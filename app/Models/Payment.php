<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'student_id',
        'course_id',
        'payment_method_id',
        'amount',
        'status',
        'payment_time',
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

    public function method()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}
