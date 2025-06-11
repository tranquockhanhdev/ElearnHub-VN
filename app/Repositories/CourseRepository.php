<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\Course;
use Exception;

class CourseRepository
{
    public function getAllCategories()
    {
        return Category::all();
    }
    public function getAllCourses()
    {
        return Course::all();
    }

    public function getCourseById($id)
    {
        return Course::find($id);
    }

    public function createCourse(array $data)
    {
        return Course::create($data);
    }

    public function updateCourse($id, array $data)
    {
        $course = Course::find($id);
        if ($course) {
            $course->update($data);
            return $course;
        }
        return null;
    }

    public function deleteCourse($id)
    {
        $course = Course::find($id);
        if ($course) {
            $course->delete();
            return true;
        }
        return false;
    }
    public function getCoursesByInstructor($instructorId)
    {
        return Course::where('instructor_id', $instructorId)->get();
    }

    public function searchCourses($keyword)
    {
        return Course::where('title', 'like', '%' . $keyword . '%')
            ->orWhere('description', 'like', '%' . $keyword . '%')
            ->get();
    }

    public function paginateCourses($perPage = 10)
    {
        return Course::paginate($perPage);
    }

    public function getApprovedCourses()
    {
        return Course::where('status', 'active')->get();
    }
}
