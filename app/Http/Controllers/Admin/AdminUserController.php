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
use App\Models\Instructor;
use Illuminate\Support\Facades\Storage;

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
        $instructor = User::where('role_id', 2)
            ->with('instructor') // <- đây là quan hệ từ User sang Instructor (1:1)
            ->findOrFail($id);

        $courses = Course::with('categories')
            ->where('instructor_id', $id)
            ->paginate(5);
        $total = Course::where('instructor_id', $id)->count();
        $active = Course::where('instructor_id', $id)->where('status', 'active')->count();
        $pending = Course::where('instructor_id', $id)->where('status', 'pending')->count();
        $inactive = Course::where('instructor_id', $id)->where('status', 'inactive')->count();

        return Inertia::render('Admin/Instructor/ShowInstructor', [
            'instructor' => $instructor,
            'courses' => $courses,
            'courseStats' => [
                'total' => $total,
                'active' => $active,
                'pending' => $pending,
                'inactive' => $inactive,
            ],
        ]);
    }

    public function updateInstructor(Request $request, $id)
    {

        $request->validate([
            'bio' => 'nullable|string',
            'profession' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'facebook_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
        ]);

        $instructor = Instructor::firstOrNew(['user_id' => $id]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $instructor->avatar = Storage::url($path);
        }

        $instructor->fill($request->only([
            'bio',
            'profession',
            'facebook_url',
            'twitter_url',
            'linkedin_url'
        ]));
        $instructor->save();

        return redirect()->back()->with('success', 'Thông tin giảng viên đã được cập nhật');
    }

    public function removeInstructorAvatar($id)
    {
        $instructor = Instructor::where('user_id', $id)->firstOrFail();

        // Xoá file cũ nếu có
        if ($instructor->avatar && Storage::disk('public')->exists(str_replace('/storage/', '', $instructor->avatar))) {
            if ($instructor->avatar) {
                $relativePath = str_replace('/storage/', '', $instructor->avatar);

                if (Storage::disk('public')->exists($relativePath)) {
                    Storage::disk('public')->delete($relativePath);
                }

                $instructor->avatar = null;
                $instructor->save();
            }
        }

        $instructor->avatar = null;
        $instructor->save();

        return redirect()->back()->with('success', 'Ảnh đại diện đã được xoá');
    }

    public function showStudent($id)
    {
        $student = User::where('role_id', 3)->findOrFail($id);

        $enrollments = Enrollment::with('course')
            ->where('student_id', $id)
            ->orderByDesc('enrolled_at')
            ->paginate(4)
            ->withQueryString();

        return Inertia::render('Admin/Student/ShowStudent', [
            'student' => $student,
            'enrollments' => $enrollments,
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