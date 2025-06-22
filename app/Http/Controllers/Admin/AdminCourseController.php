<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Http\Requests\CourseRequest;
use App\Services\CourseService;


class AdminCourseController extends Controller
{
    protected $CourseService;
    public function __construct(CourseService $CourseService)
    {
        $this->CourseService = $CourseService;
    }
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $courses = $this->CourseService->paginateCourses($perPage);

        // Gán lại img_url dạng public cho từng course
        $courses->getCollection()->transform(function ($course) {
            if ($course->img_url) {
                // Nếu chỉ lưu tên file
                $course->img_url = asset('storage/bannercourse/' . basename($course->img_url));
            }
            return $course;
        });

        return Inertia::render('Admin/Course/AdminCourseList', [
            'courses' => $courses,
            'stats' => [
                'activated' => \App\Models\Course::where('status', 'active')->count(),
                'inactivated' => \App\Models\Course::where('status', 'inactive')->count(),
                'pending' => \App\Models\Course::where('status', 'pending')->count(),
            ],
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
    public function edit($id)
    {
        $course = Course::with('categories')->findOrFail($id);
        $categories = $this->CourseService->getAllCategories();
        $instructors = User::where('role_id', 2)->get(); // Giảng viên

        return Inertia::render('Admin/Course/AdminEditCourse', [
            'course' => $course,
            'categories' => $categories,
            'instructors' => $instructors,
        ]);
    }

    public function update(CourseRequest $request, $id)
    {
        $result = $this->CourseService->updateCourse($id, $request->all());

        if ($result['success']) {
            return redirect()->route('admin.admin-course')->with('success', 'Cập nhật khóa học thành công!');
        }

        return redirect()->back()
            ->withErrors($result['errors'] ?? ['general' => $result['message']])
            ->withInput($request->except('course_image'));
    }
    public function destroy($id)
    {
        $this->CourseService->deleteCourse($id);

        return redirect()->back()->with('success', 'Course deleted successfully.');
    }
}