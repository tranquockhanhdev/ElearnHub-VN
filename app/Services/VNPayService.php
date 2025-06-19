<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;

class VNPayService
{
    protected $payment;
    protected $course;
    protected $vnpData;

    public function setOrderDetails($payment, $course)
    {
        $this->payment = $payment;
        $this->course = $course;
    }

    public function initPayment()
    {
        $vnp_Url = config('services.vnpay.url');
        $vnp_Returnurl = config('services.vnpay.return_url');
        $vnp_TmnCode = config('services.vnpay.tmn_code');
        $vnp_HashSecret = config('services.vnpay.hash_secret');

        $vnp_TxnRef = $this->payment->id;
        $vnp_Amount = $this->payment->amount * 100;
        $vnp_OrderInfo = 'Thanh toán khóa học ' . $vnp_TxnRef;
        $vnp_Locale = "vn";
        $vnp_BankCode = "";
        $vnp_IpAddr = request()->ip();
        $vnp_CreateDate = now('Asia/Ho_Chi_Minh')->format('YmdHis');
        $vnp_ExpireDate = now('Asia/Ho_Chi_Minh')->addMinutes(10)->format('YmdHis');
        $vnp_OrderType = 'billpayment';
        $vnp_CurrCode = 'VND';

        $this->vnpData = [
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
            $this->vnpData["vnp_BankCode"] = $vnp_BankCode;
        }
    }

    public function redirectToVNPay()
    {
        ksort($this->vnpData);

        $hashData = '';
        foreach ($this->vnpData as $key => $value) {
            $hashData .= $key . '=' . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&');

        $vnp_HashSecret = config('services.vnpay.hash_secret');
        $vnpSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $this->vnpData["vnp_SecureHash"] = $vnpSecureHash;

        $vnp_Url = config('services.vnpay.url');
        $redirectUrl = $vnp_Url . '?' . http_build_query($this->vnpData, '', '&', PHP_QUERY_RFC3986);

        $this->payment->update(['redirect_url' => $redirectUrl]);

        return [
            'code' => '00',
            'message' => 'success',
            'redirect_url' => $redirectUrl
        ];
    }
}