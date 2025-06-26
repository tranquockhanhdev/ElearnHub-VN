<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentRequest;
use App\Services\StudentDashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class StudentDashboardController extends Controller
{
    protected $studentDashboardService;

    public function __construct(StudentDashboardService $studentDashboardService)
    {
        $this->studentDashboardService = $studentDashboardService;
    }

    /**
     * Hiển thị dashboard chính - Chỉ hiển thị 5 khóa học gần đây
     */
    public function index(Request $request)
    {
        try {
            $studentId = Auth::id();

            // Lấy dữ liệu dashboard với 5 khóa học gần đây
            $dashboardData = $this->studentDashboardService->getDashboardData($studentId);

            return Inertia::render('Students/Dashboard', $dashboardData);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải dashboard']);
        }
    }

    /**
     * Hiển thị profile
     */
    public function profile()
    {
        return Inertia::render('Students/Profile', [
            'auths' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Cập nhật profile
     */
    public function updateProfile(StudentRequest $request)
    {
        try {
            $studentId = Auth::id();
            $updated = $this->studentDashboardService->updateProfile($studentId, $request->only([
                'name',
                'phone'
            ]));

            if ($updated) {
                return back()->with('success', 'Cập nhật thông tin thành công!');
            }

            return back()->withErrors(['error' => 'Không thể cập nhật thông tin']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi cập nhật thông tin']);
        }
    }

    /**
     * Hiển thị form đổi mật khẩu
     */
    public function changePassword()
    {
        return Inertia::render('Students/ChangePassword');
    }

    /**
     * Cập nhật mật khẩu
     */
    public function updatePassword(StudentRequest $request)
    {
        try {
            $studentId = Auth::id();
            $result = $this->studentDashboardService->changePassword(
                $studentId,
                $request->current_password,
                $request->password
            );

            if ($result) {
                return back()->with('success', 'Đổi mật khẩu thành công!');
            }

            return back()->withErrors(['current_password' => 'Mật khẩu hiện tại không chính xác']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi đổi mật khẩu']);
        }
    }

    /**
     * Hiển thị khóa học đã hoàn thành
     */
    public function completedCourses()
    {
        try {
            $studentId = Auth::id();
            $completedCourses = $this->studentDashboardService->getCompletedCourses($studentId);

            return Inertia::render('Students/CompletedCourses', [
                'completedCourses' => $completedCourses
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải khóa học đã hoàn thành']);
        }
    }

    /**
     * Hiển thị tất cả khóa học đã đăng ký
     */
    public function enrolledCourses()
    {
        try {
            $studentId = Auth::id();
            $enrolledCourses = $this->studentDashboardService->getAllEnrolledCourses($studentId);

            return Inertia::render('Students/EnrolledCourses', [
                'enrolledCourses' => $enrolledCourses
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải khóa học đã đăng ký']);
        }
    }

    /**
     * Hiển thị khóa học đang học
     */
    public function inProgressCourses()
    {
        try {
            $studentId = Auth::id();
            $inProgressCourses = $this->studentDashboardService->getInProgressCourses($studentId);

            return Inertia::render('Students/InProgressCourses', [
                'inProgressCourses' => $inProgressCourses
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải khóa học đang học']);
        }
    }

    /**
     * Hiển thị hoạt động gần đây
     */
    public function recentActivity()
    {
        try {
            $studentId = Auth::id();
            $recentActivity = $this->studentDashboardService->getRecentActivity($studentId);

            return Inertia::render('Students/RecentActivity', [
                'recentActivity' => $recentActivity
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải hoạt động gần đây']);
        }
    }

    /**
     * API endpoint - Lấy thống kê dashboard
     */
    public function getStats()
    {
        try {
            $studentId = Auth::id();
            $stats = $this->studentDashboardService->getStudentStats($studentId);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lấy thống kê'
            ], 500);
        }
    }

    /**
     * API endpoint - Lấy tiến độ khóa học
     */
    public function getCourseProgress(Request $request, $courseId)
    {
        try {
            $studentId = Auth::id();
            $progress = $this->studentDashboardService->getCourseProgress($studentId, $courseId);

            return response()->json([
                'success' => true,
                'data' => $progress
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lấy tiến độ khóa học'
            ], 500);
        }
    }
}
