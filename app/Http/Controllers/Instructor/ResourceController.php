<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstructorRequest;
use App\Models\Resource;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    public function store(InstructorRequest $request)
    {
        // Kiểm tra quyền sở hữu bài giảng
        $lesson = Lesson::with('course')->findOrFail($request->lesson_id);
        if ($lesson->course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền thêm tài liệu cho bài giảng này.');
        }

        try {
            $file = $request->file('file');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            // Lưu file vào thư mục tương ứng
            $folder = $request->type === 'video' ? 'lesson_videos' : 'lesson_documents';
            $filePath = $file->storeAs($folder, $fileName, 'public');

            // Xác định file type
            $fileType = $file->getClientOriginalExtension();

            // Lấy order tiếp theo
            $nextOrder = Resource::where('lesson_id', $request->lesson_id)->max('order') + 1;

            Resource::create([
                'lesson_id' => $request->lesson_id,
                'type' => $request->type,
                'title' => $request->title,
                'file_url' => $filePath,
                'file_type' => $fileType,
                'is_preview' => $request->boolean('is_preview'),
                'order' => $nextOrder
            ]);

            return redirect()->back()->with('success', 'Thêm tài liệu thành công!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi thêm tài liệu.']);
        }
    }

    public function destroy($id)
    {
        try {
            $resource = Resource::with('lesson.course')->findOrFail($id);

            // Kiểm tra quyền sở hữu
            if ($resource->lesson->course->instructor_id !== Auth::id()) {
                abort(403, 'Bạn không có quyền xóa tài liệu này.');
            }

            // Xóa file
            if (Storage::disk('public')->exists($resource->file_url)) {
                Storage::disk('public')->delete($resource->file_url);
            }

            $resource->delete();

            return redirect()->back()->with('success', 'Xóa tài liệu thành công!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi xóa tài liệu.']);
        }
    }
}
