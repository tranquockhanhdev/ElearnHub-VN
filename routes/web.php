<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Instructor\InstructorDashboardController;

Route::middleware(['auth', 'verified', 'role:3'])->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])
        ->name('student.dashboard');
});

Route::middleware(['auth', 'verified', 'role:2'])->group(function () {
    Route::get('/instructor/dashboard', [InstructorDashboardController::class, 'index'])
        ->name('instructor.dashboard');
});

Route::middleware(['auth', 'verified', 'role:1'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');
});
