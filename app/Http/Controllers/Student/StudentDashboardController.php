<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
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
     * Hiển thị dashboard chính
     */
    public function index(Request $request)
    {
        try {
            $studentId = Auth::id();
            $filters = [
                'search' => $request->get('search', ''),
                'sort' => $request->get('sort', ''),
                'per_page' => $request->get('per_page', 6)
            ];

            $dashboardData = $this->studentDashboardService->getDashboardData($studentId, $filters);

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
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Cập nhật profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ], [
            'name.required' => 'Tên là bắt buộc',
            'phone.max' => 'Số điện thoại không được quá 20 ký tự',
        ]);

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
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::min(8)],
        ], [
            'current_password.required' => 'Mật khẩu hiện tại là bắt buộc',
            'password.required' => 'Mật khẩu mới là bắt buộc',
            'password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp'
        ]);

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