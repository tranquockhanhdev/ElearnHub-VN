<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuizController extends Controller
{
    // Hiển thị trang làm quiz
    public function show($quizId)
    {
        $quiz = Quiz::with(['lesson.course', 'questions'])
            ->findOrFail($quizId);

        // Kiểm tra quyền truy cập
        $enrollment = Enrollment::where('student_id', Auth::id())
            ->where('course_id', $quiz->lesson->course_id)
            ->first();

        if (!$enrollment) {
            return redirect()->route('student.dashboard')
                ->with('error', 'Bạn chưa đăng ký khóa học này');
        }

        // Lấy số lần đã làm quiz
        $attemptCount = QuizAttempt::where('quiz_id', $quizId)
            ->where('student_id', Auth::id())
            ->count();

        // Lấy attempt tốt nhất
        $bestAttempt = QuizAttempt::where('quiz_id', $quizId)
            ->where('student_id', Auth::id())
            ->orderBy('score_percent', 'desc')
            ->first();

        // Trộn thứ tự câu hỏi
        $questions = $quiz->questions->shuffle();

        return Inertia::render('Students/Quiz/Show', [
            'quiz' => $quiz,
            'questions' => $questions,
            'course' => $quiz->lesson->course,
            'attemptCount' => $attemptCount,
            'bestAttempt' => $bestAttempt,
            'timeLimit' => $quiz->duration_minutes * 60, // Convert to seconds
        ]);
    }

    // Nộp bài quiz
    public function submit(Request $request, $quizId)
    {
        $quiz = Quiz::with(['questions', 'lesson.course'])->findOrFail($quizId);

        // Kiểm tra quyền truy cập
        $enrollment = Enrollment::where('student_id', Auth::id())
            ->where('course_id', $quiz->lesson->course_id)
            ->first();

        if (!$enrollment) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'answers' => 'required|array',
            'time_taken' => 'required|integer|min:1'
        ]);

        $answers = $request->answers;
        $correctAnswers = 0;
        $totalQuestions = $quiz->questions->count();

        // Tính điểm
        foreach ($quiz->questions as $question) {
            $userAnswer = $answers[$question->id] ?? null;
            if ($userAnswer && strtolower($userAnswer) === strtolower($question->correct_option)) {
                $correctAnswers++;
            }
        }

        $scorePercent = $totalQuestions > 0 ? round(($correctAnswers / $totalQuestions) * 100, 2) : 0;

        // Lưu kết quả
        $attempt = QuizAttempt::create([
            'quiz_id' => $quizId,
            'student_id' => Auth::id(),
            'score_percent' => $scorePercent,
            'attempted_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'attempt_id' => $attempt->id,
            'score' => $scorePercent,
            'correct_answers' => $correctAnswers,
            'total_questions' => $totalQuestions,
            'passed' => $scorePercent >= ($quiz->pass_score ?? 70)
        ]);
    }

    // Xem kết quả quiz
    public function result($quizId)
    {
        $quiz = Quiz::with(['lesson.course', 'questions'])->findOrFail($quizId);

        // Lấy attempt mới nhất
        $latestAttempt = QuizAttempt::where('quiz_id', $quizId)
            ->where('student_id', Auth::id())
            ->latest()
            ->first();

        // Lấy attempt tốt nhất
        $bestAttempt = QuizAttempt::where('quiz_id', $quizId)
            ->where('student_id', Auth::id())
            ->orderBy('score_percent', 'desc')
            ->first();

        // Lấy tất cả attempts
        $allAttempts = QuizAttempt::where('quiz_id', $quizId)
            ->where('student_id', Auth::id())
            ->orderBy('attempted_at', 'desc')
            ->get();

        if (!$latestAttempt) {
            return redirect()->route('student.quiz.show', $quizId)
                ->with('error', 'Bạn chưa làm quiz này');
        }

        // Kiểm tra quyền truy cập
        $enrollment = Enrollment::where('student_id', Auth::id())
            ->where('course_id', $quiz->lesson->course_id)
            ->first();

        if (!$enrollment) {
            return redirect()->route('student.dashboard')
                ->with('error', 'Bạn chưa đăng ký khóa học này');
        }

        $passed = $latestAttempt->score_percent >= ($quiz->pass_score ?? 70);

        return Inertia::render('Students/Quiz/Result', [
            'quiz' => $quiz,
            'latestAttempt' => $latestAttempt,
            'bestAttempt' => $bestAttempt,
            'allAttempts' => $allAttempts,
            'course' => $quiz->lesson->course,
            'passed' => $passed,
            'questions_count' => $quiz->questions->count(),
            'correct_answers' => round(($latestAttempt->score_percent / 100) * $quiz->questions->count())
        ]);
    }
}
