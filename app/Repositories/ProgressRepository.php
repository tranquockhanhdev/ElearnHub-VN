<?php

namespace App\Repositories;

use App\Models\LessonProgress;
use App\Models\Lesson;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProgressRepository
{
    protected $model;

    public function __construct(LessonProgress $model)
    {
        $this->model = $model;
    }

    /**
     * Lấy tất cả progress
     */
    public function getAll(): Collection
    {
        return $this->model->with(['student', 'lesson.course'])->get();
    }

    /**
     * Lấy progress theo ID
     */
    public function findById(int $id): ?LessonProgress
    {
        return $this->model->with(['student', 'lesson.course'])->find($id);
    }

    /**
     * Tạo progress mới
     */
    public function create(array $data): LessonProgress
    {
        return $this->model->create($data);
    }

    /**
     * Cập nhật progress
     */
    public function update(int $id, array $data): bool
    {
        $progress = $this->findById($id);
        if ($progress) {
            return $progress->update($data);
        }
        return false;
    }

    /**
     * Xóa progress
     */
    public function delete(int $id): bool
    {
        $progress = $this->findById($id);
        if ($progress) {
            return $progress->delete();
        }
        return false;
    }

    /**
     * Lấy progress của học viên theo khóa học
     */
    public function getStudentCourseProgress(int $studentId, int $courseId): Collection
    {
        return $this->model->with(['lesson'])
            ->where('student_id', $studentId)
            ->whereHas('lesson', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->get();
    }

    /**
     * Lấy progress của học viên cho một bài học
     */
    public function getStudentLessonProgress(int $studentId, int $lessonId): ?LessonProgress
    {
        return $this->model->where('student_id', $studentId)
            ->where('lesson_id', $lessonId)
            ->first();
    }

    /**
     * Cập nhật hoặc tạo progress
     */
    public function updateOrCreate(int $studentId, int $lessonId, array $data): LessonProgress
    {
        return $this->model->updateOrCreate(
            [
                'student_id' => $studentId,
                'lesson_id' => $lessonId
            ],
            $data
        );
    }

    /**
     * Đánh dấu bài học hoàn thành
     */
    public function markLessonCompleted(int $studentId, int $lessonId): LessonProgress
    {
        return $this->updateOrCreate($studentId, $lessonId, [
            'is_complete' => true,
            'completed_at' => now()
        ]);
    }

    /**
     * Bỏ đánh dấu hoàn thành bài học
     */
    public function markLessonIncomplete(int $studentId, int $lessonId): LessonProgress
    {
        return $this->updateOrCreate($studentId, $lessonId, [
            'is_complete' => false,
            'completed_at' => null
        ]);
    }

    /**
     * Kiểm tra bài học đã hoàn thành chưa
     */
    public function isLessonCompleted(int $studentId, int $lessonId): bool
    {
        return $this->model->where('student_id', $studentId)
            ->where('lesson_id', $lessonId)
            ->where('is_complete', true)
            ->exists();
    }

    /**
     * Lấy số bài học đã hoàn thành trong khóa học
     */
    public function getCompletedLessonsCount(int $studentId, int $courseId): int
    {
        return $this->model->where('student_id', $studentId)
            ->where('is_complete', true)
            ->whereHas('lesson', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->count();
    }

    /**
     * Lấy phần trăm hoàn thành khóa học
     */
    public function getCourseCompletionPercentage(int $studentId, int $courseId): float
    {
        $totalLessons = Lesson::where('course_id', $courseId)->count();

        if ($totalLessons === 0) {
            return 0;
        }

        $completedLessons = $this->getCompletedLessonsCount($studentId, $courseId);

        return round(($completedLessons / $totalLessons) * 100, 2);
    }

    /**
     * Lấy tất cả bài học đã hoàn thành của học viên
     */
    public function getStudentCompletedLessons(int $studentId): Collection
    {
        return $this->model->with(['lesson.course'])
            ->where('student_id', $studentId)
            ->where('is_complete', true)
            ->orderBy('completed_at', 'desc')
            ->get();
    }

    /**
     * Lấy bài học đã hoàn thành trong khoảng thời gian
     */
    public function getCompletedLessonsByDateRange(int $studentId, string $startDate, string $endDate): Collection
    {
        return $this->model->with(['lesson.course'])
            ->where('student_id', $studentId)
            ->where('is_complete', true)
            ->whereBetween('completed_at', [$startDate, $endDate])
            ->orderBy('completed_at', 'desc')
            ->get();
    }

    /**
     * Lấy thống kê progress của học viên
     */
    public function getStudentProgressStats(int $studentId): array
    {
        $totalProgress = $this->model->where('student_id', $studentId)->count();
        $completedLessons = $this->model->where('student_id', $studentId)
            ->where('is_complete', true)
            ->count();

        $coursesProgress = $this->model->with(['lesson.course'])
            ->where('student_id', $studentId)
            ->get()
            ->groupBy('lesson.course.id')
            ->map(function ($courseProgress, $courseId) {
                $course = $courseProgress->first()->lesson->course;
                $totalLessonsInCourse = $course->lessons()->count();
                $completedInCourse = $courseProgress->where('is_complete', true)->count();

                return [
                    'course_id' => $courseId,
                    'course_title' => $course->title,
                    'total_lessons' => $totalLessonsInCourse,
                    'completed_lessons' => $completedInCourse,
                    'completion_percentage' => $totalLessonsInCourse > 0
                        ? round(($completedInCourse / $totalLessonsInCourse) * 100, 2)
                        : 0
                ];
            });

        return [
            'total_lessons_enrolled' => $totalProgress,
            'completed_lessons' => $completedLessons,
            'overall_completion_rate' => $totalProgress > 0
                ? round(($completedLessons / $totalProgress) * 100, 2)
                : 0,
            'courses_progress' => $coursesProgress->values()->toArray()
        ];
    }

    /**
     * Lấy top học viên có tiến độ cao nhất
     */
    public function getTopStudentsByProgress(int $limit = 10): Collection
    {
        return $this->model->select('student_id')
            ->selectRaw('COUNT(*) as total_lessons')
            ->selectRaw('SUM(CASE WHEN is_complete = 1 THEN 1 ELSE 0 END) as completed_lessons')
            ->selectRaw('(SUM(CASE WHEN is_complete = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 as completion_rate')
            ->with('student')
            ->groupBy('student_id')
            ->orderBy('completion_rate', 'desc')
            ->orderBy('completed_lessons', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Lấy progress theo khóa học với phân trang
     */
    public function getCourseProgressWithPagination(int $courseId, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['student', 'lesson'])
            ->whereHas('lesson', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            });

        // Filter theo trạng thái hoàn thành
        if (isset($filters['completed'])) {
            $query->where('is_complete', $filters['completed']);
        }

        // Filter theo học viên
        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }

        // Tìm kiếm theo tên học viên
        if (!empty($filters['search'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    /**
     * Lấy thống kê tiến độ theo tháng
     */
    public function getMonthlyProgressStats(int $year): Collection
    {
        return $this->model->selectRaw('MONTH(completed_at) as month')
            ->selectRaw('COUNT(*) as completed_lessons')
            ->selectRaw('COUNT(DISTINCT student_id) as active_students')
            ->where('is_complete', true)
            ->whereYear('completed_at', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Reset progress của học viên cho khóa học
     */
    public function resetStudentCourseProgress(int $studentId, int $courseId): bool
    {
        return $this->model->where('student_id', $studentId)
            ->whereHas('lesson', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->delete();
    }

    /**
     * Lấy bài học tiếp theo cần hoàn thành
     */
    public function getNextLessonToComplete(int $studentId, int $courseId): ?Lesson
    {
        $completedLessonIds = $this->model->where('student_id', $studentId)
            ->where('is_complete', true)
            ->whereHas('lesson', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->pluck('lesson_id');

        return Lesson::where('course_id', $courseId)
            ->whereNotIn('id', $completedLessonIds)
            ->orderBy('order')
            ->first();
    }

    /**
     * Lấy progress với filter
     */
    public function getProgressWithFilters(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['student', 'lesson.course']);

        // Filter theo học viên
        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }

        // Filter theo khóa học
        if (!empty($filters['course_id'])) {
            $query->whereHas('lesson', function ($q) use ($filters) {
                $q->where('course_id', $filters['course_id']);
            });
        }

        // Filter theo trạng thái
        if (isset($filters['is_complete'])) {
            $query->where('is_complete', $filters['is_complete']);
        }

        // Sắp xếp
        $sortBy = $filters['sort_by'] ?? 'updated_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }
}