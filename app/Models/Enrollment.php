<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'student_id',
        'course_id',
        'payment_id',
        'enrolled_at',
        'status'
    ];

    public $timestamps = true;

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}