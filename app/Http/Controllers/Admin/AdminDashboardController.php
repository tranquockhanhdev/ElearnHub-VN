<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 📊 Thống kê doanh thu
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');

        // Doanh thu 7 ngày gần nhất
        $revenueBy7Days = Payment::where('status', 'completed')
            ->where('completed_at', '>=', $today->copy()->subDays(6))
            ->select(
                DB::raw('DATE(completed_at) as date'),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Doanh thu 12 tháng gần nhất
        $revenueBy12Months = Payment::where('status', 'completed')
            ->where('completed_at', '>=', $today->copy()->subMonths(11)->startOfMonth())
            ->select(
                DB::raw('YEAR(completed_at) as year'),
                DB::raw('MONTH(completed_at) as month'),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Doanh thu 5 năm gần nhất
        $revenueBy5Years = Payment::where('status', 'completed')
            ->where('completed_at', '>=', $today->copy()->subYears(4)->startOfYear())
            ->select(
                DB::raw('YEAR(completed_at) as year'),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('year')
            ->orderBy('year')
            ->get();

        // 👥 Thống kê người dùng
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', $today)->count();

        // Thành viên đăng ký theo 12 tháng
        $usersByMonth = User::where('created_at', '>=', $today->copy()->subMonths(11)->startOfMonth())
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // 📚 Thống kê khóa học
        $totalCourses = Course::count();

        // Số lượng học viên theo từng khóa học
        $courseEnrollments = Course::withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->get();

        // Top 5 khóa học có ít học viên nhất
        $leastEnrolledCourses = Course::withCount('enrollments')
            ->orderBy('enrollments_count', 'asc')
            ->limit(5)
            ->get();

        // Top 5 khóa học bán chạy nhất (theo doanh thu)
        $bestSellingCourses = Course::with(['payments' => function ($query) {
            $query->where('status', 'completed');
        }])
            ->get()
            ->map(function ($course) {
                $course->total_revenue = $course->payments->sum('amount');
                $course->total_sales = $course->payments->count();
                return $course;
            })
            ->sortByDesc('total_revenue')
            ->take(5)
            ->values();

        // 📦 Giao dịch gần đây
        $recentPayments = Payment::with(['student', 'course'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_users' => $totalUsers,
                'new_users_today' => $newUsersToday,
                'total_courses' => $totalCourses,
                'total_payments' => Payment::where('status', 'completed')->count(),
            ],
            'revenue_by_7days' => $revenueBy7Days,
            'revenue_by_12months' => $revenueBy12Months,
            'revenue_by_5years' => $revenueBy5Years,
            'users_by_month' => $usersByMonth,
            'course_enrollments' => $courseEnrollments,
            'least_enrolled_courses' => $leastEnrolledCourses,
            'best_selling_courses' => $bestSellingCourses,
            'recent_payments' => $recentPayments,
        ]);
    }
}
