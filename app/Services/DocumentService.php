<?php

namespace App\Services;

use App\Repositories\DocumentRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $maxOrder = $this->documentRepository->getMaxOrderByLesson($data['lesson_id']);
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
}
