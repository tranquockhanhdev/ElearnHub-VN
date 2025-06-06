<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

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
}
