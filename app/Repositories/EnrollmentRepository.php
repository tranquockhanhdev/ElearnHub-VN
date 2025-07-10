<?php

namespace App\Repositories;

use App\Models\Enrollment;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EnrollmentRepository
{
    protected $model;

    public function __construct(Enrollment $model)
    {
        $this->model = $model;
    }
    public function getTotalEnrollmentsCount(int $studentId): int
    {
        return $this->model->where('student_id', $studentId)->count();
    }
    public function getRecentStudentEnrollments(int $studentId, int $limit = 5): Collection
    {
        // Lấy danh sách course_id có học tập gần đây nhất
        $recentCourseIds = DB::table('lesson_progress')
            ->join('lessons', 'lesson_progress.lesson_id', '=', 'lessons.id')
            ->where('lesson_progress.student_id', $studentId)
            ->select('lessons.course_id', DB::raw('MAX(lesson_progress.updated_at) as latest_activity'))
            ->groupBy('lessons.course_id')
            ->orderBy('latest_activity', 'desc')
            ->limit($limit)
            ->pluck('lessons.course_id')
            ->toArray();

        // Nếu không có hoạt động học tập, lấy theo thứ tự đăng ký
        if (empty($recentCourseIds)) {
            return $this->model->with([
                'course.lessons.resources' => function ($query) {
                    $query->whereIn('type', ['video', 'document'])
                        ->where('status', 'approved')
                        ->orderBy('order', 'asc');
                },
                'course.instructor'
            ])
                ->where('student_id', $studentId)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();
        }

        // Lấy enrollments theo thứ tự hoạt động gần đây
        $enrollments = $this->model->with([
            'course.lessons.resources' => function ($query) {
                $query->whereIn('type', ['video', 'document'])
                    ->where('status', 'approved')
                    ->orderBy('order', 'asc');
            },
            'course.instructor'
        ])
            ->where('student_id', $studentId)
            ->whereIn('course_id', $recentCourseIds)
            ->get();

        // Sắp xếp theo thứ tự trong $recentCourseIds
        return $enrollments->sortBy(function ($enrollment) use ($recentCourseIds) {
            return array_search($enrollment->course_id, $recentCourseIds);
        })->values();
    }
    /**
     * Lấy tất cả enrollment
     */
    public function getAll(): Collection
    {
        return $this->model->with(['student', 'course'])->get();
    }

    /**
     * Lấy enrollment theo ID
     */
    public function findById(int $id): ?Enrollment
    {
        return $this->model->with(['student', 'course'])->find($id);
    }

    /**
     * Tạo enrollment mới
     */
    public function create(array $data): Enrollment
    {
        return $this->model->create($data);
    }

    /**
     * Cập nhật enrollment
     */
    public function update(int $id, array $data): bool
    {
        $enrollment = $this->findById($id);
        if ($enrollment) {
            return $enrollment->update($data);
        }
        return false;
    }

    /**
     * Xóa enrollment
     */
    public function delete(int $id): bool
    {
        $enrollment = $this->findById($id);
        if ($enrollment) {
            return $enrollment->delete();
        }
        return false;
    }

    /**
     * Lấy enrollment của học viên với phân trang
     */
    public function getStudentEnrollments(int $studentId, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['course.lessons', 'course.instructor'])
            ->where('student_id', $studentId);

        // Tìm kiếm theo tên khóa học
        if (!empty($filters['search'])) {
            $query->whereHas('course', function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Sắp xếp
        if (!empty($filters['sort'])) {
            switch ($filters['sort']) {
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'title':
                    $query->join('courses', 'enrollments.course_id', '=', 'courses.id')
                        ->orderBy('courses.title', 'asc')
                        ->select('enrollments.*');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $filters['per_page'] ?? 6;
        return $query->paginate($perPage);
    }

    /**
     * Lấy tất cả enrollment của học viên (không phân trang)
     */
    public function getAllStudentEnrollments(int $studentId): Collection
    {
        return $this->model->with([
            'course.lessons.resources' => function ($query) {
                $query->whereIn('type', ['video', 'document'])
                    ->where('status', 'approved')
                    ->orderBy('order', 'asc');
            },
            'course.instructor'
        ])
            ->where('student_id', $studentId)
            ->get();
    }

    /**
     * Kiểm tra học viên đã đăng ký khóa học chưa
     */
    public function isStudentEnrolled(int $studentId, int $courseId): bool
    {
        return $this->model->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->exists();
    }

    /**
     * Đăng ký học viên vào khóa học
     */
    public function enrollStudent(int $studentId, int $courseId, array $additionalData = []): Enrollment
    {
        $data = array_merge([
            'student_id' => $studentId,
            'course_id' => $courseId,
            'enrollment_date' => now(),
            'status' => 'active'
        ], $additionalData);

        return $this->create($data);
    }

    /**
     * Hủy đăng ký học viên khỏi khóa học
     */
    public function unenrollStudent(int $studentId, int $courseId): bool
    {
        return $this->model->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->delete();
    }

    /**
     * Lấy danh sách học viên của một khóa học
     */
    public function getCourseStudents(int $courseId): Collection
    {
        return $this->model->with('student')
            ->where('course_id', $courseId)
            ->get();
    }

    /**
     * Lấy số lượng học viên đã đăng ký khóa học
     */
    public function getCourseEnrollmentCount(int $courseId): int
    {
        return $this->model->where('course_id', $courseId)->count();
    }

    /**
     * Lấy enrollment với thông tin chi tiết
     */
    public function getEnrollmentDetails(int $studentId, int $courseId): ?Enrollment
    {
        return $this->model->with(['student', 'course.lessons', 'course.instructor'])
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->first();
    }

    /**
     * Cập nhật trạng thái enrollment
     */
    public function updateStatus(int $studentId, int $courseId, string $status): bool
    {
        return $this->model->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->update(['status' => $status]);
    }

    /**
     * Lấy enrollment theo trạng thái
     */
    public function getEnrollmentsByStatus(string $status): Collection
    {
        return $this->model->with(['student', 'course'])
            ->where('status', $status)
            ->get();
    }

    /**
     * Lấy enrollment trong khoảng thời gian
     */
    public function getEnrollmentsByDateRange(string $startDate, string $endDate): Collection
    {
        return $this->model->with(['student', 'course'])
            ->whereBetween('enrollment_date', [$startDate, $endDate])
            ->get();
    }

    /**
     * Lấy thống kê enrollment theo tháng
     */
    public function getMonthlyEnrollmentStats(int $year): Collection
    {
        return $this->model->selectRaw('MONTH(enrollment_date) as month, COUNT(*) as count')
            ->whereYear('enrollment_date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Lấy top khóa học có nhiều đăng ký nhất
     */
    public function getTopEnrolledCourses(int $limit = 10): Collection
    {
        return $this->model->with('course')
            ->selectRaw('course_id, COUNT(*) as enrollment_count')
            ->groupBy('course_id')
            ->orderBy('enrollment_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Lấy enrollment gần đây
     */
    public function getRecentEnrollments(int $limit = 10): Collection
    {
        return $this->model->with(['student', 'course'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Tìm kiếm enrollment
     */
    public function search(string $keyword): Collection
    {
        return $this->model->with(['student', 'course'])
            ->whereHas('student', function ($query) use ($keyword) {
                $query->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%');
            })
            ->orWhereHas('course', function ($query) use ($keyword) {
                $query->where('title', 'like', '%' . $keyword . '%');
            })
            ->get();
    }
}
