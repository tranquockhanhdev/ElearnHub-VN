<?php

namespace App\Services;

use App\Repositories\InstructorRepository;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class InstructorService
{
    protected $instructorRepository;

    public function __construct(InstructorRepository $instructorRepository)
    {
        $this->instructorRepository = $instructorRepository;
    }

    public function getDashboardData($instructorId)
    {
        return Cache::remember("instructor_dashboard_{$instructorId}", 300, function () use ($instructorId) {
            return [
                'stats' => $this->instructorRepository->getInstructorStats($instructorId),
                'revenue_chart' => $this->instructorRepository->getRevenueChart($instructorId, 'month'),
                'latest_enrollments' => $this->instructorRepository->getLatestEnrollments($instructorId, 10),
                'popular_courses' => $this->instructorRepository->getPopularCourses($instructorId, 5),
                'revenue_by_course' => $this->instructorRepository->getRevenueBycourse($instructorId)
            ];
        });
    }

    public function getRevenueChartData($instructorId, $period = 'month')
    {
        return $this->instructorRepository->getRevenueChart($instructorId, $period);
    }

    public function getInstructorProfile($userId)
    {
        $user = User::with('role')->findOrFail($userId);
        $instructor = $this->instructorRepository->getInstructorByUserId($userId);

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'created_at' => $user->created_at,
                'email_verified_at' => $user->email_verified_at,
                'role' => $user->role
            ],
            'instructor' => $instructor ? [
                'bio' => $instructor->bio,
                'avatar' => $instructor->avatar,
                'profession' => $instructor->profession,
                'facebook_url' => $instructor->facebook_url,
                'twitter_url' => $instructor->twitter_url,
                'linkedin_url' => $instructor->linkedin_url,
            ] : [
                'bio' => null,
                'avatar' => null,
                'profession' => null,
                'facebook_url' => null,
                'twitter_url' => null,
                'linkedin_url' => null,
            ]
        ];
    }

    public function updateProfile($userId, array $data)
    {
        // Validate data
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
            'profession' => 'nullable|string|max:255',
            'facebook_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:10240'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Update user information
        $user = User::findOrFail($userId);
        $user->update([
            'name' => $data['name'],
            'phone' => $data['phone'] ?? $user->phone,
        ]);

        // Handle avatar upload
        $avatarPath = null;
        if (isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            $avatarPath = $this->instructorRepository->uploadAvatar($data['avatar'], $userId);
        }

        // Update instructor profile
        $instructorData = [
            'bio' => $data['bio'] ?? null,
            'profession' => $data['profession'] ?? null,
            'facebook_url' => $data['facebook_url'] ?? null,
            'twitter_url' => $data['twitter_url'] ?? null,
            'linkedin_url' => $data['linkedin_url'] ?? null,
        ];

        if ($avatarPath) {
            $instructorData['avatar'] = $avatarPath;
        }

        $instructor = $this->instructorRepository->updateInstructorProfile($userId, $instructorData);

        return [
            'user' => $user->fresh(),
            'instructor' => $instructor
        ];
    }

    public function changePassword($userId, array $data)
    {
        $validator = Validator::make($data, [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $user = User::findOrFail($userId);

        // Verify current password
        if (!Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Mật khẩu hiện tại không đúng.']
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($data['new_password'])
        ]);

        return $user;
    }

    public function deleteAvatar($userId)
    {
        return $this->instructorRepository->deleteAvatar($userId);
    }
}
