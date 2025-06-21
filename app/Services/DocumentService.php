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

    public function createDocument(array $data)
    {
        // Tính order mới
        $maxOrder = $this->documentRepository->getMaxOrderByLesson($data['lesson_id']);
        $newOrder = $maxOrder + 1;

        // Xử lý file hoặc URL
        $fileData = $this->processFile($data['file'], $data['title']);

        // Chuẩn bị dữ liệu để lưu
        $documentData = [
            'lesson_id' => $data['lesson_id'],
            'type' => 'document',
            'title' => $data['title'],
            'file_url' => $fileData['file_url'],
            'file_type' => $fileData['file_type'],
            'is_preview' => $data['is_preview'] ?? 0,
            'order' => $newOrder,
        ];

        return $this->documentRepository->create($documentData);
    }

    private function processFile($file, $title)
    {
        // Nếu là URL string
        if (is_string($file) && filter_var($file, FILTER_VALIDATE_URL)) {
            return [
                'file_url' => $file,
                'file_type' => 'pdf' // Mặc định là pdf cho URL
            ];
        }

        // Nếu là uploaded file
        if ($file instanceof UploadedFile) {
            // Lấy extension
            $extension = strtolower($file->getClientOriginalExtension());

            // Validate file type
            $allowedTypes = ['pdf', 'doc', 'docx'];
            if (!in_array($extension, $allowedTypes)) {
                throw new \InvalidArgumentException('File type không được hỗ trợ. Chỉ chấp nhận: ' . implode(', ', $allowedTypes));
            }

            // Tạo tên file unique
            $fileName = Str::slug($title) . '_' . time() . '.' . $extension;

            // Lưu file vào storage/app/public/documents
            $filePath = $file->storeAs('documents', $fileName, 'public');

            return [
                'file_url' => 'storage/' . $filePath,
                'file_type' => $extension
            ];
        }

        throw new \InvalidArgumentException('File không hợp lệ');
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
