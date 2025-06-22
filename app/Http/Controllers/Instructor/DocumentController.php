<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class DocumentController extends Controller
{
    protected $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index($courseId, $lessonId)
    {
        // Logic để hiển thị danh sách documents của lesson
        $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
        $lesson = $course->lessons()->findOrFail($lessonId);
        $documents = $this->documentService->getDocumentsByLesson($lessonId);

        return response()->json($documents);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($courseId, $lessonId, $documentId)
    {
        try {
            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Xóa document (kiểm tra document thuộc lesson)
            $document = Resource::where('type', 'document')
                ->where('lesson_id', $lessonId)
                ->findOrFail($documentId);

            $this->documentService->deleteDocument($documentId);

            return Redirect::back()->with('success', 'Tài liệu đã được xóa thành công!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi xóa tài liệu: ' . $e->getMessage()]);
        }
    }

    public function chunkUpload(Request $request, $courseId, $lessonId)
    {
        $request->validate([
            'file' => 'required|file',
            'chunkIndex' => 'required|integer',
            'totalChunks' => 'required|integer',
            'fileName' => 'required|string',
            'uploadId' => 'required|string',
        ]);

        $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
        $lesson = $course->lessons()->findOrFail($lessonId);

        $chunk = $request->file('file');
        $fileName = $request->input('fileName');
        $chunkIndex = $request->input('chunkIndex');
        $totalChunks = $request->input('totalChunks');
        $uploadId = $request->input('uploadId');

        $safeFileName = $uploadId . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);

        $tempDir = storage_path('app/temp/' . $lessonId);
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $chunkFileName = $safeFileName . '.part' . str_pad($chunkIndex, 4, '0', STR_PAD_LEFT);
        $chunkPath = $tempDir . '/' . $chunkFileName;

        if (!$chunk->move($tempDir, $chunkFileName)) {
            return response()->json(['error' => 'Không thể lưu chunk'], 500);
        }

        if ($chunkIndex + 1 == $totalChunks) {
            $documentsDir = storage_path('app/public/documents');
            if (!file_exists($documentsDir)) {
                mkdir($documentsDir, 0777, true);
            }

            $finalFileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
            $finalPath = $documentsDir . '/' . $finalFileName;

            $success = $this->mergeChunks($tempDir, $safeFileName, $totalChunks, $finalPath);

            if (!$success) {
                return response()->json(['error' => 'Lỗi khi ghép file'], 500);
            }

            $this->cleanupChunks($tempDir, $safeFileName, $totalChunks);

            try {
                $extension = pathinfo($fileName, PATHINFO_EXTENSION);

                $documentData = [
                    'lesson_id' => $lessonId,
                    'title' => pathinfo($fileName, PATHINFO_FILENAME),
                    'file' => $finalFileName,
                    'is_preview' => 0,
                ];

                $document = $this->documentService->createDocumentFromChunk($documentData, $finalFileName, $extension);

                return response()->json([
                    'message' => 'File uploaded successfully!',
                    'file_url' => 'storage/documents/' . $finalFileName,
                    'document' => $document
                ]);
            } catch (\Exception $e) {
                if (file_exists($finalPath)) {
                    unlink($finalPath);
                }
                return response()->json(['error' => 'Lỗi lưu thông tin file: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['message' => 'Chunk uploaded successfully!']);
    }

    private function mergeChunks($tempDir, $baseFileName, $totalChunks, $finalPath)
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
        return true;
    }

    private function cleanupChunks($tempDir, $baseFileName, $totalChunks)
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
}
