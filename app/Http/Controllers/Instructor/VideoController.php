<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\Course;
use App\Services\VideoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

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
        // Validate request
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required', // Có thể là file hoặc URL
            'is_preview' => 'nullable|boolean',
        ]);

        // Validate thêm cho file
        if ($request->hasFile('file')) {
            $request->validate([
                'file' => 'file|mimes:mp4,avi,mov,wmv|max:102400', // 100MB
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
            // Kiểm tra quyền truy cập course
            $course = Course::where('instructor_id', Auth::id())->findOrFail($courseId);

            // Kiểm tra lesson thuộc course
            $lesson = $course->lessons()->findOrFail($lessonId);

            // Thêm lesson_id vào data
            $validatedData['lesson_id'] = $lessonId;

            // Tạo video
            $video = $this->videoService->createVideo($validatedData);

            return Redirect::back()->with('success', 'Video đã được thêm thành công!');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi thêm video: ' . $e->getMessage()]);
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
