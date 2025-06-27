<?php

namespace App\Repositories\Admin\Course;

use App\Models\Category;
use App\Models\Course;
use App\Models\PaymentMethod;
use App\Models\Payment;
use Exception;

class CourseRepository
{
    protected $course;
    protected $category;

    const STATUS_ACTIVE = 'active';

    public function __construct(Course $course, Category $category)
    {
        $this->course = $course;
        $this->category = $category;
    }
    public function findById($id)
    {
        return $this->course->findOrFail($id);
    }
    // Category-related methods
    /**
     * Get all active categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCategories()
    {
        return $this->category->where('status', self::STATUS_ACTIVE)->get();
    }

    // Course-related methods
    /**
     * Get all courses with their categories and instructor.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCourses()
    {
        return $this->course->with('categories', 'instructor')->get();
    }

    /**
     * Get courses with filters and pagination.
     *
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getCoursesWithFilters($filters = [], $perPage = 12)
    {
        $query = $this->course->with(['categories', 'instructor'])
            ->where('status', self::STATUS_ACTIVE);

        $this->applySearchFilter($query, $filters['search'] ?? null);
        $this->applyCategoryFilter($query, $filters['category'] ?? null);
        $this->applySortFilter($query, $filters['sort'] ?? null);

        return $query->paginate($perPage);
    }

    /**
     * Get a course by its slug.
     *
     * @param string $slug
     * @return \App\Models\Course|null
     */
    public function getCourseBySlug($slug)
    {
        return $this->course->with(['categories', 'instructor'])
            ->where('slug', $slug)
            ->where('status', self::STATUS_ACTIVE)
            ->first();
    }

    /**
     * Get a course by its ID.
     *
     * @param int $id
     * @return \App\Models\Course
     */
    public function getCourseById($id)
    {
        return $this->course->with('categories')->findOrFail($id);
    }

    /**
     * Create a new course.
     *
     * @param array $data
     * @return \App\Models\Course
     */
    public function createCourse(array $data)
    {
        return $this->course->create($data);
    }

    /**
     * Update an existing course.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Course
     */
    public function updateCourse($id, array $data)
    {
        $course = $this->getCourseById($id);
        $course->update($data);
        return $course->fresh();
    }

    /**
     * Delete a course by its ID.
     *
     * @param int $id
     * @return bool|null
     */
    public function deleteCourse($id)
    {
        $course = $this->getCourseById($id);
        $course->categories()->detach();
        return $course->delete();
    }

    // Payment-related methods
    /**
     * Get all active payment methods.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getPaymentMethods()
    {
        return PaymentMethod::where('is_active', 1)->get()->map(function ($item) {
            $item->config_json = json_decode($item->config_json, true);
            return $item;
        });
    }

    // Instructor-related methods
    /**
     * Get courses by instructor ID.
     *
     * @param int $instructorId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCoursesByInstructor($instructorId)
    {
        return $this->course
            ->with('categories')
            ->where('instructor_id', $instructorId)
            ->get();
    }

    /**
     * Count courses by instructor ID.
     *
     * @param int $instructorId
     * @return int
     */
    public function countCoursesByInstructor($instructorId)
    {
        return $this->course
            ->where('instructor_id', $instructorId)
            ->count();
    }

    /**
     * Lấy khóa học đã đăng ký của học viên với phân trang
     */
    public function getEnrolledCourses($studentId, $filters = [], $perPage = 12)
    {
        $query = $this->course->with(['categories', 'instructor', 'lessons'])
            ->whereHas('enrollments', function ($q) use ($studentId) {
                $q->where('student_id', $studentId);
            })
            ->where('status', self::STATUS_ACTIVE);

        // Tìm kiếm
        if (!empty($filters['search'])) {
            $query->where('title', 'LIKE', '%' . $filters['search'] . '%');
        }

        // Sắp xếp
        switch ($filters['sort'] ?? '') {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'title':
                $query->orderBy('title', 'asc');
                break;
            default:
                $query->orderBy('id', 'desc');
                break;
        }

        return $query->paginate($perPage);
    }

    /**
     * Lấy khóa học được đề xuất (chưa đăng ký)
     */
    public function getRecommendedCourses($excludeCourseIds = [], $limit = 5)
    {
        return $this->course->with(['categories', 'instructor'])
            ->where('status', self::STATUS_ACTIVE)
            ->whereNotIn('id', $excludeCourseIds)
            ->withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get featured courses.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeaturedCourses($limit = 6)
    {
        return $this->course->with(['instructor:id,name', 'categories:id,name'])
            ->where('status', 'active')
            ->withCount('enrollments') // Đếm số lượng enrollments
            ->orderBy('enrollments_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get latest courses.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLatestCourses($limit = 6)
    {
        return $this->course->with(['instructor:id,name', 'categories:id,name'])
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get best-selling courses.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getBestSellingCourses($limit = 6)
    {
        return $this->course->with(['instructor:id,name', 'categories:id,name'])
            ->where('status', 'active')
            ->withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get popular categories.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPopularCategories($limit = 8)
    {
        return $this->category->withCount([
            'courses' => function ($query) {
                $query->where('status', 'active');
            }
        ])
            ->where('status', 'active')
            ->having('courses_count', '>', 0)
            ->orderBy('courses_count', 'desc')
            ->limit($limit)
            ->get();
    }
    // Utility methods
    /**
     * Check if a user is enrolled in a course.
     *
     * @param int $userId
     * @param int $courseId
     * @return bool
     */
    public function isUserEnrolled($userId, $courseId)
    {
        return $this->course
            ->where('id', $courseId)
            ->whereHas('enrollments', function ($query) use ($userId) {
                $query->where('student_id', $userId);
            })
            ->exists();
    }

    /**
     * Count all courses.
     *
     * @return int
     */
    public function countCourses()
    {
        return $this->course->count();
    }

    // Private helper methods
    private function applySearchFilter($query, $searchTerm)
    {
        if (!empty($searchTerm)) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('instructor', function ($instructorQuery) use ($searchTerm) {
                        $instructorQuery->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }
    }

    private function applyCategoryFilter($query, $category)
    {
        if (!empty($category) && $category !== 'All') {
            $query->whereHas('categories', function ($categoryQuery) use ($category) {
                $categoryQuery->where('name', $category);
            });
        }
    }

    private function applySortFilter($query, $sort)
    {
        switch ($sort) {
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
    }
}