<?php

namespace App\Repositories\Admin\Website;

use App\Models\WebsiteSetting;

class WebsiteSettingRepository
{
    protected $model;

    public function __construct(WebsiteSetting $model)
    {
        $this->model = $model;
    }

    /**
     * Lấy bản ghi cấu hình đầu tiên (hoặc tạo mới nếu chưa tồn tại)
     */
    public function getOrCreate(): WebsiteSetting
    {
        return $this->model->first() ?? new WebsiteSetting();
    }

    /**
     * Lấy cấu hình theo user_id
     */
    public function getByUserId(int $userId): ?WebsiteSetting
    {
        return $this->model->where('user_id', $userId)->first();
    }

    /**
     * Lấy cấu hình chung (global settings)
     */
    public function getGlobalSettings(): ?WebsiteSetting
    {
        return $this->model->whereNull('user_id')->first();
    }

    /**
     * Cập nhật dữ liệu cài đặt website
     */
    public function update(array $data): WebsiteSetting
    {
        $setting = $this->getOrCreate();
        $setting->fill($data);
        $setting->save();

        return $setting;
    }

    /**
     * Cập nhật cấu hình theo user_id
     */
    public function updateByUserId(int $userId, array $data): WebsiteSetting
    {
        $setting = $this->getByUserId($userId);

        if (!$setting) {
            $setting = new WebsiteSetting();
            $setting->user_id = $userId;
        }

        $setting->fill($data);
        $setting->save();

        return $setting;
    }

    /**
     * Cập nhật URL logo
     */
    public function updateLogoUrl(string $url, int $userId = null): WebsiteSetting
    {
        if ($userId) {
            $setting = $this->getByUserId($userId);
            if (!$setting) {
                $setting = new WebsiteSetting();
                $setting->user_id = $userId;
            }
        } else {
            $setting = $this->getOrCreate();
        }

        $setting->site_logo_url = $url;
        $setting->save();

        return $setting;
    }

    /**
     * Xóa logo
     */
    public function removeLogo(int $userId = null): WebsiteSetting
    {
        if ($userId) {
            $setting = $this->getByUserId($userId);
            if (!$setting) {
                $setting = new WebsiteSetting();
                $setting->user_id = $userId;
            }
        } else {
            $setting = $this->getOrCreate();
        }

        $setting->site_logo_url = null;
        $setting->save();

        return $setting;
    }
}
