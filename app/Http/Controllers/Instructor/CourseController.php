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
    public function index(Request $request)
    {
        $instructorId = Auth::user()->id;

        $filters = [
            'search' => $request->get('search'),
            'status' => $request->get('status', 'all'),
            'sort' => $request->get('sort', 'newest'),
        ];

        $courses = $this->CourseService->getCoursesByInstructorWithFilters(
            $instructorId,
            $filters,
            $request->get('per_page', 6)
        );

        return Inertia::render('Intructors/MyCourse', [
            'courses' => $courses,
            'filters' => $filters,
        ]);
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
    public function show($id)
    {
        // Kiểm tra quyền sở hữu
        $course = Course::with([
            'categories',
            'enrollments.student',
            'lessons.resources',
            'lessons' => function ($query) {
                $query->orderBy('order', 'asc');
            },
        ])->where('id', $id)->firstOrFail();

        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền truy cập khóa học này.');
        }

        return Inertia::render('Intructors/CourseDetail', [
            'course' => $course,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        // Kiểm tra quyền sở hữu
        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền chỉnh sửa khóa học này.');
        }

        $categories = $this->CourseService->getAllCategories();
        $course->load('categories');

        return Inertia::render('Intructors/EditCourse', [
            'course' => $course,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CourseRequest $request, Course $course)
    {
        // Kiểm tra quyền sở hữu
        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền chỉnh sửa khóa học này.');
        }

        $result = $this->CourseService->updateCourse($course->id, $request->all());

        if ($result) {
            return redirect()->route('instructor.courses.index')
                ->with('success', 'Cập nhật khóa học thành công!');
        }

        return redirect()->back()
            ->with('error', 'Có lỗi xảy ra khi cập nhật khóa học!')
            ->withInput();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        // Kiểm tra quyền sở hữu
        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền xóa khóa học này.');
        }

        // Kiểm tra xem có học viên đã đăng ký chưa
        if ($course->enrollments()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Không thể xóa khóa học đã có học viên đăng ký!');
        }

        $result = $this->CourseService->deleteCourse($course->id);

        if ($result) {
            return redirect()->route('instructor.courses.index')
                ->with('success', 'Xóa khóa học thành công!');
        }

        return redirect()->back()
            ->with('error', 'Có lỗi xảy ra khi xóa khóa học!');
    }

    /**
     * Submit course for approval - chuyển status từ draft thành pending
     */
    public function submitForApproval($id)
    {
        // Kiểm tra quyền sở hữu
        $course = Course::with([
            'lessons.resources',
            'lessons.quiz'
        ])->where('id', $id)->firstOrFail();

        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền truy cập khóa học này.');
        }

        try {
            $result = $this->CourseService->submitForApproval($course);
            
            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            } else {
                return redirect()->back()->with('error', $result['message']);
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Có lỗi xảy ra khi gửi phê duyệt!');
        }
    }
}