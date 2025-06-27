<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\InstructorRequest;
use App\Services\InstructorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProfileController extends Controller
{
    protected $instructorService;

    public function __construct(InstructorService $instructorService)
    {
        $this->instructorService = $instructorService;
    }

    /**
     * Show the instructor profile form.
     */
    public function edit()
    {
        $userId = Auth::id();
        $profileData = $this->instructorService->getInstructorProfile($userId);

        return Inertia::render('Intructors/Profile', [
            'user' => $profileData['user'],
            'instructor' => $profileData['instructor'],
        ]);
    }

    /**
     * Update the instructor profile.
     */
    public function update(Request $request)
    {
        try {
            $userId = Auth::id();
            $data = $request->all();

            $result = $this->instructorService->updateProfile($userId, $data);

            return redirect()->route('instructor.profile.edit')
                ->with('success', 'Hồ sơ đã được cập nhật thành công!');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Có lỗi xảy ra khi cập nhật hồ sơ: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Change password.
     */
    public function changePassword(InstructorRequest $request)
    {
        try {
            $userId = Auth::id();
            $data = $request->only(['current_password', 'new_password', 'new_password_confirmation']);

            $this->instructorService->changePassword($userId, $data);

            return redirect()->back()
                ->with('success', 'Mật khẩu đã được thay đổi thành công!');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors());
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Có lỗi xảy ra khi thay đổi mật khẩu: ' . $e->getMessage());
        }
    }

    /**
     * Delete avatar.
     */
    public function deleteAvatar()
    {
        try {
            $userId = Auth::id();
            $this->instructorService->deleteAvatar($userId);

            return redirect()->back()
                ->with('success', 'Ảnh đại diện đã được xóa thành công!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Có lỗi xảy ra khi xóa ảnh đại diện: ' . $e->getMessage());
        }
    }
}
