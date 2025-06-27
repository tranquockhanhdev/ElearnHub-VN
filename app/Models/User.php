<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Role;
use App\Models\Instructor;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'role_id',
        'email',
        'password',
        'name',
        'phone',
        'status',
        'email_verified_at',
    ];

    public $timestamps = true;

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function courses() // nếu là instructor
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    public function enrollments() // nếu là student
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }
    public function lessonProgress()
    {
        return $this->hasMany(LessonProgress::class, 'student_id');
    }
    public function instructor()
    {
        return $this->hasOne(Instructor::class, 'user_id');
    }

    public function courseEdits()
    {
        return $this->hasMany(CourseEdit::class, 'submitted_by');
    }
}
