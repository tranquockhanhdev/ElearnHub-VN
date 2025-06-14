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
        dd($request->all());
        $vnp_HashSecret = "LHMDGF68I5808JJJBF4WYUN4KXKYARXE";
        $inputData = [];

        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'vnp_')) {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData)); // ✅ đúng thứ tự và encoding

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash === $vnp_SecureHash) {
            $vnp_TxnRef = $request->input('vnp_TxnRef');
            $payment = Payment::find($vnp_TxnRef);

            if (!$payment) {
                return redirect()->route('student.checkout.success')
                    ->with('error', 'Không tìm thấy thông tin giao dịch.');
            }

            if ($request->input('vnp_ResponseCode') === '00') {
                DB::beginTransaction();
                try {
                    $payment->update(['status' => 'completed']);

                    Enrollment::create([
                        'student_id' => $payment->student_id,
                        'course_id' => $payment->course_id,
                        'payment_id' => $payment->id,
                        'enrolled_at' => now(),
                        'status' => 'active'
                    ]);

                    DB::commit();
                    return redirect()->route('student.checkout.success')
                        ->with('success', 'Thanh toán thành công!');
                } catch (\Exception $e) {
                    DB::rollBack();
                    return redirect()->route('student.checkout.success')
                        ->with('error', 'Lỗi khi ghi danh: ' . $e->getMessage());
                }
            } else {
                $payment->update(['status' => 'failed']);
                return redirect()->route('student.checkout.success')
                    ->with('error', 'Thanh toán thất bại!');
            }
        } else {
            return redirect()->route('student.checkout.success')
                ->with('error', 'Mã xác thực không hợp lệ!');
        }
    }


    public function success()
    {
        return Inertia::render('Students/CheckoutSuccess');
    }
}
