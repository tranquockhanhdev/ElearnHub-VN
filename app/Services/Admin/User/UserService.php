<?php

namespace App\Services\Admin\User;

use App\Models\User;
use App\Models\Instructor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Repositories\Admin\User\UserRepository;

class UserService
{
    protected $userRepo;

    public function __construct(UserRepository $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    /**
     * Danh sách người dùng theo vai trò (role_id)
     */
    public function getUsersByRole(int $roleId, $request)
    {
        return $this->userRepo->getUsersByRole($roleId, $request);
    }

    /**
     * Tạo người dùng mới
     */
    public function createUser(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        return $this->userRepo->createUser($data);
    }

    /**
     * Cập nhật thông tin người dùng
     */
    public function updateUser(User $user, array $data)
    {
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        return $this->userRepo->updateUser($user, $data);
    }

    /**
     * Xoá người dùng
     */
    public function deleteUser(User $user)
    {
        return $this->userRepo->deleteUser($user);
    }

    /**
     * Chặn người dùng
     */
    public function suspendUser(User $user)
    {
        return $this->userRepo->suspendUser($user);
    }
 public function activateUser(User $user)
{
    return $this->userRepo->updateUser($user, ['status' => 'active']);
}


    /**
     * Cập nhật thông tin giảng viên
     */
   public function updateInstructorProfile(int $userId, array $data, $avatar = null)
{
    $instructor = \App\Models\Instructor::firstOrNew(['user_id' => $userId]);

    if ($avatar) {
        $path = $avatar->store('avatars', 'public'); // ✅ Lưu file thật
        $instructor->avatar = '/storage/' . $path;   // ✅ Lưu đường dẫn đúng vào DB
    }

    $instructor->fill($data);
    $instructor->save();

    return $instructor;
}


    /**
     * Xoá avatar giảng viên
     */
    public function removeInstructorAvatar(int $userId)
    {
        $instructor = Instructor::where('user_id', $userId)->firstOrFail();

        if ($instructor->avatar) {
            $relativePath = str_replace('/storage/', '', $instructor->avatar);

            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }

            $instructor->avatar = null;
            $instructor->save();
        }

        return $instructor;
    }

    /**
     * Lấy giảng viên và khoá học của họ
     */
    public function getInstructorDetail(int $id)
    {
        $instructor = $this->userRepo->findInstructor($id);
        $courses = $this->userRepo->getInstructorCourses($id);
        $courseStats = $this->userRepo->getCourseStats($id);

        return compact('instructor', 'courses', 'courseStats');
    }

    /**
     * Lấy học viên và danh sách khoá học đã ghi danh
     */
    public function getStudentDetail(int $id)
    {
        $student = $this->userRepo->findStudent($id);
        $enrollments = $this->userRepo->getStudentEnrollments($id);

        return compact('student', 'enrollments');
    }
}