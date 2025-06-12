<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CourseService;

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

    public function test()
    {
        return Inertia::render('Public/CourseDetail');
    }

    public function show($id)
    {
        return Inertia::render('Public/Courses/Show', ['courseId' => $id]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        return Inertia::render('Public/Courses/SearchResults', ['query' => $query]);
    }
}
