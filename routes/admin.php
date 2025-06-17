<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCourseCategoryController;
use App\Http\Controllers\Admin\AdminCourseController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminSettingController;

Route::middleware(['auth', 'verified', 'role:1'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');
    Route::get('/admin/course-category/admin-course-category', [AdminCourseCategoryController::class, 'index'])
        ->name('admin.admin-course-category');
    Route::post('/course-categories', [AdminCourseCategoryController::class, 'store'])
        ->name('admin.course-category.store');
    Route::put('/admin/course-category/{id}', [AdminCourseCategoryController::class, 'update'])
        ->name('admin.course-category.update');
    Route::delete('/admin/course-category/{id}', [AdminCourseCategoryController::class, 'destroy'])
        ->name('admin.course-category.destroy');
    Route::get('/admin/course/admin-course', [AdminCourseController::class, 'index'])
        ->name('admin.admin-course');
    Route::patch('/admin/course-category/{id}/status', [AdminCourseCategoryController::class, 'updateStatus'])
        ->name('admin.admin-course-category.update-status');

    Route::get('/admin/student/admin-student', [AdminUserController::class, 'studentList'])
        ->name('admin.students');
    Route::get('/admin/instructor/admin-instructor', [AdminUserController::class, 'instructorList'])
        ->name('admin.instructors');
    Route::get('/admin/instructors/{id}', [AdminUserController::class, 'showInstructor'])
        ->name('admin.instructors.show');
    Route::get('/admin/settings', [AdminSettingController::class, 'index'])
        ->name('admin.settings');
    Route::post('/settings/update', [AdminSettingController::class, 'update'])
         ->name('admin.settings.update');
    Route::post('/settings/upload-logo', [AdminSettingController::class, 'uploadLogo'])
        ->name('admin.settings.uploadLogo');
    Route::post('/admin/settings/remove-logo', [AdminSettingController::class, 'removeLogo'])
        ->name('admin.settings.removeLogo');
    Route::post('/admin/users', [AdminUserController::class, 'store'])
        ->name('admin.users.store');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])
        ->name('admin.users.update');
});