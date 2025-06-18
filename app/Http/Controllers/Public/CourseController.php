<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CourseService;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    protected $CourseService;

    public function __construct(CourseService $CourseService)
    {
        $this->CourseService = $CourseService;
    }

    public function index(Request $request)
    {
        $categories = $this->CourseService->getAllCategories();

        // Lấy filters từ request
        $filters = [
            'search' => $request->get('search'),
            'category' => $request->get('category'),
            'sort' => $request->get('sort')
        ];

        // Lấy courses với filters và pagination
        $courses = $this->CourseService->getCoursesWithFilters($filters, 12);

        return Inertia::render('Public/CourseList', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $filters
        ]);
    }

    public function show($slug)
    {
        $course = $this->CourseService->getCourseBySlug($slug);

        if (!$course) {
            abort(404, 'Khóa học không tồn tại');
        }
        // Kiểm tra user đã enrollment chưa
        $isEnrolled = false;
        if (Auth::check()) {
            $isEnrolled = $this->CourseService->isUserEnrolled(Auth::id(), $course->id);
        }

        return Inertia::render('Public/CourseDetail', [
            'course' => $course,
            'isEnrolled' => $isEnrolled
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        return Inertia::render('Public/Courses/SearchResults', ['query' => $query]);
    }
}