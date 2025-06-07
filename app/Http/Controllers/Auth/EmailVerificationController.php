<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;

class EmailVerificationController extends Controller
{
    protected $AuthService;
    public function __construct(AuthService $AuthService)
    {
        $this->AuthService = $AuthService;
    }
    public function verify($id, $hash)
    {
        $user = $this->AuthService->verifyEmail($id, $hash);
        if (!$user) {
            return Inertia::render('Auth/Login', [
                'flash_error' => 'Xác minh không hợp lệ',
            ]);
        }
        Auth::login($user);
        return Inertia::location(route('student.dashboard'));
    }
}
