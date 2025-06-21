<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Services\InstructorService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorDashboardController extends Controller
{
    protected $instructorService;

    public function __construct(InstructorService $instructorService)
    {
        $this->instructorService = $instructorService;
    }

    public function index()
    {
        $instructorId = Auth::user()->id;
        $dashboardData = $this->instructorService->getDashboardData($instructorId);

        return Inertia::render('Intructors/Dashboard', $dashboardData);
    }

    public function getRevenueChart(Request $request)
    {
        $instructorId = Auth::user()->id;
        $period = $request->get('period', 'month');

        $chartData = $this->instructorService->getRevenueChartData($instructorId, $period);

        return response()->json($chartData);
    }
}
