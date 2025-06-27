<?php

namespace App\Repositories\Admin\User;

use App\Models\User;
use App\Models\Instructor;
use Illuminate\Http\Request;

class UserRepository
{
    public function getUsersByRole(int $roleId, Request $request)
    {
        $query = User::where('role_id', $roleId);

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                  ->orWhere('email', 'like', "%$keyword%");
            });
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        switch ($request->get('sort')) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'az':
                $query->orderBy('name', 'asc');
                break;
            case 'za':
                $query->orderBy('name', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->paginate(6)->withQueryString();
    }

    public function createUser(array $data): User
    {
        return User::create($data);
    }

    public function updateUser(User $user, array $data): bool
{
    return $user->update($data);
}
    public function deleteUser(User $user): bool
    {
        return $user->delete();
    }

    public function suspendUser(User $user): bool
    {
        return $user->update(['status' => 'suspended']);
    }

    public function findInstructor(int $id): User
    {
        return User::with('instructor')->where('role_id', 2)->findOrFail($id);
    }

    public function findStudent(int $id): User
    {
        return User::where('role_id', 3)->findOrFail($id);
    }

    public function getInstructorCourses(int $instructorId, int $perPage = 5)
    {
        return \App\Models\Course::with('categories')
            ->where('instructor_id', $instructorId)
            ->paginate($perPage);
    }

    public function getCourseStats(int $instructorId): array
    {
        return [
            'total' => \App\Models\Course::where('instructor_id', $instructorId)->count(),
            'active' => \App\Models\Course::where('instructor_id', $instructorId)->where('status', 'active')->count(),
            'pending' => \App\Models\Course::where('instructor_id', $instructorId)->where('status', 'pending')->count(),
            'inactive' => \App\Models\Course::where('instructor_id', $instructorId)->where('status', 'inactive')->count(),
        ];
    }

    public function getStudentEnrollments(int $studentId, int $perPage = 4)
    {
        return \App\Models\Enrollment::with('course')
            ->where('student_id', $studentId)
            ->orderByDesc('enrolled_at')
            ->paginate($perPage)
            ->withQueryString();
    }
}