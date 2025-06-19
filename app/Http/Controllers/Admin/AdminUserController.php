<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Validation\Rule;
use App\Models\Course;
use Illuminate\Support\Facades\Hash;
use App\Models\Enrollment;


class AdminUserController extends Controller
{
    public function studentList(Request $request)
    {
        $query = User::query()->where('role_id', 3);

        // Tìm kiếm keyword (name hoặc email)
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%');
            });
        }


        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        // Lọc theo trạng thái
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sắp xếp
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
                $query->orderBy('created_at', 'desc'); // newest
                break;
        }

        $students = $query->paginate(6)->withQueryString();

        return Inertia::render('Admin/Student/AdminStudentList', [
            'students' => $students
        ]);
    }
    public function instructorList(Request $request)
    {
        $query = User::query()->where('role_id', 2);

        // Tìm kiếm keyword (name hoặc email)
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%');
            });
        }


        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        // Lọc theo trạng thái
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sắp xếp
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
                $query->orderBy('created_at', 'desc'); // newest
                break;
        }

        $instructors = $query->paginate(6)->withQueryString();

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
 public function showStudent(Request $request, $id)
{
    $student = User::where('role_id', 3)->findOrFail($id);

    $enrollments = Enrollment::with('course')
        ->where('student_id', $id)
        ->orderByDesc('enrolled_at')
        ->paginate(5) 
        ->withQueryString(); 

    return Inertia::render('Admin/Student/ShowStudent', [
        'student' => $student,
        'enrollments' => $enrollments, // Trả về sẽ có: data, links, meta
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
                'required',
                'email',
                'max:255',
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
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'Xóa người dùng thành công!');
    }
    public function block(User $user)
    {
        $user->update(['status' => 'suspended']);

        return back()->with('success', 'Người dùng đã bị chặn.');
    }
}