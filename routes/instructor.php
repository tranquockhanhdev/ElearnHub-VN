<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Instructor\InstructorDashboardController;

Route::middleware(['auth', 'verified', 'role:2'])->group(function () {
    Route::get('/instructor/dashboard', [InstructorDashboardController::class, 'index'])
        ->name('instructor.dashboard');
});
