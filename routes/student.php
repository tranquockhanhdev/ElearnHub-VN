<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\StudentDashboardController;

Route::middleware(['auth', 'verified', 'role:3'])->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])
        ->name('student.dashboard');
    Route::get('/student/courselist', [StudentDashboardController::class, 'course'])
        ->name('student.dashboard');
});
