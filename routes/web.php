<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\CourseController;
use App\Http\Controllers\Public\InstructorController;
use Illuminate\Support\Facades\Artisan;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');

Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/terms', [HomeController::class, 'terms'])->name('terms');
Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('courses.show');
Route::get('/search', [CourseController::class, 'search'])->name('courses.search');
Route::get('/user/{id}', [InstructorController::class, 'show'])->name('instructor.profile');
Route::get('/guideseb', [HomeController::class, 'seb'])->name('seb.guide');
Route::get('/cron/payments/expire', function () { //chay ngrok
    Artisan::call('payments:expire');
    return response()->json([
        'status' => 'success',
        'message' => 'Đã chạy command payments:expire',
        'time' => now()->toDateTimeString(),
    ]);
});
Route::get('/video/{filename}', [App\Http\Controllers\VideoStreamController::class, 'stream'])
    ->where('filename', '.*')
    ->name('video.stream');
Route::get('/resource/{resourceId}/preview', [App\Http\Controllers\Public\ResourceController::class, 'preview'])->name('resource.preview');
Route::get('/resource/{resourceId}/stream', [App\Http\Controllers\Public\ResourceController::class, 'streamVideo'])->name('resource.stream');
