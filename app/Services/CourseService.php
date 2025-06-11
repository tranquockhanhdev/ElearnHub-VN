<?php

// app/Services/CourseService.php
namespace App\Services;

use App\Repositories\CourseRepository;

class CourseService
{
    protected $CourseRepository;

    public function __construct(CourseRepository $CourseRepository)
    {
        $this->CourseRepository = $CourseRepository;
    }
    public function getAllCategories()
    {
        return $this->CourseRepository->getAllCategories();
    }
    public function getAllCourses()
    {
        return $this->CourseRepository->getAllCourses();
    }

    public function getCourseById($id)
    {
        return $this->CourseRepository->getCourseById($id);
    }

    public function createCourse(array $data)
    {
        return $this->CourseRepository->createCourse($data);
    }

    public function updateCourse($id, array $data)
    {
        return $this->CourseRepository->updateCourse($id, $data);
    }

    public function deleteCourse($id)
    {
        return $this->CourseRepository->deleteCourse($id);
    }
    public function getCoursesByInstructor($instructorId)
    {
        return $this->CourseRepository->getCoursesByInstructor($instructorId);
    }

    public function searchCourses($keyword)
    {
        return $this->CourseRepository->searchCourses($keyword);
    }

    public function paginateCourses($perPage = 10)
    {
        return $this->CourseRepository->paginateCourses($perPage);
    }

    public function getApprovedCourses()
    {
        return $this->CourseRepository->getApprovedCourses();
    }
}
