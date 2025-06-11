<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        return Inertia::render('Students/CourseList');
    }
    // index() – danh sách tất cả khóa học (đã đăng ký)

    // show($id) – chi tiết khóa học: mô tả, bài học, tiến độ

    // enroll($id) – đăng ký khóa học (nếu có chức năng đăng ký tự do)
}
