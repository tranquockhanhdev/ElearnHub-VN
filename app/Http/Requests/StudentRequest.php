<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
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
            // Dashboard & Profile routes
            'student.profile.update' => [
                'name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20',
            ],
            'student.password.update' => [
                'current_password' => 'required',
                'password' => 'required|min:8|confirmed',
            ],

            // Checkout routes
            'student.checkout.process' => [
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'student_id' => 'required|integer',
                'course_id' => 'required|integer',
                'payment_method_id' => 'required|integer|exists:payment_methods,id',
                'country' => 'required|string|max:2'
            ],

            // Progress tracking routes - Không cần validate route parameters
            'student.resource.complete' => [],
            'student.lesson.complete' => [],

            // Course filters
            'student.courselist' => [
                'search' => 'nullable|string|max:255',
                'category' => 'nullable|integer|exists:categories,id',
                'status' => 'nullable|in:in_progress,completed,not_started',
                'sort' => 'nullable|in:name,progress,enrolled_at',
                'order' => 'nullable|in:asc,desc',
                'per_page' => 'nullable|integer|min:1|max:50',
            ],

            // Payment filters
            'student.payments' => [
                'status' => 'nullable|in:pending,completed,failed',
                'search' => 'nullable|string|max:255',
            ],
        ];

        return $rules[$this->route()->getName()] ?? [];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            // Profile validation messages
            'name.required' => 'Họ và tên là bắt buộc.',
            'name.string' => 'Họ và tên phải là chuỗi ký tự.',
            'name.max' => 'Họ và tên không được vượt quá 255 ký tự.',
            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',

            // Password validation messages
            'current_password.required' => 'Mật khẩu hiện tại là bắt buộc.',
            'password.required' => 'Mật khẩu mới là bắt buộc.',
            'password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',

            // Checkout validation messages
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'student_id.required' => 'ID học viên là bắt buộc.',
            'student_id.integer' => 'ID học viên phải là số nguyên.',
            'course_id.required' => 'ID khóa học là bắt buộc.',
            'course_id.integer' => 'ID khóa học phải là số nguyên.',
            'payment_method_id.required' => 'Phương thức thanh toán là bắt buộc.',
            'payment_method_id.integer' => 'ID phương thức thanh toán phải là số nguyên.',
            'payment_method_id.exists' => 'Phương thức thanh toán không tồn tại.',
            'country.required' => 'Quốc gia là bắt buộc.',
            'country.string' => 'Quốc gia phải là chuỗi ký tự.',
            'country.max' => 'Mã quốc gia không được vượt quá 2 ký tự.',

            // Progress tracking validation messages
            'courseId.required' => 'ID khóa học là bắt buộc.',
            'courseId.integer' => 'ID khóa học phải là số nguyên.',
            'courseId.exists' => 'Khóa học không tồn tại.',
            'resourceId.required' => 'ID tài nguyên là bắt buộc.',
            'resourceId.integer' => 'ID tài nguyên phải là số nguyên.',
            'resourceId.exists' => 'Tài nguyên không tồn tại.',
            'lessonId.required' => 'ID bài học là bắt buộc.',
            'lessonId.integer' => 'ID bài học phải là số nguyên.',
            'lessonId.exists' => 'Bài học không tồn tại.',

            // Filter validation messages
            'search.string' => 'Từ khóa tìm kiếm phải là chuỗi ký tự.',
            'search.max' => 'Từ khóa tìm kiếm không được vượt quá 255 ký tự.',
            'category.integer' => 'ID danh mục phải là số nguyên.',
            'category.exists' => 'Danh mục không tồn tại.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'sort.in' => 'Trường sắp xếp không hợp lệ.',
            'order.in' => 'Thứ tự sắp xếp không hợp lệ.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'name' => 'Họ và tên',
            'email' => 'Email',
            'phone' => 'Số điện thoại',
            'current_password' => 'Mật khẩu hiện tại',
            'password' => 'Mật khẩu',
            'student_id' => 'ID học viên',
            'course_id' => 'ID khóa học',
            'payment_method_id' => 'Phương thức thanh toán',
            'country' => 'Quốc gia',
            'courseId' => 'Khóa học',
            'resourceId' => 'Tài nguyên',
            'lessonId' => 'Bài học',
            'search' => 'Từ khóa tìm kiếm',
            'category' => 'Danh mục',
            'status' => 'Trạng thái',
            'sort' => 'Sắp xếp theo',
            'order' => 'Thứ tự',
        ];
    }
}
