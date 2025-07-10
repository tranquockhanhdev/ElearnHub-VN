<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use App\Exports\PaymentsExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\User;
use App\Models\Course;
use Carbon\Carbon;

class AdminPaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['student', 'course', 'paymentMethod']);

        // Bộ lọc
        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('payment_time', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('payment_time', '<=', $request->end_date);
        }

        $payments = $query->latest()->paginate(10);

        // ✅ Thống kê
        $totalEarnings = Payment::where('status', 'completed')->sum('amount');
        $monthlyEarnings = Payment::where('status', 'completed')
            ->whereMonth('payment_time', now()->month)
            ->whereYear('payment_time', now()->year)
            ->sum('amount');
        $toBePaid = Payment::where('status', 'pending')->sum('amount');

        $adminLifetimeEarnings = $totalEarnings * 0.2;
        $adminMonthlyEarnings = $monthlyEarnings * 0.2;
        $adminPendingEarnings = $toBePaid * 0.2;

        return Inertia::render('Admin/Payment/PaymentList', [
            'payments' => $payments,
            'students' => User::where('role_id', 3)->select('id', 'name')->get(),
            'courses' => Course::select('id', 'title')->get(),
            'filters' => $request->only(['student_id', 'course_id', 'status', 'start_date', 'end_date']),
            'stats' => [
                'lifetime' => $adminLifetimeEarnings,
                'monthly' => $adminMonthlyEarnings,
                'pending' => $adminPendingEarnings,
            ],
        ]);
    }
    public function show($id)
    {
        $payment = \App\Models\Payment::with(['student', 'course', 'paymentMethod'])->findOrFail($id);

        return Inertia::render('Admin/Payment/PaymentDetail', [
            'payment' => $payment,
        ]);
    }
    public function exportExcel(Request $request)
    {
        $filters = $request->only(['status', 'student_id', 'course_id']);

        return Excel::download(new PaymentsExport($filters), 'payments.xlsx');
    }
}
