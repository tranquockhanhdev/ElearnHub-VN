<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Instructor\{
    InstructorDashboardController,
    CourseController,
    DocumentController,
    EnrollmentController,
    LessonController,
    QuizController,
    ProfileController,
    RevenueController,
    VideoController
};

Route::middleware(['auth', 'verified', 'role:2'])->prefix('instructor')->name('instructor.')->group(function () {

    // 🔹 Dashboard
    Route::get('/dashboard', [InstructorDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/revenue-chart', [InstructorDashboardController::class, 'getRevenueChart'])->name('dashboard.revenue-chart');

    // 🔹 Khóa học
    Route::prefix('courses')->name('courses.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        Route::get('/create', [CourseController::class, 'create'])->name('create');
        Route::get('/success', [CourseController::class, 'success'])->name('success');
        Route::get('/{id}', [CourseController::class, 'show'])->name('show');
        Route::post('/store', [CourseController::class, 'store'])->name('store');
        Route::get('{id}/edit', [CourseController::class, 'edit'])->name('edit');
        Route::put('{id}/update', [CourseController::class, 'update'])->name('update');
        Route::delete('{id}/delete', [CourseController::class, 'destroy'])->name('delete');

        // 👥 Học viên
        Route::get('{id}/enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');

        // 📚 Bài học
        Route::prefix('{id}/lessons')->name('lessons.')->group(function () {
            Route::get('/', [LessonController::class, 'index'])->name('index');
            Route::get('/create', [LessonController::class, 'create'])->name('create');
            Route::post('/store', [LessonController::class, 'store'])->name('store');
            Route::put('/{lessonId}/updateOrder', [LessonController::class, 'updateOrder'])->name('update-order');
            Route::get('{lessonId}/edit', [LessonController::class, 'edit'])->name('edit');
            Route::put('{lessonId}/update', [LessonController::class, 'update'])->name('update');
            Route::delete('{lessonId}/delete', [LessonController::class, 'destroy'])->name('delete');

            // 📄 Tài liệu (Documents)
            Route::prefix('{lessonId}/documents')->name('documents.')->group(function () {
                Route::get('/', [DocumentController::class, 'index'])->name('index');
                Route::post('/store', [DocumentController::class, 'store'])->name('store');
                Route::post('/chunkUpload', [DocumentController::class, 'chunkUpload'])->name('chunkUpload');
                Route::delete('{documentId}/delete', [DocumentController::class, 'destroy'])->name('delete');
            });

            // 🎥 Video Resources
            Route::prefix('{lessonId}/videos')->name('videos.')->group(function () {
                Route::get('/', [VideoController::class, 'index'])->name('index');
                Route::post('/store', [VideoController::class, 'store'])->name('store'); // Thêm route store cho video
                Route::delete('{videoId}/delete', [VideoController::class, 'destroy'])->name('delete');
            });
        });

        // 📝 Bài kiểm tra
        Route::prefix('{id}/quizzes')->name('quizzes.')->group(function () {
            Route::get('/', [QuizController::class, 'index'])->name('index');
            Route::get('/create', [QuizController::class, 'create'])->name('create');
            Route::post('/store', [QuizController::class, 'store'])->name('store');
            Route::get('{quizId}/edit', [QuizController::class, 'edit'])->name('edit');
            Route::put('{quizId}/update', [QuizController::class, 'update'])->name('update');
            Route::delete('{quizId}/delete', [QuizController::class, 'destroy'])->name('delete');

            // 🧠 Câu hỏi
            Route::prefix('{quizId}/questions')->name('questions.')->group(function () {
                Route::get('/', [QuizController::class, 'questions'])->name('index');
                Route::post('/store', [QuizController::class, 'storeQuestion'])->name('store');
                Route::get('{questionId}/edit', [QuizController::class, 'editQuestion'])->name('edit');
                Route::put('{questionId}/update', [QuizController::class, 'updateQuestion'])->name('update');
                Route::delete('{questionId}/delete', [QuizController::class, 'destroyQuestion'])->name('delete');
            });
        });
    });

    // 🧑‍🏫 Hồ sơ giảng viên
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::put('/update', [ProfileController::class, 'update'])->name('update');
    });

    // 💰 Doanh thu
    Route::prefix('revenue')->name('revenue.')->group(function () {
        Route::get('/', [RevenueController::class, 'index'])->name('index');
        Route::get('{id}/details', [RevenueController::class, 'details'])->name('details');
    });
});
