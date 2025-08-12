<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InstructorRequest extends FormRequest
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
            // Dashboard routes
            'instructor.dashboard' => [],
            'instructor.dashboard.revenue-chart' => [
                'period' => 'nullable|in:week,month,quarter,year',
            ],

            // Profile routes
            'instructor.profile.update' => [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string|max:1000',
                'experience' => 'nullable|string|max:1000',
                'specialization' => 'nullable|string|max:500',
                'linkedin' => 'nullable|url|max:255',
                'website' => 'nullable|url|max:255',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ],
            'instructor.profile.change-password' => [
                'current_password' => 'required',
                'new_password' => 'required|min:8|confirmed',
            ],

            // Course routes
            'instructor.courses.store' => [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:5000',
                'price' => 'required|numeric|min:0',
                'level' => 'required|in:beginner,intermediate,advanced',
                'language' => 'required|string|max:50',
                'what_you_will_learn' => 'nullable|array',
                'requirements' => 'nullable|array',
                'course_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'categories' => 'required|array|min:1',
                'categories.*' => 'integer|exists:categories,id',
            ],
            'instructor.courses.update' => [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:5000',
                'price' => 'required|numeric|min:0',
                'level' => 'required|in:beginner,intermediate,advanced',
                'language' => 'required|string|max:50',
                'what_you_will_learn' => 'nullable|array',
                'requirements' => 'nullable|array',
                'course_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'categories' => 'required|array|min:1',
                'categories.*' => 'integer|exists:categories,id',
            ],

            // Course filters
            'instructor.courses.index' => [
                'search' => 'nullable|string|max:255',
                'status' => 'nullable|in:all,draft,pending,approved,rejected',
                'sort' => 'nullable|in:newest,oldest,title,enrollments',
                'per_page' => 'nullable|integer|min:1|max:50',
            ],

            // Lesson routes
            'instructor.courses.lessons.store' => [
                'course_id' => 'required|exists:courses,id',
                'title' => 'required|string|max:255',
                'order' => 'required|integer|min:1',
            ],
            'instructor.courses.lessons.update' => [
                'title' => 'required|string|max:255',
                'order' => 'required|integer|min:1',
            ],
            'instructor.courses.lessons.update-order' => [
                'order' => 'required|integer|min:1',
            ],

            // Video routes
            'instructor.courses.lessons.videos.store' => [
                'title' => 'required|string|max:255',
                'video' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:102400', // 100MB max
                'video_url' => 'nullable|url',
                'duration' => 'nullable|integer|min:1',
                'is_preview' => 'boolean',
                'order' => 'nullable|integer|min:1',
            ],
            'instructor.courses.lessons.videos.update-order' => [
                'order' => 'required|integer|min:1',
            ],

            // Document routes
            'instructor.courses.lessons.documents.chunkUpload' => [
                'file' => 'required|file',
                'chunkIndex' => 'required|integer|min:0',
                'totalChunks' => 'required|integer|min:1',
                'fileName' => 'required|string|max:255',
                'uploadId' => 'required|string|max:100',
            ],
            'instructor.courses.lessons.documents.update-order' => [
                'order' => 'required|integer|min:1',
            ],

            // Quiz routes
            'instructor.courses.quizzes.store' => [
                'lesson_id' => 'required|exists:lessons,id',
                'title' => 'required|string|max:255',
                'duration_minutes' => 'required|integer|min:1|max:300',
                'pass_score' => 'required|integer|min:0|max:100',
                'questions' => 'required|array|min:1',
                'questions.*.question_text' => 'required|string|max:1000',
                'questions.*.option_a' => 'required|string|max:255',
                'questions.*.option_b' => 'required|string|max:255',
                'questions.*.option_c' => 'required|string|max:255',
                'questions.*.option_d' => 'required|string|max:255',
                'questions.*.correct_option' => 'required|in:A,B,C,D',
            ],
            'instructor.courses.quizzes.update' => [
                'title' => 'required|string|max:255',
                'duration_minutes' => 'required|integer|min:1|max:300',
                'pass_score' => 'required|integer|min:0|max:100',
            ],
            'instructor.courses.quizzes.questions.store' => [
                'question_text' => 'required|string|max:1000',
                'option_a' => 'required|string|max:255',
                'option_b' => 'required|string|max:255',
                'option_c' => 'required|string|max:255',
                'option_d' => 'required|string|max:255',
                'correct_option' => 'required|in:A,B,C,D',
            ],
            'instructor.courses.quizzes.questions.update' => [
                'question_text' => 'required|string|max:1000',
                'option_a' => 'required|string|max:255',
                'option_b' => 'required|string|max:255',
                'option_c' => 'required|string|max:255',
                'option_d' => 'required|string|max:255',
                'correct_option' => 'required|in:A,B,C,D',
            ],

            // Student management
            'instructor.students' => [
                'search' => 'nullable|string|max:255',
                'course_id' => 'nullable|integer|exists:courses,id',
                'status' => 'nullable|in:active,completed,dropped',
                'sort' => 'nullable|in:name,enrolled_at,progress',
                'order' => 'nullable|in:asc,desc',
            ],

            // Revenue routes
            'instructor.revenue.index' => [
                'period' => 'nullable|in:week,month,quarter,year',
                'course_id' => 'nullable|integer|exists:courses,id',
            ],

            // Resource routes
            'instructor.resources.store' => [
                'lesson_id' => 'required|exists:lessons,id',
                'type' => 'required|in:document,video',
                'title' => 'required|string|max:255',
                'file' => 'required|file|max:102400', // 100MB
                'is_preview' => 'boolean'
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
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
            'bio.string' => 'Tiểu sử phải là chuỗi ký tự.',
            'bio.max' => 'Tiểu sử không được vượt quá 1000 ký tự.',
            'experience.string' => 'Kinh nghiệm phải là chuỗi ký tự.',
            'experience.max' => 'Kinh nghiệm không được vượt quá 1000 ký tự.',
            'specialization.string' => 'Chuyên môn phải là chuỗi ký tự.',
            'specialization.max' => 'Chuyên môn không được vượt quá 500 ký tự.',
            'linkedin.url' => 'LinkedIn phải là URL hợp lệ.',
            'linkedin.max' => 'LinkedIn không được vượt quá 255 ký tự.',
            'website.url' => 'Website phải là URL hợp lệ.',
            'website.max' => 'Website không được vượt quá 255 ký tự.',
            'avatar.image' => 'Avatar phải là hình ảnh.',
            'avatar.mimes' => 'Avatar phải có định dạng: jpeg, png, jpg, gif.',
            'avatar.max' => 'Avatar không được vượt quá 2MB.',

            // Password validation messages
            'current_password.required' => 'Mật khẩu hiện tại là bắt buộc.',
            'new_password.required' => 'Mật khẩu mới là bắt buộc.',
            'new_password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
            'new_password.confirmed' => 'Xác nhận mật khẩu không khớp.',

            // Course validation messages
            'title.required' => 'Tiêu đề khóa học là bắt buộc.',
            'title.string' => 'Tiêu đề khóa học phải là chuỗi ký tự.',
            'title.max' => 'Tiêu đề khóa học không được vượt quá 255 ký tự.',
            'description.required' => 'Mô tả khóa học là bắt buộc.',
            'description.string' => 'Mô tả khóa học phải là chuỗi ký tự.',
            'description.max' => 'Mô tả khóa học không được vượt quá 5000 ký tự.',
            'price.required' => 'Giá khóa học là bắt buộc.',
            'price.numeric' => 'Giá khóa học phải là số.',
            'price.min' => 'Giá khóa học không được âm.',
            'level.required' => 'Cấp độ khóa học là bắt buộc.',
            'level.in' => 'Cấp độ khóa học phải là: beginner, intermediate, hoặc advanced.',
            'language.required' => 'Ngôn ngữ khóa học là bắt buộc.',
            'language.string' => 'Ngôn ngữ khóa học phải là chuỗi ký tự.',
            'language.max' => 'Ngôn ngữ khóa học không được vượt quá 50 ký tự.',
            'course_image.image' => 'Ảnh khóa học phải là hình ảnh.',
            'course_image.mimes' => 'Ảnh khóa học phải có định dạng: jpeg, png, jpg, gif.',
            'course_image.max' => 'Ảnh khóa học không được vượt quá 2MB.',
            'categories.required' => 'Danh mục khóa học là bắt buộc.',
            'categories.array' => 'Danh mục khóa học phải là mảng.',
            'categories.min' => 'Phải chọn ít nhất 1 danh mục.',
            'categories.*.integer' => 'ID danh mục phải là số nguyên.',
            'categories.*.exists' => 'Danh mục không tồn tại.',

            // Lesson validation messages
            'course_id.required' => 'ID khóa học là bắt buộc.',
            'course_id.exists' => 'Khóa học không tồn tại.',
            'order.required' => 'Thứ tự là bắt buộc.',
            'order.integer' => 'Thứ tự phải là số nguyên.',
            'order.min' => 'Thứ tự phải lớn hơn 0.',

            // Video validation messages
            'video.file' => 'Video phải là file.',
            'video.mimes' => 'Video phải có định dạng: mp4, avi, mov, wmv.',
            'video.max' => 'Video không được vượt quá 100MB.',
            'video_url.url' => 'URL video không hợp lệ.',
            'duration.integer' => 'Thời lượng phải là số nguyên.',
            'duration.min' => 'Thời lượng phải lớn hơn 0.',
            'is_preview.boolean' => 'Xem trước phải là true hoặc false.',

            // Document validation messages
            'file.required' => 'File là bắt buộc.',
            'file.file' => 'Phải là file hợp lệ.',
            'chunkIndex.required' => 'Chỉ số chunk là bắt buộc.',
            'chunkIndex.integer' => 'Chỉ số chunk phải là số nguyên.',
            'chunkIndex.min' => 'Chỉ số chunk không được âm.',
            'totalChunks.required' => 'Tổng số chunk là bắt buộc.',
            'totalChunks.integer' => 'Tổng số chunk phải là số nguyên.',
            'totalChunks.min' => 'Tổng số chunk phải lớn hơn 0.',
            'fileName.required' => 'Tên file là bắt buộc.',
            'fileName.string' => 'Tên file phải là chuỗi ký tự.',
            'fileName.max' => 'Tên file không được vượt quá 255 ký tự.',
            'uploadId.required' => 'ID upload là bắt buộc.',
            'uploadId.string' => 'ID upload phải là chuỗi ký tự.',
            'uploadId.max' => 'ID upload không được vượt quá 100 ký tự.',

            // Quiz validation messages
            'lesson_id.required' => 'ID bài học là bắt buộc.',
            'lesson_id.exists' => 'Bài học không tồn tại.',
            'duration_minutes.required' => 'Thời gian làm bài là bắt buộc.',
            'duration_minutes.integer' => 'Thời gian làm bài phải là số nguyên.',
            'duration_minutes.min' => 'Thời gian làm bài phải lớn hơn 0.',
            'duration_minutes.max' => 'Thời gian làm bài không được vượt quá 300 phút.',
            'pass_score.required' => 'Điểm đậu là bắt buộc.',
            'pass_score.integer' => 'Điểm đậu phải là số nguyên.',
            'pass_score.min' => 'Điểm đậu không được âm.',
            'pass_score.max' => 'Điểm đậu không được vượt quá 100.',
            'questions.required' => 'Câu hỏi là bắt buộc.',
            'questions.array' => 'Câu hỏi phải là mảng.',
            'questions.min' => 'Phải có ít nhất 1 câu hỏi.',
            'questions.*.question_text.required' => 'Nội dung câu hỏi là bắt buộc.',
            'questions.*.question_text.string' => 'Nội dung câu hỏi phải là chuỗi ký tự.',
            'questions.*.question_text.max' => 'Nội dung câu hỏi không được vượt quá 1000 ký tự.',
            'questions.*.option_a.required' => 'Lựa chọn A là bắt buộc.',
            'questions.*.option_a.string' => 'Lựa chọn A phải là chuỗi ký tự.',
            'questions.*.option_a.max' => 'Lựa chọn A không được vượt quá 255 ký tự.',
            'questions.*.option_b.required' => 'Lựa chọn B là bắt buộc.',
            'questions.*.option_b.string' => 'Lựa chọn B phải là chuỗi ký tự.',
            'questions.*.option_b.max' => 'Lựa chọn B không được vượt quá 255 ký tự.',
            'questions.*.option_c.required' => 'Lựa chọn C là bắt buộc.',
            'questions.*.option_c.string' => 'Lựa chọn C phải là chuỗi ký tự.',
            'questions.*.option_c.max' => 'Lựa chọn C không được vượt quá 255 ký tự.',
            'questions.*.option_d.required' => 'Lựa chọn D là bắt buộc.',
            'questions.*.option_d.string' => 'Lựa chọn D phải là chuỗi ký tự.',
            'questions.*.option_d.max' => 'Lựa chọn D không được vượt quá 255 ký tự.',
            'questions.*.correct_option.required' => 'Đáp án đúng là bắt buộc.',
            'questions.*.correct_option.in' => 'Đáp án đúng phải là A, B, C hoặc D.',

            // Question validation messages
            'question_text.required' => 'Nội dung câu hỏi là bắt buộc.',
            'question_text.string' => 'Nội dung câu hỏi phải là chuỗi ký tự.',
            'question_text.max' => 'Nội dung câu hỏi không được vượt quá 1000 ký tự.',
            'option_a.required' => 'Lựa chọn A là bắt buộc.',
            'option_a.string' => 'Lựa chọn A phải là chuỗi ký tự.',
            'option_a.max' => 'Lựa chọn A không được vượt quá 255 ký tự.',
            'option_b.required' => 'Lựa chọn B là bắt buộc.',
            'option_b.string' => 'Lựa chọn B phải là chuỗi ký tự.',
            'option_b.max' => 'Lựa chọn B không được vượt quá 255 ký tự.',
            'option_c.required' => 'Lựa chọn C là bắt buộc.',
            'option_c.string' => 'Lựa chọn C phải là chuỗi ký tự.',
            'option_c.max' => 'Lựa chọn C không được vượt quá 255 ký tự.',
            'option_d.required' => 'Lựa chọn D là bắt buộc.',
            'option_d.string' => 'Lựa chọn D phải là chuỗi ký tự.',
            'option_d.max' => 'Lựa chọn D không được vượt quá 255 ký tự.',
            'correct_option.required' => 'Đáp án đúng là bắt buộc.',
            'correct_option.in' => 'Đáp án đúng phải là A, B, C hoặc D.',

            // Filter validation messages
            'search.string' => 'Từ khóa tìm kiếm phải là chuỗi ký tự.',
            'search.max' => 'Từ khóa tìm kiếm không được vượt quá 255 ký tự.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'sort.in' => 'Trường sắp xếp không hợp lệ.',
            'order.in' => 'Thứ tự sắp xếp không hợp lệ.',
            'per_page.integer' => 'Số lượng mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số lượng mỗi trang phải lớn hơn 0.',
            'per_page.max' => 'Số lượng mỗi trang không được vượt quá 50.',
            'period.in' => 'Khoảng thời gian không hợp lệ.',

            // Resource validation messages
            'type.required' => 'Loại tài liệu là bắt buộc.',
            'type.in' => 'Loại tài liệu phải là document hoặc video.',
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
            'bio' => 'Tiểu sử',
            'experience' => 'Kinh nghiệm',
            'specialization' => 'Chuyên môn',
            'linkedin' => 'LinkedIn',
            'website' => 'Website',
            'avatar' => 'Ảnh đại diện',
            'current_password' => 'Mật khẩu hiện tại',
            'new_password' => 'Mật khẩu mới',
            'title' => 'Tiêu đề',
            'description' => 'Mô tả',
            'price' => 'Giá',
            'level' => 'Cấp độ',
            'language' => 'Ngôn ngữ',
            'course_image' => 'Ảnh khóa học',
            'categories' => 'Danh mục',
            'course_id' => 'Khóa học',
            'lesson_id' => 'Bài học',
            'order' => 'Thứ tự',
            'video' => 'Video',
            'video_url' => 'URL Video',
            'duration' => 'Thời lượng',
            'is_preview' => 'Xem trước',
            'file' => 'File',
            'fileName' => 'Tên file',
            'uploadId' => 'ID upload',
            'chunkIndex' => 'Chỉ số chunk',
            'totalChunks' => 'Tổng số chunk',
            'duration_minutes' => 'Thời gian làm bài',
            'pass_score' => 'Điểm đậu',
            'questions' => 'Câu hỏi',
            'question_text' => 'Nội dung câu hỏi',
            'option_a' => 'Lựa chọn A',
            'option_b' => 'Lựa chọn B',
            'option_c' => 'Lựa chọn C',
            'option_d' => 'Lựa chọn D',
            'correct_option' => 'Đáp án đúng',
            'search' => 'Từ khóa tìm kiếm',
            'status' => 'Trạng thái',
            'sort' => 'Sắp xếp theo',
            'per_page' => 'Số lượng mỗi trang',
            'period' => 'Khoảng thời gian',
            'type' => 'Loại tài liệu',
        ];
    }
}
