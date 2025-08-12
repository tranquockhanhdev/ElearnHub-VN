<?php

namespace App\Repositories;

use App\Models\Lesson;
use App\Models\Course;
use App\Models\LessonProgress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class LessonRepository
{
    protected $model;

    public function __construct(Lesson $model)
    {
        $this->model = $model;
    }
    public function model()
    {
        return $this->model;
    }

    /**
     * Lấy tất cả bài học
     */
    public function getAll(): Collection
    {
        return $this->model->with(['course', 'resources', 'quiz'])->get();
    }

    /**
     * Lấy bài học theo ID
     */
    public function findById(int $id): ?Lesson
    {
        return $this->model->with(['course', 'resources', 'quiz'])->find($id);
    }

    /**
     * Tạo bài học mới
     */
    public function create(array $data): Lesson
    {
        return $this->model->create($data);
    }

    /**
     * Cập nhật bài học
     */
    public function update(int $id, array $data): bool
    {
        $lesson = $this->findById($id);
        if ($lesson) {
            return $lesson->update($data);
        }
        return false;
    }

    /**
     * Xóa bài học
     */
    public function delete(int $id): bool
    {
        $lesson = $this->findById($id);
        if ($lesson) {
            return $lesson->delete();
        }
        return false;
    }

    /**
     * Lấy bài học theo khóa học
     */
    public function getLessonsByCourse(int $courseId): Collection
    {
        return $this->model->with(['resources', 'quiz'])
            ->where('course_id', $courseId)
            ->orderBy('order')
            ->get();
    }

    /**
     * Lấy bài học theo khóa học với phân trang
     */
    public function getLessonsByCourseWithPagination(int $courseId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->with(['resources', 'quiz'])
            ->where('course_id', $courseId)
            ->orderBy('order')
            ->paginate($perPage);
    }

    /**
     * Lấy bài học kế tiếp
     */
    public function getNextLesson(int $courseId, int $currentOrder): ?Lesson
    {
        return $this->model->where('course_id', $courseId)
            ->where('order', '>', $currentOrder)
            ->orderBy('order')
            ->first();
    }

    /**
     * Lấy bài học trước đó
     */
    public function getPreviousLesson(int $courseId, int $currentOrder): ?Lesson
    {
        return $this->model->where('course_id', $courseId)
            ->where('order', '<', $currentOrder)
            ->orderBy('order', 'desc')
            ->first();
    }

    /**
     * Lấy bài học đầu tiên của khóa học
     */
    public function getFirstLesson(int $courseId): ?Lesson
    {
        return $this->model->where('course_id', $courseId)
            ->orderBy('order')
            ->first();
    }

    /**
     * Lấy bài học cuối cùng của khóa học
     */
    public function getLastLesson(int $courseId): ?Lesson
    {
        return $this->model->where('course_id', $courseId)
            ->orderBy('order', 'desc')
            ->first();
    }

    /**
     * Đếm số bài học trong khóa học
     */
    public function countLessonsByCourse(int $courseId): int
    {
        return $this->model->where('course_id', $courseId)->count();
    }

    /**
     * Sắp xếp lại thứ tự bài học trong khóa học
     */
    public function reorderLessons(int $courseId, array $lessonIds): bool
    {
        try {
            foreach ($lessonIds as $order => $lessonId) {
                $this->model->where('id', $lessonId)
                    ->where('course_id', $courseId)
                    ->update(['order' => $order + 1]);
            }
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Lấy bài học với tiến độ của học viên
     */
    public function getLessonWithProgress(int $lessonId, int $studentId): ?Lesson
    {
        return $this->model->with(['course', 'resources', 'quiz'])
            ->where('id', $lessonId)
            ->first()
            ?->load(['progress' => function ($query) use ($studentId) {
                $query->where('student_id', $studentId);
            }]);
    }

    /**
     * Lấy bài học đã hoàn thành của học viên trong khóa học
     */
    public function getCompletedLessons(int $courseId, int $studentId): Collection
    {
        return $this->model->where('course_id', $courseId)
            ->whereHas('progress', function ($query) use ($studentId) {
                $query->where('student_id', $studentId)
                    ->where('is_complete', true);
            })
            ->orderBy('order')
            ->get();
    }

    /**
     * Lấy bài học chưa hoàn thành của học viên trong khóa học
     */
    public function getIncompleteLessons(int $courseId, int $studentId): Collection
    {
        return $this->model->where('course_id', $courseId)
            ->whereDoesntHave('progress', function ($query) use ($studentId) {
                $query->where('student_id', $studentId)
                    ->where('is_complete', true);
            })
            ->orderBy('order')
            ->get();
    }

    /**
     * Đánh dấu bài học hoàn thành
     */
    public function markAsCompleted(int $lessonId, int $studentId): bool
    {
        return LessonProgress::updateOrCreate(
            [
                'lesson_id' => $lessonId,
                'student_id' => $studentId
            ],
            [
                'is_complete' => true
            ]
        ) ? true : false;
    }

    /**
     * Bỏ đánh dấu hoàn thành bài học
     */
    public function markAsIncomplete(int $lessonId, int $studentId): bool
    {
        return LessonProgress::updateOrCreate(
            [
                'lesson_id' => $lessonId,
                'student_id' => $studentId
            ],
            [
                'is_complete' => false
            ]
        ) ? true : false;
    }

    /**
     * Kiểm tra bài học đã hoàn thành chưa
     */
    public function isLessonCompleted(int $lessonId, int $studentId): bool
    {
        return LessonProgress::where('lesson_id', $lessonId)
            ->where('student_id', $studentId)
            ->where('is_complete', true)
            ->exists();
    }

    /**
     * Lấy tiến độ bài học của học viên
     */
    public function getLessonProgress(int $lessonId, int $studentId): ?LessonProgress
    {
        return LessonProgress::where('lesson_id', $lessonId)
            ->where('student_id', $studentId)
            ->first();
    }

    /**
     * Tìm kiếm bài học
     */
    public function search(string $keyword, int $courseId = null): Collection
    {
        $query = $this->model->with(['course'])
            ->where('title', 'like', '%' . $keyword . '%');

        if ($courseId) {
            $query->where('course_id', $courseId);
        }

        return $query->orderBy('course_id')
            ->orderBy('order')
            ->get();
    }

    /**
     * Lấy bài học với filter
     */
    public function getLessonsWithFilters(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['course', 'resources', 'quiz']);

        // Filter theo khóa học
        if (!empty($filters['course_id'])) {
            $query->where('course_id', $filters['course_id']);
        }

        // Tìm kiếm
        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        // Sắp xếp
        $sortBy = $filters['sort_by'] ?? 'order';
        $sortOrder = $filters['sort_order'] ?? 'asc';

        if ($sortBy === 'course_title') {
            $query->join('courses', 'lessons.course_id', '=', 'courses.id')
                ->orderBy('courses.title', $sortOrder)
                ->select('lessons.*');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    /**
     * Duplicate bài học
     */
    public function duplicateLesson(int $lessonId, int $newCourseId = null): ?Lesson
    {
        $originalLesson = $this->findById($lessonId);

        if (!$originalLesson) {
            return null;
        }

        $courseId = $newCourseId ?? $originalLesson->course_id;
        $lastOrder = $this->model->where('course_id', $courseId)->max('order') ?? 0;

        $newLessonData = $originalLesson->toArray();
        unset($newLessonData['id'], $newLessonData['created_at'], $newLessonData['updated_at']);

        $newLessonData['course_id'] = $courseId;
        $newLessonData['order'] = $lastOrder + 1;
        $newLessonData['title'] = $newLessonData['title'] . ' (Copy)';

        return $this->create($newLessonData);
    }

    /**
     * Lấy thống kê bài học
     */
    public function getLessonStats(): array
    {
        return [
            'total_lessons' => $this->model->count(),
            'lessons_with_quiz' => $this->model->whereHas('quiz')->count(),
            'lessons_with_resources' => $this->model->whereHas('resources')->count(),
            'average_lessons_per_course' => $this->model->groupBy('course_id')->avg('course_id')
        ];
    }

    /**
     * Lấy bài học gần đây
     */
    public function getRecentLessons(int $limit = 10): Collection
    {
        return $this->model->with(['course'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Lấy bài học phổ biến (có nhiều học viên hoàn thành)
     */
    public function getPopularLessons(int $limit = 10): Collection
    {
        return $this->model->with(['course'])
            ->withCount(['progress as completed_count' => function ($query) {
                $query->where('is_complete', true);
            }])
            ->orderBy('completed_count', 'desc')
            ->limit($limit)
            ->get();
    }
}
