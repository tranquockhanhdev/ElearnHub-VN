<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Course;


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

}