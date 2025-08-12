<?php

namespace App\Services;

use App\Repositories\ProgressRepository;
use App\Repositories\LessonRepository;
use App\Repositories\EnrollmentRepository;
use App\Repositories\CourseRepository;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CourseProgressService
{
    protected $progressRepository;
    protected $lessonRepository;
    protected $enrollmentRepository;
    protected $courseRepository;

    public function __construct(
        ProgressRepository $progressRepository,
        LessonRepository $lessonRepository,
        EnrollmentRepository $enrollmentRepository,
        CourseRepository $courseRepository
    ) {
        $this->progressRepository = $progressRepository;
        $this->lessonRepository = $lessonRepository;
        $this->enrollmentRepository = $enrollmentRepository;
        $this->courseRepository = $courseRepository;
    }

    /**
     * Lấy tiến độ khóa học của học viên
     */
    public function getCourseProgress(int $studentId, int $courseId): array
    {
        try {
            $course = $this->courseRepository->findById($courseId);
            if (!$course) {
                throw new \Exception('Khóa học không tồn tại');
            }

            // Kiểm tra học viên đã đăng ký khóa học chưa
            if (!$this->enrollmentRepository->isStudentEnrolled($studentId, $courseId)) {
                throw new \Exception('Học viên chưa đăng ký khóa học này');
            }

            $lessons = $this->lessonRepository->getLessonsByCourse($courseId);
            $totalLessons = $lessons->count();

            if ($totalLessons === 0) {
                return [
                    'course_id' => $courseId,
                    'course_title' => $course->title,
                    'total_lessons' => 0,
                    'completed_lessons' => 0,
                    'progress_percentage' => 0,
                    'lessons_progress' => [],
                    'next_lesson' => null,
                    'is_completed' => false
                ];
            }

            $completedLessons = $this->progressRepository->getCompletedLessonsCount($studentId, $courseId);
            $progressPercentage = round(($completedLessons / $totalLessons) * 100, 2);

            // Lấy chi tiết tiến độ từng bài học
            $lessonsProgress = $lessons->map(function ($lesson) use ($studentId) {
                $progress = $this->progressRepository->getStudentLessonProgress($studentId, $lesson->id);

                return [
                    'lesson_id' => $lesson->id,
                    'lesson_title' => $lesson->title,
                    'lesson_order' => $lesson->order,
                    'is_completed' => $progress ? $progress->is_complete : false,
                    'completed_at' => $progress && $progress->completed_at
                        ? $progress->completed_at->format('d/m/Y H:i')
                        : null
                ];
            });

            // Lấy bài học tiếp theo cần hoàn thành
            $nextLesson = $this->getNextLessonToComplete($studentId, $courseId);

            return [
                'course_id' => $courseId,
                'course_title' => $course->title,
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'progress_percentage' => $progressPercentage,
                'lessons_progress' => $lessonsProgress,
                'next_lesson' => $nextLesson,
                'is_completed' => $progressPercentage === 100.0
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy tiến độ khóa học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Đánh dấu hoàn thành bài học
     */
    public function markLessonCompleted(int $studentId, int $lessonId): array
    {
        try {
            DB::beginTransaction();

            $lesson = $this->lessonRepository->findById($lessonId);
            if (!$lesson) {
                throw new \Exception('Bài học không tồn tại');
            }

            // Kiểm tra quyền truy cập
            if (!$this->enrollmentRepository->isStudentEnrolled($studentId, $lesson->course_id)) {
                throw new \Exception('Bạn không có quyền truy cập bài học này');
            }

            // Đánh dấu hoàn thành
            $progress = $this->progressRepository->markLessonCompleted($studentId, $lessonId);

            // Cập nhật tiến độ khóa học
            $courseProgress = $this->getCourseProgress($studentId, $lesson->course_id);

            // Kiểm tra nếu hoàn thành toàn bộ khóa học
            if ($courseProgress['is_completed']) {
                $this->handleCourseCompletion($studentId, $lesson->course_id);
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Đã đánh dấu hoàn thành bài học',
                'lesson_progress' => $progress,
                'course_progress' => $courseProgress
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi đánh dấu hoàn thành bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Bỏ đánh dấu hoàn thành bài học
     */
    public function markLessonIncomplete(int $studentId, int $lessonId): array
    {
        try {
            DB::beginTransaction();

            $lesson = $this->lessonRepository->findById($lessonId);
            if (!$lesson) {
                throw new \Exception('Bài học không tồn tại');
            }

            // Kiểm tra quyền truy cập
            if (!$this->enrollmentRepository->isStudentEnrolled($studentId, $lesson->course_id)) {
                throw new \Exception('Bạn không có quyền truy cập bài học này');
            }

            // Bỏ đánh dấu hoàn thành
            $progress = $this->progressRepository->markLessonIncomplete($studentId, $lessonId);

            // Cập nhật tiến độ khóa học
            $courseProgress = $this->getCourseProgress($studentId, $lesson->course_id);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Đã bỏ đánh dấu hoàn thành bài học',
                'lesson_progress' => $progress,
                'course_progress' => $courseProgress
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi bỏ đánh dấu hoàn thành bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy bài học tiếp theo cần hoàn thành
     */
    public function getNextLessonToComplete(int $studentId, int $courseId): ?array
    {
        $nextLesson = $this->progressRepository->getNextLessonToComplete($studentId, $courseId);

        if (!$nextLesson) {
            return null;
        }

        return [
            'lesson_id' => $nextLesson->id,
            'lesson_title' => $nextLesson->title,
            'lesson_order' => $nextLesson->order,
            'lesson_type' => $nextLesson->type,
            'lesson_duration' => $nextLesson->duration
        ];
    }

    /**
     * Lấy thống kê tiến độ của học viên
     */
    public function getStudentProgressStats(int $studentId): array
    {
        try {
            return $this->progressRepository->getStudentProgressStats($studentId);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy thống kê tiến độ học viên: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Reset tiến độ khóa học
     */
    public function resetCourseProgress(int $studentId, int $courseId): bool
    {
        try {
            DB::beginTransaction();

            // Kiểm tra quyền
            if (!$this->enrollmentRepository->isStudentEnrolled($studentId, $courseId)) {
                throw new \Exception('Bạn không có quyền reset tiến độ khóa học này');
            }

            $result = $this->progressRepository->resetStudentCourseProgress($studentId, $courseId);

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi reset tiến độ khóa học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy tiến độ tất cả khóa học của học viên
     */
    public function getAllCoursesProgress(int $studentId): array
    {
        try {
            $enrollments = $this->enrollmentRepository->getAllStudentEnrollments($studentId);

            $coursesProgress = $enrollments->map(function ($enrollment) use ($studentId) {
                return $this->getCourseProgress($studentId, $enrollment->course_id);
            });

            return [
                'student_id' => $studentId,
                'total_courses' => $coursesProgress->count(),
                'completed_courses' => $coursesProgress->where('is_completed', true)->count(),
                'in_progress_courses' => $coursesProgress->where('is_completed', false)
                    ->where('completed_lessons', '>', 0)->count(),
                'not_started_courses' => $coursesProgress->where('completed_lessons', 0)->count(),
                'courses' => $coursesProgress->values()->toArray()
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy tiến độ tất cả khóa học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy hoạt động học tập gần đây
     */
    public function getRecentLearningActivity(int $studentId, int $limit = 20): array
    {
        try {
            $recentProgress = $this->progressRepository->getAll()
                ->where('student_id', $studentId)
                ->sortByDesc('updated_at')
                ->take($limit);

            return $recentProgress->map(function ($progress) {
                return [
                    'lesson_id' => $progress->lesson_id,
                    'lesson_title' => $progress->lesson->title,
                    'course_title' => $progress->lesson->course->title,
                    'is_completed' => $progress->is_complete,
                    'activity_date' => $progress->updated_at->format('d/m/Y H:i'),
                    'activity_type' => $progress->is_complete ? 'completed' : 'updated'
                ];
            })->values()->toArray();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy hoạt động học tập gần đây: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Tính phần trăm hoàn thành khóa học
     */
    public function calculateCourseCompletionPercentage(int $studentId, int $courseId): float
    {
        return $this->progressRepository->getCourseCompletionPercentage($studentId, $courseId);
    }

    /**
     * Kiểm tra xem có thể truy cập bài học tiếp theo không
     */
    public function canAccessNextLesson(int $studentId, int $currentLessonId): bool
    {
        $currentLesson = $this->lessonRepository->findById($currentLessonId);
        if (!$currentLesson) {
            return false;
        }

        // Kiểm tra bài học hiện tại đã hoàn thành chưa
        return $this->progressRepository->isLessonCompleted($studentId, $currentLessonId);
    }

    /**
     * Lấy đường dẫn học tập được đề xuất
     */
    public function getRecommendedLearningPath(int $studentId, int $courseId): array
    {
        try {
            $courseProgress = $this->getCourseProgress($studentId, $courseId);
            $recommendations = [];

            // Nếu chưa bắt đầu
            if ($courseProgress['completed_lessons'] === 0) {
                $recommendations[] = [
                    'type' => 'start_course',
                    'title' => 'Bắt đầu khóa học',
                    'description' => 'Hãy bắt đầu với bài học đầu tiên',
                    'action' => 'start_first_lesson'
                ];
            }

            // Nếu đang học dở
            elseif (!$courseProgress['is_completed']) {
                $nextLesson = $courseProgress['next_lesson'];
                if ($nextLesson) {
                    $recommendations[] = [
                        'type' => 'continue_learning',
                        'title' => 'Tiếp tục học',
                        'description' => "Tiếp tục với bài: {$nextLesson['lesson_title']}",
                        'action' => 'continue_lesson',
                        'lesson_id' => $nextLesson['lesson_id']
                    ];
                }
            }

            // Nếu đã hoàn thành
            else {
                $recommendations[] = [
                    'type' => 'course_completed',
                    'title' => 'Khóa học đã hoàn thành',
                    'description' => 'Chúc mừng! Bạn đã hoàn thành khóa học này',
                    'action' => 'view_certificate'
                ];
            }

            return $recommendations;
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy đường dẫn học tập: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Xử lý khi hoàn thành khóa học
     */
    private function handleCourseCompletion(int $studentId, int $courseId): void
    {
        try {
            // Cập nhật trạng thái enrollment
            $this->enrollmentRepository->updateStatus($studentId, $courseId, 'completed');

            // Log hoạt động
            Log::info("Học viên {$studentId} đã hoàn thành khóa học {$courseId}");

            // Có thể thêm logic khác như gửi email chúc mừng, tạo certificate, etc.

        } catch (\Exception $e) {
            Log::error('Lỗi khi xử lý hoàn thành khóa học: ' . $e->getMessage());
        }
    }

    /**
     * Lấy thống kê tiến độ theo tháng
     */
    public function getMonthlyProgressStats(int $year): array
    {
        try {
            $stats = $this->progressRepository->getMonthlyProgressStats($year);

            return $stats->map(function ($stat) {
                return [
                    'month' => $stat->month,
                    'completed_lessons' => $stat->completed_lessons,
                    'active_students' => $stat->active_students
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy thống kê tiến độ theo tháng: ' . $e->getMessage());
            throw $e;
        }
    }
}