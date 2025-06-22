<?php

namespace App\Services;

use App\Repositories\VideoRepository;
use Illuminate\Http\UploadedFile;
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
        $maxOrder = $this->videoRepository->getMaxOrderByLesson($data['lesson_id']);
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
        ];

        return $this->videoRepository->create($videoData);
    }

    /**
     * Tạo video từ đường dẫn file (dành cho chunk upload)
     */
    public function createVideoFromPath(array $data)
    {
        // Tính order mới
        $maxOrder = $this->videoRepository->getMaxOrderByLesson($data['lesson_id']);
        $newOrder = $maxOrder + 1;

        // Lấy extension từ file path
        $extension = pathinfo($data['file'], PATHINFO_EXTENSION);

        // Chuẩn bị dữ liệu để lưu
        $videoData = [
            'lesson_id' => $data['lesson_id'],
            'type' => 'video',
            'title' => $data['title'],
            'file_url' => 'storage/' . $data['file'], // Đường dẫn file đã merge
            'file_type' => strtolower($extension),
            'is_preview' => $data['is_preview'] ?? false,
            'order' => $newOrder,
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
}
