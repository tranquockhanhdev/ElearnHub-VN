<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Admin\Category\StoreCategoryRequest;
use App\Http\Requests\Admin\Category\UpdateCategoryRequest;
use App\Services\Admin\Category\CategoryService;

class AdminCourseCategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        $categories = $this->categoryService->getFilteredCategories($request);

        return Inertia::render('Admin/Course-category/AdminCourseCategory', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'sort', 'status']),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $this->categoryService->createCategory($request->validated());

        return redirect()->route('admin.admin-course-category')->with('success', 'Thêm danh mục thành công.');
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $this->categoryService->updateCategory($id, $request->validated());

        return redirect()->route('admin.admin-course-category')->with('success', 'Cập nhật danh mục thành công.');
    }

    public function destroy($id)
    {
        $this->categoryService->deleteCategory($id);

        return redirect()->route('admin.admin-course-category')->with('success', 'Xóa danh mục thành công.');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $this->categoryService->updateStatus($id, $request->status);

        return redirect()->route('admin.admin-course-category')->with('success', 'Cập nhật trạng thái danh mục thành công.');
    }
}