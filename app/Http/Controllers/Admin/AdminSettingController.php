<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Website\UpdateWebsiteSettingRequest;
use App\Http\Requests\Admin\Website\UploadLogoRequest;
use App\Services\Admin\Website\WebsiteSettingService;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdminSettingController extends Controller
{
    protected $service;

    public function __construct(WebsiteSettingService $service)
    {
        $this->service = $service;
    }

    /**
     * Hiển thị trang cài đặt website
     */
    public function index()
    {
        return Inertia::render('Admin/Website/Settings', [
            'setting' => $this->service->getOrCreate(),
            'admin' => Auth::user(),
            'admins' => User::where('role_id', 1)->get(),
        ]);
    }

    /**
     * Cập nhật thông tin cấu hình website
     */
    public function update(UpdateWebsiteSettingRequest $request)
    {
        $data = $request->validated();

        // Thêm user_id của admin hiện tại
        $data['user_id'] = Auth::id();

        $this->service->update($data);

        return redirect()->back()->with('success', 'Cập nhật cấu hình thành công.');
    }

    /**
     * Upload logo website
     */
    public function uploadLogo(UploadLogoRequest $request)
    {
        $url = $this->service->uploadLogo(
            $request->file('site_logo'),
            Auth::id() // Thêm user_id của admin hiện tại
        );

        return redirect()->back()->with('success', 'Cập nhật logo thành công.');
    }

    /**
     * Xóa logo website
     */
    public function removeLogo()
    {
        $this->service->removeLogo(Auth::id()); // Thêm user_id của admin hiện tại

        return redirect()->back()->with('success', 'Logo đã được xóa.');
    }
}
