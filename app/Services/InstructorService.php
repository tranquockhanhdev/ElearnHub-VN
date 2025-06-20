<?php

namespace App\Services;

use App\Repositories\InstructorRepository;
use Illuminate\Support\Facades\Cache;

class InstructorService
{
    protected $instructorRepository;

    public function __construct(InstructorRepository $instructorRepository)
    {
        $this->instructorRepository = $instructorRepository;
    }

    public function getDashboardData($instructorId)
    {
        return Cache::remember("instructor_dashboard_{$instructorId}", 300, function () use ($instructorId) {
            return [
                'stats' => $this->instructorRepository->getInstructorStats($instructorId),
                'revenue_chart' => $this->instructorRepository->getRevenueChart($instructorId, 'month'),
                'latest_enrollments' => $this->instructorRepository->getLatestEnrollments($instructorId, 10),
                'popular_courses' => $this->instructorRepository->getPopularCourses($instructorId, 5),
                'revenue_by_course' => $this->instructorRepository->getRevenueBycourse($instructorId)
            ];
        });
    }

    public function getRevenueChartData($instructorId, $period = 'month')
    {
        return $this->instructorRepository->getRevenueChart($instructorId, $period);
    }
}
