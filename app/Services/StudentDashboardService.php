<?php

namespace App\Services;

use App\Repositories\EnrollmentRepository;
use App\Repositories\StudentRepository;
use App\Repositories\ProgressRepository;
use App\Repositories\CourseRepository;
use Illuminate\Support\Facades\Log;

class StudentDashboardService
{
    protected $enrollmentRepository;
    protected $studentRepository;
    protected $progressRepository;
    protected $courseRepository;

    public function __construct(
        EnrollmentRepository $enrollmentRepository,
        StudentRepository $studentRepository,
        ProgressRepository $progressRepository,
        CourseRepository $courseRepository
    ) {
        $this->enrollmentRepository = $enrollmentRepository;
        $this->studentRepository = $studentRepository;
        $this->progressRepository = $progressRepository;
        $this->courseRepository = $courseRepository;
    }

    /**
     * Lấy dữ liệu dashboard của học viên - Chỉ 5 khóa học gần đây
     */
    public function getDashboardData(int $studentId): array
    {
        try {
            $recentEnrollments = $this->enrollmentRepository->getRecentStudentEnrollments($studentId, 5);
            $processedCourses = $recentEnrollments->map(function ($enrollment) use ($studentId) {
                return $this->processCourseWithProgress($enrollment, $studentId);
            });

            // Lấy thống kê tổng quan
            $stats = $this->getStudentStats($studentId);

            return [
                'stats' => $stats,
                'enrolledCourses' => [
                    'data' => $processedCourses->toArray(),
                    'total' => $this->enrollmentRepository->getTotalEnrollmentsCount($studentId)
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy dữ liệu dashboard: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy thống kê tổng quan của học viên
     */
    public function getStudentStats(int $studentId): array
    {
        try {
            return $this->studentRepository->getStudentStats($studentId);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy thống kê học viên: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy khóa học đã hoàn thành
     */
    public function getCompletedCourses(int $studentId): array
    {
        try {
            $completedCourses = $this->studentRepository->getCompletedCourses($studentId);

            return $completedCourses->map(function ($course) use ($studentId) {
                $enrollment = $this->enrollmentRepository->getEnrollmentDetails($studentId, $course->id);

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'img_url' => $course->img_url,
                    'instructor_name' => $course->instructor->name,
                    'total_lessons' => $course->lessons->count(),
                    'completed_lessons' => $course->lessons->count(),
                    'progress' => 100,
                    'enrollment_date' => $enrollment->created_at->format('d/m/Y'),
                    'completed_date' => $enrollment->updated_at->format('d/m/Y')
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy khóa học đã hoàn thành: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy tất cả khóa học đã đăng ký
     */
    public function getAllEnrolledCourses(int $studentId): array
    {
        try {
            $enrollments = $this->enrollmentRepository->getAllStudentEnrollments($studentId);

            return $enrollments->map(function ($enrollment) use ($studentId) {
                return $this->processCourseWithProgress($enrollment, $studentId);
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy tất cả khóa học đã đăng ký: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy hoạt động học tập gần đây
     */
    public function getRecentActivity(int $studentId, int $limit = 20): array
    {
        try {
            return $this->studentRepository->getRecentActivity($studentId, $limit)
                ->map(function ($progress) {
                    return [
                        'lesson_id' => $progress->lesson_id,
                        'lesson_title' => $progress->lesson->title,
                        'course_title' => $progress->lesson->course->title,
                        'course_id' => $progress->lesson->course_id,
                        'is_completed' => $progress->is_complete,
                        'activity_date' => $progress->updated_at->format('d/m/Y H:i'),
                        'activity_type' => $progress->is_complete ? 'completed' : 'in_progress'
                    ];
                })->toArray();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy hoạt động gần đây: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy tiến độ theo khóa học cụ thể
     */
    public function getCourseProgress(int $studentId, int $courseId): array
    {
        try {
            return $this->studentRepository->getCourseProgress($studentId, $courseId);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy tiến độ khóa học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy khóa học đang học (có tiến độ nhưng chưa hoàn thành)
     */
    public function getInProgressCourses(int $studentId): array
    {
        try {
            $inProgressCourses = $this->studentRepository->getInProgressCourses($studentId);

            return $inProgressCourses->map(function ($course) use ($studentId) {
                $enrollment = $this->enrollmentRepository->getEnrollmentDetails($studentId, $course->id);
                $totalLessons = $course->lessons->count();
                $completedLessons = $this->progressRepository->getCompletedLessonsCount($studentId, $course->id);

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'img_url' => $course->img_url,
                    'instructor_name' => $course->instructor->name,
                    'total_lessons' => $totalLessons,
                    'completed_lessons' => $completedLessons,
                    'progress' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0,
                    'enrollment_date' => $enrollment->created_at->format('d/m/Y'),
                    'last_accessed' => $enrollment->updated_at->format('d/m/Y H:i')
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy khóa học đang học: ' . $e->getMessage());
            throw $e;
        }
    }
    /**
     * Xử lý dữ liệu khóa học với tiến độ
     */
    private function processCourseWithProgress($enrollment, int $studentId): array
    {
        $course = $enrollment->course;

        // Đếm tổng số items cần hoàn thành (resources + quizzes)
        $totalItems = 0;
        $completedItems = 0;

        foreach ($course->lessons as $lesson) {
            // Đếm resources trong lesson
            $totalItems += $lesson->resources->count();

            // Đếm quiz nếu có
            if ($lesson->quiz) {
                $totalItems++;
            }
        }

        // Đếm items đã hoàn thành
        if ($totalItems > 0) {
            // Đếm resources đã hoàn thành
            $completedResources = \App\Models\LessonProgress::where('student_id', $studentId)
                ->whereHas('lesson', function ($query) use ($course) {
                    $query->where('course_id', $course->id);
                })
                ->where('is_complete', true)
                ->whereNotNull('resource_id')
                ->count();

            // Đếm quizzes đã pass
            $completedQuizzes = \App\Models\QuizAttempt::where('student_id', $studentId)
                ->whereHas('quiz.lesson', function ($query) use ($course) {
                    $query->where('course_id', $course->id);
                })
                ->selectRaw('quiz_id, MAX(score_percent) as best_score')
                ->groupBy('quiz_id')
                ->get()
                ->filter(function ($attempt) {
                    $quiz = \App\Models\Quiz::find($attempt->quiz_id);
                    return $quiz && $attempt->best_score >= $quiz->pass_score;
                })
                ->count();

            $completedItems = $completedResources + $completedQuizzes;
        }

        // Tính progress an toàn
        $progress = $totalItems > 0 ? min(round(($completedItems / $totalItems) * 100), 100) : 0;

        // Đếm lessons để hiển thị
        $totalLessons = $course->lessons->count();
        $completedLessons = min($completedItems, $totalLessons); // Đảm bảo không vượt quá tổng số lessons

        // Xác định khóa học đã hoàn thành: progress = 100% VÀ completed_lessons = total_lessons
        $isCompleted = ($progress === 100) && ($completedLessons === $totalLessons);

        return [
            'id' => $course->id,
            'title' => $course->title,
            'img_url' => $course->img_url,
            'instructor_name' => $course->instructor->name,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'progress' => $progress,
            'is_completed' => $isCompleted,
            'enrollment_date' => $enrollment->created_at->format('d/m/Y'),
            'last_accessed' => $enrollment->updated_at->format('d/m/Y H:i')
        ];
    }

    public function updateProfile(int $studentId, array $data)
    {
        try {
            return $this->studentRepository->updateProfile($studentId, $data);
        } catch (\Exception $e) {
            Log::error('Lỗi khi cập nhật thông tin cá nhân: ' . $e->getMessage());
            throw $e;
        }
    }
    public function changePassword(int $studentId, string $currentPassword, string $newPassword)
    {
        try {
            if (!$this->studentRepository->checkCurrentPassword($studentId, $currentPassword)) {
                return [
                    'success' => false,
                    'message' => 'Mật khẩu hiện tại không đúng'
                ];
            }

            return $this->studentRepository->changePassword($studentId, $newPassword);
        } catch (\Exception $e) {
            Log::error('Lỗi khi đổi mật khẩu: ' . $e->getMessage());
            throw $e;
        }
    }
}
