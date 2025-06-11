<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\CourseController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');

Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/coursestest', [CourseController::class, 'test'])->name('courses.test');
Route::get('/courses/{id}', [CourseController::class, 'show'])->name('courses.show');
Route::get('/search', [CourseController::class, 'search'])->name('courses.search');
