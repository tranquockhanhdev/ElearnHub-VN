<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    // callback(Request $request)	/payment/callback	Nhận phản hồi từ cổng thanh toán (VNPay, Momo, ZaloPay...)
    // webhook(Request $request)	/payment/webhook	Xử lý các webhook tự động (nếu có)
}
