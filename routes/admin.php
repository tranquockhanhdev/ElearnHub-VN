<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCourseCategoryController;
use App\Http\Controllers\Admin\AdminCourseController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminPaymentController;

// Nhóm route chỉ dành cho admin (role_id = 1)
Route::middleware(['auth', 'verified', 'role:1'])->group(function () {

    // ==================== Dashboard ====================
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');

    // ==================== Quản lý Danh mục Khóa học ====================
    Route::get('/admin/course-category/admin-course-category', [AdminCourseCategoryController::class, 'index'])
        ->name('admin.admin-course-category');

    Route::post('/course-categories', [AdminCourseCategoryController::class, 'store'])
        ->name('admin.course-category.store');

    Route::put('/admin/course-category/{id}', [AdminCourseCategoryController::class, 'update'])
        ->name('admin.course-category.update');

    Route::delete('/admin/course-category/{id}', [AdminCourseCategoryController::class, 'destroy'])
        ->name('admin.course-category.destroy');

    Route::patch('/admin/course-category/{id}/status', [AdminCourseCategoryController::class, 'updateStatus'])
        ->name('admin.admin-course-category.update-status');

    // ==================== Quản lý Khóa học ====================
    Route::get('/admin/course/admin-course', [AdminCourseController::class, 'index'])
        ->name('admin.admin-course'); // Danh sách

    Route::get('/admin/courses/create', [AdminCourseController::class, 'create'])
        ->name('admin.courses.create'); // Form tạo mới

    Route::post('/admin/courses/store', [AdminCourseController::class, 'store'])
        ->name('admin.courses.store'); // Lưu khóa học mới

    Route::get('/admin/courses/{id}/edit', [AdminCourseController::class, 'edit'])
        ->name('admin.courses.edit'); // Form chỉnh sửa

    Route::post('/admin/courses/{id}/update', [AdminCourseController::class, 'update'])
        ->name('admin.courses.update'); // Cập nhật khóa học

    Route::delete('/admin/courses/{id}', [AdminCourseController::class, 'destroy'])
        ->name('admin.courses.destroy'); // Xóa

    Route::get('/admin/courses/success', [AdminCourseController::class, 'success'])
        ->name('admin.courses.success'); // Trang hiển thị khi tạo thành công

    Route::get('/admin/courses/{id}', [AdminCourseController::class, 'show'])
        ->name('admin.courses.show'); // Chi tiết khóa học

    // ==================== Quản lý Người dùng: Học viên & Giảng viên ====================
    Route::get('/admin/student/admin-student', [AdminUserController::class, 'studentList'])
        ->name('admin.students'); // Danh sách học viên

    Route::get('/admin/instructor/admin-instructor', [AdminUserController::class, 'instructorList'])
        ->name('admin.instructors'); // Danh sách giảng viên

    Route::get('/admin/students/{id}', [AdminUserController::class, 'showStudent'])
        ->name('admin.students.show'); // Chi tiết học viên

    Route::get('/admin/instructors/{id}', [AdminUserController::class, 'showInstructor'])
        ->name('admin.instructors.show'); // Chi tiết giảng viên

    Route::post('/admin/users', [AdminUserController::class, 'store'])
        ->name('admin.users.store'); // Tạo người dùng

    Route::put('/users/{user}', [AdminUserController::class, 'update'])
        ->name('admin.users.update'); // Cập nhật thông tin

    Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy'])
        ->name('admin.users.destroy'); // Xóa người dùng

    // Chặn & Mở chặn giảng viên
    Route::put('/admin/instructors/{user}/block', [AdminUserController::class, 'block'])
        ->name('admin.instructors.block');

    Route::put('/admin/instructors/{user}/unblock', [AdminUserController::class, 'unblock'])
        ->name('admin.instructors.unblock');

    // Cập nhật giảng viên (profile)
    Route::put('/admin/instructors/{id}', [AdminUserController::class, 'updateInstructor'])
        ->name('admin.instructors.update');

    Route::delete('/admin/instructors/{id}/avatar', [AdminUserController::class, 'removeInstructorAvatar'])
        ->name('admin.instructors.remove-avatar');

    // ==================== Cài đặt Website ====================
    Route::get('/admin/settings', [AdminSettingController::class, 'index'])
        ->name('admin.settings'); // Trang cấu hình

    Route::post('/settings/update', [AdminSettingController::class, 'update'])
        ->name('admin.settings.update'); // Cập nhật thông tin

    Route::post('/settings/upload-logo', [AdminSettingController::class, 'uploadLogo'])
        ->name('admin.settings.uploadLogo'); // Upload logo

    Route::post('/admin/settings/remove-logo', [AdminSettingController::class, 'removeLogo'])
        ->name('admin.settings.removeLogo'); // Xóa logo
    
    // ==================== Thanh toán ====================
    Route::get('/admin/payments', [AdminPaymentController::class, 'index'])
        ->name('admin.payments.index');
    Route::get('/admin/payments/{id}', [AdminPaymentController::class, 'show'])
        ->name('admin.payments.show');
    Route::get('/admin/payments/export/excel', [AdminPaymentController::class, 'exportExcel'])
        ->name('admin.payments.export.excel');
});