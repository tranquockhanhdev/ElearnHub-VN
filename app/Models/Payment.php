<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

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
        'gateway_response',
        'redirect_url',
        'payment_time',
    ];

    public $timestamps = true;
    public function setPaymentTimeAttribute($value)
    {
        if ($value) {
            try {
                // Chuyển đổi từ ISO 8601 sang MySQL datetime
                $this->attributes['payment_time'] = Carbon::parse($value)->format('Y-m-d H:i:s');
            } catch (\Exception $e) {
                $this->attributes['payment_time'] = now();
            }
        } else {
            $this->attributes['payment_time'] = now();
        }
    }
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
