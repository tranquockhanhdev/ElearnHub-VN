<?php

namespace App\Services;

use App\Repositories\DocumentRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DocumentService
{
    protected $documentRepository;

    public function __construct(DocumentRepository $documentRepository)
    {
        $this->documentRepository = $documentRepository;
    }
    /**
     * Tạo tài liệu từ file hoặc URL
     *
     * @param mixed $file
     * @param string $title
     * @param int $lessonId
     * @return mixed
     */
    public function createDocumentFromChunk(array $data, $fileName, $extension)
    {
        // Tính order mới
        $maxOrder = $this->documentRepository->getMaxOrderByLessonAndType($data['lesson_id']);
        $newOrder = $maxOrder + 1;

        // Validate file type
        $allowedTypes = ['pdf', 'doc', 'docx'];
        if (!in_array(strtolower($extension), $allowedTypes)) {
            throw new \InvalidArgumentException('File type không được hỗ trợ. Chỉ chấp nhận: ' . implode(', ', $allowedTypes));
        }

        // Chuẩn bị dữ liệu để lưu
        $documentData = [
            'lesson_id' => $data['lesson_id'],
            'type' => 'document',
            'title' => $data['title'],
            'file_url' => 'storage/documents/' . $fileName,
            'file_type' => strtolower($extension),
            'is_preview' => $data['is_preview'] ?? 0,
            'order' => $newOrder,
        ];

        return $this->documentRepository->create($documentData);
    }

    public function getDocumentsByLesson($lessonId)
    {
        return $this->documentRepository->findByLessonId($lessonId);
    }

    public function deleteDocument($id)
    {
        $document = $this->documentRepository->findById($id);

        // Xóa file nếu có (chỉ xóa file upload, không xóa URL)
        if ($document->file_url && !filter_var($document->file_url, FILTER_VALIDATE_URL)) {
            $filePath = str_replace('storage/', '', $document->file_url);
            Storage::disk('public')->delete($filePath);
        }

        return $this->documentRepository->delete($id);
    }

    public function updateDocumentOrder(int $documentId, int $lessonId, int $newOrder): array
    {
        try {
            DB::beginTransaction();

            $document = $this->documentRepository->findById($documentId);
            if (!$document || $document->lesson_id !== $lessonId) {
                throw new \Exception('Tài liệu không tồn tại hoặc không thuộc bài giảng này.');
            }

            $oldOrder = $document->order;

            if ($newOrder === $oldOrder) {
                return ['success' => true, 'message' => 'Không có thay đổi.'];
            }

            // Cập nhật các tài liệu liên quan
            if ($newOrder > $oldOrder) {
                // Dịch chuyển xuống: giảm order của các tài liệu ở giữa
                $this->documentRepository->model()
                    ->where('lesson_id', $lessonId)
                    ->where('type', 'document')
                    ->where('order', '>', $oldOrder)
                    ->where('order', '<=', $newOrder)
                    ->decrement('order');
            } else {
                // Dịch chuyển lên: tăng order của các tài liệu ở giữa
                $this->documentRepository->model()
                    ->where('lesson_id', $lessonId)
                    ->where('type', 'document')
                    ->where('order', '>=', $newOrder)
                    ->where('order', '<', $oldOrder)
                    ->increment('order');
            }

            // Cập nhật tài liệu đang di chuyển
            $document->order = $newOrder;
            $document->save();

            DB::commit();

            return ['success' => true, 'message' => 'Cập nhật thứ tự tài liệu thành công'];
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Lỗi khi cập nhật thứ tự tài liệu: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Lỗi cập nhật thứ tự tài liệu'];
        }
    }
}
