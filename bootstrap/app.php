<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: [
            __DIR__ . '/../routes/web.php',
            __DIR__ . '/../routes/auth.php',
            __DIR__ . '/../routes/student.php',
            __DIR__ . '/../routes/instructor.php',
            __DIR__ . '/../routes/admin.php',
        ],
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'seb'  => \App\Http\Middleware\CheckSEBUserAgent::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->withSchedule(function (Illuminate\Console\Scheduling\Schedule $schedule) {
        (new \App\Providers\AppServiceProvider(app()))->schedule($schedule);
    })
    ->create();
