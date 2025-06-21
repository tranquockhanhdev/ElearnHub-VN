<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Services\LessonService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\Lesson;

class LessonController extends Controller
{
    protected $lessonService;

    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'order' => 'required|integer|min:1'
        ]);

        // Kiểm tra quyền sở hữu khóa học
        $course = Course::findOrFail($request->course_id);
        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền thêm bài giảng cho khóa học này.');
        }

        try {
            $result = $this->lessonService->createLesson($request->all());

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }

            return redirect()->back()->withErrors(['general' => $result['message']]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi tạo bài giảng.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Lesson $lesson)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lesson $lesson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'required|integer|min:1'
        ]);

        try {
            $result = $this->lessonService->updateLesson($id, $request->all());

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }

            return redirect()->back()->withErrors(['general' => $result['message']]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi cập nhật bài giảng.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $result = $this->lessonService->deleteLesson($id);

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }

            return redirect()->back()->withErrors(['general' => $result['message']]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi xóa bài giảng.']);
        }
    }
}
