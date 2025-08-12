<?php

namespace App\Services\Admin\Website;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Repositories\Admin\Website\WebsiteSettingRepository;
use Illuminate\Http\UploadedFile;

class WebsiteSettingService
{
    protected $repository;

    public function __construct(WebsiteSettingRepository $repository)
    {
        $this->repository = $repository;
    }
    public function getOrCreate()
    {
        return $this->repository->getOrCreate();
    }

    /**
     * Lấy cấu hình theo user_id
     */
    public function getByUserId(int $userId)
    {
        return $this->repository->getByUserId($userId);
    }

    /**
     * Lấy cấu hình chung (global settings)
     */
    public function getGlobalSettings()
    {
        return $this->repository->getGlobalSettings();
    }

    /**
     * Cập nhật thông tin cấu hình website
     */
    public function update(array $data)
    {
        return $this->repository->update($data);
    }

    /**
     * Cập nhật cấu hình theo user_id
     */
    public function updateByUserId(int $userId, array $data)
    {
        return $this->repository->updateByUserId($userId, $data);
    }

    /**
     * Upload và lưu logo, trả về URL logo mới
     */
    public function uploadLogo(UploadedFile $file, int $userId = null): string
    {
        // Lưu file vào thư mục storage/app/public/site_logos
        $path = $file->store('site_logos', 'public');

        // Tạo đường dẫn public
        $url = '/storage/' . $path;

        // Cập nhật vào DB
        $this->repository->updateLogoUrl($url, $userId);

        return $url;
    }

    /**
     * Xóa logo khỏi storage và database
     */
    public function removeLogo(int $userId = null): void
    {
        if ($userId) {
            $setting = $this->repository->getByUserId($userId);
        } else {
            $setting = $this->repository->getOrCreate();
        }

        if ($setting && $setting->site_logo_url) {
            $fileName = basename($setting->site_logo_url);
            $filePath = 'site_logos/' . $fileName;

            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
                Log::info("Logo deleted: " . $filePath);
            } else {
                Log::warning("Logo not found: " . $filePath);
            }

            $this->repository->removeLogo($userId);
        }
    }
}