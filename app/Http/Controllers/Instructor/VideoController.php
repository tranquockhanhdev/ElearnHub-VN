<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\Course;
use App\Services\VideoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    protected $videoService;

    public function __construct(VideoService $videoService)
    {
        $this->videoService = $videoService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index($courseId, $lessonId)
    {
        $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
        $lesson = $course->lessons()->findOrFail($lessonId);
        $videos = $this->videoService->getVideosByLesson($lessonId);

        return response()->json($videos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $courseId, $lessonId)
    {
        // Kiểm tra quyền truy cập course
        $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
        $lesson = $course->lessons()->findOrFail($lessonId);

        // Kiểm tra xem có phải chunk upload không
        if ($request->has('chunkIndex') && $request->has('totalChunks')) {
            return $this->handleChunkUpload($request, $courseId, $lessonId);
        }

        // Validate request
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required', // Có thể là file hoặc URL
            'is_preview' => 'nullable|boolean',
            'file_type' => 'nullable|string'
        ]);

        // Validate thêm cho file
        if ($request->hasFile('file')) {
            // Upload file video trực tiếp
            $request->validate([
                'file' => 'file|mimes:mp4,avi,mov,wmv,webm|max:102400', // 100MB
            ]);
            $validatedData['file'] = $request->file('file');
        } elseif ($request->filled('file')) {
            // Nếu là URL string (YouTube, Vimeo, etc.)
            $request->validate([
                'file' => 'url',
            ]);
            $validatedData['file'] = $request->input('file');
        } else {
            return back()->withErrors(['file' => 'File hoặc URL là bắt buộc']);
        }

        try {
            // Thêm lesson_id vào data
            $validatedData['lesson_id'] = $lessonId;

            // Tạo video
            $video = $this->videoService->createVideo($validatedData);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Video đã được thêm thành công!',
                    'video' => $video
                ]);
            }

            return Redirect::back()->with('success', 'Video đã được thêm thành công!');
        } catch (\InvalidArgumentException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 422);
            }
            return back()->withErrors(['file' => $e->getMessage()]);
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Có lỗi xảy ra khi thêm video: ' . $e->getMessage()
                ], 500);
            }
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi thêm video: ' . $e->getMessage()]);
        }
    }

    /**
     * Xử lý chunk upload cho video
     */
    private function handleChunkUpload(Request $request, $courseId, $lessonId)
    {
        // Validate chunk data
        $validatedData = $request->validate([
            'file' => 'required|file|max:10240', // 10MB per chunk
            'chunkIndex' => 'required|integer|min:0',
            'totalChunks' => 'required|integer|min:1',
            'fileName' => 'required|string',
            'uploadId' => 'required|string',
            'title' => 'required|string|max:255',
            'is_preview' => 'nullable|boolean'
        ]);

        $chunkIndex = $validatedData['chunkIndex'];
        $totalChunks = $validatedData['totalChunks'];
        $fileName = $validatedData['fileName'];
        $uploadId = $validatedData['uploadId'];
        $title = $validatedData['title'];
        $isPreview = $validatedData['is_preview'] ?? false;

        try {
            // Tạo thư mục tạm cho chunks
            $tempDir = storage_path('app/temp/video_chunks/' . $uploadId);
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0777, true);
            }

            // Lưu chunk với tên có thứ tự để đảm bảo đúng order
            $chunkFile = $request->file('file');
            $safeFileName = $uploadId . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
            $chunkFileName = $safeFileName . '.part' . str_pad($chunkIndex, 4, '0', STR_PAD_LEFT);

            if (!$chunkFile->move($tempDir, $chunkFileName)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể lưu chunk'
                ], 500);
            }

            Log::info("Chunk upload progress", [
                'uploadId' => $uploadId,
                'chunkIndex' => $chunkIndex,
                'totalChunks' => $totalChunks
            ]);

            // Kiểm tra xem đã upload đủ chunks chưa
            if ($chunkIndex + 1 == $totalChunks) {
                // Tạo thư mục videos nếu chưa có
                $videosDir = storage_path('app/public/videos');
                if (!file_exists($videosDir)) {
                    mkdir($videosDir, 0777, true);
                }

                // Tạo tên file cuối cùng
                $extension = pathinfo($fileName, PATHINFO_EXTENSION);
                $sanitizedTitle = preg_replace('/[^a-zA-Z0-9-_]/', '', $title);
                $finalFileName = $sanitizedTitle . '_' . time() . '.' . $extension;
                $finalPath = $videosDir . '/' . $finalFileName;

                // Merge chunks
                $success = $this->mergeVideoChunks($tempDir, $safeFileName, $totalChunks, $finalPath);

                if (!$success) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Lỗi khi ghép file video'
                    ], 500);
                }

                // Cleanup chunks
                $this->cleanupVideoChunks($tempDir, $safeFileName, $totalChunks);

                // Tạo video record
                $videoData = [
                    'lesson_id' => $lessonId,
                    'title' => $title,
                    'file' => $finalFileName, // Chỉ lưu tên file, không cần đường dẫn đầy đủ
                    'is_preview' => $isPreview
                ];

                $video = $this->videoService->createVideoFromPath($videoData);

                return response()->json([
                    'success' => true,
                    'message' => 'Video đã được upload thành công!',
                    'video' => $video,
                    'isComplete' => true
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Chunk ' . ($chunkIndex + 1) . '/' . $totalChunks . ' đã được upload',
                'isComplete' => false
            ]);
        } catch (\Exception $e) {
            Log::error('Chunk upload error', [
                'uploadId' => $uploadId,
                'chunkIndex' => $chunkIndex,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi upload chunk: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Merge chunks thành file video hoàn chỉnh
     */
    private function mergeVideoChunks($tempDir, $baseFileName, $totalChunks, $finalPath)
    {
        $outputFile = fopen($finalPath, 'wb');

        if (!$outputFile) {
            return false;
        }

        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkFileName = $baseFileName . '.part' . str_pad($i, 4, '0', STR_PAD_LEFT);
            $chunkPath = $tempDir . '/' . $chunkFileName;

            if (!file_exists($chunkPath)) {
                fclose($outputFile);
                unlink($finalPath);
                return false;
            }

            $chunkData = file_get_contents($chunkPath);
            if ($chunkData === false) {
                fclose($outputFile);
                unlink($finalPath);
                return false;
            }

            fwrite($outputFile, $chunkData);
        }

        fclose($outputFile);

        Log::info("Video merged successfully", [
            'finalPath' => $finalPath,
            'fileSize' => filesize($finalPath),
            'totalChunks' => $totalChunks
        ]);

        return true;
    }

    /**
     * Cleanup video chunks sau khi merge
     */
    private function cleanupVideoChunks($tempDir, $baseFileName, $totalChunks)
    {
        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkFileName = $baseFileName . '.part' . str_pad($i, 4, '0', STR_PAD_LEFT);
            $chunkPath = $tempDir . '/' . $chunkFileName;

            if (file_exists($chunkPath)) {
                unlink($chunkPath);
            }
        }

        // Xóa thư mục nếu rỗng
        if (is_dir($tempDir) && count(glob($tempDir . '/*')) === 0) {
            rmdir($tempDir);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($courseId, $lessonId, $videoId)
    {
        try {
            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Xóa video (kiểm tra video thuộc lesson)
            $video = Resource::where('type', 'video')
                ->where('lesson_id', $lessonId)
                ->findOrFail($videoId);

            $this->videoService->deleteVideo($videoId);

            return Redirect::back()->with('success', 'Video đã được xóa thành công!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi xóa video: ' . $e->getMessage()]);
        }
    }
}
