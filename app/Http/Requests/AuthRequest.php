<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $rules = [
            'login.store' => [
                'email' => 'required|email|exists:users,email',
                'password' => 'required|min:8',
            ],
            'register.store' => [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8|confirmed',
            ],
            'password.forgot' => [
                'email' => 'required|email|exists:users,email',
            ],
            'password.reset' => [
                'token' => 'required',
                'password' => 'required|min:6|confirmed',
            ],
        ];
        return $rules[$this->route()->getName()] ?? [];
    }

    public function messages()
    {
        return [
            'name.required' => 'Họ và tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.exists' => 'Email không tồn tại trong hệ thống.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã được sử dụng, nếu email của bạn chưa kích hoạt, vui lòng kiểm tra hộp thư đến hoặc thư mục spam.',
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
        ];
    }
}
