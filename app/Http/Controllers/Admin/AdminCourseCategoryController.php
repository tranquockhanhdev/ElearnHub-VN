<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
class AdminCourseCategoryController extends Controller
{
public function index()
{
    $categories = Category::all(); // hoặc ->paginate() nếu bạn muốn phân trang

    return Inertia::render('Admin/Course-category/AdminCourseCategory', [
        'categories' => $categories
    ]);
}

}
