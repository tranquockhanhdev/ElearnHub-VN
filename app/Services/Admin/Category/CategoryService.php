<?php

namespace App\Services\Admin\Category;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Repositories\Admin\Category\CategoryRepository;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Lấy danh sách category có filter, search, sort
     */
    public function getFilteredCategories(Request $request)
    {
        return $this->categoryRepository->getFiltered($request);
    }

    /**
     * Tạo mới category với slug không trùng
     */
    public function createCategory(array $data)
    {
        $slug = Str::slug($data['name']);
        $slug = $this->generateUniqueSlug($slug);

        $data['slug'] = $slug;

        return $this->categoryRepository->create($data);
    }

    /**
     * Cập nhật category (check name & slug không trùng)
     */
    public function updateCategory($id, array $data)
    {
        // Kiểm tra name đã tồn tại (trừ chính nó)
        if ($this->categoryRepository->isNameExists($data['name'], $id)) {
            throw new \Exception('Tên danh mục đã tồn tại.');
        }

        // Nếu không nhập slug, tự tạo từ name
        $slug = $data['slug'] ?? Str::slug($data['name']);

        // Kiểm tra slug trùng
        if ($this->categoryRepository->isSlugExists($slug, $id)) {
            throw new \Exception('Slug đã tồn tại.');
        }

        $data['slug'] = $slug;

        return $this->categoryRepository->update($id, $data);
    }

    /**
     * Xóa category
     */
    public function deleteCategory($id)
    {
        return $this->categoryRepository->delete($id);
    }

    /**
     * Cập nhật trạng thái
     */
    public function updateStatus($id, $status)
    {
        return $this->categoryRepository->update($id, ['status' => $status]);
    }

    /**
     * Tạo slug không trùng
     */
    protected function generateUniqueSlug($slug)
    {
        $originalSlug = $slug;
        $count = 1;

        while ($this->categoryRepository->isSlugExists($slug)) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }
}