<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $role = Auth::user()->role->id;
            if ($role == '1') {
                return redirect()->route('admin.dashboard');
            } elseif ($role == '2') {
                return redirect()->route('instructor.dashboard');
            }
        }

        return $next($request);
    }
}
