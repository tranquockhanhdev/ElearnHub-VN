<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index(Request $request)
    {
        $categories = $this->courseService->getAllCategories();

        // Lấy filters từ request
        $filters = [
            'search' => $request->get('search'),
            'category' => $request->get('category'),
            'sort' => $request->get('sort')
        ];

        // Lấy courses với filters và pagination
        $courses = $this->courseService->getCoursesWithFilters($filters, 12);

        return Inertia::render('Public/CourseList', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $filters
        ]);
    }

    public function show($slug)
    {
        $course = $this->courseService->getCourseForPublicDisplay($slug);

        if (!$course) {
            abort(404, 'Khóa học không tồn tại hoặc chưa được phê duyệt');
        }

        $isEnrolled = false;
        if (Auth::check()) {
            $isEnrolled = $this->courseService->isUserEnrolled(Auth::id(), $course->id);
        }

        // Lấy thông tin bio và avatar của instructor
        $instructorDetails = $this->courseService->getInstructorDetailsByCourseId($course->id);

        return Inertia::render('Public/CourseDetail', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
            'instructorDetails' => $instructorDetails,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        return Inertia::render('Public/Courses/SearchResults', ['query' => $query]);
    }
}
