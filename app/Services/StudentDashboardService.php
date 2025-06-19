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
     * Lấy dữ liệu dashboard của học viên
     */
    public function getDashboardData(int $studentId, array $filters = []): array
    {
        try {
            // Lấy khóa học đã đăng ký với phân trang
            $enrolledCourses = $this->enrollmentRepository->getStudentEnrollments($studentId, $filters);

            // Xử lý dữ liệu khóa học với progress
            $processedCourses = $enrolledCourses->getCollection()->map(function ($enrollment) use ($studentId) {
                return $this->processCourseWithProgress($enrollment, $studentId);
            });

            // Cập nhật collection
            $enrolledCourses->setCollection($processedCourses);

            // Lấy thống kê tổng quan
            $stats = $this->getStudentStats($studentId);

            return [
                'stats' => $stats,
                'enrolledCourses' => $enrolledCourses,
                'filters' => $filters
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
        $totalLessons = $course->lessons->count();
        $completedLessons = $this->progressRepository->getCompletedLessonsCount($studentId, $course->id);
        $progress = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

        return [
            'id' => $course->id,
            'title' => $course->title,
            'img_url' => $course->img_url,
            'instructor_name' => $course->instructor->name,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'progress' => $progress,
            'is_completed' => $progress === 100,
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