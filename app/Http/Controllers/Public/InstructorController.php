<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Course;
use Inertia\Inertia;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    public function show($id)
    {
        // Lấy thông tin giảng viên
        $instructor = Instructor::with(['user'])
            ->where('user_id', $id)
            ->firstOrFail();
        // Lấy các khóa học của giảng viên thông qua user_id
        $courses = Course::with(['categories', 'enrollments'])
            ->where('instructor_id', $instructor->user_id)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();
        // Tính toán thống kê
        $stats = [
            'total_courses' => $courses->count(),
            'total_students' => $courses->sum(function ($course) {
                return $course->enrollments->count();
            }),
            'total_reviews' => 0,
            'average_rating' => 0,
        ];

        return Inertia::render('Public/InstructorProfile', [
            'instructor' => $instructor,
            'courses' => $courses,
            'stats' => $stats,
        ]);
    }
}
