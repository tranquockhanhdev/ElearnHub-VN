<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\Course;
use App\Models\PaymentMethod;
use Exception;

class CourseRepository
{
    protected $course;
    protected $category;

    public function __construct(Course $course, Category $category)
    {
        $this->course = $course;
        $this->category = $category;
    }

    public function getAllCategories()
    {
        return $this->category->all();
    }

    public function getAllCourses()
    {
        return $this->course->with('categories', 'instructor')->get();
    }

    // Thêm method mới cho search và filter với pagination
    public function getCoursesWithFilters($filters = [], $perPage = 12)
    {
        $query = $this->course->with(['categories', 'instructor'])
            ->where('status', 'active'); // Chỉ lấy khóa học active

        // Search by title or instructor name
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('instructor', function ($instructorQuery) use ($searchTerm) {
                        $instructorQuery->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        // Filter by category
        if (!empty($filters['category']) && $filters['category'] !== 'All') {
            $query->whereHas('categories', function ($categoryQuery) use ($filters) {
                $categoryQuery->where('name', $filters['category']);
            });
        }

        // Sort by price
        if (!empty($filters['sort'])) {
            switch ($filters['sort']) {
                case 'price-lowest-highest':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-highest-lowest':
                    $query->orderBy('price', 'desc');
                    break;
                default:
                    $query->orderBy('id', 'desc');
                    break;
            }
        } else {
            $query->orderBy('id', 'desc');
        }

        return $query->paginate($perPage);
    }
    public function getCourseBySlug($slug)
    {
        return $this->course->with(['categories', 'instructor'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }
    public function getPaymentMethods()
    {
        return PaymentMethod::where('is_active', 1)->get()->map(function ($item) {
            $item->config_json = json_decode($item->config_json, true);
            return $item;
        });
    }
    public function getCourseById($id)
    {
        return $this->course->with('categories')->findOrFail($id);
    }

    public function createCourse(array $data)
    {
        return $this->course->create($data);
    }

    public function updateCourse($id, array $data)
    {
        $course = $this->getCourseById($id);
        $course->update($data);
        return $course->fresh();
    }

    public function deleteCourse($id)
    {
        $course = $this->getCourseById($id);

        $course->categories()->detach();

        return $course->delete();
    }

    public function getCoursesByInstructor($instructorId)
    {
        return $this->course
            ->with('categories')
            ->where('instructor_id', $instructorId)
            ->get();
    }

    public function searchCourses($keyword)
    {
        return $this->course
            ->with('categories')
            ->where('title', 'LIKE', "%{$keyword}%")
            ->orWhere('description', 'LIKE', "%{$keyword}%")
            ->get();
    }

    public function paginateCourses($perPage = 10)
    {
        return $this->course
            ->with('categories')
            ->paginate($perPage);
    }

    public function getApprovedCourses()
    {
        return $this->course
            ->with('categories')
            ->where('status', 'active') // Giả sử có cột status
            ->get();
    }

    public function getCoursesByCategory($categoryId)
    {
        return $this->course
            ->with('categories')
            ->whereHas('categories', function ($query) use ($categoryId) {
                $query->where('categories.id', $categoryId);
            })
            ->get();
    }

    public function getLatestCourses($limit = 10)
    {
        return $this->course
            ->with('categories')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function countCourses()
    {
        return $this->course->count();
    }

    public function countCoursesByInstructor($instructorId)
    {
        return $this->course
            ->where('instructor_id', $instructorId)
            ->count();
    }
}
