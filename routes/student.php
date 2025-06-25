<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\{
    StudentDashboardController,
    CourseController,
    LessonController,
    PaymentController,
    CheckoutController
};

Route::middleware(['auth', 'verified', 'role:3'])->prefix('student')->name('student.')->group(function () {

    // Dashboard & Hồ sơ
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [StudentDashboardController::class, 'profile'])->name('profile');
    Route::put('/profile/update', [StudentDashboardController::class, 'updateProfile'])->name('profile.update');
    Route::get('/profile/change-password', [StudentDashboardController::class, 'changePassword'])->name('profile.change-password');
    Route::put('/profile/update-password', [StudentDashboardController::class, 'updatePassword'])->name('password.update');

    // 🔹 Danh sách khóa học
    Route::get('/courselist', [CourseController::class, 'index'])->name('courselist');
    Route::get('/course/{id}', [CourseController::class, 'show'])->name('course.show');

    Route::get('/course/{id}/learn', [CourseController::class, 'learn'])->name('course.learn'); //student.course.learn

    Route::get('/course/{courseId}/download/{documentId}', [
        CourseController::class,
        'downloadDocument'
    ])->name('course.downloadDocument');

    // 🔹 Bài học
    Route::get('/lesson/{id}', [LessonController::class, 'show'])->name('lesson.show');

    // 🔹 Thanh toán & giao dịch
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments');

    Route::prefix('checkout')->name('checkout.')->group(function () {
        Route::get('/{courseId}', [CheckoutController::class, 'show'])->name('show');
        Route::post('/{courseId}', [CheckoutController::class, 'process'])->name('process');
        Route::get('/success', [CheckoutController::class, 'success'])->name('success');
        Route::get('/cancel', [CheckoutController::class, 'cancel'])->name('cancel');
    });

    Route::get('/invoice/{paymentId}/download', [CheckoutController::class, 'downloadInvoice'])->name('invoice.download');

    // 🔹 Khóa học theo trạng thái
    Route::get('/completed-courses', [StudentDashboardController::class, 'completedCourses'])->name('completed-courses');
    Route::get('/enrolled-courses', [StudentDashboardController::class, 'enrolledCourses'])->name('enrolled-courses');

    // Progress tracking
    Route::post('/course/{courseId}/resource/{resourceId}/complete', [CourseController::class, 'markResourceComplete'])->name('resource.complete');
    Route::post('/course/{courseId}/lesson/{lessonId}/complete', [CourseController::class, 'markLessonComplete'])->name('lesson.complete');
});

// 🔁 VNPay return (ngoài middleware)
Route::get('/vnpay_return', [CheckoutController::class, 'vnpay_return'])->name('vnpay.return');
