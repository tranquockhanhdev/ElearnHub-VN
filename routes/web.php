<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\CourseController;
use Illuminate\Support\Facades\Artisan;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');

Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('courses.show');
Route::get('/search', [CourseController::class, 'search'])->name('courses.search');
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