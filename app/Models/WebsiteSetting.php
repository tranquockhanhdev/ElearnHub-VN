<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    use HasFactory;

    protected $table = 'website_settings';

    // protected $guarded = []; // Mở nếu muốn tắt bảo vệ mass assignment

    protected $fillable = [
        'site_name',
        'contact_email',
        'site_logo_url',
        'homepage_banner',
        'footer_text',
        'facebook_url',
        'support_phone',
        'maintenance_mode',
    ];

    public $timestamps = true;
}
