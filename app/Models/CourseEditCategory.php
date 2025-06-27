<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseEditCategory extends Model
{
    use HasFactory;

    protected $table = 'course_edit_categories';

    protected $fillable = [
        'course_edit_id',
        'category_id',
    ];

    public $timestamps = true;

    public function courseEdit()
    {
        return $this->belongsTo(CourseEdit::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
