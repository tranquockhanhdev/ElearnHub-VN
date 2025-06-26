<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstructorRequest;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
    public function store(Request $request, $courseId)
    {
        try {
            // Validate request data
            $validatedData = $request->validate([
                'lesson_id' => 'required|exists:lessons,id',
                'title' => 'required|string|max:255',
                'duration_minutes' => 'required|integer|min:1|max:300',
                'pass_score' => 'required|integer|min:0|max:100',
                'questions' => 'required|array|min:1|max:50',
                'questions.*.question_text' => 'required|string|max:1000',
                'questions.*.option_a' => 'required|string|max:500',
                'questions.*.option_b' => 'required|string|max:500',
                'questions.*.option_c' => 'required|string|max:500',
                'questions.*.option_d' => 'required|string|max:500',
                'questions.*.correct_option' => 'required|in:A,B,C,D',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        }

        try {
            // Kiểm tra quyền sở hữu bài giảng
            $lesson = Lesson::with(['course', 'quiz'])->findOrFail($request->lesson_id);

            if ($lesson->course->instructor_id !== Auth::id()) {
                return redirect()->back()
                    ->withErrors(['lesson_id' => 'Bạn không có quyền thêm quiz cho bài giảng này.'])
                    ->with('error', 'Không có quyền truy cập.');
            }

            // Kiểm tra xem bài giảng đã có quiz chưa
            if ($lesson->quiz) {
                return redirect()->back()
                    ->withErrors(['lesson_id' => 'Bài giảng này đã có quiz.'])
                    ->withInput()
                    ->with('error', 'Bài giảng đã có quiz.');
            }

            // Kiểm tra xem khóa học có thuộc về instructor không
            if ($lesson->course->id != $courseId) {
                return redirect()->back()
                    ->withErrors(['general' => 'Khóa học không hợp lệ.'])
                    ->with('error', 'Khóa học không hợp lệ.');
            }

            DB::beginTransaction();

            // Tạo quiz
            $quiz = Quiz::create([
                'lesson_id' => $validatedData['lesson_id'],
                'title' => $validatedData['title'],
                'duration_minutes' => $validatedData['duration_minutes'],
                'pass_score' => $validatedData['pass_score'],
                'status' => 'draft'
            ]);

            // Tạo câu hỏi
            foreach ($validatedData['questions'] as $index => $questionData) {
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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollback();
            return redirect()->back()
                ->withErrors(['lesson_id' => 'Bài giảng không tồn tại.'])
                ->withInput()
                ->with('error', 'Bài giảng không tồn tại.');
        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollback();
            Log::error('Database error when creating quiz: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['general' => 'Lỗi cơ sở dữ liệu. Vui lòng thử lại sau.'])
                ->withInput()
                ->with('error', 'Lỗi cơ sở dữ liệu.');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating quiz: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['general' => 'Có lỗi xảy ra khi tạo quiz. Vui lòng thử lại.'])
                ->withInput()
                ->with('error', 'Có lỗi xảy ra khi tạo quiz.');
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
    public function update(InstructorRequest $request, Quiz $quiz)
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
                return redirect()->back()
                    ->withErrors(['general' => 'Bạn không có quyền xóa quiz này.'])
                    ->with('error', 'Không có quyền truy cập.');
            }

            DB::beginTransaction();

            $quiz->delete(); // Cascade delete sẽ xóa luôn câu hỏi

            DB::commit();

            return redirect()->back()->with('success', 'Xóa quiz thành công!');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Quiz không tồn tại.'])
                ->with('error', 'Quiz không tồn tại.');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error deleting quiz: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['general' => 'Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.'])
                ->with('error', 'Có lỗi xảy ra khi xóa quiz.');
        }
    }
}
