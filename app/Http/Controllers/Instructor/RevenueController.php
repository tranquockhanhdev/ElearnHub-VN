<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstructorRequest;
use App\Models\Payment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RevenueController extends Controller
{
    /**
     * Display a listing of revenue data for instructor's courses
     */
    public function index(InstructorRequest $request)
    {
        Log::info(request()->all());
        $instructorId = Auth::id();

        // Build query for courses with revenue data
        $query = Course::select([
            'courses.id',
            'courses.title',
            'courses.slug',
            'courses.img_url',
            'courses.price',
            'courses.created_at',
            DB::raw('COUNT(DISTINCT enrollments.id) as total_students'),
            DB::raw('COALESCE(SUM(CASE WHEN payments.status = "completed" THEN payments.amount ELSE 0 END), 0) as total_revenue'),
            DB::raw('COUNT(DISTINCT CASE WHEN enrollments.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN enrollments.id END) as students_this_month'),
            DB::raw('COALESCE(SUM(CASE WHEN payments.status = "completed" AND payments.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN payments.amount ELSE 0 END), 0) as revenue_this_month')
        ])
            ->leftJoin('enrollments', 'courses.id', '=', 'enrollments.course_id')
            ->leftJoin('payments', 'enrollments.payment_id', '=', 'payments.id')
            ->where('courses.instructor_id', $instructorId)
            ->groupBy('courses.id', 'courses.title', 'courses.slug', 'courses.img_url', 'courses.price', 'courses.created_at');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('courses.title', 'like', "%{$search}%");
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('courses.status', $request->status);
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        switch ($sortField) {
            case 'title':
                $query->orderBy('courses.title', $sortDirection);
                break;
            case 'total_revenue':
                $query->orderBy('total_revenue', $sortDirection);
                break;
            case 'total_students':
                $query->orderBy('total_students', $sortDirection);
                break;
            case 'revenue_this_month':
                $query->orderBy('revenue_this_month', $sortDirection);
                break;
            case 'students_this_month':
                $query->orderBy('students_this_month', $sortDirection);
                break;
            default:
                $query->orderBy('courses.created_at', $sortDirection);
                break;
        }

        // Get paginated results
        $courses = $query->paginate(5)->withQueryString();

        // Calculate monthly averages
        $courses->getCollection()->transform(function ($course) {
            // Calculate months since course creation
            $monthsSinceCreation = max(1, now()->diffInMonths($course->created_at) + 1);

            $course->avg_revenue_per_month = $course->total_revenue / $monthsSinceCreation;
            $course->avg_students_per_month = $course->total_students / $monthsSinceCreation;

            return $course;
        });

        // Get overall statistics
        $stats = [
            'total_courses' => Course::where('instructor_id', $instructorId)->count(),
            'total_revenue' => Payment::join('enrollments', 'payments.id', '=', 'enrollments.payment_id')
                ->join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('courses.instructor_id', $instructorId)
                ->where('payments.status', 'completed')
                ->sum('payments.amount'),
            'total_students' => DB::table('enrollments')
                ->join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('courses.instructor_id', $instructorId)
                ->distinct('enrollments.student_id')
                ->count('enrollments.student_id'),
            'revenue_this_month' => Payment::join('enrollments', 'payments.id', '=', 'enrollments.payment_id')
                ->join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('courses.instructor_id', $instructorId)
                ->where('payments.status', 'completed')
                ->whereMonth('payments.created_at', now()->month)
                ->whereYear('payments.created_at', now()->year)
                ->sum('payments.amount'),
        ];

        return Inertia::render('Intructors/Revenue', [
            'courses' => $courses,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display revenue details for a specific course
     */
    public function show(InstructorRequest $request, $courseId)
    {
        $instructorId = Auth::id();

        // Verify course belongs to instructor
        $course = Course::where('id', $courseId)
            ->where('instructor_id', $instructorId)
            ->firstOrFail();

        // Get detailed payments for this course
        $query = Payment::select([
            'payments.*',
            'users.name as student_name',
            'users.email as student_email'
        ])
            ->join('enrollments', 'payments.id', '=', 'enrollments.payment_id')
            ->join('users', 'enrollments.student_id', '=', 'users.id')
            ->where('enrollments.course_id', $courseId);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('users.email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('payments.status', $request->status);
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        switch ($sortField) {
            case 'student_name':
                $query->orderBy('users.name', $sortDirection);
                break;
            case 'amount':
                $query->orderBy('payments.amount', $sortDirection);
                break;
            case 'status':
                $query->orderBy('payments.status', $sortDirection);
                break;
            default:
                $query->orderBy('payments.created_at', $sortDirection);
                break;
        }

        $payments = $query->paginate(15)->withQueryString();

        // Course statistics
        $courseStats = [
            'total_revenue' => Payment::join('enrollments', 'payments.id', '=', 'enrollments.payment_id')
                ->where('enrollments.course_id', $courseId)
                ->where('payments.status', 'completed')
                ->sum('payments.amount'),
            'total_students' => Payment::join('enrollments', 'payments.id', '=', 'enrollments.payment_id')
                ->where('enrollments.course_id', $courseId)
                ->where('payments.status', 'completed')
                ->count(),
            'avg_revenue_per_student' => Payment::join('enrollments', 'payments.id', '=', 'enrollments.payment_id')
                ->where('enrollments.course_id', $courseId)
                ->where('payments.status', 'completed')
                ->avg('payments.amount'),
            'revenue_this_month' => Payment::join('enrollments', 'payments.id', '=', 'enrollments.payment_id')
                ->where('enrollments.course_id', $courseId)
                ->where('payments.status', 'completed')
                ->whereMonth('payments.created_at', now()->month)
                ->whereYear('payments.created_at', now()->year)
                ->sum('payments.amount'),
        ];

        return Inertia::render('Intructors/RevenueDetail', [
            'course' => $course,
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
            'stats' => $courseStats,
        ]);
    }
}
