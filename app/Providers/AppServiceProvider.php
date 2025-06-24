<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;

use App\Repositories\AuthRepository;
use App\Repositories\CourseRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\EnrollmentRepository;
use App\Repositories\LessonRepository;
use App\Repositories\ProgressRepository;
use App\Repositories\StudentRepository;
use App\Repositories\DocumentRepository;
use App\Repositories\InstructorRepository;
use App\Repositories\VideoRepository;

use App\Services\AuthService;
use App\Services\CourseService;
use App\Services\PaymentService;
use App\Services\VNPayService;
use App\Services\LessonService;
use App\Services\StudentDashboardService;
use App\Services\CourseProgressService;
use App\Services\DocumentService;
use App\Services\InstructorService;
use App\Services\VideoService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repositories
        $this->app->bind(AuthRepository::class, AuthRepository::class);
        $this->app->bind(CourseRepository::class, CourseRepository::class);
        $this->app->bind(PaymentRepository::class, PaymentRepository::class);
        $this->app->bind(EnrollmentRepository::class, EnrollmentRepository::class);
        $this->app->bind(LessonRepository::class, LessonRepository::class);
        $this->app->bind(ProgressRepository::class, ProgressRepository::class);
        $this->app->bind(StudentRepository::class, StudentRepository::class);
        $this->app->bind(DocumentRepository::class, DocumentRepository::class);
        $this->app->bind(InstructorRepository::class, InstructorRepository::class);
        $this->app->bind(VideoRepository::class, VideoRepository::class);

        // Services
        $this->app->bind(AuthService::class, AuthService::class);
        $this->app->bind(CourseService::class, CourseService::class);
        $this->app->bind(PaymentService::class, PaymentService::class);
        $this->app->bind(VNPayService::class, VNPayService::class);
        $this->app->bind(LessonService::class, LessonService::class);
        $this->app->bind(StudentDashboardService::class, StudentDashboardService::class);
        $this->app->bind(CourseProgressService::class, CourseProgressService::class);
        $this->app->bind(DocumentService::class, DocumentService::class);
        $this->app->bind(InstructorService::class, InstructorService::class);
        $this->app->bind(VideoService::class, VideoService::class);
    }

    /**
     * Schedule any application tasks.
     */
    public function schedule(Schedule $schedule): void
    {
        $schedule->command('payments:expire')->everyMinute();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
