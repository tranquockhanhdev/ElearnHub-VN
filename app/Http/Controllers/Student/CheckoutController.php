<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    // index($courseId)	/checkout/{course}	Trang xác nhận thanh toán (hiển thị thông tin khóa học + giá + chọn phương thức)
    // store()	/checkout (POST)	Gửi thông tin thanh toán, tạo hóa đơn, chuyển sang gateway (VNPay, Momo...)
}
