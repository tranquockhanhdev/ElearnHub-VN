import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from "@/Components/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    CheckIcon,
    XMarkIcon,
    DocumentTextIcon,
    VideoCameraIcon,
    PlayIcon,
    DocumentIcon,
    ShieldCheckIcon,
    ClockIcon,
    UserIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import VideoModal from '@/Components/VideoModal';
import DocumentModal from '@/Components/DocumentModal';

const CourseApprovalDetail = () => {
    const { course, contentChanges, resourceChanges } = usePage().props;
    const [activeTab, setActiveTab] = useState('content');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [previewResource, setPreviewResource] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectData, setRejectData] = useState(null);
    const [rejectNote, setRejectNote] = useState('');

    const handleApprove = (type, editId, resourceId = null, lessonId = null) => {
        const requestData = { type };
        if (type === 'new_resource') {
            requestData.resource_id = resourceId;
        } else if (type === 'lesson') {
            requestData.lesson_id = lessonId;
        } else {
            requestData.edit_id = editId;
        }

        router.post(route('admin.course-approvals.approve', course.id), requestData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Success notification can be added here
            }
        });
    };

    const handleReject = (type, editId, resourceId = null, lessonId = null) => {
        setRejectData({ type, editId, resourceId, lessonId });
        setShowRejectModal(true);
    };

    const submitReject = () => {
        const requestData = {
            type: rejectData.type,
            note: rejectNote
        };

        if (rejectData.type === 'new_resource') {
            requestData.resource_id = rejectData.resourceId;
        } else if (rejectData.type === 'lesson') {
            requestData.lesson_id = rejectData.lessonId;
        } else {
            requestData.edit_id = rejectData.editId;
        }

        router.post(route('admin.course-approvals.reject', course.id), requestData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                setRejectNote('');
                setRejectData(null);
            }
        });
    };

    const handlePreview = (resource) => {
        setPreviewResource(resource);

        const fileType = resource.file_type?.toLowerCase();

        // Kiểm tra nếu là video
        if (['mp4', 'avi', 'mov', 'wmv', 'webm', 'youtube', 'vimeo'].includes(fileType)) {
            setShowVideoModal(true);
        }
        // Kiểm tra nếu là document
        else if (['pdf', 'doc', 'docx'].includes(fileType)) {
            setShowDocumentModal(true);
        }
    };

    const getFileTypeIcon = (fileType) => {
        const iconClasses = "h-6 w-6";
        if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(fileType)) {
            return <VideoCameraIcon className={`${iconClasses} text-white`} />;
        }
        if (fileType === 'pdf') {
            return <DocumentIcon className={`${iconClasses} text-white`} />;
        }
        return <DocumentTextIcon className={`${iconClasses} text-white`} />;
    };

    const getFileTypeLabel = (fileType) => {
        const typeMap = {
            'mp4': 'Video MP4',
            'avi': 'Video AVI',
            'mov': 'Video MOV',
            'wmv': 'Video WMV',
            'webm': 'Video WebM',
            'pdf': 'PDF',
            'doc': 'Word DOC',
            'docx': 'Word DOCX',
            'youtube': 'YouTube',
            'vimeo': 'Vimeo'
        };
        return typeMap[fileType] || fileType?.toUpperCase();
    }; return (
        <AdminLayout>
            <Head title={`Chi tiết phê duyệt - ${course.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
                    {/* Header */}
                    <div className="mb-4">
                        <Link
                            href={route('admin.course-approvals.index')}
                            className="inline-flex items-center text-xs text-gray-600 hover:text-blue-600 mb-3 transition-colors duration-200 group"
                        >
                            <ArrowLeftIcon className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-medium">Quay lại danh sách</span>
                        </Link>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            {/* Course Image Background */}
                            <div className="h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
                                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                <div className="absolute bottom-2 left-3 right-3">
                                    <h4 className="text-base lg:text-lg font-bold text-white line-clamp-1">
                                        {course.title}
                                    </h4>
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="p-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-600">
                                        <div className="flex items-center">
                                            <UserIcon className="w-3 h-3 mr-1 text-gray-400" />
                                            <span>Giảng viên: <span className="font-semibold text-gray-900">{course.instructor?.name}</span></span>
                                        </div>
                                        <span className="hidden sm:inline text-gray-300">•</span>
                                        <div className="flex items-center">
                                            <span>ID: <span className="font-mono font-semibold text-gray-900">{course.id}</span></span>
                                        </div>
                                        <span className="hidden sm:inline text-gray-300">•</span>
                                        <div className="flex items-center">
                                            <ClockIcon className="w-3 h-3 mr-1 text-gray-400" />
                                            <span>Chờ phê duyệt</span>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="flex items-center gap-2">
                                        <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1 text-center">
                                            <div className="text-xs font-bold text-amber-700">{contentChanges.length}</div>
                                            <div className="text-xs text-amber-600">Nội dung</div>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-center">
                                            <div className="text-xs font-bold text-blue-700">{resourceChanges.length}</div>
                                            <div className="text-xs text-blue-600">Tài nguyên</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100">
                            <nav className="flex">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold border-b-2 transition-all duration-300 relative group ${activeTab === 'content'
                                        ? 'border-amber-500 text-amber-600 bg-amber-50'
                                        : 'border-transparent text-gray-500 hover:text-amber-600 hover:bg-amber-50/50'
                                        }`}
                                >
                                    <DocumentTextIcon className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                                    <div className="flex flex-col items-start">
                                        <span className="hidden sm:inline">Thay đổi nội dung</span>
                                        <span className="sm:hidden">Nội dung</span>
                                        <span className="text-xs text-gray-400 font-normal">
                                            {contentChanges.length} yêu cầu
                                        </span>
                                    </div>
                                    <span className="ml-1 bg-amber-100 text-amber-700 px-1 py-0.5 rounded-full text-xs font-bold min-w-[16px] text-center">
                                        {contentChanges.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('resources')}
                                    className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold border-b-2 transition-all duration-300 relative group ${activeTab === 'resources'
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
                                        }`}
                                >
                                    <VideoCameraIcon className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                                    <div className="flex flex-col items-start">
                                        <span className="hidden sm:inline">Tài nguyên</span>
                                        <span className="sm:hidden">Tài nguyên</span>
                                        <span className="text-xs text-gray-400 font-normal">
                                            {resourceChanges.length} yêu cầu
                                        </span>
                                    </div>
                                    <span className="ml-1 bg-blue-100 text-blue-700 px-1 py-0.5 rounded-full text-xs font-bold min-w-[16px] text-center">
                                        {resourceChanges.length}
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-3">
                            {/* Content Changes Tab */}
                            {activeTab === 'content' && (
                                <div>
                                    {contentChanges.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                                                <DocumentTextIcon className="h-6 w-6 text-amber-500" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                Không có thay đổi nội dung nào
                                            </h3>
                                            <p className="text-gray-500 text-xs max-w-md mx-auto">
                                                Hiện tại không có yêu cầu thay đổi nội dung nào cần phê duyệt cho khóa học này.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {contentChanges.map((change, index) => (
                                                <div key={change.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                                    <div className="p-3">
                                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
                                                                        <span className="text-white font-bold text-xs">{index + 1}</span>
                                                                    </div>
                                                                    <h4 className="text-sm font-bold text-gray-900">
                                                                        {change.type === 'lesson' ? (
                                                                            <span>Bài giảng mới: <span className="text-amber-700">{change.new_value}</span></span>
                                                                        ) : (
                                                                            <span>Trường: <span className="text-amber-700">{change.field}</span></span>
                                                                        )}
                                                                    </h4>
                                                                </div>

                                                                {change.type === 'lesson' ? (
                                                                    <div className="space-y-2 mb-3">
                                                                        <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                                                                            <div className="flex items-start gap-2">
                                                                                <DocumentTextIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-blue-800">Bài giảng mới</p>
                                                                                    <p className="text-sm text-blue-700">Tiêu đề: {change.lesson_data?.title}</p>
                                                                                    <p className="text-xs text-blue-600 mt-1">Thứ tự: {change.lesson_data?.order}</p>
                                                                                    {change.lesson_data?.note && (
                                                                                        <p className="text-xs text-blue-600 mt-1">Ghi chú: {change.lesson_data.note}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1">
                                                                                <XMarkIcon className="w-3 h-3 text-red-500" />
                                                                                <span className="text-xs font-semibold text-red-700">Giá trị cũ</span>
                                                                            </div>
                                                                            <div className="p-2 bg-red-50 border-l-2 border-red-400 rounded">
                                                                                <p className="text-xs text-gray-800 leading-relaxed">{change.original_value}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1">
                                                                                <CheckIcon className="w-3 h-3 text-green-500" />
                                                                                <span className="text-xs font-semibold text-green-700">Giá trị mới</span>
                                                                            </div>
                                                                            <div className="p-2 bg-green-50 border-l-2 border-green-400 rounded">
                                                                                <p className="text-xs text-gray-800 leading-relaxed">{change.new_value}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="flex items-center gap-2">
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                                                                        <ClockIcon className="w-3 h-3 mr-1" />
                                                                        Chờ phê duyệt
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-32">
                                                                <button
                                                                    onClick={() => change.type === 'lesson'
                                                                        ? handleApprove('lesson', null, null, change.id)
                                                                        : handleApprove('content', change.id)
                                                                    }
                                                                    className="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-md hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                >
                                                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                    Phê duyệt
                                                                </button>
                                                                <button
                                                                    onClick={() => change.type === 'lesson'
                                                                        ? handleReject('lesson', null, null, change.id)
                                                                        : handleReject('content', change.id)
                                                                    }
                                                                    className="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-md hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                >
                                                                    <XMarkIcon className="h-3 w-3 mr-1" />
                                                                    Từ chối
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Resources Tab */}
                            {activeTab === 'resources' && (
                                <div>
                                    {resourceChanges.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                <VideoCameraIcon className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                Không có tài nguyên nào chờ duyệt
                                            </h3>
                                            <p className="text-gray-500 text-xs max-w-md mx-auto">
                                                Hiện tại không có tài nguyên nào cần phê duyệt cho khóa học này.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {resourceChanges.map((resource, index) => (
                                                <div key={`${resource.type}-${resource.id}`} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                                    <div className="p-3">
                                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-start space-x-2 mb-3">
                                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        {getFileTypeIcon(resource.file_type)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                                                                <span className="text-white font-bold text-xs">{index + 1}</span>
                                                                            </div>
                                                                            <h4 className="text-sm font-bold text-gray-900 truncate">
                                                                                {resource.new_title || resource.original_title}
                                                                            </h4>
                                                                        </div>
                                                                        <div className="flex flex-wrap items-center gap-1 mb-2">
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                                                                {getFileTypeLabel(resource.file_type)}
                                                                            </span>

                                                                            {resource.type === 'new_resource' ? (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                                                                    ✨ Tài nguyên mới
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                                                    ✏️ Chỉnh sửa
                                                                                </span>
                                                                            )}

                                                                            {resource.is_encrypted && (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                                                                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                                                                    DRM
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="bg-white bg-opacity-70 rounded p-1.5 mb-2">
                                                                            <p className="text-xs text-gray-700">
                                                                                <span className="font-semibold">Bài học:</span> {resource.lesson_title}
                                                                            </p>
                                                                        </div>

                                                                        {resource.type === 'edit' && resource.new_title && resource.new_title !== resource.original_title && (
                                                                            <div className="bg-yellow-50 border-l-2 border-yellow-400 p-2 rounded mb-2">
                                                                                <div className="flex items-center">
                                                                                    <ExclamationTriangleIcon className="h-3 w-3 text-yellow-400 mr-1" />
                                                                                    <span className="text-xs font-medium text-yellow-800">Thay đổi tên tệp</span>
                                                                                </div>
                                                                                <p className="text-xs text-yellow-700 mt-1">
                                                                                    <span className="font-medium">Tên cũ:</span> {resource.original_title}
                                                                                </p>
                                                                            </div>
                                                                        )}

                                                                        {resource.can_preview && (
                                                                            <button
                                                                                onClick={() => handlePreview(resource)}
                                                                                className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                            >
                                                                                {resource.file_type === 'pdf' ? (
                                                                                    <DocumentIcon className="h-3 w-3 mr-1" />
                                                                                ) : (
                                                                                    <PlayIcon className="h-3 w-3 mr-1" />
                                                                                )}
                                                                                Xem trước
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-32">
                                                                <button
                                                                    onClick={() => {
                                                                        if (resource.type === 'new_resource') {
                                                                            handleApprove('new_resource', null, resource.resource_id);
                                                                        } else {
                                                                            handleApprove('resource', resource.id);
                                                                        }
                                                                    }}
                                                                    className="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-md hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                >
                                                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                    Phê duyệt
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (resource.type === 'new_resource') {
                                                                            handleReject('new_resource', null, resource.resource_id);
                                                                        } else {
                                                                            handleReject('resource', resource.id);
                                                                        }
                                                                    }}
                                                                    className="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-md hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                >
                                                                    <XMarkIcon className="h-3 w-3 mr-1" />
                                                                    Từ chối
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
                            onClick={() => setShowRejectModal(false)}
                        ></div>

                        {/* Modal */}
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg leading-6 font-bold text-white">
                                            Từ chối yêu cầu
                                        </h3>
                                        <p className="text-xs text-red-100">
                                            Yêu cầu này sẽ bị từ chối và gửi thông báo cho giảng viên
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="bg-white px-4 py-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Lý do từ chối <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={rejectNote}
                                            onChange={(e) => setRejectNote(e.target.value)}
                                            rows={3}
                                            className="w-full border-2 border-gray-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-200 resize-none"
                                            placeholder="Vui lòng mô tả chi tiết lý do từ chối để giảng viên có thể hiểu và khắc phục..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Thông tin này sẽ được gửi trực tiếp đến giảng viên
                                        </p>
                                    </div>

                                    {/* Quick reasons */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Lý do phổ biến:
                                        </label>
                                        <div className="grid grid-cols-1 gap-1">
                                            {[
                                                "Nội dung không phù hợp với yêu cầu khóa học",
                                                "Chất lượng tài nguyên không đạt yêu cầu",
                                                "Thông tin không chính xác hoặc sai lệch",
                                                "Vi phạm quy định về bản quyền",
                                                "Cần bổ sung thêm thông tin"
                                            ].map((reason, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setRejectNote(reason)}
                                                    className="text-left px-2 py-1 text-xs text-gray-700 bg-gray-50 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200 border border-gray-200 hover:border-red-200"
                                                >
                                                    {reason}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse gap-2">
                                <button
                                    onClick={submitReject}
                                    disabled={!rejectNote.trim()}
                                    className="w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-1" />
                                    Từ chối yêu cầu
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectNote('');
                                        setRejectData(null);
                                    }}
                                    className="mt-2 w-full inline-flex justify-center items-center rounded-lg border-2 border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto transition-all duration-200"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {showVideoModal && previewResource && (
                <VideoModal
                    isOpen={showVideoModal}
                    onClose={() => {
                        setShowVideoModal(false);
                        setPreviewResource(null);
                    }}
                    video={{
                        title: previewResource.new_title || previewResource.original_title,
                        file_url: previewResource.new_file_url || previewResource.original_file_url,
                        file: previewResource.new_file_url || previewResource.original_file_url,
                        file_type: previewResource.file_type
                    }}
                />
            )}

            {/* Document Modal */}
            {showDocumentModal && previewResource && (
                <DocumentModal
                    isOpen={showDocumentModal}
                    onClose={() => {
                        setShowDocumentModal(false);
                        setPreviewResource(null);
                    }}
                    document={{
                        title: previewResource.new_title || previewResource.original_title,
                        file_url: previewResource.new_file_url || previewResource.original_file_url,
                        file_type: previewResource.file_type
                    }}
                />
            )}
        </AdminLayout>
    );
};

export default CourseApprovalDetail;
