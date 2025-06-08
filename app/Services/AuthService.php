<?php

// app/Services/AuthService.php
namespace App\Services;

use App\Repositories\AuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Jobs\SendResetPasswordEmail;

class AuthService
{
    protected $AuthRepository;

    public function __construct(AuthRepository $AuthRepository)
    {
        $this->AuthRepository = $AuthRepository;
    }

    public function registerUser(array $data)
    {
        $user =  $this->AuthRepository->createUser($data);
        $sendMail = $this->AuthRepository->sendMailVerify($user);
        dump($sendMail);
        if (!$sendMail) {
            return [
                'success' => false,
                'error' => 'Không thể gửi email xác nhận. Vui lòng thử lại sau.',
            ];
        }
        return [
            'success' => true,
            'message' => 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.',
        ];
    }

    public function loginUser(array $credentials)
    {
        $user = $this->AuthRepository->getUserByCredentials($credentials);

        if (!$user) {
            return [
                'success' => false,
                'error' => 'Email hoặc mật khẩu không đúng.',
            ];
        }

        Auth::login($user);

        return [
            'success' => true,
            'redirect' => match ((int) $user->role_id) {
                1 => route('admin.dashboard'),
                2 => route('instructor.dashboard'),
                3 => route('student.dashboard'),
                default => route('login'),
            },
        ];
    }

    public function verifyEmail(string $id, string $hash)
    {
        $token = hash('sha256', $hash);
        $user =  $this->AuthRepository->verifyUserEmail($id, $token);
        Auth::login($user);
        return $user;
    }

    public function forgotPassword(string $email)
    {
        $user = $this->AuthRepository->findByEmail($email);

        if (!$user) {
            return null;
        }

        dispatch(new SendResetPasswordEmail($email))->onQueue('emails');

        return true;
    }

    public function resetPassword(array $data)
    {
        return Password::reset(
            $data,
            function ($user, $password) {
                $this->AuthRepository->updatePassword($user, $password);
            }
        );
    }
}
