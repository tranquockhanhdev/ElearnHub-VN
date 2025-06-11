<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\CourseService;
use Illuminate\Support\Facades\Session;

class CourseController extends Controller
{
    protected $CourseService;
    public function __construct(CourseService $CourseService)
    {
        $this->CourseService = $CourseService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = $this->CourseService->getAllCategories();
        return Inertia::render(
            'Intructors/CreateCourse',
            [
                'categories' => $categories,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request)
    {
        $result  = $this->CourseService->createCourse($request->all());
        if ($result['success']) {
            return Inertia::location(route('instructor.courses.success'));
        }
        return redirect()->back()
            ->withErrors($result['errors'] ?? ['general' => $result['message']])
            ->withInput($request->except('course_image'));
    }
    /**
     * Show the success message after course creation.
     */
    public function success()
    {
        return Inertia::render('Intructors/SuccessCourse');
    }
    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        //
    }
}
