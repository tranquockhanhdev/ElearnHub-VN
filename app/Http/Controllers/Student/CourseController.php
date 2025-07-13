<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentRequest;
use App\Models\LessonProgress;
use App\Models\Resource;
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
    public function index(StudentRequest $request)
    {
        try {
            $studentId = Auth::id();
            $validated = $request->validated();

            $filters = [
                'search' => $validated['search'] ?? '',
                'category' => $validated['category'] ?? null,
                'status' => $validated['status'] ?? null,
                'sort' => $validated['sort'] ?? 'enrolled_at',
                'order' => $validated['order'] ?? 'desc',
            ];

            // Lấy khóa học đã đăng ký với phân trang
            $enrolledCourses = $this->courseRepository->getEnrolledCourses(
                $studentId,
                $filters,
                $request->get('per_page', 8)
            );

            // Xử lý dữ liệu khóa học với tiến độ
            $coursesWithProgress = $enrolledCourses->getCollection()->map(function ($course) use ($studentId) {
                $progress = $this->calculateCourseProgress($studentId, $course->id);

                $totalVideos = $course->lessons->sum(function ($lesson) {
                    return $lesson->resources->where('type', 'video')
                        ->where('status', 'approved')
                        ->count();
                });

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'img_url' => $course->img_url,
                    'instructor_name' => $course->instructor->name,
                    'total_videos' => $totalVideos,
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
            $progress = $this->getStudentProgress($studentId, $id);

            return Inertia::render('Students/CourseDetail', [
                'course' => $course,
                'progress' => $progress
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải chi tiết khóa học']);
        }
    }

    /**
     * Hiển thị giao diện học tập
     */
    public function learn($id)
    {
        try {
            $studentId = Auth::id();

            // Kiểm tra quyền truy cập
            if (!$this->courseRepository->isUserEnrolled($studentId, $id)) {
                return redirect()->route('student.dashboard')
                    ->withErrors(['error' => 'Bạn chưa đăng ký khóa học này']);
            }
            // Lấy khóa học với đầy đủ nội dung
            $course = $this->courseRepository->getCourseWithFullContent($id, $studentId);
            if (!$course) {
                return redirect()->route('student.courselist')
                    ->withErrors(['error' => 'Không tìm thấy khóa học']);
            }

            // Lấy tiến độ học tập
            $progress = $this->getStudentProgress($studentId, $id);
            return Inertia::render('Students/CourseDetail', [
                'course' => $course,
                'progress' => $progress
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải nội dung khóa học']);
        }
    }

    /**
     * Lấy tiến độ học tập của học viên
     */
    private function getStudentProgress($studentId, $courseId)
    {
        // Lấy danh sách resource đã hoàn thành từ lesson_progress
        $completedResources = \App\Models\LessonProgress::where('student_id', $studentId)
            ->whereHas('lesson', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->where('is_complete', true)
            ->whereNotNull('resource_id')
            ->pluck('resource_id')
            ->toArray();

        // Lấy danh sách quiz đã làm (có attempt) và số lần làm
        $quizAttempts = \App\Models\QuizAttempt::where('student_id', $studentId)
            ->whereHas('quiz.lesson', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->selectRaw('quiz_id, COUNT(*) as attempt_count, MAX(score_percent) as best_score')
            ->groupBy('quiz_id')
            ->get()
            ->keyBy('quiz_id')
            ->toArray();

        // Lấy danh sách quiz đã pass (điểm >= pass_score)
        $passedQuizzes = [];
        foreach ($quizAttempts as $quizId => $attempt) {
            $quiz = \App\Models\Quiz::find($quizId);
            if ($quiz && $attempt['best_score'] >= $quiz->pass_score) {
                $passedQuizzes[] = $quizId;
            }
        }

        // Lấy danh sách lesson đã hoàn thành
        $completedLessons = \App\Models\LessonProgress::where('student_id', $studentId)
            ->whereHas('lesson', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->where('is_complete', true)
            ->whereNull('resource_id') // Chỉ lấy progress của lesson, không phải resource
            ->pluck('lesson_id')
            ->toArray();

        // Tính toán progress percentage từ backend
        $progressPercentage = $this->calculateCourseProgress($studentId, $courseId);

        return [
            'completedResources' => $completedResources,
            'completedQuizzes' => $passedQuizzes,
            'completedLessons' => $completedLessons,
            'quizAttempts' => $quizAttempts,
            'progressPercentage' => $progressPercentage
        ];
    }

    /**
     * Tính toán tiến độ tổng thể của khóa học
     */
    private function calculateCourseProgress($studentId, $courseId)
    {
        // Lấy course với lessons và resources
        $course = \App\Models\Course::with([
            'lessons' => function ($query) {
                $query->with([
                    'resources' => function ($query) {
                        $query->whereIn('type', ['video', 'document'])
                            ->where('status', 'approved');
                    },
                    'quiz'
                ]);
            }
        ])->find($courseId);

        if (!$course) {
            return 0;
        }

        return $this->calculateStudentProgress($studentId, $course);
    }

    /**
     * Tính toán progress của học viên
     */
    private function calculateStudentProgress($studentId, $course)
    {
        $totalItems = 0;
        $completedItems = 0;

        foreach ($course->lessons as $lesson) {
            // Đếm video resources đã approved
            $approvedVideos = $lesson->resources->where('type', 'video')
                ->where('status', 'approved');
            $approvedDocuments = $lesson->resources->where('type', 'document')
                ->where('status', 'approved');
            $totalItems += $approvedVideos->count() + $approvedDocuments->count();

            // Đếm quiz nếu có
            if ($lesson->quiz && $lesson->quiz->status === 'approved') {
                $totalItems++;
            }
        }

        if ($totalItems > 0) {
            // Đếm video resources đã hoàn thành
            $completedResources = \App\Models\LessonProgress::where('student_id', $studentId)
                ->whereHas('lesson', function ($query) use ($course) {
                    $query->where('course_id', $course->id);
                })
                ->whereHas('resource', function ($query) {
                    $query->whereIn('type', ['video', 'document'])
                        ->where('status', 'approved');
                })
                ->where('is_complete', 1)
                ->count();

            // Đếm quiz đã hoàn thành
            $completedQuizzes = \App\Models\QuizAttempt::where('student_id', $studentId)
                ->whereHas('quiz.lesson', function ($query) use ($course) {
                    $query->where('course_id', $course->id);
                })
                ->whereHas('quiz', function ($query) {
                    $query->where('status', 'approved');
                })
                ->count();

            $completedItems = $completedResources + $completedQuizzes;
        }

        return $totalItems > 0 ? round(($completedItems / $totalItems) * 100) : 0;
    }

    /**
     * Đánh dấu resource đã hoàn thành
     */
    public function markResourceComplete(StudentRequest $request, $courseId, $resourceId)
    {
        try {
            $studentId = Auth::id();

            // Kiểm tra quyền truy cập
            if (!$this->courseRepository->isUserEnrolled($studentId, $courseId)) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            // Lấy resource và lesson
            $resource = Resource::findOrFail($resourceId);
            $lesson = $resource->lesson;

            // Kiểm tra resource thuộc về khóa học
            if ($lesson->course_id != $courseId) {
                return response()->json(['error' => 'Invalid resource'], 400);
            }
            // Tạo hoặc cập nhật progress
            LessonProgress::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'lesson_id' => $lesson->id,
                    'resource_id' => $resourceId
                ],
                [
                    'is_complete' => true
                ]
            );

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    /**
     * Đánh dấu lesson đã hoàn thành
     */
    public function markLessonComplete(StudentRequest $request, $courseId, $lessonId)
    {
        try {
            $studentId = Auth::id();

            // Kiểm tra quyền truy cập
            if (!$this->courseRepository->isUserEnrolled($studentId, $courseId)) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Kiểm tra lesson thuộc về khóa học
            $lesson = \App\Models\Lesson::where('id', $lessonId)
                ->where('course_id', $courseId)
                ->firstOrFail();

            // Tạo hoặc cập nhật progress cho lesson
            \App\Models\LessonProgress::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'lesson_id' => $lessonId,
                    'resource_id' => null // NULL cho lesson progress
                ],
                [
                    'is_complete' => true
                ]
            );

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}
