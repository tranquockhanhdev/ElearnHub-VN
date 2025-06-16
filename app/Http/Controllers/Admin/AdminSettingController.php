<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
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
     public function update(Request $request)
    {
        $request->validate([
            'site_name' => 'required|string|max:255',
            'contact_email' => 'required|email',
            'support_phone' => 'nullable|string|max:50',
            'facebook_url' => 'nullable|url',
            'footer_text' => 'nullable|string',
            'maintenance_mode' => 'required|boolean',
        ]);

        $setting = WebsiteSetting::first() ?? new WebsiteSetting();
        $setting->fill($request->only([
            'site_name',
            'contact_email',
            'support_phone',
            'facebook_url',
            'footer_text',
            'maintenance_mode',
        ]));
        $setting->save();

        return redirect()->back()->with('success', 'Website settings updated successfully.');
    }

    public function uploadLogo(Request $request)
{
    $request->validate([
        'site_logo' => 'required|image|mimes:jpg,jpeg,png,svg|max:2048',
    ]);

    if ($request->hasFile('site_logo')) {
        // Lưu vào storage/app/public/site_logos
        $path = $request->file('site_logo')->store('site_logos', 'public');

        // Tạo URL hiển thị: /storage/site_logos/filename.png
        $url = '/storage/' . $path;

        // Lưu vào DB
        $setting = WebsiteSetting::first() ?? new WebsiteSetting();
        $setting->site_logo_url = $url;
        $setting->save();

        return redirect()->back()->with('success', 'Logo updated successfully.');
    }

    return redirect()->back()->withErrors(['site_logo' => 'File upload failed.']);
}

public function removeLogo(Request $request)
{
    $setting = WebsiteSetting::first();

    if ($setting && $setting->site_logo_url) {
        // Lấy đúng tên file từ URL
        $fileName = basename($setting->site_logo_url); // chỉ lấy tên file

        $filePath = 'site_logos/' . $fileName;

        // Ghi log để debug nếu cần
        Log::info("Trying to delete: " . $filePath);

        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            Log::info("Deleted logo file: " . $filePath);
        } else {
            Log::warning("File not found: " . $filePath);
        }

        $setting->site_logo_url = null;
        $setting->save();

        return redirect()->back()->with('success', 'Logo removed successfully.');
    }

    return redirect()->back()->withErrors(['site_logo' => 'No logo to remove.']);
}
}