<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\AuthRequest;

class ForgotPasswordController extends Controller
{
    protected $AuthService;
    public function __construct(AuthService $AuthService)
    {
        $this->AuthService = $AuthService;
    }
    public function view()
    {
        return Inertia::render('Auth/ForgotPassword');
    }
    public function store(Request $request)
    {
        $email = $request->only('email')['email'];

        $result = $this->AuthService->forgotPassword($email);

        if (!$result['success']) {
            return Inertia::render('Auth/ForgotPassword', [
                'flash_error' => $result['error'],
            ]);
        }

        return Inertia::render('Auth/ForgotPassword', [
            'flash_success' => $result['message'],
        ]);
    }
}
