<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Course;
use App\Http\Requests\CourseRequest;
use App\Services\CourseService;

class AdminCourseController extends Controller
{
    protected $CourseService;
    public function __construct(CourseService $CourseService)
    {
        $this->CourseService = $CourseService;
    }
    public function index()
    {
        $courses = Course::with(['instructor', 'categories'])->get();

        return Inertia::render('Admin/Course/AdminCourseList', [
            'courses' => $courses,
        ]);
    }
    public function create()
    {
        $categories = $this->CourseService->getAllCategories();
        $instructors = \App\Models\User::where('role_id', 2)->get();
        return Inertia::render(
            'Admin/Course/AdminCreateCourse',
            [
                'categories' => $categories,
                'instructors' => $instructors,
            ]
        );
    }
      public function store(CourseRequest $request)
    {
        $result  = $this->CourseService->createCourse($request->all());
        if ($result['success']) {
            return Inertia::location(route('admin.courses.success'));
        }
        return redirect()->back()
            ->withErrors($result['errors'] ?? ['general' => $result['message']])
            ->withInput($request->except('course_image'));
    }
      public function success()
    {
        return Inertia::render('Admin/Course/SuccessCourse');
    }
}