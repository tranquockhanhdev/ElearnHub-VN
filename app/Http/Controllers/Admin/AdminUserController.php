<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\StoreUserRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Http\Requests\Admin\User\UpdateInstructorRequest;
use App\Models\User;
use App\Services\Admin\User\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function studentList(Request $request)
    {
        $students = $this->userService->getUsersByRole(3, $request);

        return Inertia::render('Admin/Student/AdminStudentList', [
            'students' => $students,
        ]);
    }

    public function instructorList(Request $request)
    {
        $instructors = $this->userService->getUsersByRole(2, $request);

        return Inertia::render('Admin/Instructor/AdminInstructorList', [
            'instructors' => $instructors,
        ]);
    }

    public function showInstructor($id)
    {
        $data = $this->userService->getInstructorDetail($id);

        return Inertia::render('Admin/Instructor/ShowInstructor', [
            'instructor' => $data['instructor'],
            'courses' => $data['courses'],
            'courseStats' => $data['courseStats'],
        ]);
    }

  public function updateInstructor(UpdateInstructorRequest $request, $id)
{
    $this->userService->updateInstructorProfile(
        $id,
        $request->except('avatar'), // ✅ loại bỏ avatar
        $request->file('avatar')    // ✅ truyền file rõ ràng
    );

    return back()->with('success', 'Thông tin giảng viên đã được cập nhật');
}

    public function removeInstructorAvatar($id)
    {
        $this->userService->removeInstructorAvatar($id);

        return back()->with('success', 'Ảnh đại diện đã được xoá');
    }

    public function showStudent($id)
    {
        $data = $this->userService->getStudentDetail($id);

        return Inertia::render('Admin/Student/ShowStudent', [
            'student' => $data['student'],
            'enrollments' => $data['enrollments'],
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->userService->createUser($request->validated());

        return back()->with('success', 'Tạo người dùng thành công!');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->userService->updateUser($user, $request->validated());

        return back()->with('success', 'Cập nhật người dùng thành công.');
    }

    public function destroy(User $user)
    {
        $this->userService->deleteUser($user);

        return back()->with('success', 'Xóa người dùng thành công!');
    }

    public function block(User $user)
    {
        $this->userService->suspendUser($user);

        return back()->with('success', 'Người dùng đã bị chặn.');
    }
   public function unblock(User $user)
{
    $this->userService->activateUser($user);
    return back()->with('success', 'Người dùng đã được mở chặn.');
}
}