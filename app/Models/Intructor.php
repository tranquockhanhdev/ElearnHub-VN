<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Intructor extends Model
{
    use HasFactory;

    protected $table = 'instructors';

    protected $fillable = [
        'user_id',
        'bio',
        'avatar',
        'profession',
        'facebook_url',
        'twitter_url',
        'linkedin_url',
    ];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
