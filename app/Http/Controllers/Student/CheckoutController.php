<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Services\CourseService;
use App\Services\VNPayService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class CheckoutController extends Controller
{
    protected $CourseService;

    public function __construct(CourseService $CourseService)
    {
        $this->CourseService = $CourseService;
    }

    public function show($courseId)
    {
        if ($courseId) {
            $course = $this->CourseService->getCourseById($courseId);
        }
        return Inertia::render('Students/Checkout', [
            'course' => $course,
            'paymentMethods' => $this->CourseService->getPaymentMethods(),
        ]);
    }

    public function process(Request $request, $course)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'student_id' => 'required|integer',
            'course_id' => 'required|integer',
            'payment_method_id' => 'required|integer|exists:payment_methods,id',
            'country' => 'required|string|max:2'
        ]);

        $course = Course::find($validated['course_id']);

        try {
            DB::beginTransaction();

            // Kiểm tra xem học viên đã đăng ký khóa học này chưa
            $existingEnrollment = Enrollment::where('student_id', $validated['student_id'])
                ->where('course_id', $validated['course_id'])
                ->first();

            if ($existingEnrollment) {
                return redirect()->back()
                    ->withErrors(['course' => 'Bạn đã đăng ký khóa học này rồi!']);
            }
            $paymentTime = null;
            if ($request->payment_time) {
                try {
                    $paymentTime = \Carbon\Carbon::parse($request->payment_time)->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    $paymentTime = now();
                }
            } else {
                $paymentTime = now();
            }
            // Tạo payment - loại bỏ payment_data
            $payment = Payment::create([
                'student_id' => $validated['student_id'],
                'course_id' => $validated['course_id'],
                'payment_method_id' => $validated['payment_method_id'],
                'amount' => $course->price,
                'status' => 'pending',
                'payment_time' => $paymentTime
            ]);

            Log::info('Payment created', ['payment_id' => $payment->id]);
            if ($validated['payment_method_id'] == 1) { // VNPay
                DB::commit();
                return $this->processVNPay($payment, $course);
            } else { // Phương thức khác
                // Tạo enrollment ngay
                $enrollment = Enrollment::create([
                    'student_id' => $validated['student_id'],
                    'course_id' => $validated['course_id'],
                    'payment_id' => $payment->id,
                    'enrolled_at' => now(),
                    'status' => 'active'
                ]);

                // Cập nhật payment status
                $payment->update(['status' => 'completed']);

                DB::commit();

                // Trả về JSON response thay vì redirect
                return response()->json([
                    'success' => true,
                    'message' => 'Đăng ký khóa học thành công!'
                ]);
            }
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Checkout failed', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    // Hàm xử lý thanh toán qua VNPay
    public function processVNPay($payment, $course)
    {
        try {
            $vnpay = new VNPayService();
            $vnpay->setOrderDetails($payment, $course);
            $vnpay->initPayment();

            return $vnpay->redirectToVNPay();
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['vnpay' => 'Lỗi kết nối VNPay: ' . $e->getMessage()]);
        }
    }

    public function vnpay_return(Request $request)
    {
        $vnp_HashSecret = config('services.vnpay.hash_secret');
        $inputData = [];

        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'vnp_')) {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = '';
        foreach ($inputData as $key => $value) {
            $hashData .= $key . '=' . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&');

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash === $vnp_SecureHash) {
            $vnp_ResponseCode = $request->get('vnp_ResponseCode');
            $vnp_TxnRef = $request->get('vnp_TxnRef');

            if ($vnp_ResponseCode == '00') {
                // Thanh toán thành công
                $payment = $this->handleSuccessfulPayment($vnp_TxnRef);

                if ($payment) {
                    return redirect()->route('student.checkout.success', [
                        'payment' => $payment->id
                    ]);
                }
            } else {
                // Thanh toán thất bại hoặc bị hủy
                $payment = $this->handleFailedPayment($vnp_TxnRef);

                // Nếu người dùng hủy giao dịch (ResponseCode = 24)
                if ($vnp_ResponseCode == '24') {
                    $payment->update([
                        'status' => 'failed',
                        'cancelled_at' => now()
                    ]);

                    return redirect()->route('student.checkout.cancel', [
                        'payment' => $payment->id
                    ]);
                }

                // Các lỗi khác
                $courseId = $this->getCourseIdFromPayment($vnp_TxnRef);
                session(['payment_status' => 'failed']);
                session()->flash('error', 'Thanh toán không thành công. Vui lòng thử lại.');

                return redirect()->route('student.checkout.show', $courseId);
            }
        } else {
            // Hash không hợp lệ
            session()->flash('error', 'Giao dịch không hợp lệ.');
            return redirect()->route('student.dashboard');
        }
    }

    private function handleSuccessfulPayment($transactionRef)
    {
        $payment = Payment::where('id', $transactionRef)->first();

        if ($payment) {
            // Cập nhật payment status
            $payment->update([
                'status' => 'completed',
                'completed_at' => now()
            ]);

            // Tạo hoặc cập nhật enrollment
            $enrollment = Enrollment::firstOrCreate([
                'student_id' => $payment->student_id,
                'course_id' => $payment->course_id
            ], [
                'payment_id' => $payment->id,
                'status' => 'active',
                'enrolled_at' => now()
            ]);

            // Nếu enrollment đã tồn tại, cập nhật status
            if (!$enrollment->wasRecentlyCreated) {
                $enrollment->update([
                    'payment_id' => $payment->id,
                    'status' => 'active',
                    'enrolled_at' => now()
                ]);
            }

            return $payment;
        }

        return null;
    }

    public function success(Request $request)
    {
        $paymentId = $request->get('payment');

        $payment = Payment::with([
            'course.instructor',
            'course.categories',
            'paymentMethod',
            'student'
        ])->findOrFail($paymentId);

        // Kiểm tra xem payment có thuộc về user hiện tại không
        if ($payment->student_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Lấy thông tin enrollment
        $enrollment = Enrollment::where('payment_id', $payment->id)->first();

        return Inertia::render('Students/Success', [
            'payment' => $payment,
            'course' => $payment->course,
            'enrollment' => $enrollment
        ]);
    }
    public function downloadInvoice($paymentId)
    {
        $payment = Payment::with([
            'course',
            'student'
        ])->find($paymentId);

        if (!$payment) {
            abort(404, 'Không tìm thấy thông tin thanh toán');
        }

        // Kiểm tra quyền truy cập
        if ($payment->student_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $enrollment = Enrollment::where('payment_id', $payment->id)->first();

        $data = [
            'payment' => $payment,
            'course' => $payment->course,
            'student' => $payment->student,
            'enrollment' => $enrollment,
            'invoiceNumber' => 'HD' . str_pad($payment->id, 6, '0', STR_PAD_LEFT),
            'invoiceDate' => $payment->created_at->format('d/m/Y'),
        ];

        $pdf = Pdf::loadView('pdf.invoice', $data)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'defaultFont' => 'DejaVu Sans',
                'isRemoteEnabled' => true,
            ]);

        return $pdf->download('hoa-don-' . $data['invoiceNumber'] . '.pdf');
    }
    public function cancel(Request $request)
    {
        $paymentId = $request->get('payment');
        $courseId = $request->get('course');

        // Nếu có payment ID, cập nhật status thành cancelled
        if ($paymentId) {
            $payment = Payment::find($paymentId);
            if ($payment && $payment->student_id === Auth::id()) {
                $payment->update([
                    'status' => 'failed',
                    'cancelled_at' => now()
                ]);

                $course = $payment->course;
            }
        } else if ($courseId) {
            // Nếu chỉ có course ID
            $course = Course::find($courseId);
        }

        return Inertia::render('Students/Cancel', [
            'course' => $course ?? null,
            'payment' => $payment ?? null
        ]);
    }

    private function handleFailedPayment($transactionRef)
    {
        $payment = Payment::where('id', $transactionRef)->first();

        if ($payment) {
            $payment->update([
                'status' => 'failed',
                'failed_at' => now()
            ]);
        }

        return $payment;
    }

    private function getCourseIdFromPayment($transactionRef)
    {
        $payment = Payment::where('id', $transactionRef)->first();
        return $payment ? $payment->course_id : null;
    }
}
