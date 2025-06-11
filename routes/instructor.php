<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Instructor\InstructorDashboardController;
use App\Http\Controllers\Instructor\CourseController;
use App\Http\Controllers\Instructor\DocumentController;
use App\Http\Controllers\Instructor\EnrollmentController;
use App\Http\Controllers\Instructor\LessonController;
use App\Http\Controllers\Instructor\ProfileController;
use App\Http\Controllers\Instructor\QuizController;
use App\Http\Controllers\Instructor\RevenueController;
use App\Http\Controllers\Instructor\VideoController;

Route::middleware(['auth', 'verified', 'role:2'])->group(function () {
    // Đường dẫn đến trang dashboard của giảng viên
    Route::get('/instructor/dashboard', [InstructorDashboardController::class, 'index'])
        ->name('instructor.dashboard');

    // Hiển thị danh sách các khóa học của giảng viên
    Route::get('/instructor/courses', [CourseController::class, 'index'])
        ->name('instructor.courses.index');
    // Hiển thị form tạo khóa học mới
    Route::get('/instructor/courses/create', [CourseController::class, 'create'])
        ->name('instructor.courses.create');
    //show success message after course creation
    Route::get('/instructor/courses/success', [CourseController::class, 'success'])
        ->name('instructor.courses.success');
    // Lưu thông tin khóa học mới
    Route::post('/instructor/courses/store', [CourseController::class, 'store'])
        ->name('instructor.courses.store');
    // Hiển thị form chỉnh sửa khóa học
    Route::get('/instructor/courses/{id}/edit', [CourseController::class, 'edit'])
        ->name('instructor.courses.edit');
    // Cập nhật thông tin khóa học
    Route::put('/instructor/courses/{id}/update', [CourseController::class, 'update'])
        ->name('instructor.courses.update');
    // Xóa khóa học
    Route::delete('/instructor/courses/{id}/delete', [CourseController::class, 'destroy'])
        ->name('instructor.courses.delete');

    // Hiển thị danh sách tài liệu của khóa học
    Route::get('/instructor/courses/{id}/documents', [DocumentController::class, 'index'])
        ->name('instructor.courses.documents.index');
    // Thêm tài liệu mới vào khóa học
    Route::post('/instructor/courses/{id}/documents/store', [DocumentController::class, 'store'])
        ->name('instructor.courses.documents.store');
    // Xóa tài liệu khỏi khóa học
    Route::delete('/instructor/courses/{id}/documents/{documentId}/delete', [DocumentController::class, 'destroy'])
        ->name('instructor.courses.documents.delete');

    // Hiển thị danh sách học viên đã đăng ký khóa học
    Route::get('/instructor/courses/{id}/enrollments', [EnrollmentController::class, 'index'])
        ->name('instructor.courses.enrollments.index');

    // Hiển thị danh sách bài học trong khóa học
    Route::get('/instructor/courses/{id}/lessons', [LessonController::class, 'index'])
        ->name('instructor.courses.lessons.index');
    // Hiển thị form tạo bài học mới
    Route::get('/instructor/courses/{id}/lessons/create', [LessonController::class, 'create'])
        ->name('instructor.courses.lessons.create');
    // Lưu bài học mới
    Route::post('/instructor/courses/{id}/lessons/store', [LessonController::class, 'store'])
        ->name('instructor.courses.lessons.store');
    // Hiển thị form chỉnh sửa bài học
    Route::get('/instructor/courses/{id}/lessons/{lessonId}/edit', [LessonController::class, 'edit'])
        ->name('instructor.courses.lessons.edit');
    // Cập nhật thông tin bài học
    Route::put('/instructor/courses/{id}/lessons/{lessonId}/update', [LessonController::class, 'update'])
        ->name('instructor.courses.lessons.update');
    // Xóa bài học
    Route::delete('/instructor/courses/{id}/lessons/{lessonId}/delete', [LessonController::class, 'destroy'])
        ->name('instructor.courses.lessons.delete');

    // Hiển thị danh sách bài kiểm tra trong khóa học
    Route::get('/instructor/courses/{id}/quizzes', [QuizController::class, 'index'])
        ->name('instructor.courses.quizzes.index');
    // Hiển thị form tạo bài kiểm tra mới
    Route::get('/instructor/courses/{id}/quizzes/create', [QuizController::class, 'create'])
        ->name('instructor.courses.quizzes.create');
    // Lưu bài kiểm tra mới
    Route::post('/instructor/courses/{id}/quizzes/store', [QuizController::class, 'store'])
        ->name('instructor.courses.quizzes.store');
    // Hiển thị form chỉnh sửa bài kiểm tra
    Route::get('/instructor/courses/{id}/quizzes/{quizId}/edit', [QuizController::class, 'edit'])
        ->name('instructor.courses.quizzes.edit');
    // Cập nhật thông tin bài kiểm tra
    Route::put('/instructor/courses/{id}/quizzes/{quizId}/update', [QuizController::class, 'update'])
        ->name('instructor.courses.quizzes.update');
    // Xóa bài kiểm tra
    Route::delete('/instructor/courses/{id}/quizzes/{quizId}/delete', [QuizController::class, 'destroy'])
        ->name('instructor.courses.quizzes.delete');
    // Hiển thị danh sách câu hỏi trong bài kiểm tra
    Route::get('/instructor/courses/{id}/quizzes/{quizId}/questions', [QuizController::class, 'questions'])
        ->name('instructor.courses.quizzes.questions');
    // Thêm câu hỏi mới vào bài kiểm tra
    Route::post('/instructor/courses/{id}/quizzes/{quizId}/questions/store', [QuizController::class, 'storeQuestion'])
        ->name('instructor.courses.quizzes.questions.store');
    // Hiển thị form chỉnh sửa câu hỏi
    Route::get('/instructor/courses/{id}/quizzes/{quizId}/questions/{questionId}/edit', [QuizController::class, 'editQuestion'])
        ->name('instructor.courses.quizzes.questions.edit');
    // Cập nhật thông tin câu hỏi
    Route::put('/instructor/courses/{id}/quizzes/{quizId}/questions/{questionId}/update', [QuizController::class, 'updateQuestion'])
        ->name('instructor.courses.quizzes.questions.update');
    // Xóa câu hỏi khỏi bài kiểm tra
    Route::delete('/instructor/courses/{id}/quizzes/{quizId}/questions/{questionId}/delete', [QuizController::class, 'destroyQuestion'])
        ->name('instructor.courses.quizzes.questions.delete');

    // Hiển thị form chỉnh sửa hồ sơ giảng viên
    Route::get('/instructor/profile', [ProfileController::class, 'edit'])
        ->name('instructor.profile.edit');
    // Cập nhật thông tin hồ sơ giảng viên
    Route::put('/instructor/profile/update', [ProfileController::class, 'update'])
        ->name('instructor.profile.update');

    // Hiển thị doanh thu của giảng viên
    Route::get('/instructor/revenue', [RevenueController::class, 'index'])
        ->name('instructor.revenue.index');
    // Hiển thị chi tiết doanh thu
    Route::get('/instructor/revenue/{id}/details', [RevenueController::class, 'details'])
        ->name('instructor.revenue.details');

    // Hiển thị danh sách video của giảng viên
    Route::get('/instructor/videos', [VideoController::class, 'index'])
        ->name('instructor.videos.index');
    // Upload video mới
    Route::post('/instructor/videos/upload', [VideoController::class, 'upload'])
        ->name('instructor.videos.upload');

    // Xóa video
    Route::delete('/instructor/videos/{id}/delete', [VideoController::class, 'destroy'])
        ->name('instructor.videos.delete');

    // Hiển thị form chỉnh sửa video
    Route::get('/instructor/videos/{id}/edit', [VideoController::class, 'edit'])
        ->name('instructor.videos.edit');
    // Cập nhật thông tin video
    Route::put('/instructor/videos/{id}/update', [VideoController::class, 'update'])
        ->name('instructor.videos.update');

    // Hiển thị chi tiết video
    Route::get('/instructor/videos/{id}/details', [VideoController::class, 'details'])
        ->name('instructor.videos.details');
});
