<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstructorRequest;
use App\Models\Resource;
use App\Models\Course;
use App\Models\ResourceEdit;
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
    public function store(InstructorRequest $request, $courseId, $lessonId)
    {
        // Kiểm tra quyền truy cập course
        $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
        $lesson = $course->lessons()->findOrFail($lessonId);

        // Kiểm tra xem có phải chunk upload không
        if ($request->has('chunkIndex') && $request->has('totalChunks')) {
            return $this->handleChunkUpload($request, $courseId, $lessonId);
        }

        // Validate thêm cho file
        if ($request->hasFile('file')) {
            // Upload file video trực tiếp
            $request->validate([
                'file' => 'file|mimes:webm|max:102400', // 100MB
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

        $validatedData = $request->all();

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

        // Validate file extension for WebM only
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if ($extension !== 'webm') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ cho phép upload file định dạng WebM.'
            ], 422);
        }

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

    /**
     * Update the order of videos.
     */
    public function updateOrder(InstructorRequest $request, $courseId, $lessonId, $videoId)
    {
        try {
            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            $result = $this->videoService->updateVideoOrder($videoId, $lessonId, $request->order);

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }

            return redirect()->back()->withErrors(['general' => $result['message']]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi cập nhật thứ tự video.']);
        }
    }

    /**
     * Edit video - tạo yêu cầu chỉnh sửa để admin phê duyệt
     */
    public function edit(Request $request, $courseId, $lessonId, $videoId)
    {
        try {
            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Kiểm tra video thuộc lesson
            $video = Resource::where('type', 'video')
                ->where('lesson_id', $lessonId)
                ->findOrFail($videoId);

            // Kiểm tra xem đã có yêu cầu chỉnh sửa pending chưa
            $existingEdit = ResourceEdit::where('resources_id', $videoId)
                ->where('status', ResourceEdit::STATUS_PENDING)
                ->first();

            if ($existingEdit) {
                return redirect()->back()->withErrors(['general' => 'Đã có yêu cầu chỉnh sửa đang chờ phê duyệt cho video này.']);
            }            // Kiểm tra xem có phải chunk upload không
            if ($request->has('chunkIndex') && $request->has('totalChunks')) {
                return $this->handleEditChunkUpload($request, $courseId, $lessonId, $videoId);
            }

            // Prepare data for non-chunk edit
            $editData = [
                'video_id' => $videoId,
                'title' => $request->input('title'),
                'lesson_id' => $lessonId,
            ];

            // Add file if provided
            if ($request->hasFile('file')) {
                $editData['file'] = $request->file('file');
            }

            // Add URL if provided
            if ($request->filled('url')) {
                $editData['url'] = $request->input('url');
            }

            // Add preview flag if provided
            if ($request->has('is_preview')) {
                $editData['is_preview'] = $request->boolean('is_preview');
            }

            // Use service to create the edit request
            $result = $this->videoService->createVideoEditWithoutFile($editData);

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            } else {
                return redirect()->back()->withErrors(['general' => $result['message']]);
            }
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi gửi yêu cầu chỉnh sửa: ' . $e->getMessage()]);
        }
    }

    /**
     * Xử lý chunk upload cho edit video
     */
    private function handleEditChunkUpload(Request $request, $courseId, $lessonId, $videoId)
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

        // Validate file extension for WebM only
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if ($extension !== 'webm') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ cho phép upload file định dạng WebM.'
            ], 422);
        }

        try {
            // Tạo thư mục tạm cho chunks edit
            $tempDir = storage_path('app/temp/edit_video_chunks/' . $uploadId);
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

            Log::info("Edit video chunk upload progress", [
                'uploadId' => $uploadId,
                'videoId' => $videoId,
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
                $finalFileName = $sanitizedTitle . '_edit_' . time() . '.' . $extension;
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
                $this->cleanupEditVideoChunks($tempDir, $safeFileName, $totalChunks);

                // Detect loại video từ extension
                $fileType = strtolower($extension);
                if (!in_array($fileType, ['webm'])) {
                    $fileType = 'webm'; // default
                }

                // Use service to create the edit request
                $editData = [
                    'video_id' => $videoId,
                    'title' => $title,
                    'file_url' => 'storage/videos/' . $finalFileName,
                    'file_type' => $fileType,
                    'is_preview' => $isPreview,
                ];

                $result = $this->videoService->createVideoEditFromChunk($editData);

                if (!$result['success']) {
                    return response()->json([
                        'success' => false,
                        'message' => $result['message']
                    ], 500);
                }

                Log::info("Edit video merged successfully", [
                    'videoId' => $videoId,
                    'finalPath' => $finalPath,
                    'fileSize' => filesize($finalPath),
                    'totalChunks' => $totalChunks
                ]);

                return response()->json([
                    'success' => true,
                    'message' => $result['message'],
                    'isComplete' => true
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Chunk ' . ($chunkIndex + 1) . '/' . $totalChunks . ' đã được upload',
                'isComplete' => false
            ]);
        } catch (\Exception $e) {
            Log::error('Edit video chunk upload error', [
                'uploadId' => $uploadId,
                'videoId' => $videoId,
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
     * Cleanup video chunks sau khi merge cho edit
     */
    private function cleanupEditVideoChunks($tempDir, $baseFileName, $totalChunks)
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
     * Update the status of video.
     */
    public function updateStatus(Request $request, $courseId, $lessonId, $videoId)
    {
        try {
            $request->validate([
                'status' => 'required|in:draft,pending,approved,rejected'
            ]);

            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Kiểm tra video thuộc lesson
            $video = Resource::where('type', 'video')
                ->where('lesson_id', $lessonId)
                ->findOrFail($videoId);

            $video->status = $request->status;
            $video->save();

            $statusText = [
                'draft' => 'nháp',
                'pending' => 'chờ phê duyệt',
                'approved' => 'đã phê duyệt',
                'rejected' => 'bị từ chối'
            ];

            return redirect()->back()->with('success', "Cập nhật trạng thái video thành '{$statusText[$request->status]}' thành công!");
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Video không tồn tại.'])
                ->with('error', 'Video không tồn tại.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Có lỗi xảy ra khi cập nhật trạng thái video.'])
                ->with('error', 'Có lỗi xảy ra khi cập nhật trạng thái video.');
        }
    }
}