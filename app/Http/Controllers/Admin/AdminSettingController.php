<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\WebsiteSetting;
class AdminSettingController extends Controller
{
     public function index()
    {
        // Lấy thông tin cấu hình website (bản ghi đầu tiên)
        $setting = WebsiteSetting::first();

        // Lấy tài khoản admin đầu tiên (role_id = 1)
        $admin = User::where('role_id', 1)->first();
        $admins = User::where('role_id', 1)->get();

       return Inertia::render('Admin/Website/Settings', [
            'setting' => $setting,
            'admin' => $admin,
            'admins' => $admins,
            ]);
    }
}