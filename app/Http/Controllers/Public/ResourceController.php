<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\CourseService;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    /**
     * Preview a resource (video/document)
     */
    public function preview($resourceId)
    {
        $resource = Resource::with('lesson.course')->find($resourceId);

        if (!$resource) {
            abort(404, 'Tài liệu không tồn tại');
        }

        // Kiểm tra quyền truy cập
        if (!$this->courseService->canAccessResource($resourceId, Auth::id())) {
            abort(403, 'Bạn không có quyền truy cập tài liệu này');
        }

        return response()->json([
            'success' => true,
            'resource' => [
                'id' => $resource->id,
                'title' => $resource->title,
                'type' => $resource->type,
                'file_type' => $resource->file_type,
                'file_url' => $resource->file_url,
                'is_preview' => $resource->is_preview,
            ]
        ]);
    }

    /**
     * Stream video for preview
     */
    public function streamVideo($resourceId)
    {
        $resource = Resource::find($resourceId);

        if (!$resource || !$this->courseService->canAccessResource($resourceId, Auth::id())) {
            abort(403, 'Không có quyền truy cập');
        }

        if ($resource->type !== 'video') {
            abort(400, 'Tài liệu không phải là video');
        }

        // Return video URL for streaming
        $videoUrl = $resource->file_url;

        if (!$videoUrl) {
            abort(404, 'Video không tồn tại');
        }

        return response()->json([
            'success' => true,
            'video_url' => $videoUrl,
            'title' => $resource->title
        ]);
    }
}
