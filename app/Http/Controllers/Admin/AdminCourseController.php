<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Course;
class AdminCourseController extends Controller
{
   public function index()
    {
    $courses = Course::with(['instructor', 'categories'])->get();

    return Inertia::render('Admin/Course/AdminCourseList', [
        'courses' => $courses,
    ]);
    }

}

