<?php

namespace App\Http\Requests\Admin\Website;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWebsiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'site_name'         => 'required|string|max:255',
            'contact_email'     => 'required|email',
            'support_phone'     => 'nullable|string|max:50',
            'facebook_url'      => 'nullable|url',
            'footer_text'       => 'nullable|string',
            'maintenance_mode'  => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'site_name.required'         => 'Tên website là bắt buộc.',
            'site_name.max'              => 'Tên website không được vượt quá :max ký tự.',
            'contact_email.required'     => 'Email liên hệ là bắt buộc.',
            'contact_email.email'        => 'Email liên hệ không đúng định dạng.',
            'support_phone.string'       => 'Số điện thoại phải là chuỗi.',
            'support_phone.max'          => 'Số điện thoại không được vượt quá :max ký tự.',
            'facebook_url.url'           => 'Đường dẫn Facebook không hợp lệ.',
            'maintenance_mode.required'  => 'Trạng thái bảo trì là bắt buộc.',
            'maintenance_mode.boolean'   => 'Trạng thái bảo trì phải là true hoặc false.',
        ];
    }

    public function attributes(): array
    {
        return [
            'site_name'         => 'Tên website',
            'contact_email'     => 'Email liên hệ',
            'support_phone'     => 'Số điện thoại hỗ trợ',
            'facebook_url'      => 'Địa chỉ Facebook',
            'footer_text'       => 'Nội dung footer',
            'maintenance_mode'  => 'Chế độ bảo trì',
        ];
    }
}