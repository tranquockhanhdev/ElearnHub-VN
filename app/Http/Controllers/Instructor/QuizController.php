<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
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
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'pass_score' => 'required|integer|min:0|max:100',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.option_a' => 'required|string',
            'questions.*.option_b' => 'required|string',
            'questions.*.option_c' => 'required|string',
            'questions.*.option_d' => 'required|string',
            'questions.*.correct_option' => 'required|in:A,B,C,D'
        ]);

        // Kiểm tra quyền sở hữu bài giảng
        $lesson = Lesson::with('course')->findOrFail($request->lesson_id);
        if ($lesson->course->instructor_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền thêm quiz cho bài giảng này.');
        }

        // Kiểm tra xem bài giảng đã có quiz chưa
        if ($lesson->quiz) {
            return redirect()->back()->withErrors(['general' => 'Bài giảng này đã có quiz.']);
        }

        try {
            DB::beginTransaction();

            // Tạo quiz
            $quiz = Quiz::create([
                'lesson_id' => $request->lesson_id,
                'title' => $request->title,
                'duration_minutes' => $request->duration_minutes,
                'pass_score' => $request->pass_score
            ]);

            // Tạo câu hỏi
            foreach ($request->questions as $questionData) {
                QuizQuestion::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $questionData['question_text'],
                    'option_a' => $questionData['option_a'],
                    'option_b' => $questionData['option_b'],
                    'option_c' => $questionData['option_c'],
                    'option_d' => $questionData['option_d'],
                    'correct_option' => $questionData['correct_option']
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Thêm quiz thành công!');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi tạo quiz.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Quiz $quiz)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quiz $quiz)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quiz $quiz)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $quiz = Quiz::with('lesson.course')->findOrFail($id);

            // Kiểm tra quyền sở hữu
            if ($quiz->lesson->course->instructor_id !== Auth::id()) {
                abort(403, 'Bạn không có quyền xóa quiz này.');
            }

            $quiz->delete(); // Cascade delete sẽ xóa luôn câu hỏi

            return redirect()->back()->with('success', 'Xóa quiz thành công!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Có lỗi xảy ra khi xóa quiz.']);
        }
    }
}
