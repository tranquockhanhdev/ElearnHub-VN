<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AuthService;
use App\Http\Requests\AuthRequest;

class LoginController extends Controller
{
    protected $AuthService;
    public function __construct(AuthService $AuthService)
    {
        $this->AuthService = $AuthService;
    }
    public function view()
    {
        return Inertia::render('Auth/Login');
    }
    public function store(AuthRequest $request)
    {
        $credentials = $request->only('email', 'password');

        $result = $this->AuthService->loginUser($credentials);

        if (!$result['success']) {
            return Inertia::render('Auth/Login', [
                'flash_error' => $result['error'],
            ]);
        }

        return Inertia::location($result['redirect']);
    }
}
