<?php

namespace App\Repositories\Admin\Category;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryRepository
{
    /**
     * Lấy danh sách category có filter, search, sort
     */
    public function getFiltered(Request $request)
    {
        $query = Category::query();

        // Search theo tên
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter theo trạng thái
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sắp xếp
        $sortDirection = $request->sort === 'oldest' ? 'asc' : 'desc';
        $query->orderBy('created_at', $sortDirection);

        return $query->paginate(10)->withQueryString();
    }

    /**
     * Tạo mới category
     */
    public function create(array $data)
    {
        return Category::create($data);
    }

    /**
     * Cập nhật category
     */
    public function update($id, array $data)
    {
        $category = Category::findOrFail($id);
        $category->update($data);

        return $category;
    }

    /**
     * Xóa category
     */
    public function delete($id)
    {
        $category = Category::findOrFail($id);
        return $category->delete();
    }

    /**
     * Kiểm tra slug đã tồn tại chưa (trừ ID nếu cần)
     */
    public function isSlugExists($slug, $ignoreId = null)
    {
        $query = Category::where('slug', $slug);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    /**
     * Kiểm tra tên đã tồn tại chưa (trừ ID nếu cần)
     */
    public function isNameExists($name, $ignoreId = null)
    {
        $query = Category::where('name', $name);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }
}