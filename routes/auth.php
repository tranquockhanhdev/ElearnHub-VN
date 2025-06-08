<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    LoginController,
    RegisterController,
    ForgotPasswordController,
    ResetPasswordController,
    EmailVerificationController,
    LogoutController
};

// Auth
Route::controller(LoginController::class)->group(function () {
    Route::get('/login', 'view')->name('login');
    Route::post('/login', 'store')->name('login.store');
});

Route::controller(RegisterController::class)->group(function () {
    Route::get('/register', 'view')->name('register');
    Route::post('/register', 'store')->name('register.store');
});

Route::controller(ForgotPasswordController::class)->group(function () {
    Route::get('/forgot-password', 'view')->name('forgot-password');
    Route::post('/forgot-password', 'store')->name('password.email');
});

Route::controller(ResetPasswordController::class)->group(function () {
    Route::get('/reset-password/{token}', 'view')->name('password.reset');
    Route::post('/reset-password', 'store')->name('password.update');
});

Route::get('/verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LogoutController::class, 'destroy'])->name('logout');
});
