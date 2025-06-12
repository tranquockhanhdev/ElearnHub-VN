<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\Course;
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
