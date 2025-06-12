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
    public function index()
    {
        $categories = $this->CourseService->getAllCategories();
        $data = $this->CourseService->getAllCourses();
        return Inertia::render(
            'Public/CourseList',
            [
                'courses' => $data,
                'categories' => $categories
            ]
        );
    }
    public function test()
    {
        return Inertia::render('Public/CourseDetail');
    }

    public function show($id)
    {
        // Logic to retrieve and display a specific course by ID
        return Inertia::render('Public/Courses/Show', ['courseId' => $id]);
    }

    public function search(Request $request)
    {
        // Logic to search for courses based on the request parameters
        $query = $request->input('query');
        return Inertia::render('Public/Courses/SearchResults', ['query' => $query]);
    }
}
