<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Validation\Rule;
use App\Models\Course;
use Illuminate\Support\Facades\Hash;


class AdminUserController extends Controller
{
    public function studentList()
    {
        $students = User::where('role_id', 3)->paginate(6);

        return Inertia::render('Admin/Student/AdminStudentList', [
            'students' => $students
        ]);
    }
    public function instructorList()
    {
        // Lấy danh sách Instructor (giảng viên) role_id = 2
        $instructors = User::where('role_id', 2)->paginate(6); // 6 giảng viên mỗi trang

        return Inertia::render('Admin/Instructor/AdminInstructorList', [
            'instructors' => $instructors,
        ]);
    }
    public function showInstructor($id)
        {
        $instructor = User::where('role_id', 2)->findOrFail($id);
        // Eager load categories qua quan hệ many-to-many
        $courses = Course::with('categories')
                    ->where('instructor_id', $id)
                    ->get();

        return Inertia::render('Admin/Instructor/ShowInstructor', [
            'instructor' => $instructor,
            'courses' => $courses,
        ]);
        }
  public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:6',
        'phone' => 'nullable|string|max:20',
        'role_id' => 'required|integer',
        'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
    ]);

    $validated['password'] = bcrypt($validated['password']);
    User::create($validated);

    return redirect()->back()->with('success', 'Tạo người dùng thành công!');
}

     public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:20'],
            'role_id' => ['required', 'integer', Rule::in([1, 2, 3])],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'];
        $user->role_id = $validated['role_id'];
        $user->status = $validated['status'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->back()->with('success', 'Cập nhật người dùng thành công.');
    }

}