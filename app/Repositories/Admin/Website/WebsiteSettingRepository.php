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
     * Cập nhật URL logo
     */
    public function updateLogoUrl(string $url): WebsiteSetting
    {
        $setting = $this->getOrCreate();
        $setting->site_logo_url = $url;
        $setting->save();

        return $setting;
    }

    /**
     * Xóa logo
     */
    public function removeLogo(): WebsiteSetting
    {
        $setting = $this->getOrCreate();
        $setting->site_logo_url = null;
        $setting->save();

        return $setting;
    }
}