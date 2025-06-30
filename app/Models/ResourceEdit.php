<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceEdit extends Model
{
    use HasFactory;

    protected $table = 'resources_edits';

    protected $fillable = [
        'resources_id',
        'edited_title',
        'edited_file_url',
        'edited_file_type',
        'is_preview',
        'status',
        'note',
        'created_at',
        'updated_at',
    ];

    // Enum cho status
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_DRAFT = 'draft';

    protected $casts = [
        'is_preview' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class, 'resources_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }
    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }
}