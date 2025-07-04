<?php

namespace App\Services;

use App\Repositories\VideoRepository;
use App\Models\ResourceEdit;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoService
{
    protected $videoRepository;

    public function __construct(VideoRepository $videoRepository)
    {
        $this->videoRepository = $videoRepository;
    }

    public function createVideo(array $data)
    {
        // Tính order mới
        $maxOrder = $this->videoRepository->getMaxOrderByLessonAndType($data['lesson_id']);
        $newOrder = $maxOrder + 1;

        // Xử lý file hoặc URL
        $fileData = $this->processFile($data['file'], $data['title']);

        // Chuẩn bị dữ liệu để lưu
        $videoData = [
            'lesson_id' => $data['lesson_id'],
            'type' => 'video',
            'title' => $data['title'],
            'file_url' => $fileData['file_url'],
            'file_type' => $fileData['file_type'],
            'is_preview' => $data['is_preview'] ?? false,
            'order' => $newOrder,
            'status' => 'pending', // Video cần admin phê duyệt trước khi active
        ];

        // Thêm DRM data nếu có
        if (isset($fileData['encrypted_path'])) {
            $videoData['encrypted_path'] = $fileData['encrypted_path'];
            $videoData['decrypt_key'] = $fileData['decrypt_key'];
            $videoData['is_encrypted'] = true;
        }

        return $this->videoRepository->create($videoData);
    }

    /**
     * Tạo video từ đường dẫn file (dành cho chunk upload)
     */
    public function createVideoFromPath(array $data)
    {
        // Tính order mới
        $maxOrder = $this->videoRepository->getMaxOrderByLessonAndType($data['lesson_id']);
        $newOrder = $maxOrder + 1;

        // Lấy extension từ file path
        $extension = pathinfo($data['file'], PATHINFO_EXTENSION);

        // Chuẩn bị dữ liệu để lưu
        $videoData = [
            'lesson_id' => $data['lesson_id'],
            'type' => 'video',
            'title' => $data['title'],
            'file_url' => 'storage/videos/' . $data['file'], // Đường dẫn file đã merge
            'file_type' => strtolower($extension),
            'is_preview' => $data['is_preview'] ?? false,
            'order' => $newOrder,
            'status' => 'pending', // Video cần admin phê duyệt trước khi active
        ];

        return $this->videoRepository->create($videoData);
    }

    private function processFile($file, $title)
    {
        // Nếu là URL string (YouTube, Vimeo, etc.)
        if (is_string($file) && filter_var($file, FILTER_VALIDATE_URL)) {
            return [
                'file_url' => $file,
                'file_type' => $this->getVideoTypeFromUrl($file)
            ];
        }

        // Nếu là uploaded file
        if ($file instanceof UploadedFile) {
            // Lấy extension
            $extension = strtolower($file->getClientOriginalExtension());

            // Validate file type
            $allowedTypes = ['mp4', 'avi', 'mov', 'wmv', 'webm'];
            if (!in_array($extension, $allowedTypes)) {
                throw new \InvalidArgumentException('Video type không được hỗ trợ. Chỉ chấp nhận: ' . implode(', ', $allowedTypes));
            }

            // Tạo tên file unique
            $fileName = Str::slug($title) . '_' . time() . '.' . $extension;

            // Lưu file vào storage/app/public/videos
            $filePath = $file->storeAs('videos', $fileName, 'public');

            return [
                'file_url' => 'storage/' . $filePath,
                'file_type' => $extension
            ];
        }

        throw new \InvalidArgumentException('File không hợp lệ');
    }

    private function getVideoTypeFromUrl($url)
    {
        if (strpos($url, 'youtube.com') !== false || strpos($url, 'youtu.be') !== false) {
            return 'youtube';
        }
        if (strpos($url, 'vimeo.com') !== false) {
            return 'vimeo';
        }
        return 'url';
    }

    public function getVideosByLesson($lessonId)
    {
        return $this->videoRepository->findByLessonId($lessonId);
    }

    public function deleteVideo($id)
    {
        $video = $this->videoRepository->findById($id);

        // Xóa file nếu có (chỉ xóa file upload, không xóa URL)
        if ($video->file_url && !filter_var($video->file_url, FILTER_VALIDATE_URL)) {
            $filePath = str_replace('storage/', '', $video->file_url);
            Storage::disk('public')->delete($filePath);
        }

        return $this->videoRepository->delete($id);
    }

    public function updateVideoOrder(int $videoId, int $lessonId, int $newOrder): array
    {
        try {
            DB::beginTransaction();

            $video = $this->videoRepository->findById($videoId);
            if (!$video || $video->lesson_id !== $lessonId) {
                throw new \Exception('Video không tồn tại hoặc không thuộc bài giảng này.');
            }

            $oldOrder = $video->order;

            if ($newOrder === $oldOrder) {
                return ['success' => true, 'message' => 'Không có thay đổi.'];
            }

            // Cập nhật các video liên quan
            if ($newOrder > $oldOrder) {
                // Dịch chuyển xuống: giảm order của các video ở giữa
                $this->videoRepository->model()
                    ->where('lesson_id', $lessonId)
                    ->where('type', 'video')
                    ->where('order', '>', $oldOrder)
                    ->where('order', '<=', $newOrder)
                    ->decrement('order');
            } else {
                // Dịch chuyển lên: tăng order của các video ở giữa
                $this->videoRepository->model()
                    ->where('lesson_id', $lessonId)
                    ->where('type', 'video')
                    ->where('order', '>=', $newOrder)
                    ->where('order', '<', $oldOrder)
                    ->increment('order');
            }

            // Cập nhật video đang di chuyển
            $video->order = $newOrder;
            $video->save();

            DB::commit();

            return ['success' => true, 'message' => 'Cập nhật thứ tự video thành công'];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi cập nhật thứ tự video: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Lỗi cập nhật thứ tự video'];
        }
    }
    public function uploadVideo(UploadedFile $file, string $title, int $lessonId, bool $isPreview = false): array
    {
        // Xử lý file và lưu video
        $video = $this->createVideo([
            'file' => $file,
            'title' => $title,
            'lesson_id' => $lessonId,
            'is_preview' => $isPreview,
        ]);

        return [
            'success' => true,
            'message' => 'Video đã được upload thành công',
            'video' => $video,
        ];
    }

    /**
     * Create a resource edit from chunk upload (after merging)
     */
    public function createVideoEditFromChunk(array $data): array
    {
        try {
            $editData = [
                'resources_id' => $data['video_id'],
                'edited_title' => $data['title'],
                'edited_file_url' => $data['file_url'],
                'is_preview' => $data['is_preview'] ?? false,
                'status' => ResourceEdit::STATUS_PENDING,
            ];

            $resourceEdit = ResourceEdit::create($editData);

            return [
                'success' => true,
                'message' => 'Yêu cầu chỉnh sửa video đã được gửi thành công!',
                'resource_edit' => $resourceEdit
            ];
        } catch (\Exception $e) {
            Log::error('Error creating video edit from chunk: ' . $e->getMessage(), $data);
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra khi tạo yêu cầu chỉnh sửa video: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Create a resource edit without file upload (title, URL, or preview changes)
     */
    public function createVideoEditWithoutFile(array $data): array
    {
        try {
            $editData = [
                'resources_id' => $data['video_id'],
                'edited_title' => $data['title'],
                'status' => ResourceEdit::STATUS_PENDING,
            ];

            // Handle file/URL changes
            if (isset($data['file']) && $data['file'] instanceof \Illuminate\Http\UploadedFile) {
                // Upload new video file
                $result = $this->uploadVideo(
                    $data['file'],
                    $data['title'],
                    $data['lesson_id'],
                    $data['is_preview'] ?? false
                );

                if ($result['success']) {
                    $editData['edited_file_url'] = $result['video']->file_url;
                } else {
                    return $result;
                }
            } elseif (isset($data['url']) && !empty($data['url'])) {
                // Handle URL video (YouTube, Vimeo, etc.)
                $editData['edited_file_url'] = $data['url'];
            }

            // Handle preview flag changes
            if (isset($data['is_preview'])) {
                $editData['is_preview'] = $data['is_preview'];
            }

            $resourceEdit = ResourceEdit::create($editData);

            return [
                'success' => true,
                'message' => 'Yêu cầu chỉnh sửa video đã được gửi và đang chờ admin phê duyệt!',
                'resource_edit' => $resourceEdit
            ];
        } catch (\Exception $e) {
            Log::error('Error creating video edit without file: ' . $e->getMessage(), $data);
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra khi gửi yêu cầu chỉnh sửa: ' . $e->getMessage()
            ];
        }
    }
}
