<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckSEBUserAgent
{
    public function handle(Request $request, Closure $next): Response
    {
        $userAgent = $request->header('User-Agent');

        if (!str_contains($userAgent, 'SEB')) {
            if ($request->hasHeader('X-Inertia')) {
                return Inertia::location('/guideseb');
            }
            return response()->json([
                'message' => 'Vui lòng truy cập bằng Safe Exam Browser (SEB)',
            ], 403);
        }


        return $next($request);
    }
}
