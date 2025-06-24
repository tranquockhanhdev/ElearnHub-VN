<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display students list for instructor
     */
    public function index(Request $request)
    {
        $instructorId = Auth::id();

        // Get instructor's courses
        $instructorCourses = Course::where('instructor_id', $instructorId)
            ->select('id', 'title')
            ->get();

        // Build query for students
        $query = User::select('users.*', 'enrollments.created_at as enrolled_at', 'enrollments.status as enrollment_status', 'courses.title as course_title', 'courses.id as course_id')
            ->join('enrollments', 'users.id', '=', 'enrollments.student_id')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->where('courses.instructor_id', $instructorId)
            ->where('users.role_id', 3); // Sửa từ users.role thành users.role_id

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('users.email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('course_id') && $request->course_id !== 'all') {
            $query->where('courses.id', $request->course_id);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('enrollments.status', 'active');
            } elseif ($request->status === 'completed') {
                $query->where('enrollments.status', 'completed');
            }
        }

        // Apply sorting
        $sortField = $request->get('sort', 'enrolled_at');
        $sortDirection = $request->get('direction', 'desc');

        switch ($sortField) {
            case 'name':
                $query->orderBy('users.name', $sortDirection);
                break;
            case 'email':
                $query->orderBy('users.email', $sortDirection);
                break;
            case 'course':
                $query->orderBy('courses.title', $sortDirection);
                break;
            default:
                $query->orderBy('enrollments.created_at', $sortDirection);
                break;
        }

        // Get paginated results
        $students = $query->paginate(15)->withQueryString();

        // Get statistics - Sửa lại các query statistics
        $stats = [
            'total_students' => User::join('enrollments', 'users.id', '=', 'enrollments.student_id')
                ->join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('courses.instructor_id', $instructorId)
                ->where('users.role_id', 3) // Sửa từ users.role thành users.role_id
                ->distinct('users.id')
                ->count(),
            'new_this_month' => User::join('enrollments', 'users.id', '=', 'enrollments.student_id')
                ->join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('courses.instructor_id', $instructorId)
                ->where('users.role_id', 3) // Sửa từ users.role thành users.role_id
                ->whereMonth('enrollments.created_at', now()->month)
                ->whereYear('enrollments.created_at', now()->year)
                ->distinct('users.id')
                ->count(),
            'active_enrollments' => Enrollment::join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('courses.instructor_id', $instructorId)
                ->where('enrollments.status', 'active')
                ->count(),
            'completed_enrollments' => Enrollment::join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('courses.instructor_id', $instructorId)
                ->where('enrollments.status', 'completed')
                ->count(),
        ];

        return Inertia::render('Intructors/Students', [
            'students' => $students,
            'courses' => $instructorCourses,
            'filters' => $request->only(['search', 'course_id', 'status', 'sort', 'direction']),
            'stats' => $stats,
        ]);
    }
}
