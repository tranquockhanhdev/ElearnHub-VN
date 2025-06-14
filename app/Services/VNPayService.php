<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Payment;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class VNPayService
{
    protected $payment;
    protected $course;

    public function setOrderDetails($payment, $course)
    {
        $this->payment = $payment;
        $this->course = $course;
    }

    public function initPayment()
    {
        // Tạo các tham số cần thiết cho thanh toán VNPay
        // Các tham số bao gồm mã đơn hàng, tổng tiền, phí vận chuyển, v.v.
    }

    public function redirectToVNPay()
    {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = route('vnpay.return');
        $vnp_TmnCode = "0KTK5V1V";
        $vnp_HashSecret = "LHMDGF68I5808JJJBF4WYUN4KXKYARXE";

        $vnp_TxnRef = $this->payment->id;
        $vnp_Amount = $this->payment->amount * 100;

        // VNPAY yêu cầu tiếng Việt không dấu, không ký tự đặc biệt
        $vnp_OrderInfo = 'Thanh toan khoa hoc ' . $vnp_TxnRef;


        $vnp_Locale = "vn"; // hoặc "en"
        $vnp_BankCode = ""; // để trống cho phép chọn sau
        $vnp_IpAddr = request()->ip(); // nên dùng request()->ip() thay vì $_SERVER
        $vnp_CreateDate = now('Asia/Ho_Chi_Minh')->format('YmdHis');
        $vnp_ExpireDate = now('Asia/Ho_Chi_Minh')->addMinutes(10)->format('YmdHis');
        $vnp_OrderType = 'billpayment';
        $vnp_CurrCode = 'VND';

        // Danh sách tham số (KHÔNG bao gồm vnp_SecureHash)
        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $vnp_CreateDate,
            "vnp_CurrCode" => $vnp_CurrCode,
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_ExpireDate" => $vnp_ExpireDate,
        ];

        if (!empty($vnp_BankCode)) {
            $inputData["vnp_BankCode"] = $vnp_BankCode;
        }

        // Sắp xếp dữ liệu theo key để hash
        ksort($inputData);

        $hashData = '';
        foreach ($inputData as $key => $value) {
            $hashData .= $key . '=' . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&'); // Bỏ dấu & cuối cùng

        $vnpSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $inputData["vnp_SecureHash"] = $vnpSecureHash;

        // Tạo URL cuối
        $redirectUrl = $vnp_Url . '?' . http_build_query($inputData, '', '&', PHP_QUERY_RFC3986);

        // Lưu redirect_url vào DB nếu cần
        $this->payment->update(['redirect_url' => $redirectUrl]);

        return [
            'code' => '00',
            'message' => 'success',
            'redirect_url' => $redirectUrl
        ];
    }
}
