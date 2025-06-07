<?php

// app/Services/AuthService.php
namespace App\Services;

use App\Repositories\AuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
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
        $this->AuthRepository->sendMailVerify($user);
    }

    public function loginUser(array $credentials)
    {
        $user = $this->AuthRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        if (!$user->email_verified_at) {
            return 'unverified';
        }

        return $user->createToken('api-token')->plainTextToken;
    }

    public function verifyEmail(string $id, string $hash)
    {
        $token = hash('sha256', $hash);
        return $this->AuthRepository->verifyUserEmail($id, $token);
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
