<?php

namespace App\Services;

use App\Repositories\LessonRepository;
use App\Repositories\ProgressRepository;
use App\Repositories\EnrollmentRepository;
use App\Repositories\CourseRepository;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class LessonService
{
    protected $lessonRepository;
    protected $progressRepository;
    protected $enrollmentRepository;
    protected $courseRepository;

    public function __construct(
        LessonRepository $lessonRepository,
        ProgressRepository $progressRepository,
        EnrollmentRepository $enrollmentRepository,
        CourseRepository $courseRepository
    ) {
        $this->lessonRepository = $lessonRepository;
        $this->progressRepository = $progressRepository;
        $this->enrollmentRepository = $enrollmentRepository;
        $this->courseRepository = $courseRepository;
    }

    /**
     * Lấy tất cả bài học với filter
     */
    public function getAllLessons(array $filters = [])
    {
        try {
            return $this->lessonRepository->getLessonsWithFilters($filters);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy danh sách bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy bài học theo ID với thông tin chi tiết
     */
    public function getLessonById(int $id, ?int $studentId = null): ?array
    {
        try {
            $lesson = $this->lessonRepository->findById($id);

            if (!$lesson) {
                return null;
            }

            $lessonData = [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'content' => $lesson->content,
                'type' => $lesson->type,
                'video_url' => $lesson->video_url,
                'duration' => $lesson->duration,
                'order' => $lesson->order,
                'course' => [
                    'id' => $lesson->course->id,
                    'title' => $lesson->course->title
                ],
                'resources' => $lesson->resources ?? [],
                'quiz' => $lesson->quiz ?? null
            ];

            // Nếu có student ID, thêm thông tin tiến độ
            if ($studentId) {
                $progress = $this->progressRepository->getStudentLessonProgress($studentId, $id);
                $lessonData['progress'] = [
                    'is_completed' => $progress ? $progress->is_complete : false,
                    'completed_at' => $progress && $progress->completed_at
                        ? $progress->completed_at->format('d/m/Y H:i')
                        : null
                ];

                // Thêm thông tin điều hướng
                $navigation = $this->getLessonNavigation($lesson->course_id, $lesson->order);
                $lessonData['navigation'] = $navigation;
            }

            return $lessonData;
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy thông tin bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Tạo bài học mới
     */
    public function createLesson(array $data): array
    {
        try {
            DB::beginTransaction();

            // Kiểm tra khóa học có tồn tại không
            $course = $this->courseRepository->findById($data['course_id']);
            if (!$course) {
                throw new \Exception('Khóa học không tồn tại');
            }

            // Xử lý thứ tự bài học
            if (!isset($data['order'])) {
                $lastOrder = $this->lessonRepository->countLessonsByCourse($data['course_id']);
                $data['order'] = $lastOrder + 1;
            }

            // Xử lý upload video nếu có
            if (isset($data['video_file']) && $data['video_file'] instanceof UploadedFile) {
                $data['video_url'] = $this->handleVideoUpload($data['video_file']);
                unset($data['video_file']);
            }

            $lesson = $this->lessonRepository->create($data);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Tạo bài học thành công',
                'lesson' => $lesson
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi tạo bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Cập nhật bài học
     */
    public function updateLesson(int $id, array $data): array
    {
        try {
            DB::beginTransaction();

            $lesson = $this->lessonRepository->findById($id);
            if (!$lesson) {
                throw new \Exception('Bài học không tồn tại');
            }

            // Xử lý upload video mới nếu có
            if (isset($data['video_file']) && $data['video_file'] instanceof UploadedFile) {
                // Xóa video cũ nếu có
                if ($lesson->video_url) {
                    $this->deleteVideoFile($lesson->video_url);
                }
                $data['video_url'] = $this->handleVideoUpload($data['video_file']);
                unset($data['video_file']);
            }

            $success = $this->lessonRepository->update($id, $data);

            if (!$success) {
                throw new \Exception('Không thể cập nhật bài học');
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Cập nhật bài học thành công'
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi cập nhật bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Xóa bài học
     */
    public function deleteLesson(int $id): array
    {
        try {
            DB::beginTransaction();

            $lesson = $this->lessonRepository->findById($id);
            if (!$lesson) {
                throw new \Exception('Bài học không tồn tại');
            }

            // Xóa file video nếu có
            if ($lesson->video_url) {
                $this->deleteVideoFile($lesson->video_url);
            }

            // Xóa progress liên quan
            $this->progressRepository->delete($id);

            $success = $this->lessonRepository->delete($id);

            if (!$success) {
                throw new \Exception('Không thể xóa bài học');
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Xóa bài học thành công'
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi xóa bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy bài học theo khóa học
     */
    public function getLessonsByCourse(int $courseId, ?int $studentId = null): array
    {
        try {
            $lessons = $this->lessonRepository->getLessonsByCourse($courseId);

            $lessonsData = $lessons->map(function ($lesson) use ($studentId) {
                $lessonData = [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'type' => $lesson->type,
                    'duration' => $lesson->duration,
                    'order' => $lesson->order,
                    'video_url' => $lesson->video_url
                ];

                // Thêm thông tin tiến độ nếu có student ID
                if ($studentId) {
                    $progress = $this->progressRepository->getStudentLessonProgress($studentId, $lesson->id);
                    $lessonData['is_completed'] = $progress ? $progress->is_complete : false;
                    $lessonData['completed_at'] = $progress && $progress->completed_at
                        ? $progress->completed_at->format('d/m/Y H:i')
                        : null;
                }

                return $lessonData;
            });

            return [
                'course_id' => $courseId,
                'total_lessons' => $lessons->count(),
                'lessons' => $lessonsData->toArray()
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy bài học theo khóa học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Đánh dấu bài học hoàn thành
     */
    public function markLessonCompleted(int $lessonId, int $studentId): array
    {
        try {
            DB::beginTransaction();

            $lesson = $this->lessonRepository->findById($lessonId);
            if (!$lesson) {
                throw new \Exception('Bài học không tồn tại');
            }

            // Kiểm tra quyền truy cập
            if (!$this->enrollmentRepository->isStudentEnrolled($studentId, $lesson->course_id)) {
                throw new \Exception('Bạn không có quyền truy cập bài học này');
            }

            $progress = $this->progressRepository->markLessonCompleted($studentId, $lessonId);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Đã đánh dấu hoàn thành bài học',
                'progress' => $progress
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi đánh dấu hoàn thành bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Bỏ đánh dấu hoàn thành bài học
     */
    public function markLessonIncomplete(int $lessonId, int $studentId): array
    {
        try {
            DB::beginTransaction();

            $lesson = $this->lessonRepository->findById($lessonId);
            if (!$lesson) {
                throw new \Exception('Bài học không tồn tại');
            }

            // Kiểm tra quyền truy cập
            if (!$this->enrollmentRepository->isStudentEnrolled($studentId, $lesson->course_id)) {
                throw new \Exception('Bạn không có quyền truy cập bài học này');
            }

            $progress = $this->progressRepository->markLessonIncomplete($studentId, $lessonId);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Đã bỏ đánh dấu hoàn thành bài học',
                'progress' => $progress
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi bỏ đánh dấu hoàn thành bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Sắp xếp lại thứ tự bài học
     */
    public function reorderLessons(int $courseId, array $lessonIds): array
    {
        try {
            DB::beginTransaction();

            $success = $this->lessonRepository->reorderLessons($courseId, $lessonIds);

            if (!$success) {
                throw new \Exception('Không thể sắp xếp lại thứ tự bài học');
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Sắp xếp lại thứ tự bài học thành công'
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi sắp xếp lại thứ tự bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Nhân bản bài học
     */
    public function duplicateLesson(int $lessonId, ?int $newCourseId = null): array
    {
        try {
            DB::beginTransaction();

            $newLesson = $this->lessonRepository->duplicateLesson($lessonId, $newCourseId);

            if (!$newLesson) {
                throw new \Exception('Không thể nhân bản bài học');
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Nhân bản bài học thành công',
                'lesson' => $newLesson
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi nhân bản bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy thông tin điều hướng bài học
     */
    public function getLessonNavigation(int $courseId, int $currentOrder): array
    {
        try {
            $previousLesson = $this->lessonRepository->getPreviousLesson($courseId, $currentOrder);
            $nextLesson = $this->lessonRepository->getNextLesson($courseId, $currentOrder);

            return [
                'previous' => $previousLesson ? [
                    'id' => $previousLesson->id,
                    'title' => $previousLesson->title,
                    'order' => $previousLesson->order
                ] : null,
                'next' => $nextLesson ? [
                    'id' => $nextLesson->id,
                    'title' => $nextLesson->title,
                    'order' => $nextLesson->order
                ] : null
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy thông tin điều hướng: ' . $e->getMessage());
            return ['previous' => null, 'next' => null];
        }
    }

    /**
     * Tìm kiếm bài học
     */
    public function searchLessons(string $keyword, ?int $courseId = null): array
    {
        try {
            $lessons = $this->lessonRepository->search($keyword, $courseId);

            return [
                'keyword' => $keyword,
                'course_id' => $courseId,
                'total_results' => $lessons->count(),
                'lessons' => $lessons->map(function ($lesson) {
                    return [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'type' => $lesson->type,
                        'duration' => $lesson->duration,
                        'course_title' => $lesson->course->title,
                        'course_id' => $lesson->course_id
                    ];
                })->toArray()
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi tìm kiếm bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy thống kê bài học
     */
    public function getLessonStats(): array
    {
        try {
            return $this->lessonRepository->getLessonStats();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy thống kê bài học: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Lấy bài học phổ biến
     */
    public function getPopularLessons(int $limit = 10): array
    {
        try {
            $lessons = $this->lessonRepository->getPopularLessons($limit);

            return $lessons->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'course_title' => $lesson->course->title,
                    'completed_count' => $lesson->completed_count,
                    'type' => $lesson->type
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy bài học phổ biến: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Kiểm tra quyền truy cập bài học
     */
    public function canAccessLesson(int $lessonId, int $studentId): bool
    {
        try {
            $lesson = $this->lessonRepository->findById($lessonId);
            if (!$lesson) {
                return false;
            }

            return $this->enrollmentRepository->isStudentEnrolled($studentId, $lesson->course_id);
        } catch (\Exception $e) {
            Log::error('Lỗi khi kiểm tra quyền truy cập bài học: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Xử lý upload video
     */
    private function handleVideoUpload(UploadedFile $file): string
    {
        try {
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('lessons/videos', $fileName, 'public');
            return $path;
        } catch (\Exception $e) {
            Log::error('Lỗi khi upload video: ' . $e->getMessage());
            throw new \Exception('Không thể upload video');
        }
    }

    /**
     * Xóa file video
     */
    private function deleteVideoFile(string $videoUrl): void
    {
        try {
            if (Storage::disk('public')->exists($videoUrl)) {
                Storage::disk('public')->delete($videoUrl);
            }
        } catch (\Exception $e) {
            Log::error('Lỗi khi xóa file video: ' . $e->getMessage());
        }
    }

    /**
     * Bulk update lessons
     */
    public function bulkUpdateLessons(array $lessonData): array
    {
        try {
            DB::beginTransaction();

            $updatedCount = 0;
            foreach ($lessonData as $data) {
                if (isset($data['id'])) {
                    $success = $this->lessonRepository->update($data['id'], $data);
                    if ($success) {
                        $updatedCount++;
                    }
                }
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Đã cập nhật {$updatedCount} bài học",
                'updated_count' => $updatedCount
            ];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi cập nhật hàng loạt bài học: ' . $e->getMessage());
            throw $e;
        }
    }
}
