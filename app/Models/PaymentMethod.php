<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $table = 'payment_methods';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'name',
        'code',
        'is_active',
        'config_json',
    ];

    public $timestamps = true;

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
