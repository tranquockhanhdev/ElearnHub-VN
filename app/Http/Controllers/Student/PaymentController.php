<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(StudentRequest $request)
    {
        $validated = $request->validated();
        $filters = [
            'status' => $validated['status'] ?? null,
            'search' => $validated['search'] ?? null,
        ];

        $query = Payment::with(['course', 'paymentMethod'])
            ->where('student_id', Auth::id())
            ->orderBy('created_at', 'desc');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('id', 'like', '%' . $filters['search'] . '%')
                    ->orWhereHas('course', function ($courseQuery) use ($filters) {
                        $courseQuery->where('title', 'like', '%' . $filters['search'] . '%');
                    });
            });
        }

        $payments = $query->paginate(10)->withQueryString();

        $rawCounts = Payment::selectRaw('status, COUNT(*) as total')
            ->where('student_id', Auth::id())
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $counts = [
            'all' => array_sum($rawCounts),
            'completed' => $rawCounts['completed'] ?? 0,
            'pending' => $rawCounts['pending'] ?? 0,
            'failed' => $rawCounts['failed'] ?? 0,
        ];
        return Inertia::render('Students/Payments', [
            'payments' => $payments,
            'filters' => $filters,
            'counts' => $counts,
        ]);
    }
}
