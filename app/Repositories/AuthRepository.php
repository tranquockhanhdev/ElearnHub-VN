<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\EmailVerificationToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Mail\VerifyEmail;
use Illuminate\Support\Facades\Auth;
use Exception;

class AuthRepository
{
    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }
    public function createUser(array $data)
    {
        $data['role_id'] = 3;
        $data['email'] = strtolower($data['email']);
        $data['password'] = Hash::make($data['password']);
        $data['name'] = trim($data['name']);
        $data['status'] = 'inactive';
        $data['email_verified_at'] = null;
        $user = User::create($data);

        return $user;
    }

    public function sendMailVerify(User $user)
    {
        EmailVerificationToken::where('user_id', $user->id)->delete();
        $token = Str::random(60);
        EmailVerificationToken::create([
            'user_id'    => $user->id,
            'token'      => hash('sha256', $token),
            'expires_at' => now()->addMinutes(5),
        ]);
        Mail::to($user->email)->queue(new VerifyEmail($user, $token));
    }

    public function verifyUserEmail(string $id, string $token)
    {
        $user = User::find($id);
        if (!$user) return null;

        $record = EmailVerificationToken::where('token', $token)
            ->where('expires_at', '>', now())
            ->whereNull('verified_at')
            ->first();
        if (!$record) return null;
        $record->update(['verified_at' => now()]);
        $user->update([
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        return $user;
    }

    public function updatePassword(User $user, string $password)
    {
        DB::beginTransaction();

        try {
            $user->password = Hash::make($password);
            if (!$user->email_verified_at) {
                $user->email_verified_at = now();
            }
            $user->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw new Exception('Error creating variant: ' . $e->getMessage());
        }
    }
}
