<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\CourseEditStatus;

class CourseEdit extends Model
{
    use HasFactory;

    protected $table = 'course_edits';

    /** Nếu muốn mass-assign */
    protected $fillable = [
        'course_id',
        'submitted_by',
        'edited_title',
        'edited_description',
        'edited_price',
        'edited_img_url',
        'status',
        'note',
    ];

    /**  ENUM cast (Laravel ≥10)  */
    protected $casts = [
        'status' => CourseEditStatus::class,
    ];
    public $timestamps = true;
    /* ──────────────── Relationships ──────────────── */

    // Khóa ngoại `course_id`
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // Khóa ngoại `submitted_by`
    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'course_edit_categories', 'course_edit_id', 'category_id');
    }
}
