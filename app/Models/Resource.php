<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $table = 'resources';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'lesson_id',
        'type',
        'title',
        'file_url',
        'file_type',
        'is_preview',
        'order',
        'status',
        'note',
        'encrypted_path',
        'decrypt_key',
        'is_encrypted'
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'is_encrypted' => 'boolean'
    ];

    public $timestamps = true;

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
    public function edits()
    {
        return $this->hasMany(ResourceEdit::class, 'resources_id');
    }
}
