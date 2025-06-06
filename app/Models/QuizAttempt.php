<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $table = 'quiz_attempts';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'quiz_id',
        'student_id',
        'score_percent',
        'attempted_at',
    ];

    public $timestamps = true;

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
