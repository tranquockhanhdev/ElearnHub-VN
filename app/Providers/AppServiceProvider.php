<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AuthService;
use App\Services\CourseService;
use App\Services\PaymentService;
use App\Services\VNPayService;
use App\Services\LessonService;
use App\Services\StudentDashboardService;
use App\Services\CourseProgressService;
use App\Repositories\AuthRepository;
use App\Repositories\CourseRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\EnrollmentRepository;
use App\Repositories\LessonRepository;
use App\Repositories\ProgressRepository;
use App\Repositories\StudentRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind Repositories
        $this->app->bind(AuthRepository::class, AuthRepository::class);
        $this->app->bind(CourseRepository::class, CourseRepository::class);
        $this->app->bind(PaymentRepository::class, PaymentRepository::class);
        $this->app->bind(EnrollmentRepository::class, EnrollmentRepository::class);
        $this->app->bind(LessonRepository::class, LessonRepository::class);
        $this->app->bind(ProgressRepository::class, ProgressRepository::class);
        $this->app->bind(StudentRepository::class, StudentRepository::class);

        // Bind Services
        $this->app->bind(AuthService::class, AuthService::class);
        $this->app->bind(CourseService::class, CourseService::class);
        $this->app->bind(PaymentService::class, PaymentService::class);
        $this->app->bind(VNPayService::class, VNPayService::class);
        $this->app->bind(LessonService::class, LessonService::class);
        $this->app->bind(StudentDashboardService::class, StudentDashboardService::class);
        $this->app->bind(CourseProgressService::class, CourseProgressService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}