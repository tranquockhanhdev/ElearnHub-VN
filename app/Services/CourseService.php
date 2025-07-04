<?php

// app/Services/CourseService.php
namespace App\Services;

use App\Repositories\CourseRepository;
use App\Models\Course;
use App\Models\CourseEdit;
use App\Models\CourseEditCategory;
use App\Enums\CourseEditStatus;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            unset($data['course_image']); // Remove course_image from data array
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
        try {
            $course = $this->getCourseById($id);

            // Xử lý upload ảnh mới nếu có
            if (isset($data['course_image']) && $data['course_image'] instanceof UploadedFile) {
                // Xóa ảnh cũ
                if ($course->img_url) {
                    $this->deleteCourseImage($course->img_url);
                }

                $data['img_url'] = $this->uploadCourseImage($data['course_image']);
                unset($data['course_image']);
            }

            // Xử lý category_ids - sync vào bảng course_category
            if (isset($data['category_ids']) && is_array($data['category_ids'])) {
                $categoryIds = $data['category_ids'];
                unset($data['category_ids']);

                // Sync categories (xóa cũ và thêm mới vào course_category)
                $course->categories()->sync($categoryIds);
            }

            $result = $this->CourseRepository->updateCourse($id, $data);

            return [
                'success' => true,
                'message' => 'Cập nhật khóa học thành công!',
                'data' => $result
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ];
        }
    }
    public function getCourseBySlug($slug)
    {
        return $this->CourseRepository->getCourseBySlug($slug);
    }
    public function getPaymentMethods()
    {
        return $this->CourseRepository->getPaymentMethods();
    }
    public function deleteCourse($id)
    {
        $course = $this->getCourseById($id);

        // Xóa ảnh nếu có
        if ($course->img_url) {
            $this->deleteCourseImage($course->img_url);
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
    public function isUserEnrolled($userId, $courseId)
    {
        return $this->CourseRepository->isUserEnrolled($userId, $courseId);
    }

    /**
     * Get courses by instructor with filters and pagination
     */
    public function getCoursesByInstructorWithFilters($instructorId, $filters = [], $perPage = 12)
    {
        return $this->CourseRepository->getCoursesByInstructorWithFilters($instructorId, $filters, $perPage);
    }

    /**
     * Submit course for approval - chuyển status từ draft thành pending
     */
    public function submitForApproval($course)
    {
        try {
            $updated = false;
            $updatedItems = [];

            // Kiểm tra và cập nhật course nếu status là draft
            if ($course->status === 'draft') {
                $course->update(['status' => 'pending']);
                $updated = true;
                $updatedItems[] = 'khóa học';
            }

            // Kiểm tra và cập nhật lessons
            foreach ($course->lessons as $lesson) {
                if ($lesson->status === 'draft') {
                    $lesson->update(['status' => 'pending']);
                    $updated = true;
                    if (!in_array('bài giảng', $updatedItems)) {
                        $updatedItems[] = 'bài giảng';
                    }
                }

                // Kiểm tra và cập nhật resources
                if ($lesson->resources) {
                    foreach ($lesson->resources as $resource) {
                        if ($resource->status === 'draft') {
                            $resource->update(['status' => 'pending']);
                            $updated = true;
                            if (!in_array('tài liệu', $updatedItems)) {
                                $updatedItems[] = 'tài liệu';
                            }
                        }
                    }
                }

                // Kiểm tra và cập nhật quiz
                if ($lesson->quiz && $lesson->quiz->status === 'draft') {
                    $lesson->quiz->update(['status' => 'pending']);
                    $updated = true;
                    if (!in_array('quiz', $updatedItems)) {
                        $updatedItems[] = 'quiz';
                    }
                }
            }

            if ($updated) {
                $message = 'Đã gửi phê duyệt thành công cho: ' . implode(', ', $updatedItems) . '.';
                return [
                    'success' => true,
                    'message' => $message
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Không có nội dung nào cần gửi phê duyệt (chỉ những nội dung có trạng thái "Nháp" mới được gửi phê duyệt).'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra khi gửi phê duyệt: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get course for public display with approved content only
     */
    public function getCourseForPublicDisplay($slug)
    {
        $course = $this->CourseRepository->getCourseWithApprovedContent($slug);

        if (!$course) {
            return null;
        }

        // Process lessons and resources for display
        $course->lessons = $course->lessons->map(function ($lesson) {
            // Count total resources and preview resources
            $lesson->total_resources = $lesson->resources->count();
            $lesson->preview_resources = $lesson->resources->where('is_preview', 1)->count();
            if ($lesson->quiz && $lesson->quiz->status === 'approved') {
            } else {
                $lesson->quiz = null;
            }
            // Separate preview and locked resources
            $lesson->preview_items = $lesson->resources->where('is_preview', 1);
            $lesson->locked_items = $lesson->resources->where('is_preview', 0);

            return $lesson;
        });

        return $course;
    }
    public function getInstructorDetailsByCourseId($id)
    {
        return $this->CourseRepository->getInstructorDetailsByCourseId($id);
    }
    /**
     * Get course curriculum for enrolled users
     */
    public function getCourseForEnrolledUser($courseId, $userId)
    {
        // Kiểm tra xem user đã enroll chưa
        if (!$this->isUserEnrolled($userId, $courseId)) {
            return null;
        }

        return $this->CourseRepository->getCourseWithFullContent($courseId, $userId);
    }

    /**
     * Check if resource can be accessed by user
     */
    public function canAccessResource($resourceId, $userId = null)
    {
        $resource = \App\Models\Resource::with('lesson.course')->find($resourceId);

        if (!$resource || $resource->status !== 'approved') {
            return false;
        }

        // Nếu lesson không approved thì không thể access
        if ($resource->lesson->status !== 'approved') {
            return false;
        }

        // Nếu là preview resource thì ai cũng có thể xem
        if ($resource->is_preview) {
            return true;
        }

        // Nếu không phải preview thì phải đăng ký khóa học
        if (!$userId) {
            return false;
        }

        return $this->isUserEnrolled($userId, $resource->lesson->course_id);
    }

    /**
     * Tạo yêu cầu chỉnh sửa khóa học (cần admin duyệt)
     */
    public function createEditRequest($courseId, array $data)
    {
        try {
            DB::beginTransaction();

            // Kiểm tra xem có yêu cầu chỉnh sửa đang pending không
            $existingPendingEdit = CourseEdit::where('course_id', $courseId)
                ->where('status', CourseEditStatus::Pending)
                ->first();

            if ($existingPendingEdit) {
                // Cập nhật yêu cầu chỉnh sửa hiện có
                $courseEdit = $existingPendingEdit;
                $courseEdit->edited_title = $data['title'];
                $courseEdit->edited_description = $data['description'];
                $courseEdit->edited_price = $data['price'];

                // Xử lý upload ảnh mới nếu có
                if (isset($data['course_image']) && $data['course_image'] instanceof UploadedFile) {
                    // Xóa ảnh cũ của edit request
                    if ($courseEdit->edited_img_url) {
                        $this->deleteCourseImage($courseEdit->edited_img_url);
                    }
                    $courseEdit->edited_img_url = $this->uploadCourseImage($data['course_image']);
                }

                $courseEdit->save();
            } else {
                // Tạo yêu cầu chỉnh sửa mới
                $courseEdit = CourseEdit::create([
                    'course_id' => $courseId,
                    'submitted_by' => Auth::id(),
                    'edited_title' => $data['title'],
                    'edited_description' => $data['description'],
                    'edited_price' => $data['price'],
                    'status' => CourseEditStatus::Pending,
                ]);

                // Xử lý upload ảnh mới nếu có
                if (isset($data['course_image']) && $data['course_image'] instanceof UploadedFile) {
                    $courseEdit->edited_img_url = $this->uploadCourseImage($data['course_image']);
                    $courseEdit->save();
                }
            }

            // Xử lý categories
            if (isset($data['category_ids']) && is_array($data['category_ids'])) {
                // Xóa categories cũ của course edit
                CourseEditCategory::where('course_edit_id', $courseEdit->id)->delete();

                // Thêm categories mới
                foreach ($data['category_ids'] as $categoryId) {
                    CourseEditCategory::create([
                        'course_edit_id' => $courseEdit->id,
                        'category_id' => $categoryId,
                    ]);
                }
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Yêu cầu chỉnh sửa đã được gửi thành công!',
                'course_edit' => $courseEdit
            ];
        } catch (Exception $e) {
            DB::rollback();
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ];
        }
    }
}
