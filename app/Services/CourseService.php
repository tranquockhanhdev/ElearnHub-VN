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
            if (isset($data['instructor_id'])) {
                $data['instructor_id'] = (int) $data['instructor_id'];
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

        // ✅ Nếu không tồn tại, có thể throw hoặc return lỗi tùy bạn xử lý
        if (!$course) {
            return [
                'success' => false,
                'message' => 'Khóa học không tồn tại.',
            ];
        }

        // ✅ Xử lý upload ảnh mới nếu có
     if (isset($data['course_image']) && $data['course_image'] instanceof UploadedFile) {
    if ($course->course_image) {
        $this->deleteCourseImage($course->course_image);
    }

    $data['course_image'] = $this->uploadCourseImage($data['course_image']);
    $data['img_url'] = $data['course_image']; // ✅ Thêm dòng này để update ảnh hiển thị
}

        // ✅ Xử lý danh mục
        if (isset($data['category_ids']) && is_array($data['category_ids'])) {
            $categoryIds = $data['category_ids'];
            unset($data['category_ids']);
            $course->categories()->sync($categoryIds);
        }

        // ✅ Nếu có cập nhật title, cập nhật lại slug
        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // ✅ Cho phép chỉnh sửa instructor_id nếu có
        if (isset($data['instructor_id'])) {
            $data['instructor_id'] = (int) $data['instructor_id'];
        }

        // ✅ Cho phép chỉnh sửa status nếu có
        if (isset($data['status'])) {
            $data['status'] = $data['status']; // có thể kiểm tra thêm nếu cần
        }
        // ✅ Nếu có cập nhật title, tạo lại slug và kiểm tra trùng
        if (isset($data['title'])) {
            $newSlug = Str::slug($data['title']);

            $slugExists = Course::where('slug', $newSlug)
                ->where('id', '!=', $id) // tránh chính khóa học này
                ->exists();

            if ($slugExists) {
                return [
                    'success' => false,
                    'message' => 'Tiêu đề đã tồn tại cho một khóa học khác.',
                    'errors' => ['title' => 'Khóa học với tiêu đề này đã tồn tại.']
                ];
            }

            $data['slug'] = $newSlug;
        }
        // ✅ Gửi đến repository xử lý update
        $updated = $this->CourseRepository->updateCourse($id, $data);

        return [
            'success' => true,
            'message' => 'Cập nhật khóa học thành công.',
            'data' => $updated,
        ];
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