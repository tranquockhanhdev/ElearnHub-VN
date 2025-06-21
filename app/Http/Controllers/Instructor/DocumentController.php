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
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $courseId, $lessonId)
    {
        // Validate request
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required', // Có thể là file hoặc URL
            'is_preview' => 'nullable|boolean',
        ]);

        // Validate thêm cho file
        if ($request->hasFile('file')) {
            $request->validate([
                'file' => 'file|mimes:pdf,doc,docx|max:10240', // 10MB
            ]);
            $validatedData['file'] = $request->file('file');
        } elseif ($request->filled('file')) {
            // Nếu là URL string
            $request->validate([
                'file' => 'url',
            ]);
            $validatedData['file'] = $request->input('file');
        } else {
            return back()->withErrors(['file' => 'File hoặc URL là bắt buộc']);
        }

        try {
            // Kiểm tra quyền truy cập course
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);

            // Kiểm tra lesson thuộc course
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Thêm lesson_id vào data
            $validatedData['lesson_id'] = $lessonId;

            // Tạo document
            $document = $this->documentService->createDocument($validatedData);

            return Redirect::back()->with('success', 'Tài liệu đã được thêm thành công!');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi thêm tài liệu: ' . $e->getMessage()]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Resource $resource)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resource $resource)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resource $resource)
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
}
