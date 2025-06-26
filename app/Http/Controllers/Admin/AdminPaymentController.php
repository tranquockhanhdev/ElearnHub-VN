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
    $query = Payment::with(['student', 'course', 'method']);

    if ($request->student_id) {
        $query->where('student_id', $request->student_id);
    }

    if ($request->course_id) {
        $query->where('course_id', $request->course_id);
    }

    if ($request->status) {
        $query->where('status', $request->status);
    }

    if ($request->start_date) {
        $query->whereDate('payment_time', '>=', Carbon::parse($request->start_date));
    }

    if ($request->end_date) {
        $query->whereDate('payment_time', '<=', Carbon::parse($request->end_date));
    }

    $payments = $query->latest()->paginate(10);

    return Inertia::render('Admin/Payment/PaymentList', [
        'payments' => $payments,
        'students' => User::where('role_id', 3)->get(), // học viên
        'courses' => Course::all(),
        'filters' => $request->only('student_id', 'course_id', 'status', 'start_date', 'end_date'),
    ]);
}
    public function show($id)
    {
        $payment = \App\Models\Payment::with(['student', 'course', 'method'])->findOrFail($id);

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