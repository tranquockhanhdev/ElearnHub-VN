<?php

namespace App\Services;

use App\Repositories\DocumentRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\ResourceEdit;

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
        if (!$document) {
            throw new \Exception('Document không tồn tại');
        }

        // Kiểm tra status của resource
        if ($document->status === 'approved') {
            // Tạo ResourceEdit với action xóa thay vì xóa trực tiếp
            $this->createDeleteResourceEdit($document);
            throw new \Exception('Document đã được phê duyệt. Yêu cầu xóa đã được gửi để admin xử lý.');
        }

        // Chỉ cho phép xóa trực tiếp nếu status là draft hoặc pending
        if (!in_array($document->status, ['draft', 'pending'])) {
            throw new \Exception('Chỉ có thể xóa document có trạng thái nháp hoặc chờ phê duyệt.');
        }

        // Xóa file nếu có (chỉ xóa file upload, không xóa URL)
        if ($document->file_url && !filter_var($document->file_url, FILTER_VALIDATE_URL)) {
            $filePath = str_replace('storage/', '', $document->file_url);
            Storage::disk('public')->delete($filePath);
        }

        return $this->documentRepository->delete($id);
    }

    /**
     * Tạo ResourceEdit với action xóa cho document đã được approve
     */
    private function createDeleteResourceEdit($document)
    {
        // Tạo một ResourceEdit với edited_file_url = null để đánh dấu là xóa
        \App\Models\ResourceEdit::create([
            'resources_id' => $document->id,
            'edited_title' => null,
            'edited_file_url' => null, // null có nghĩa là xóa
            'is_preview' => $document->is_preview,
            'status' => 'pending',
            'note' => 'Yêu cầu xóa tài liệu'
        ]);
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
    /**
     * Tạo yêu cầu chỉnh sửa document từ chunk upload
     *
     * @param array $data
     * @param string $fileName
     * @param string $extension
     * @param int $resourceId
     * @return array
     */
    public function createDocumentEditFromChunk(array $data, string $fileName, string $extension, int $resourceId): array
    {
        try {
            // Validate file type
            $allowedTypes = ['pdf', 'doc', 'docx'];
            if (!in_array(strtolower($extension), $allowedTypes)) {
                return [
                    'success' => false,
                    'message' => 'File type không được hỗ trợ. Chỉ chấp nhận: ' . implode(', ', $allowedTypes)
                ];
            }

            // Chuẩn bị dữ liệu cho resource_edits
            $editData = [
                'resources_id' => $resourceId,
                'edited_title' => $data['title'] ?? null,
                'edited_file_url' => 'storage/documents/' . $fileName,
                'is_preview' => $data['is_preview'] ?? false,
                'status' => ResourceEdit::STATUS_PENDING,
                'note' => $data['note'] ?? null,
            ];

            // Tạo record trong resource_edits
            $resourceEdit = ResourceEdit::create($editData);

            return [
                'success' => true,
                'message' => 'Yêu cầu chỉnh sửa tài liệu đã được tạo thành công!',
                'resource_edit' => $resourceEdit
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi tạo yêu cầu chỉnh sửa tài liệu: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra khi tạo yêu cầu chỉnh sửa: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Tạo yêu cầu chỉnh sửa document chỉ title và preview (không có file)
     *
     * @param array $data
     * @param int $resourceId
     * @return array
     */
    public function createDocumentEditWithoutFile(array $data, int $resourceId): array
    {
        try {
            // Chuẩn bị dữ liệu cho resource_edits
            $editData = [
                'resources_id' => $resourceId,
                'edited_title' => $data['title'] ?? null,
                'edited_file_url' => null, // Không có file mới
                'is_preview' => $data['is_preview'] ?? false,
                'status' => ResourceEdit::STATUS_PENDING,
                'note' => $data['note'] ?? null,
            ];

            // Tạo record trong resource_edits
            $resourceEdit = ResourceEdit::create($editData);

            return [
                'success' => true,
                'message' => 'Yêu cầu chỉnh sửa tài liệu đã được tạo thành công!',
                'resource_edit' => $resourceEdit
            ];
        } catch (\Exception $e) {
            Log::error('Lỗi khi tạo yêu cầu chỉnh sửa tài liệu: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra khi tạo yêu cầu chỉnh sửa: ' . $e->getMessage()
            ];
        }
    }
}