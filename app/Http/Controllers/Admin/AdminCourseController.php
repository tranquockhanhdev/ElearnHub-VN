<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Http\Requests\Admin\Course\CourseRequest;
use App\Services\Admin\Course\CourseService;


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
        $search = $request->input('search');
        $category = $request->input('category');
        $status = $request->input('status');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $instructor = $request->input('instructor');
        $tab = $request->input('tab', 'grid'); // 👈 giữ trạng thái tab

        $query = Course::with(['categories', 'instructor']);

        if ($instructor) {
            $query->where('instructor_id', $instructor);
        }

        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        if ($category) {
            $query->whereHas('categories', function ($q) use ($category) {
                $q->where('category_id', $category);
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $query->orderBy($sortBy, $sortOrder);

        $courses = $query->paginate($perPage)->withQueryString();

        // Xử lý đường dẫn ảnh nếu có
        $courses->getCollection()->transform(function ($course) {
            if ($course->img_url) {
                $course->img_url = asset('storage/bannercourse/' . basename($course->img_url));
            }
            return $course;
        });

        return Inertia::render('Admin/Course/AdminCourseList', [
            'courses' => $courses,
            'instructors' => \App\Models\User::where('role_id', 2)->select('id', 'name')->get(),
            'categories' => \App\Models\Category::select('id', 'name')->get(),

            // Truyền toàn bộ filters để đồng bộ với frontend
            'filters' => [
                'search' => $search,
                'category' => $category,
                'status' => $status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'instructor' => $instructor,
                'tab' => $tab,
            ],

            // Truyền thống kê tổng quan
            'stats' => [
                'total' => Course::count(),
                'active' => Course::where('status', 'active')->count(),
                'pending' => Course::where('status', 'pending')->count(),
                'inactive' => Course::where('status', 'inactive')->count(),
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
    public function show($id)
    {
        $course = Course::with(['categories', 'instructor'])->findOrFail($id);

        if ($course->img_url) {
            $course->img_url = asset('storage/bannercourse/' . basename($course->img_url));
        }

        return Inertia::render('Admin/Course/AdminCourseDetail', [
            'course' => $course
        ]);
    }

    public function destroy($id)
    {
        $this->CourseService->deleteCourse($id);

        return redirect()->back()->with('success', 'Course deleted successfully.');
    }
}