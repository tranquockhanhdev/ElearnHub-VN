<?php

namespace App\Services;

use App\Repositories\CourseRepository;
use App\Models\User;
use App\Models\Course;
use Illuminate\Support\Facades\Cache;

class HomeService
{
    protected $courseRepository;

    public function __construct(CourseRepository $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function getHomePageData()
    {
        return Cache::remember('homepage_data', 300, function () {
            return [
                'featured_courses' => $this->courseRepository->getFeaturedCourses(6),
                'latest_courses' => $this->courseRepository->getLatestCourses(6),
                'best_selling_courses' => $this->courseRepository->getBestSellingCourses(6),
                'popular_categories' => $this->courseRepository->getPopularCategories(8),
                'stats' => $this->getWebsiteStats()
            ];
        });
    }

    private function getWebsiteStats()
    {
        return [
            'total_courses' => Cache::remember('total_courses', 3600, function () {
                return Course::where('status', 'active')->count();
            }),
            'total_students' => Cache::remember('total_students', 3600, function () {
                return User::where('role_id', 3)->count();
            }),
            'total_instructors' => Cache::remember('total_instructors', 3600, function () {
                return User::where('role_id', 2)->count();
            }),
            'satisfaction_rate' => 95
        ];
    }
}
