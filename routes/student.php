<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\CourseController;
use App\Http\Controllers\Student\LessonController;
use App\Http\Controllers\Student\PaymentController;
use App\Http\Controllers\Student\CheckoutController;

// Nhóm route dành cho học viên (role:3), yêu cầu đăng nhập và xác thực email
Route::middleware(['auth', 'verified', 'role:3'])->group(function () {

    // Trang dashboard của học viên
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])
        ->name('student.dashboard');

    // Hiển thị danh sách các khóa học mà học viên đã đăng ký
    Route::get('/student/courselist', [CourseController::class, 'index'])
        ->name('student.courselist');

    // Hiển thị chi tiết một khóa học
    Route::get('/student/course/{id}', [CourseController::class, 'show'])
        ->name('student.course.show');

    // Hiển thị nội dung bài học
    Route::get('/student/lesson/{id}', [LessonController::class, 'show'])
        ->name('student.lesson.show');

    // Hiển thị danh sách các giao dịch thanh toán của học viên
    Route::get('/student/payments', [PaymentController::class, 'index'])
        ->name('student.payments');

    // Hiển thị trang thanh toán cho một khóa học
    Route::get('/student/checkout/{courseId}', [CheckoutController::class, 'show'])
        ->name('student.checkout.show');
    // Xử lý thanh toán cho một khóa học
    Route::post('/student/checkout/{courseId}', [CheckoutController::class, 'process'])
        ->name('student.checkout.process');

    // Hiển thị trang thông báo thanh toán thành công
    Route::get('/student/success', [CheckoutController::class, 'success'])
        ->name('student.checkout.success');

    // Route download hóa đơn PDF
    Route::get('/student/invoice/{paymentId}/download', [CheckoutController::class, 'downloadInvoice'])
        ->name('student.invoice.download');

    // Hiển thị trang thông báo hủy thanh toán
    Route::get('/student/cancel', [CheckoutController::class, 'cancel'])
        ->name('student.checkout.cancel');

    // Hiển thị trang hồ sơ cá nhân của học viên
    Route::get('/student/profile', [StudentDashboardController::class, 'profile'])
        ->name('student.profile');

    // Cập nhật thông tin hồ sơ cá nhân của học viên
    Route::put('/student/profile/update', [StudentDashboardController::class, 'updateProfile'])
        ->name('student.profile.update');

    // Hiển thị trang thay đổi mật khẩu
    Route::get('/student/profile/change-password', [StudentDashboardController::class, 'changePassword'])
        ->name('student.profile.change-password');

    // Xử lý cập nhật mật khẩu mới
    Route::put('/student/profile/update-password', [StudentDashboardController::class, 'updatePassword'])
        ->name('student.password.update');

    // Tải xuống tài liệu khóa học
    Route::get('/student/course/{courseId}/download/{documentId}', [CourseController::class, 'downloadDocument'])
        ->name('student.course.downloadDocument');

    // Xem danh sách các khóa học đã hoàn thành
    Route::get('/student/completed-courses', [StudentDashboardController::class, 'completedCourses'])
        ->name('student.completed-courses');
    // Xem danh sách các khóa học đang theo học
    Route::get('/student/enrolled-courses', [StudentDashboardController::class, 'enrolledCourses'])
        ->name('student.enrolled-courses');
});

Route::get('vnpay_return', [CheckoutController::class, 'vnpay_return'])->name('vnpay.return');