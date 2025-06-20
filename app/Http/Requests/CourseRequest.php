<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
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
            'instructor.courses.store' => [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category_ids' => 'required|array|min:1',
                'category_ids.*' => 'exists:categories,id',
                'price' => 'required|numeric|min:0',
                'course_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'instructor_id' => 'required|exists:users,id',
                'status' => 'required|in:active,inactive,suspended,pending',
            ],
        ];
        return $rules[$this->route()->getName()] ?? [];
    }
    public function messages()
    {
        return [
            'title.required' => 'Vui lòng nhập tiêu đề khóa học.',
            'title.string' => 'Tiêu đề phải là chuỗi văn bản.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',

            'description.required' => 'Vui lòng nhập mô tả cho khóa học.',
            'description.string' => 'Mô tả phải là văn bản.',

            'category_ids.required' => 'Vui lòng chọn ít nhất một danh mục.',
            'category_ids.array' => 'Danh mục phải là một danh sách.',
            'category_ids.*.exists' => 'Danh mục đã chọn không hợp lệ.',

            'price.required' => 'Vui lòng nhập giá khóa học.',
            'price.numeric' => 'Giá phải là một số.',
            'price.min' => 'Giá không được nhỏ hơn 0.',

            'course_image.image' => 'Tệp tải lên phải là hình ảnh.',
            'course_image.image' => 'Vui lòng tải lên một tệp hình ảnh.',
            'course_image.mimes' => 'Ảnh phải có định dạng: jpeg, png, jpg, gif, hoặc svg.',
            'course_image.max' => 'Dung lượng ảnh tối đa là 2MB.',

            'instructor_id.required' => 'Thiếu thông tin giảng viên.',
            'instructor_id.exists' => 'Giảng viên không tồn tại trong hệ thống.',
            'status.required' => 'Vui lòng chọn trạng thái khóa học.',
            'status.in' => 'Trạng thái không hợp lệ.',
        ];
    }
}