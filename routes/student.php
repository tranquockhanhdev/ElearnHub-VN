<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\CourseController;
use App\Http\Controllers\Student\LessonController;
use App\Http\Controllers\Student\PaymentController;
use App\Http\Controllers\Student\CheckoutController;

Route::middleware(['auth', 'verified', 'role:3'])->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])
        ->name('student.dashboard');

    Route::get('/student/courselist', [CourseController::class, 'index'])
        ->name('student.courselist');
    Route::get('/student/course/{id}', [CourseController::class, 'show'])
        ->name('student.course.show');
    Route::post('/student/course/{id}/enroll', [CourseController::class, 'enroll'])
        ->name('student.course.enroll');

    Route::get('/student/lesson/{id}', [LessonController::class, 'show'])
        ->name('student.lesson.show');

    Route::get('/student/payments', [PaymentController::class, 'index'])
        ->name('student.payments');

    Route::get('/student/checkout/{courseId}', [CheckoutController::class, 'show'])
        ->name('student.checkout.show');
    Route::post('/student/checkout/{courseId}', [CheckoutController::class, 'process'])
        ->name('student.checkout.process');
    Route::get('/student/checkout/success', [CheckoutController::class, 'success'])
        ->name('student.checkout.success');
    Route::get('/student/checkout/cancel', [CheckoutController::class, 'cancel'])
        ->name('student.checkout.cancel');

    Route::get('/student/profile', [StudentDashboardController::class, 'profile'])
        ->name('student.profile');
    Route::post('/student/profile/update', [StudentDashboardController::class, 'updateProfile'])
        ->name('student.profile.update');
});
