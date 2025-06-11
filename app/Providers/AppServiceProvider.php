<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AuthService;
use App\Services\CourseService;
use App\Repositories\AuthRepository;
use App\Repositories\CourseRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthService::class, AuthService::class);
        $this->app->bind(CourseService::class, CourseService::class);
        $this->app->bind(AuthRepository::class, AuthRepository::class);
        $this->app->bind(CourseRepository::class, CourseRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
