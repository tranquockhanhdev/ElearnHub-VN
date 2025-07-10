<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Http\Requests\Admin\Course\CourseRequest;
use App\Services\Admin\Course\CourseService;
use Illuminate\Support\Facades\Log;

class AdminCourseController extends Controller
{
    protected $CourseService;
    public function __construct(CourseService $CourseService)
    {
        $this->CourseService = $CourseService;
    }
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');
        $category = $request->input('category');
        $status = $request->input('status');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $instructor = $request->input('instructor');
        $tab = $request->input('tab', 'grid'); // 👈 giữ trạng thái tab

        $query = Course::with(['categories', 'instructor']);

        if ($instructor) {
            $query->where('instructor_id', $instructor);
        }

        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        if ($category) {
            $query->whereHas('categories', function ($q) use ($category) {
                $q->where('category_id', $category);
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $query->orderBy($sortBy, $sortOrder);

        $courses = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Course/AdminCourseList', [
            'courses' => $courses,
            'instructors' => \App\Models\User::where('role_id', 2)->select('id', 'name')->get(),
            'categories' => \App\Models\Category::select('id', 'name')->get(),

            // Truyền toàn bộ filters để đồng bộ với frontend
            'filters' => [
                'search' => $search,
                'category' => $category,
                'status' => $status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'instructor' => $instructor,
                'tab' => $tab,
            ],

            // Truyền thống kê tổng quan
            'stats' => [
                'total' => Course::count(),
                'active' => Course::where('status', 'approved')->count(),
                'pending' => Course::where('status', 'pending')->count(),
                'inactive' => Course::where('status', 'draft')->count(),
            ],
        ]);
    }


    public function create()
    {
        $categories = $this->CourseService->getAllCategories();
        $instructors = \App\Models\User::where('role_id', 2)->get();
        return Inertia::render(
            'Admin/Course/AdminCreateCourse',
            [
                'categories' => $categories,
                'instructors' => $instructors,
            ]
        );
    }
    public function store(CourseRequest $request)
    {
        $result  = $this->CourseService->createCourse($request->all());
        if ($result['success']) {
            return Inertia::location(route('admin.courses.success'));
        }
        return redirect()->back()
            ->withErrors($result['errors'] ?? ['general' => $result['message']])
            ->withInput($request->except('course_image'));
    }
    public function success()
    {
        return Inertia::render('Admin/Course/SuccessCourse');
    }
    public function edit($id)
    {
        $course = Course::with('categories')->findOrFail($id);
        $categories = $this->CourseService->getAllCategories();
        $instructors = User::where('role_id', 2)->get(); // Giảng viên

        return Inertia::render('Admin/Course/AdminEditCourse', [
            'course' => $course,
            'categories' => $categories,
            'instructors' => $instructors,
        ]);
    }

    public function update(CourseRequest $request, $id)
    {
        $result = $this->CourseService->updateCourse($id, $request->all());

        if ($result['success']) {
            return redirect()->route('admin.admin-course')->with('success', 'Cập nhật khóa học thành công!');
        }

        return redirect()->back()
            ->withErrors($result['errors'] ?? ['general' => $result['message']])
            ->withInput($request->except('course_image'));
    }
    public function show($id)
    {
        $course = Course::with(['categories', 'instructor'])->findOrFail($id);

        if ($course->img_url) {
            $course->img_url = asset('storage/bannercourse/' . basename($course->img_url));
        }

        return Inertia::render('Admin/Course/AdminCourseDetail', [
            'course' => $course
        ]);
    }

    public function destroy($id)
    {
        $this->CourseService->deleteCourse($id);

        return redirect()->back()->with('success', 'Course deleted successfully.');
    }

    /**
     * Hiển thị danh sách khóa học chờ phê duyệt (Tầng 1)
     */
    public function courseApprovals(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');
        $instructor = $request->input('instructor');
        $changeType = $request->input('change_type'); // 'content', 'resource', 'all'
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Lấy các khóa học có course_edits pending, lesson pending hoặc resource_edits pending (bao gồm cả video và document)
        $query = Course::with(['instructor', 'courseEdits' => function ($q) {
            $q->where('status', 'pending');
        }])
            ->where(function ($q) use ($changeType) {
                if ($changeType === 'content') {
                    $q->whereHas('courseEdits', function ($subQ) {
                        $subQ->where('status', 'pending');
                    })
                        ->orWhereHas('lessons', function ($subQ) {
                            $subQ->where('status', 'pending');
                        })
                        ->orWhereHas('lessons.quiz', function ($subQ) {
                            $subQ->where('status', 'pending');
                        });
                } elseif ($changeType === 'resource') {
                    $q->where(function ($subQ) {
                        $subQ->whereHas('lessons.resources.edits', function ($subSubQ) {
                            $subSubQ->where('status', 'pending');
                        })
                            ->orWhereHas('lessons.resources', function ($subSubQ) {
                                $subSubQ->where('status', 'pending')
                                    ->whereIn('type', ['video', 'document']);
                            });
                    });
                } else {
                    // Default: all changes
                    $q->whereHas('courseEdits', function ($subQ) {
                        $subQ->where('status', 'pending');
                    })
                        ->orWhereHas('lessons', function ($subQ) {
                            $subQ->where('status', 'pending');
                        })
                        ->orWhereHas('lessons.quiz', function ($subQ) {
                            $subQ->where('status', 'pending');
                        })
                        ->orWhereHas('lessons.resources.edits', function ($subQ) {
                            $subQ->where('status', 'pending');
                        })
                        ->orWhereHas('lessons.resources', function ($subQ) {
                            $subQ->where('status', 'pending')
                                ->whereIn('type', ['video', 'document']);
                        });
                }
            });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhereHas('instructor', function ($subQ) use ($search) {
                        $subQ->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        if ($instructor) {
            $query->where('instructor_id', $instructor);
        }

        if ($dateFrom) {
            $query->whereHas('courseEdits', function ($q) use ($dateFrom) {
                $q->where('created_at', '>=', $dateFrom);
            });
        }

        if ($dateTo) {
            $query->whereHas('courseEdits', function ($q) use ($dateTo) {
                $q->where('created_at', '<=', $dateTo);
            });
        }

        if ($sortBy === 'instructor.name') {
            $query->join('users', 'users.id', '=', 'courses.instructor_id')
                ->orderBy('users.name', $sortOrder)
                ->select('courses.*');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $courses = $query->paginate($perPage)->withQueryString();

        // Thêm thống kê cho mỗi khóa học
        $courses->getCollection()->transform(function ($course) {
            // Đếm số thay đổi nội dung pending (course edits + lesson pending + quiz pending)
            $contentChanges = $course->courseEdits()->where('status', 'pending')->count();
            $lessonChanges = $course->lessons()->where('status', 'pending')->count();
            $quizChanges = 0;

            // Đếm quiz pending
            foreach ($course->lessons as $lesson) {
                if ($lesson->quiz && $lesson->quiz->status === 'pending') {
                    $quizChanges++;
                }
            }

            // Đếm số tài nguyên pending (bao gồm cả edits và resources có status pending)
            $resourceChanges = 0;
            $pendingResources = 0;

            foreach ($course->lessons as $lesson) {
                foreach ($lesson->resources as $resource) {
                    // Đếm resource edits pending
                    $resourceChanges += $resource->edits()->where('status', 'pending')->count();

                    // Đếm resources có status pending (chờ admin duyệt)
                    if ($resource->status === 'pending' && in_array($resource->type, ['video', 'document'])) {
                        $pendingResources++;
                    }
                }
            }

            $course->pending_content_changes = $contentChanges + $lessonChanges + $quizChanges;
            $course->pending_resource_changes = $resourceChanges + $pendingResources;
            $course->latest_edit_date = $course->courseEdits()
                ->where('status', 'pending')
                ->latest()
                ->first()?->created_at;

            return $course;
        });

        return Inertia::render('Admin/Course/CourseApprovalIndex', [
            'courses' => $courses,
            'instructors' => \App\Models\User::where('role_id', 2)->select('id', 'name')->get(),
            'filters' => $request->only(['search', 'instructor', 'change_type', 'date_from', 'date_to', 'sort_by', 'sort_order']),
            'stats' => [
                'total' => $courses->total(),
                'content_changes' => Course::where(function ($q) {
                    $q->whereHas('courseEdits', function ($subQ) {
                        $subQ->where('status', 'pending');
                    })
                        ->orWhereHas('lessons', function ($subQ) {
                            $subQ->where('status', 'pending');
                        });
                })->count(),
                'resource_changes' => Course::where(function ($q) {
                    $q->whereHas('lessons.resources.edits', function ($subQ) {
                        $subQ->where('status', 'pending');
                    })
                        ->orWhereHas('lessons.resources', function ($subQ) {
                            $subQ->where('status', 'pending')
                                ->whereIn('type', ['video', 'document']);
                        });
                })->count(),
            ]
        ]);
    }

    /**
     * Chi tiết khóa học chờ phê duyệt (Tầng 2)
     */
    public function showCourseApproval($id, Request $request)
    {
        $course = Course::with([
            'instructor',
            'categories',
            'courseEdits' => function ($q) {
                $q->where('status', 'pending')->latest();
            },
            'lessons' => function ($q) {
                $q->where(function ($subQ) {
                    $subQ->where('status', 'pending')
                        ->orWhereHas('quiz', function ($quizQ) {
                            $quizQ->where('status', 'pending');
                        })
                        ->orWhereHas('resources', function ($resQ) {
                            $resQ->where('status', 'pending')->orWhereHas('edits', function ($editQ) {
                                $editQ->where('status', 'pending');
                            });
                        });
                });
            },
            'lessons.quiz' => function ($q) {
                $q->where('status', 'pending');
            },
            'lessons.resources.edits' => function ($q) {
                $q->where('status', 'pending')->latest();
            },
            'lessons.resources' => function ($q) {
                $q->where(function ($subQ) {
                    $subQ->whereHas('edits', function ($editQ) {
                        $editQ->where('status', 'pending');
                    })
                        ->orWhere(function ($pendingQ) {
                            $pendingQ->where('status', 'pending')
                                ->whereIn('type', ['video', 'document']);
                        });
                });
            }
        ])->findOrFail($id);

        // Chuẩn bị dữ liệu cho tab thay đổi nội dung
        $contentChanges = collect();

        // Course edits
        $course->courseEdits->each(function ($edit) use ($course, $contentChanges) {
            $contentChanges->push([
                'id' => $edit->id,
                'type' => 'course_edit',
                'field' => $this->getChangedFields($course, $edit),
                'original_value' => $this->getOriginalValue($course, $edit),
                'new_value' => $this->getNewValue($edit),
                'status' => $edit->status,
                'created_at' => $edit->created_at,
                'submitter' => $edit->submitter
            ]);
        });

        // Lesson pending
        $course->lessons()->where('status', 'pending')->get()->each(function ($lesson) use ($contentChanges) {
            $contentChanges->push([
                'id' => $lesson->id,
                'type' => 'lesson',
                'field' => 'Bài giảng mới',
                'original_value' => 'Không có',
                'new_value' => $lesson->title,
                'status' => $lesson->status,
                'created_at' => $lesson->created_at,
                'lesson_data' => $lesson
            ]);
        });

        // Quiz pending
        foreach ($course->lessons as $lesson) {
            if ($lesson->quiz && $lesson->quiz->status === 'pending') {
                $contentChanges->push([
                    'id' => $lesson->quiz->id,
                    'type' => 'quiz',
                    'field' => 'Quiz mới',
                    'original_value' => 'Không có',
                    'new_value' => $lesson->quiz->title,
                    'status' => $lesson->quiz->status,
                    'created_at' => $lesson->quiz->created_at,
                    'lesson_id' => $lesson->id,
                    'lesson_title' => $lesson->title,
                    'quiz_data' => $lesson->quiz
                ]);
            }
        }

        // Chuẩn bị dữ liệu cho tab tài nguyên
        $resourceChanges = collect();
        foreach ($course->lessons as $lesson) {
            foreach ($lesson->resources as $resource) {
                // Xử lý resource edits (thay đổi tài nguyên hiện có)
                foreach ($resource->edits as $edit) {
                    // Kiểm tra xem có phải là delete request không
                    $isDeleteRequest = ($edit->edited_file_url === null &&
                        in_array($edit->note, ['Yêu cầu xóa tài liệu', 'Yêu cầu xóa video']));

                    $resourceChanges->push([
                        'id' => $edit->id,
                        'type' => $isDeleteRequest ? 'delete' : 'edit',
                        'resource_id' => $resource->id,
                        'lesson_title' => $lesson->title,
                        'original_title' => $resource->title,
                        'new_title' => $isDeleteRequest ? null : $edit->edited_title,
                        'original_file_url' => $resource->file_url,
                        'new_file_url' => $isDeleteRequest ? null : $edit->edited_file_url,
                        'status' => $edit->status,
                        'created_at' => $edit->created_at,
                        'is_delete_request' => $isDeleteRequest
                    ]);
                }

                // Xử lý resources mới chờ duyệt (status pending)
                if ($resource->status === 'pending' && in_array($resource->type, ['video', 'document'])) {
                    $resourceChanges->push([
                        'id' => $resource->id,
                        'type' => 'new_resource',
                        'resource_id' => $resource->id,
                        'lesson_title' => $lesson->title,
                        'original_title' => null,
                        'new_title' => $resource->title,
                        'file_type' => $resource->file_type,
                        'original_file_url' => null,
                        'new_file_url' => $resource->file_url,
                        'status' => $resource->status,
                        'created_at' => $resource->created_at,
                        'can_preview' => in_array($resource->file_type, ['mp4', 'pdf', 'youtube', 'vimeo', 'doc', 'docx']),
                        'is_encrypted' => $resource->is_encrypted ?? false
                    ]);
                }
            }
        }

        return Inertia::render('Admin/Course/CourseApprovalDetail', [
            'course' => $course,
            'contentChanges' => $contentChanges,
            'resourceChanges' => $resourceChanges
        ]);
    }

    /**
     * Phê duyệt khóa học (approve course edit)
     */
    public function approveCourse($id, Request $request)
    {
        $type = $request->input('type'); // 'content', 'resource', 'lesson', hoặc 'new_resource'
        $editId = $request->input('edit_id');
        $resourceId = $request->input('resource_id'); // For new resources
        $lessonId = $request->input('lesson_id'); // For lessons

        \Illuminate\Support\Facades\Log::info("Approving course {$id}", [
            'type' => $type,
            'edit_id' => $editId,
            'resource_id' => $resourceId,
            'lesson_id' => $lessonId
        ]);

        try {
            if ($type === 'content') {
                $this->approveCourseEdit($editId);
                $message = 'Đã phê duyệt thay đổi nội dung thành công!';
            } elseif ($type === 'lesson') {
                $this->approveLesson($lessonId);
                $message = 'Đã phê duyệt bài giảng thành công!';
            } elseif ($type === 'quiz') {
                $this->approveQuiz($editId);
                $message = 'Đã phê duyệt quiz thành công!';
            } elseif ($type === 'resource') {
                // Kiểm tra xem có phải là delete request không
                $edit = \App\Models\ResourceEdit::findOrFail($editId);
                if ($edit->edited_file_url === null && in_array($edit->note, ['Yêu cầu xóa tài liệu', 'Yêu cầu xóa video'])) {
                    $this->approveDeleteResource($editId);
                    $message = 'Đã phê duyệt yêu cầu xóa tài nguyên thành công!';
                } else {
                    $this->approveResourceEdit($editId);
                    $message = 'Đã phê duyệt chỉnh sửa tài nguyên thành công!';
                }
            } elseif ($type === 'new_resource') {
                $this->approveNewResource($resourceId);
                $message = 'Đã phê duyệt tài nguyên mới thành công!';
            }

            return redirect()->back()->with('success', $message ?? 'Đã phê duyệt thành công!');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error approving course {$id}: " . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    /**
     * Từ chối khóa học (reject course edit)
     */
    public function rejectCourse($id, Request $request)
    {
        $type = $request->input('type');
        $editId = $request->input('edit_id');
        $resourceId = $request->input('resource_id'); // For new resources
        $lessonId = $request->input('lesson_id'); // For lessons
        $note = $request->input('note', '');

        try {
            if ($type === 'content') {
                $this->rejectCourseEdit($editId, $note);
            } elseif ($type === 'lesson') {
                $this->rejectLesson($lessonId, $note);
            } elseif ($type === 'quiz') {
                $this->rejectQuiz($editId, $note);
            } elseif ($type === 'resource') {
                // Kiểm tra xem có phải là delete request không
                $edit = \App\Models\ResourceEdit::findOrFail($editId);
                if ($edit->edited_file_url === null && in_array($edit->note, ['Yêu cầu xóa tài liệu', 'Yêu cầu xóa video'])) {
                    $this->rejectDeleteResource($editId, $note);
                } else {
                    $this->rejectResourceEdit($editId, $note);
                }
            } elseif ($type === 'new_resource') {
                $this->rejectNewResource($resourceId, $note);
            }

            return redirect()->back()->with('success', 'Đã từ chối thành công!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    // Helper methods
    private function getChangedFields($course, $edit)
    {
        $changes = [];
        if ($edit->edited_title && $edit->edited_title !== $course->title) {
            $changes[] = 'Tiêu đề';
        }
        if ($edit->edited_description && $edit->edited_description !== $course->description) {
            $changes[] = 'Mô tả';
        }
        if ($edit->edited_price && $edit->edited_price !== $course->price) {
            $changes[] = 'Giá';
        }
        if ($edit->edited_img_url && $edit->edited_img_url !== $course->img_url) {
            $changes[] = 'Hình ảnh';
        }
        return implode(', ', $changes);
    }

    private function getOriginalValue($course, $edit)
    {
        if ($edit->edited_title && $edit->edited_title !== $course->title) {
            return $course->title;
        }
        if ($edit->edited_description && $edit->edited_description !== $course->description) {
            return $course->description;
        }
        if ($edit->edited_price && $edit->edited_price !== $course->price) {
            return number_format($course->price) . ' VNĐ';
        }
        return 'N/A';
    }

    private function getNewValue($edit)
    {
        if ($edit->edited_title) {
            return $edit->edited_title;
        }
        if ($edit->edited_description) {
            return $edit->edited_description;
        }
        if ($edit->edited_price) {
            return number_format($edit->edited_price) . ' VNĐ';
        }
        return 'N/A';
    }

    private function approveCourseEdit($editId)
    {
        $edit = \App\Models\CourseEdit::findOrFail($editId);
        $course = $edit->course;

        // Cập nhật course với dữ liệu mới
        if ($edit->edited_title) {
            $course->title = $edit->edited_title;
        }
        if ($edit->edited_description) {
            $course->description = $edit->edited_description;
        }
        if ($edit->edited_price) {
            $course->price = $edit->edited_price;
        }
        if ($edit->edited_img_url) {
            $course->img_url = $edit->edited_img_url;
        }

        $course->save();

        // Cập nhật trạng thái edit
        $edit->status = 'approved';
        $edit->save();
    }

    private function approveResourceEdit($editId)
    {
        $edit = \App\Models\ResourceEdit::findOrFail($editId);
        $resource = $edit->resource;

        // Cập nhật resource với dữ liệu mới
        if ($edit->edited_title) {
            $resource->title = $edit->edited_title;
        }
        if ($edit->edited_file_url) {
            $resource->file_url = $edit->edited_file_url;
        }
        if (isset($edit->is_preview)) {
            $resource->is_preview = $edit->is_preview;
        }

        $resource->save();

        // Cập nhật trạng thái edit
        $edit->status = \App\Models\ResourceEdit::STATUS_APPROVED;
        $edit->save();
    }

    private function rejectCourseEdit($editId, $note)
    {
        $edit = \App\Models\CourseEdit::findOrFail($editId);
        $edit->status = 'rejected';
        $edit->note = $note;
        $edit->save();
    }

    private function rejectResourceEdit($editId, $note)
    {
        $edit = \App\Models\ResourceEdit::findOrFail($editId);
        $edit->status = \App\Models\ResourceEdit::STATUS_REJECTED;
        $edit->note = $note;
        $edit->save();
    }

    /**
     * Phê duyệt tài nguyên mới (video/document mới được upload)
     */
    private function approveNewResource($resourceId)
    {
        $resource = \App\Models\Resource::findOrFail($resourceId);

        // Log để debug
        \Illuminate\Support\Facades\Log::info("Approving new resource {$resourceId}, current status: {$resource->status}");

        // Chỉ approve resource có status pending
        if ($resource->status === 'pending') {
            $resource->status = 'approved';
            $resource->save();

            \Illuminate\Support\Facades\Log::info("Resource {$resourceId} approved successfully, new status: {$resource->status}");
        } else {
            \Illuminate\Support\Facades\Log::warning("Resource {$resourceId} cannot be approved, current status: {$resource->status}");
        }
    }

    /**
     * Từ chối tài nguyên mới (video/document mới được upload)
     */
    private function rejectNewResource($resourceId, $note)
    {
        $resource = \App\Models\Resource::findOrFail($resourceId);

        // Chỉ reject resource có status pending
        if ($resource->status === 'pending') {
            $resource->status = 'rejected';
            $resource->note = $note;
            $resource->save();

            // Xóa file đã upload nếu cần thiết
            if ($resource->file_url && !filter_var($resource->file_url, FILTER_VALIDATE_URL)) {
                try {
                    // Xóa file mã hóa nếu có
                    if ($resource->encrypted_path) {
                        $encryptedFullPath = storage_path('app/' . $resource->encrypted_path);
                        if (file_exists($encryptedFullPath)) {
                            unlink($encryptedFullPath);
                        }
                    }

                    // Xóa file gốc
                    $filePath = str_replace('storage/', '', $resource->file_url);
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($filePath);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error deleting rejected resource file: ' . $e->getMessage());
                }
            }
        }
    }

    /**
     * Phê duyệt bài giảng (lesson)
     */
    private function approveLesson($lessonId)
    {
        $lesson = \App\Models\Lesson::findOrFail($lessonId);

        // Chỉ approve lesson có status pending
        if ($lesson->status === 'pending') {
            $lesson->status = 'approved';
            $lesson->save();

            \Illuminate\Support\Facades\Log::info("Lesson {$lessonId} approved successfully, new status: {$lesson->status}");
        } else {
            \Illuminate\Support\Facades\Log::warning("Lesson {$lessonId} is not pending, current status: {$lesson->status}");
        }
    }

    /**
     * Từ chối bài giảng (lesson)
     */
    private function rejectLesson($lessonId, $note)
    {
        $lesson = \App\Models\Lesson::findOrFail($lessonId);

        // Chỉ reject lesson có status pending
        if ($lesson->status === 'pending') {
            $lesson->status = 'rejected';
            $lesson->note = $note;
            $lesson->save();

            \Illuminate\Support\Facades\Log::info("Lesson {$lessonId} rejected successfully");
        } else {
            \Illuminate\Support\Facades\Log::warning("Lesson {$lessonId} is not pending, current status: {$lesson->status}");
        }
    }

    /**
     * Phê duyệt quiz
     */
    private function approveQuiz($quizId)
    {
        $quiz = \App\Models\Quiz::findOrFail($quizId);

        // Chỉ approve quiz có status pending
        if ($quiz->status === 'pending') {
            $quiz->status = 'approved';
            $quiz->save();
            \Illuminate\Support\Facades\Log::info("Quiz {$quizId} approved successfully, new status: {$quiz->status}");
        } else {
            \Illuminate\Support\Facades\Log::warning("Quiz {$quizId} cannot be approved, current status: {$quiz->status}");
        }
    }

    /**
     * Từ chối quiz
     */
    private function rejectQuiz($quizId, $note)
    {
        $quiz = \App\Models\Quiz::findOrFail($quizId);

        // Chỉ reject quiz có status pending
        if ($quiz->status === 'pending') {
            $quiz->status = 'rejected';
            $quiz->save();
            \Illuminate\Support\Facades\Log::info("Quiz {$quizId} rejected successfully");
        } else {
            \Illuminate\Support\Facades\Log::warning("Quiz {$quizId} cannot be rejected, current status: {$quiz->status}");
        }
    }

    /**
     * Phê duyệt yêu cầu xóa resource (từ ResourceEdit với edited_file_url = null)
     */
    private function approveDeleteResource($editId)
    {
        $edit = \App\Models\ResourceEdit::findOrFail($editId);
        $resource = $edit->resource;

        // Kiểm tra nếu đây là yêu cầu xóa (edited_file_url = null)
        if ($edit->edited_file_url === null && ($edit->note === 'Yêu cầu xóa tài liệu' || $edit->note === 'Yêu cầu xóa video')) {
            // Xóa file vật lý
            if ($resource->file_url && !filter_var($resource->file_url, FILTER_VALIDATE_URL)) {
                try {
                    // Xóa file mã hóa nếu có
                    if ($resource->encrypted_path) {
                        $encryptedFullPath = storage_path('app/' . $resource->encrypted_path);
                        if (file_exists($encryptedFullPath)) {
                            unlink($encryptedFullPath);
                        }
                    }

                    // Xóa file gốc
                    $filePath = str_replace('storage/', '', $resource->file_url);
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($filePath);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error deleting resource file: ' . $e->getMessage());
                }
            }

            // Xóa resource khỏi database
            $resource->delete();

            // Cập nhật trạng thái edit
            $edit->status = \App\Models\ResourceEdit::STATUS_APPROVED;
            $edit->save();

            \Illuminate\Support\Facades\Log::info("Delete resource request approved and resource {$resource->id} deleted");
        } else {
            // Xử lý edit bình thường
            $this->approveResourceEdit($editId);
        }
    }

    /**
     * Từ chối yêu cầu xóa resource
     */
    private function rejectDeleteResource($editId, $note)
    {
        $edit = \App\Models\ResourceEdit::findOrFail($editId);

        // Cập nhật trạng thái edit
        $edit->status = \App\Models\ResourceEdit::STATUS_REJECTED;
        $edit->note = $note;
        $edit->save();

        \Illuminate\Support\Facades\Log::info("Delete resource request rejected for edit {$editId}");
    }
}
