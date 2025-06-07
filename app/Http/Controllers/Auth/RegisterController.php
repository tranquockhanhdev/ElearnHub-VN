<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\AuthRequest;

class RegisterController extends Controller
{
    protected $AuthService;
    public function __construct(AuthService $AuthService)
    {
        $this->AuthService = $AuthService;
    }
    public function view()
    {
        return Inertia::render('Auth/Register');
    }
    public function store(AuthRequest $request)
    {
        $this->AuthService->registerUser($request->only(['name', 'email', 'password']));

        return Inertia::render('Auth/Register', [
            'success' => 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.',
        ]);
    }
}
