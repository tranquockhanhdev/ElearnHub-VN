<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInstructorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bio' => 'nullable|string|max:2000',
            'profession' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'facebook_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'bio.string' => 'Mô tả không hợp lệ.',
            'profession.string' => 'Nghề nghiệp không hợp lệ.',
            'avatar.image' => 'Tệp phải là hình ảnh.',
            'avatar.mimes' => 'Ảnh phải có định dạng jpeg, png, jpg, gif, svg.',
            'avatar.max' => 'Ảnh đại diện không được vượt quá 2MB.',
            'facebook_url.url' => 'Liên kết Facebook không hợp lệ.',
            'twitter_url.url' => 'Liên kết Twitter không hợp lệ.',
            'linkedin_url.url' => 'Liên kết LinkedIn không hợp lệ.',
        ];
    }
}