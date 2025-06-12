<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;


class AdminUserController extends Controller
{
    public function studentList()
    {
        $students = User::where('role_id', 3)->paginate(6);

        return Inertia::render('Admin/Student/AdminStudentList', [
            'students' => $students
        ]);
    }
}