<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\Course;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class StudentRepository
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    /**
     * Lấy tất cả học viên
     */
    public function getAll(): Collection
    {
        return $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->with(['enrollments.course'])
            ->get();
    }

    /**
     * Lấy học viên theo ID
     */
    public function findById(int $id): ?User
    {
        return $this->model
            ->where('role_id', 3) // Sửa role_id thành 3
            ->where('id', $id)
            ->with(['enrollments.course', 'lessonProgress'])
            ->first();
    }

    /**
     * Tạo học viên mới
     */
    public function create(array $data): User
    {
        $data['role_id'] = 3; // Sửa role_id thành 3
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $this->model->create($data);
    }

    /**
     * Cập nhật thông tin học viên
     */
    public function update(int $id, array $data): bool
    {
        $student = $this->findById($id);
        if ($student) {
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }
            return $student->update($data);
        }
        return false;
    }

    /**
     * Xóa học viên
     */
    public function delete(int $id): bool
    {
        $student = $this->findById($id);
        if ($student) {
            return $student->delete();
        }
        return false;
    }

    /**
     * Lấy học viên với phân trang
     */
    public function getStudentsWithPagination(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->with(['enrollments.course']);

        // Tìm kiếm
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('phone', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Filter theo trạng thái
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter theo ngày đăng ký
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Sắp xếp
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    /**
     * Lấy học viên theo email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->where('email', $email)
            ->first();
    }

    /**
     * Lấy khóa học đã đăng ký của học viên
     */
    public function getStudentCourses(int $studentId): Collection
    {
        return Course::whereHas('enrollments', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })->with(['instructor', 'lessons'])->get();
    }

    /**
     * Lấy khóa học đã hoàn thành của học viên
     */
    public function getCompletedCourses(int $studentId): Collection
    {
        $enrolledCourses = $this->getStudentCourses($studentId);

        return $enrolledCourses->filter(function ($course) use ($studentId) {
            $totalLessons = $course->lessons->count();
            if ($totalLessons === 0) return false;

            $completedLessons = LessonProgress::whereIn('lesson_id', $course->lessons->pluck('id'))
                ->where('student_id', $studentId)
                ->where('is_complete', true)
                ->count();

            return $completedLessons === $totalLessons;
        });
    }

    /**
     * Lấy khóa học đang học của học viên
     */
    public function getInProgressCourses(int $studentId): Collection
    {
        $enrolledCourses = $this->getStudentCourses($studentId);

        return $enrolledCourses->filter(function ($course) use ($studentId) {
            $totalLessons = $course->lessons->count();
            if ($totalLessons === 0) return true;

            $completedLessons = LessonProgress::whereIn('lesson_id', $course->lessons->pluck('id'))
                ->where('student_id', $studentId)
                ->where('is_complete', true)
                ->count();

            return $completedLessons > 0 && $completedLessons < $totalLessons;
        });
    }

    /**
     * Lấy thống kê của học viên
     */
    public function getStudentStats(int $studentId): array
    {
        $enrollments = Enrollment::where('student_id', $studentId)->count();

        $totalLessonsCompleted = LessonProgress::where('student_id', $studentId)
            ->where('is_complete', true)
            ->count();

        $completedCourses = $this->getCompletedCourses($studentId)->count();
        $inProgressCourses = $this->getInProgressCourses($studentId)->count();

        return [
            'total_courses' => $enrollments,
            'completed_courses' => $completedCourses,
            'in_progress_courses' => $inProgressCourses,
            'completed_lessons' => $totalLessonsCompleted,
        ];
    }

    /**
     * Lấy hoạt động gần đây của học viên
     */
    public function getRecentActivity(int $studentId, int $limit = 20): Collection
    {
        return LessonProgress::with(['lesson.course'])
            ->where('student_id', $studentId)
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Lấy tiến độ học tập theo khóa học
     */
    public function getCourseProgress(int $studentId, int $courseId): array
    {
        $course = Course::with('lessons')->find($courseId);
        if (!$course) {
            return [];
        }

        $totalLessons = $course->lessons->count();
        $completedLessons = LessonProgress::whereIn('lesson_id', $course->lessons->pluck('id'))
            ->where('student_id', $studentId)
            ->where('is_complete', true)
            ->count();

        $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0;

        return [
            'course_id' => $courseId,
            'course_title' => $course->title,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'progress_percentage' => $progressPercentage,
            'is_completed' => $progressPercentage === 100.0
        ];
    }

    /**
     * Đăng ký học viên vào khóa học
     */
    public function enrollInCourse(int $studentId, int $courseId): bool
    {
        $existingEnrollment = Enrollment::where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->exists();

        if ($existingEnrollment) {
            return false;
        }

        Enrollment::create([
            'student_id' => $studentId,
            'course_id' => $courseId,
            'enrollment_date' => now(),
            'status' => 'active'
        ]);

        return true;
    }

    /**
     * Hủy đăng ký khóa học
     */
    public function unenrollFromCourse(int $studentId, int $courseId): bool
    {
        return Enrollment::where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->delete();
    }

    /**
     * Cập nhật profile học viên
     */
    public function updateProfile(int $studentId, array $data): bool
    {
        $allowedFields = ['name', 'phone'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));
        return $this->update($studentId, $updateData);
    }

    /**
     * Thay đổi mật khẩu
     */
    public function changePassword(int $studentId, string $newPassword): bool
    {
        return $this->update($studentId, ['password' => $newPassword]);
    }
    public function checkCurrentPassword(int $studentId, string $currentPassword): bool
    {
        $student = $this->findById($studentId);
        if (!$student) {
            return false;
        }
        return Hash::check($currentPassword, $student->password);
    }
    /**
     * Lấy top học viên hoạt động nhất
     */
    public function getTopActiveStudents(int $limit = 10): Collection
    {
        return $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->withCount(['lessonProgress as completed_lessons' => function ($query) {
                $query->where('is_complete', true);
            }])
            ->orderBy('completed_lessons', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Lấy học viên mới đăng ký
     */
    public function getRecentStudents(int $limit = 10): Collection
    {
        return $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Tìm kiếm học viên
     */
    public function search(string $keyword): Collection
    {
        return $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%')
                    ->orWhere('phone', 'like', '%' . $keyword . '%');
            })
            ->get();
    }

    /**
     * Lấy thống kê tổng quan học viên
     */
    public function getOverallStats(): array
    {
        $totalStudents = $this->model->where('role_id', 3)->count(); // Sửa role_id thành 3
        $activeStudents = $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->where('status', 'active')
            ->count();

        $studentsWithCourses = $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->whereHas('enrollments')
            ->count();

        $averageCoursesPerStudent = $studentsWithCourses > 0
            ? round(Enrollment::count() / $studentsWithCourses, 2)
            : 0;

        return [
            'total_students' => $totalStudents,
            'active_students' => $activeStudents,
            'students_with_courses' => $studentsWithCourses,
            'average_courses_per_student' => $averageCoursesPerStudent,
        ];
    }

    /**
     * Lấy thống kê đăng ký theo tháng
     */
    public function getMonthlyRegistrationStats(int $year): Collection
    {
        return $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Lấy danh sách học viên theo khóa học
     */
    public function getStudentsByCourse(int $courseId): Collection
    {
        return $this->model->where('role_id', 3) // Sửa role_id thành 3
            ->whereHas('enrollments', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->with(['enrollments' => function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            }])
            ->get();
    }

    /**
     * Cập nhật trạng thái học viên
     */
    public function updateStatus(int $studentId, string $status): bool
    {
        return $this->update($studentId, ['status' => $status]);
    }

    /**
     * Bulk operations - Cập nhật hàng loạt
     */
    public function bulkUpdateStatus(array $studentIds, string $status): bool
    {
        return $this->model->whereIn('id', $studentIds)
            ->where('role_id', 3) // Sửa role_id thành 3
            ->update(['status' => $status]);
    }

    /**
     * Xóa hàng loạt học viên
     */
    public function bulkDelete(array $studentIds): bool
    {
        return $this->model->whereIn('id', $studentIds)
            ->where('role_id', 3) // Sửa role_id thành 3
            ->delete();
    }
}