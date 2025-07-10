<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstructorRequest;
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
    public function store(InstructorRequest $request)
    {
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
    public function update(InstructorRequest $request, $id)
    {
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
    public function destroy(Request $request, $id, $lessonId)
    {
        // Kiểm tra quyền sở hữu khóa học
        $course = Course::findOrFail($id);
        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền xóa bài giảng cho khóa học này.');
        }

        try {
            $result = $this->lessonService->deleteLesson($lessonId);

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }

            return redirect()->back()->withErrors(['general' => $result['message']]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi xóa bài giảng.']);
        }
    }
    public function updateStatus(InstructorRequest $request, $courseId, $lessonId)
    {
        // Kiểm tra quyền sở hữu khóa học
        $course = Course::findOrFail($courseId);
        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền cập nhật trạng thái bài giảng cho khóa học này.');
        }

        $lesson = Lesson::findOrFail($lessonId);
        $lesson->status = $request->status;
        $lesson->save();

        return redirect()->back()->with('success', 'Cập nhật trạng thái bài giảng thành công!');
    }
    /**
     * Update the order of lessons.
     */
    public function updateOrder(InstructorRequest $request, $courseId, $lessonId)
    {
        // Kiểm tra quyền sở hữu khóa học
        $course = Course::findOrFail($courseId);
        if ($course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền cập nhật thứ tự bài giảng cho khóa học này.');
        }

        try {
            $result = $this->lessonService->updateLessonOrder($lessonId, $courseId, $request->order);

            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }

            return redirect()->back()->withErrors(['general' => $result['message']]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi cập nhật thứ tự bài giảng.']);
        }
    }
}