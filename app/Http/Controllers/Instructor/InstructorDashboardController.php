<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Intructors/Dashboard');
    }
}
