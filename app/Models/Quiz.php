<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $table = 'quizzes';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'lesson_id',
        'title',
        'duration_minutes',
        'pass_score',
        'status',
    ];

    public $timestamps = true;

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    // Accessor to get questions count
    public function getQuestionsCountAttribute()
    {
        return $this->questions()->count();
    }

    // Get best attempt for a student
    public function getBestAttemptForStudent($studentId)
    {
        return $this->attempts()
            ->where('student_id', $studentId)
            ->orderBy('score_percent', 'desc')
            ->first();
    }

    // Get latest attempt for a student  
    public function getLatestAttemptForStudent($studentId)
    {
        return $this->attempts()
            ->where('student_id', $studentId)
            ->latest()
            ->first();
    }

    // Get attempt count for a student
    public function getAttemptCountForStudent($studentId)
    {
        return $this->attempts()
            ->where('student_id', $studentId)
            ->count();
    }
}
