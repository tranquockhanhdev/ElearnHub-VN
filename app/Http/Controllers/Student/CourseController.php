<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\StudentDashboardService;
use App\Repositories\CourseRepository;
use App\Repositories\ProgressRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $studentDashboardService;
    protected $courseRepository;
    protected $progressRepository;

    public function __construct(
        StudentDashboardService $studentDashboardService,
        CourseRepository $courseRepository,
        ProgressRepository $progressRepository
    ) {
        $this->studentDashboardService = $studentDashboardService;
        $this->courseRepository = $courseRepository;
        $this->progressRepository = $progressRepository;
    }

    /**
     * Hiển thị danh sách khóa học đã đăng ký
     */
    public function index(Request $request)
    {
        try {
            $studentId = Auth::id();
            $filters = [
                'search' => $request->get('search', ''),
                'sort' => $request->get('sort', ''),
            ];

            // Lấy khóa học đã đăng ký với phân trang
            $enrolledCourses = $this->courseRepository->getEnrolledCourses(
                $studentId,
                $filters,
                $request->get('per_page', 8)
            );

            // Xử lý dữ liệu khóa học với tiến độ
            $coursesWithProgress = $enrolledCourses->getCollection()->map(function ($course) use ($studentId) {
                $totalLessons = $course->lessons->count();
                $completedLessons = $this->progressRepository->getCompletedLessonsCount($studentId, $course->id);
                $progress = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'img_url' => $course->img_url,
                    'instructor_name' => $course->instructor->name,
                    'total_lessons' => $totalLessons,
                    'completed_lessons' => $completedLessons,
                    'progress' => $progress,
                    'is_completed' => $progress === 100,
                    'categories' => $course->categories->pluck('name')->toArray(),
                    'created_at' => $course->created_at->format('d/m/Y')
                ];
            });

            // Cập nhật collection
            $enrolledCourses->setCollection($coursesWithProgress);

            return Inertia::render('Students/CourseList', [
                'enrolledCourses' => $enrolledCourses,
                'filters' => $filters
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải danh sách khóa học']);
        }
    }

    /**
     * Hiển thị chi tiết khóa học
     */
    public function show($id)
    {
        try {
            $studentId = Auth::id();
            $course = $this->courseRepository->findById($id);

            // Kiểm tra quyền truy cập
            if (!$this->courseRepository->isUserEnrolled($studentId, $id)) {
                return redirect()->route('student.dashboard')
                    ->withErrors(['error' => 'Bạn chưa đăng ký khóa học này']);
            }

            // Lấy tiến độ khóa học
            $courseProgress = $this->studentDashboardService->getCourseProgress($studentId, $id);

            return Inertia::render('Students/CourseDetail', [
                'course' => $course,
                'progress' => $courseProgress
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải chi tiết khóa học']);
        }
    }
}