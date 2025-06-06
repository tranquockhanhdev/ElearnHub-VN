<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'name',
        'slug',
    ];
    public $timestamps = true;

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_categories', 'category_id', 'course_id');
    }
}
