<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\AuthRequest;

class ResetPasswordController extends Controller
{
    protected $AuthService;
    public function __construct(AuthService $AuthService)
    {
        $this->AuthService = $AuthService;
    }
    public function view(Request $request, $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email'),
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
            'token' => 'required',
        ]);

        $status = $this->AuthService->resetPassword(
            $request->only('email', 'password', 'password_confirmation', 'token')
        );
        if ($status) {
            return Inertia::render('Auth/Login', [
                'flash_success' => 'Mật khẩu đã được cập nhật thành công! Hãy đăng nhập lại.',
            ]);
        } else {
            return Inertia::render('Auth/ResetPassword', [
                'flash_error' => 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.',
            ]);
        }
    }
}
