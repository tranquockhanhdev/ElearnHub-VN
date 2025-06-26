<?php

namespace App\Http\Requests\Admin\Website;

use Illuminate\Foundation\Http\FormRequest;

class UploadLogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'site_logo' => 'required|mimes:jpg,jpeg,png,svg|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'site_logo.required' => 'Vui lòng chọn tệp logo để tải lên.',
            'site_logo.image'    => 'Tệp phải là hình ảnh.',
            'site_logo.mimes'    => 'Logo chỉ được phép định dạng: jpg, jpeg, png, svg.',
            'site_logo.max'      => 'Logo không được vượt quá 2MB.',
        ];
    }

    public function attributes(): array
    {
        return [
            'site_logo' => 'Logo website',
        ];
    }
}