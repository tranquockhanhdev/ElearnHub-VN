<?php

// app/Services/CourseService.php
namespace App\Services;

use App\Repositories\CourseRepository;
use App\Models\Course;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;

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

    // Thêm method mới cho search và filter
    public function getCoursesWithFilters($filters = [], $perPage = 12)
    {
        return $this->CourseRepository->getCoursesWithFilters($filters, $perPage);
    }

    public function getCourseById($id)
    {
        return $this->CourseRepository->getCourseById($id);
    }

    public function createCourse(array $data)
    {
        try {
            if (isset($data['course_image']) && $data['course_image'] instanceof UploadedFile) {
                $data['course_image'] = $this->uploadCourseImage($data['course_image']);
            }

            if (isset($data['category_ids']) && is_array($data['category_ids'])) {
                $categoryIds = $data['category_ids'];
                unset($data['category_ids']);
            }

            $slug = Str::slug($data['title'], '-');

            $existingCourse = Course::where('slug', $slug)->first();
            if ($existingCourse) {
                return [
                    'success' => false,
                    'message' => 'Tiêu đề khóa học đã tồn tại, vui lòng chọn tiêu đề khác.',
                    'errors' => ['title' => 'Khóa học với tiêu đề này đã tồn tại.']
                ];
            }

            $data['slug'] = $slug;
            $data['img_url'] = $data['course_image'] ?? null;
            $course = $this->CourseRepository->createCourse($data);

            if (isset($categoryIds) && !empty($categoryIds)) {
                $course->categories()->attach($categoryIds);
            }

            return [
                'success' => true,
                'message' => 'Tạo khoá học thành công.',
                'data' => $course
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi tạo khoá học, vui lòng thử lại sau.',
                'data' => null
            ];
        }
    }

    /**
     * Upload ảnh khóa học vào folder bannercourse
     */
    private function uploadCourseImage(UploadedFile $image)
    {
        $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        $path = $image->storeAs('bannercourse', $fileName, 'public');

        return $path;
    }

    /**
     * Xóa ảnh khóa học cũ
     */
    private function deleteCourseImage($imagePath)
    {
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
    }

    public function updateCourse($id, array $data)
    {
        $course = $this->getCourseById($id);

        // Xử lý upload ảnh mới nếu có
        if (isset($data['course_image']) && $data['course_image'] instanceof UploadedFile) {
            // Xóa ảnh cũ
            if ($course->course_image) {
                $this->deleteCourseImage($course->course_image);
            }

            $data['course_image'] = $this->uploadCourseImage($data['course_image']);
        }

        // Xử lý category_ids - sync vào bảng course_category
        if (isset($data['category_ids']) && is_array($data['category_ids'])) {
            $categoryIds = $data['category_ids'];
            unset($data['category_ids']);

            // Sync categories (xóa cũ và thêm mới vào course_category)
            $course->categories()->sync($categoryIds);
        }

        return $this->CourseRepository->updateCourse($id, $data);
    }
    public function getCourseBySlug($slug)
    {
        return $this->CourseRepository->getCourseBySlug($slug);
    }
    public function deleteCourse($id)
    {
        $course = $this->getCourseById($id);

        // Xóa ảnh nếu có
        if ($course->course_image) {
            $this->deleteCourseImage($course->course_image);
        }

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

    /**
     * Lấy URL đầy đủ của ảnh khóa học
     */
    public function getCourseImageUrl($imagePath)
    {
        if (!$imagePath) {
            return null;
        }

        return asset('storage/' . $imagePath);
    }
}
