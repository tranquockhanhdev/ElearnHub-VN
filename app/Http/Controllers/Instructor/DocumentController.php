<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstructorRequest;
use App\Models\Resource;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\ResourceEdit;
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

    public function chunkUpload(InstructorRequest $request, $courseId, $lessonId)
    {
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

    /**
     * Update the order of documents.
     */
    public function updateOrder(InstructorRequest $request, $courseId, $lessonId, $documentId)
    {
        try {
            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            $result = $this->documentService->updateDocumentOrder($documentId, $lessonId, $request->order);

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }

            return redirect()->back()->withErrors(['general' => $result['message']]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi cập nhật thứ tự tài liệu.']);
        }
    }

    /**
     * Edit document - tạo yêu cầu chỉnh sửa để admin phê duyệt
     */
    public function edit(Request $request, $courseId, $lessonId, $documentId)
    {
        try {
            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Kiểm tra document thuộc lesson
            $document = Resource::where('type', 'document')
                ->where('lesson_id', $lessonId)
                ->findOrFail($documentId);

            // Kiểm tra xem đã có yêu cầu chỉnh sửa pending chưa
            $existingEdit = ResourceEdit::where('resources_id', $documentId)
                ->where('status', ResourceEdit::STATUS_PENDING)
                ->first();

            if ($existingEdit) {
                return redirect()->back()->withErrors(['general' => 'Đã có yêu cầu chỉnh sửa đang chờ phê duyệt cho tài liệu này.']);
            }

            // Kiểm tra xem có phải chunk upload không
            if ($request->has('chunkIndex') && $request->has('totalChunks')) {
                return $this->handleEditChunkUpload($request, $courseId, $lessonId, $documentId);
            }

            // Xử lý edit không có file (chỉ title và is_preview)
            $result = $this->documentService->createDocumentEditWithoutFile(
                [
                    'title' => $request->input('title'),
                    'is_preview' => $request->boolean('is_preview', false),
                    'note' => null
                ],
                $documentId
            );

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
     * Xử lý chunk upload cho edit document
     */
    private function handleEditChunkUpload(Request $request, $courseId, $lessonId, $documentId)
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
            // Tạo thư mục tạm cho chunks edit
            $tempDir = storage_path('app/temp/edit_document_chunks/' . $uploadId);
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

            // Kiểm tra xem đã upload đủ chunks chưa
            if ($chunkIndex + 1 == $totalChunks) {
                // Tạo thư mục documents nếu chưa có
                $documentsDir = storage_path('app/public/documents');
                if (!file_exists($documentsDir)) {
                    mkdir($documentsDir, 0777, true);
                }

                // Tạo tên file cuối cùng
                $extension = pathinfo($fileName, PATHINFO_EXTENSION);
                $sanitizedTitle = preg_replace('/[^a-zA-Z0-9-_]/', '', $title);
                $finalFileName = $sanitizedTitle . '_edit_' . time() . '.' . $extension;
                $finalPath = $documentsDir . '/' . $finalFileName;

                // Merge chunks
                $success = $this->mergeChunks($tempDir, $safeFileName, $totalChunks, $finalPath);

                if (!$success) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Lỗi khi ghép file tài liệu'
                    ], 500);
                }

                // Cleanup chunks
                $this->cleanupEditChunks($tempDir, $safeFileName, $totalChunks);

                // Tạo yêu cầu chỉnh sửa với file mới
                $result = $this->documentService->createDocumentEditFromChunk(
                    [
                        'title' => $title,
                        'is_preview' => $isPreview,
                        'note' => null
                    ],
                    $finalFileName,
                    $extension,
                    $documentId
                );

                if (!$result['success']) {
                    return response()->json([
                        'success' => false,
                        'message' => $result['message']
                    ], 500);
                }

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
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi upload chunk: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cleanup chunks sau khi merge cho edit
     */
    private function cleanupEditChunks($tempDir, $baseFileName, $totalChunks)
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
     * Update the status of document.
     */
    public function updateStatus(Request $request, $courseId, $lessonId, $documentId)
    {
        try {
            $request->validate([
                'status' => 'required|in:draft,pending,approved,rejected'
            ]);

            // Kiểm tra quyền truy cập
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Kiểm tra document thuộc lesson
            $document = Resource::where('type', 'document')
                ->where('lesson_id', $lessonId)
                ->findOrFail($documentId);

            $document->status = $request->status;
            $document->save();

            $statusText = [
                'draft' => 'nháp',
                'pending' => 'chờ phê duyệt',
                'approved' => 'đã phê duyệt',
                'rejected' => 'bị từ chối'
            ];

            return redirect()->back()->with('success', "Cập nhật trạng thái tài liệu thành '{$statusText[$request->status]}' thành công!");
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Tài liệu không tồn tại.'])
                ->with('error', 'Tài liệu không tồn tại.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Có lỗi xảy ra khi cập nhật trạng thái tài liệu.'])
                ->with('error', 'Có lỗi xảy ra khi cập nhật trạng thái tài liệu.');
        }
    }
}
