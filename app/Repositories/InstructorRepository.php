<?php

namespace App\Repositories;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Instructor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class InstructorRepository
{
    protected $course;
    protected $enrollment;
    protected $payment;

    public function __construct(Course $course, Enrollment $enrollment, Payment $payment)
    {
        $this->course = $course;
        $this->enrollment = $enrollment;
        $this->payment = $payment;
    }

    /**
     * Lấy thống kê tổng quan của giảng viên
     */
    public function getInstructorStats($instructorId)
    {
        // Tổng số khóa học
        $totalCourses = $this->course->where('instructor_id', $instructorId)->count();

        // Tổng số học viên
        $totalStudents = $this->enrollment->whereHas('course', function ($query) use ($instructorId) {
            $query->where('instructor_id', $instructorId);
        })->distinct('student_id')->count();

        // Tổng thu nhập
        $totalRevenue = $this->payment->whereHas('course', function ($query) use ($instructorId) {
            $query->where('instructor_id', $instructorId);
        })->where('status', 'completed')->sum('amount');

        // Tổng số đăng ký trong tháng
        $monthlyEnrollments = $this->enrollment->whereHas('course', function ($query) use ($instructorId) {
            $query->where('instructor_id', $instructorId);
        })->whereMonth('created_at', Carbon::now()->month)->count();

        return [
            'total_courses' => $totalCourses,
            'total_students' => $totalStudents,
            'total_revenue' => $totalRevenue,
            'monthly_enrollments' => $monthlyEnrollments
        ];
    }

    /**
     * Lấy dữ liệu biểu đồ doanh thu theo thời gian
     */
    public function getRevenueChart($instructorId, $period = 'month')
    {
        $query = $this->payment->whereHas('course', function ($query) use ($instructorId) {
            $query->where('instructor_id', $instructorId);
        })->where('status', 'completed');

        switch ($period) {
            case 'day':
                $data = $query->selectRaw('DATE(created_at) as date, SUM(amount) as revenue')
                    ->where('created_at', '>=', Carbon::now()->subDays(30))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();
                break;

            case 'week':
                $data = $query->selectRaw('YEARWEEK(created_at) as week, SUM(amount) as revenue')
                    ->where('created_at', '>=', Carbon::now()->subWeeks(12))
                    ->groupBy('week')
                    ->orderBy('week')
                    ->get();
                break;

            case 'quarter':
                $data = $query->selectRaw('QUARTER(created_at) as quarter, YEAR(created_at) as year, SUM(amount) as revenue')
                    ->where('created_at', '>=', Carbon::now()->subYears(2))
                    ->groupBy('quarter', 'year')
                    ->orderBy('year')
                    ->orderBy('quarter')
                    ->get();
                break;

            default: // month
                $data = $query->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, SUM(amount) as revenue')
                    ->where('created_at', '>=', Carbon::now()->subMonths(12))
                    ->groupBy('month', 'year')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();
                break;
        }

        return $data;
    }

    /**
     * Lấy đăng ký mới nhất
     */
    public function getLatestEnrollments($instructorId, $limit = 10)
    {
        return $this->enrollment->with(['student', 'course'])
            ->whereHas('course', function ($query) use ($instructorId) {
                $query->where('instructor_id', $instructorId);
            })
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Lấy khóa học phổ biến nhất
     */
    public function getPopularCourses($instructorId, $limit = 5)
    {
        return $this->course->where('instructor_id', $instructorId)
            ->withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Lấy doanh thu theo khóa học
     */
    public function getRevenueByCourse($instructorId)
    {
        return $this->course->where('instructor_id', $instructorId)
            ->withSum(['payments as total_revenue' => function ($query) {
                $query->where('status', 'completed');
            }], 'amount')
            ->having('total_revenue', '>', 0)
            ->orderBy('total_revenue', 'desc')
            ->get();
    }

    public function getInstructorByUserId($userId)
    {
        return Instructor::where('user_id', $userId)->first();
    }

    public function getInstructorWithUser($userId)
    {
        return Instructor::with('user')->where('user_id', $userId)->first();
    }

    public function createOrUpdateInstructor($userId, array $data)
    {
        return Instructor::updateOrCreate(
            ['user_id' => $userId],
            $data
        );
    }

    public function updateInstructorProfile($userId, array $data)
    {
        $instructor = $this->getInstructorByUserId($userId);

        if (!$instructor) {
            $instructor = new Instructor(['user_id' => $userId]);
        }

        $instructor->fill($data);
        $instructor->save();

        return $instructor;
    }

    public function uploadAvatar(UploadedFile $file, $userId)
    {
        // Xóa avatar cũ nếu có
        $instructor = $this->getInstructorByUserId($userId);
        if ($instructor && $instructor->avatar) {
            Storage::disk('public')->delete($instructor->avatar);
        }

        // Upload avatar mới
        $path = $file->store('avatars', 'public');

        return $path;
    }

    public function deleteAvatar($userId)
    {
        $instructor = $this->getInstructorByUserId($userId);

        if ($instructor && $instructor->avatar) {
            Storage::disk('public')->delete($instructor->avatar);
            $instructor->update(['avatar' => null]);
            return true;
        }

        return false;
    }
}
