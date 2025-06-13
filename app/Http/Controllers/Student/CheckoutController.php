<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CourseService;
use Inertia\Inertia;

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
    public function store(Request $request)
    {
        // Xử lý thông tin thanh toán từ form
        // Tạo hóa đơn, lưu vào database
        // Chuyển hướng đến cổng thanh toán (VNPay, Momo, v.v.)
        // Trả về phản hồi hoặc chuyển hướng đến trang thanh toán
    }

    // index($courseId)	/checkout/{course}	Trang xác nhận thanh toán (hiển thị thông tin khóa học + giá + chọn phương thức)
    // store()	/checkout (POST)	Gửi thông tin thanh toán, tạo hóa đơn, chuyển sang gateway (VNPay, Momo...)
}
