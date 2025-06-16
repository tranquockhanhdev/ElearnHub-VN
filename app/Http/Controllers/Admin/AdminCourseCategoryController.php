<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\Category;

class AdminCourseCategoryController extends Controller
{
  public function index(Request $request)
{
    $query = Category::query();

    // Search
    if ($request->filled('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }

    // Status filter 👇
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Sort
    if ($request->filled('sort')) {
        $sortOption = $request->sort === 'oldest' ? 'asc' : 'desc';
        $query->orderBy('created_at', $sortOption);
    } else {
        $query->orderBy('created_at', 'desc');
    }

    $categories = $query->paginate(10)->withQueryString();

    return Inertia::render('Admin/Course-category/AdminCourseCategory', [
        'categories' => $categories,
        'filters' => $request->only(['search', 'sort', 'status']), // 👈 THÊM status
    ]);
}



    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'status' => 'required|in:active,inactive,suspended',
        ]);

        // Tạo slug và đảm bảo không trùng
        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.admin-course-category')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']);

        // Kiểm tra name đã tồn tại chưa (trừ chính record đang sửa)
        $nameExists = Category::where('name', $validated['name'])->where('id', '!=', $id)->exists();
        if ($nameExists) {
            return back()
                ->withErrors(['name' => 'Tên danh mục đã tồn tại. Hãy dùng tên khác.'])
                ->withInput();
        }

        // Kiểm tra slug đã tồn tại chưa (trừ chính record đang sửa)
        $slugExists = Category::where('slug', $slug)->where('id', '!=', $id)->exists();
        if ($slugExists) {
            return back()
                ->withErrors(['slug' => 'Slug đã tồn tại. Hãy dùng slug khác.'])
                ->withInput();
        }

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.admin-course-category')->with('success', 'Cập nhật danh mục thành công.');
    }
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->route('admin.admin-course-category')->with('success', 'Xóa danh mục thành công.');
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $category = Category::findOrFail($id);
        $category->status = $request->status;
        $category->save();

        return redirect()->route('admin.admin-course-category')->with('success', 'Cập nhật trạng thái danh mục thành công.');
    }
}