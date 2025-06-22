import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    DocumentTextIcon,
    PlayCircleIcon,
    QuestionMarkCircleIcon,
    UsersIcon,
    CalendarIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    GlobeAltIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import DocumentModal from '../../Components/DocumentModal';
import VideoModal from '../../Components/VideoModal';
import { route } from 'ziggy-js';
import axios from 'axios';

const CourseDetail = ({ course }) => {
    const [activeTab, setActiveTab] = useState('lessons');
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [showAddResource, setShowAddResource] = useState(null);
    const [showAddQuiz, setShowAddQuiz] = useState(null);
    const [expandedLessons, setExpandedLessons] = useState({});
    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    // Form cho thêm bài giảng
    const lessonForm = useForm({
        course_id: course.id,
        title: '',
        order: course.lessons?.length + 1 || 1
    });

    // Form cho thêm tài liệu (document)
    const documentForm = useForm({
        lesson_id: '',
        type: 'document',
        title: '',
        file: null,
        is_preview: 0,
        order: 0,
        uploadProgress: 0
    });
    // Form cho thêm video
    const videoForm = useForm({
        lesson_id: '',
        type: 'video',
        title: '',
        file: null,
        url: '',
        uploadMethod: 'file',
        is_preview: 0,
        order: 0,
        uploadProgress: 0
    });
    // Form cho thêm quiz
    const quizForm = useForm({
        lesson_id: '',
        title: '',
        duration_minutes: 30,
        pass_score: 70,
        questions: [
            {
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_option: 'A'
            }
        ]
    });

    // Form cho cập nhật order
    const orderForm = useForm({
        order: 1
    });

    const handleAddLesson = (e) => {
        e.preventDefault();
        lessonForm.post(route('instructor.courses.lessons.store', course.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowAddLesson(false);
                lessonForm.reset();
            }
        });
    };

    const handleAddDocument = async (e) => {
        e.preventDefault();

        if (documentForm.data.file) {
            await handleChunkUpload(documentForm.data.file, showAddResource, 'document');
        } else {
            alert('Vui lòng chọn file để tải lên.');
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();

        if (videoForm.data.uploadMethod === 'file') {
            if (videoForm.data.file) {
                await handleChunkUpload(videoForm.data.file, showAddResource, 'video');
            } else {
                alert('Vui lòng chọn file video để tải lên.');
            }
        } else if (videoForm.data.uploadMethod === 'url') {
            if (videoForm.data.url) {
                await handleVideoUrlUpload();
            } else {
                alert('Vui lòng nhập URL video.');
            }
        }
    };

    const handleVideoUrlUpload = async () => {
        const formData = new FormData();
        formData.append('title', videoForm.data.title);
        formData.append('file', videoForm.data.url);
        formData.append('is_preview', videoForm.data.is_preview ? 1 : 0);

        let fileType = 'url';
        if (videoForm.data.url.includes('youtube.com') || videoForm.data.url.includes('youtu.be')) {
            fileType = 'youtube';
        } else if (videoForm.data.url.includes('vimeo.com')) {
            fileType = 'vimeo';
        }
        formData.append('file_type', fileType);

        try {
            const response = await axios.post(
                route('instructor.courses.lessons.videos.store', {
                    id: course.id,
                    lessonId: showAddResource,
                }),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setShowAddResource(null);
            videoForm.reset();

            // Reload trang để hiển thị video mới
            router.reload({
                preserveScroll: true,
                preserveState: false
            });

        } catch (error) {
            console.error('Error uploading video URL:', error);
            alert('Có lỗi xảy ra khi thêm video từ URL.');
        }
    };

    const handleAddQuiz = (e) => {
        e.preventDefault();
        quizForm.post(route('instructor.courses.quizzes.store', course.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowAddQuiz(null);
                quizForm.reset();
            }
        });
    };

    const addQuizQuestion = () => {
        quizForm.setData('questions', [
            ...quizForm.data.questions,
            {
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_option: 'A'
            }
        ]);
    };

    const removeQuizQuestion = (index) => {
        const newQuestions = quizForm.data.questions.filter((_, i) => i !== index);
        quizForm.setData('questions', newQuestions);
    };

    const toggleLessonExpand = (lessonId) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    const handleUpdateOrder = (lessonId, currentOrder) => {
        setEditingOrder(lessonId);
        orderForm.setData('order', currentOrder);
    };

    const handleSaveOrder = (lessonId) => {
        orderForm.put(route('instructor.courses.lessons.update-order', {
            id: course.id,
            lessonId: lessonId
        }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setEditingOrder(null);
            },
            onError: (errors) => {
                console.error('Lỗi cập nhật order:', errors);
            }
        });
    };

    const handleCancelEditOrder = () => {
        setEditingOrder(null);
        orderForm.reset();
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'video':
                return <PlayCircleIcon className="h-5 w-5 text-blue-500" />;
            case 'document':
                return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
            default:
                return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const handleViewDocument = (document) => {
        console.log('Viewing document:', document);
        setSelectedDocument(document);
        setShowDocumentModal(true);
    };

    const handleViewVideo = (video) => {
        console.log('Viewing video:', video);
        setSelectedVideo(video);
        setShowVideoModal(true);
    };

    const closeDocumentModal = () => {
        setShowDocumentModal(false);
        setSelectedDocument(null);
    };

    const closeVideoModal = () => {
        setShowVideoModal(false);
        setSelectedVideo(null);
    };
    // Function để xóa tài liệu
    const handleDeleteResource = (lessonId, resourceId, type) => {
        if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
            const deleteRoute = type === 'video'
                ? route('instructor.courses.lessons.videos.delete', {
                    id: course.id,
                    lessonId: lessonId,
                    videoId: resourceId
                })
                : route('instructor.courses.lessons.documents.delete', {
                    id: course.id,
                    lessonId: lessonId,
                    documentId: resourceId
                });

            router.delete(deleteRoute, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Có thể thêm toast notification ở đây
                }
            });
        }
    };

    const handleChunkUpload = async (file, lessonId, type) => {
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        let uploadUrl, form;
        if (type === 'video') {
            // Upload video qua VideoController với chunk
            uploadUrl = route('instructor.courses.lessons.videos.store', {
                id: course.id,
                lessonId: lessonId,
            });
            form = videoForm;
        } else {
            // Upload document qua DocumentController (chunk upload)
            uploadUrl = route('instructor.courses.lessons.documents.chunkUpload', {
                id: course.id,
                lessonId: lessonId,
            });
            form = documentForm;
        }

        try {
            if (type === 'video') {
                // Đối với video, sử dụng chunk upload
                for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                    const start = chunkIndex * CHUNK_SIZE;
                    const end = Math.min(file.size, start + CHUNK_SIZE);
                    const chunk = file.slice(start, end);

                    const formData = new FormData();
                    formData.append('file', chunk);
                    formData.append('chunkIndex', chunkIndex);
                    formData.append('totalChunks', totalChunks);
                    formData.append('fileName', file.name);
                    formData.append('uploadId', uploadId);
                    formData.append('title', form.data.title);
                    formData.append('is_preview', form.data.is_preview ? 1 : 0);

                    const response = await axios.post(uploadUrl, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                ((chunkIndex + progressEvent.loaded / progressEvent.total) / totalChunks) * 100
                            );
                            form.setData('uploadProgress', progress);
                        },
                    });

                    // Kiểm tra xem upload đã hoàn thành chưa
                    if (response.data.isComplete) {
                        break;
                    }
                }
            } else {
                // Đối với document, sử dụng chunk upload (logic cũ)
                for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                    const start = chunkIndex * CHUNK_SIZE;
                    const end = Math.min(file.size, start + CHUNK_SIZE);
                    const chunk = file.slice(start, end);

                    const formData = new FormData();
                    formData.append('file', chunk);
                    formData.append('chunkIndex', chunkIndex);
                    formData.append('totalChunks', totalChunks);
                    formData.append('fileName', file.name);
                    formData.append('uploadId', uploadId);

                    await axios.post(uploadUrl, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                ((chunkIndex + progressEvent.loaded / progressEvent.total) / totalChunks) * 100
                            );
                            form.setData('uploadProgress', progress);
                        },
                    });
                }
            }

            // Reset progress và đóng modal
            form.setData('uploadProgress', 0);
            setShowAddResource(null);

            // Reset form
            form.reset();

            // Reload trang để hiển thị tài liệu mới
            router.reload({
                preserveScroll: true,
                preserveState: false
            });

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Có lỗi xảy ra khi tải lên file.');
            form.setData('uploadProgress', 0);
        }
    };

    return (
        <InstructorLayout>
            <Head title={`Chi tiết khóa học - ${course.title}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <Link
                                    href={route('instructor.courses.index')}
                                    className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
                                    preserveScroll
                                    preserveState
                                >
                                    ← Quay lại danh sách khóa học
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                                <p className="mt-2 text-gray-600">{course.description}</p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route('instructor.courses.edit', course.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                    preserveScroll
                                    preserveState
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                </Link>
                            </div>
                        </div>

                        {/* Course Stats */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center">
                                    <UsersIcon className="h-8 w-8 text-blue-500" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Học viên</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {course.enrollments?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center">
                                    <DocumentTextIcon className="h-8 w-8 text-green-500" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Bài giảng</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {course.lessons?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-8 w-8 text-purple-500" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                                        <p className="text-lg font-semibold text-gray-900 capitalize">
                                            {course.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="text-green-500 text-2xl">₫</div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Giá</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {course.price?.toLocaleString() || 'Miễn phí'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('lessons')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'lessons'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Bài giảng
                            </button>
                            <button
                                onClick={() => setActiveTab('students')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'students'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Học viên
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === 'lessons' && (
                            <div>
                                {/* Add Lesson Button */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => setShowAddLesson(true)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Thêm bài giảng
                                    </button>
                                </div>

                                {/* Add Lesson Form */}
                                {showAddLesson && (
                                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                                        <h3 className="text-lg font-medium mb-4">Thêm bài giảng mới</h3>
                                        <form onSubmit={handleAddLesson}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tiêu đề bài giảng
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={lessonForm.data.title}
                                                        onChange={(e) => lessonForm.setData('title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                    {lessonForm.errors.title && (
                                                        <p className="text-red-500 text-sm mt-1">{lessonForm.errors.title}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Thứ tự
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={lessonForm.data.order}
                                                        onChange={(e) => lessonForm.setData('order', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-3 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddLesson(false)}
                                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={lessonForm.processing}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    {lessonForm.processing ? 'Đang thêm...' : 'Thêm bài giảng'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Lessons List */}
                                <div className="space-y-4">
                                    {course.lessons?.length > 0 ? (
                                        course.lessons.map((lesson) => (
                                            <div key={lesson.id} className="bg-white rounded-lg shadow">
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => toggleLessonExpand(lesson.id)}
                                                                className="mr-3"
                                                            >
                                                                {expandedLessons[lesson.id] ? (
                                                                    <ChevronDownIcon className="h-5 w-5" />
                                                                ) : (
                                                                    <ChevronRightIcon className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                            <div className="flex items-center space-x-3">
                                                                {/* Order Display/Edit */}
                                                                {editingOrder === lesson.id ? (
                                                                    <div className="flex items-center space-x-2">
                                                                        <input
                                                                            type="number"
                                                                            value={orderForm.data.order}
                                                                            onChange={(e) => orderForm.setData('order', parseInt(e.target.value) || 1)}
                                                                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            min="1"
                                                                            max={course.lessons.length}
                                                                        />
                                                                        <button
                                                                            onClick={() => handleSaveOrder(lesson.id)}
                                                                            disabled={orderForm.processing}
                                                                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                                                            title="Lưu"
                                                                        >
                                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </button>
                                                                        <button
                                                                            onClick={handleCancelEditOrder}
                                                                            className="text-gray-600 hover:text-gray-800"
                                                                            title="Hủy"
                                                                        >
                                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleUpdateOrder(lesson.id, lesson.order)}
                                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                                        title="Chỉnh sửa thứ tự"
                                                                    >
                                                                        <span>{lesson.order}</span>
                                                                        <PencilIcon className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                                <div>
                                                                    <h3 className="text-lg font-medium text-gray-900">
                                                                        {lesson.title}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        {lesson.resources?.length || 0} tài liệu •
                                                                        {lesson.quiz ? ' Có quiz' : ' Chưa có quiz'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => setShowAddResource(lesson.id)}
                                                                className="text-blue-600 hover:text-blue-800 p-2"
                                                                title="Thêm tài liệu"
                                                            >
                                                                <PlusIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowAddQuiz(lesson.id)}
                                                                className="text-green-600 hover:text-green-800 p-2"
                                                                title="Thêm quiz"
                                                            >
                                                                <QuestionMarkCircleIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Hiển thị lỗi order nếu có */}
                                                    {orderForm.errors.order && editingOrder === lesson.id && (
                                                        <div className="mt-2 text-red-500 text-sm">
                                                            {orderForm.errors.order}
                                                        </div>
                                                    )}

                                                    {/* Expanded Content */}
                                                    {expandedLessons[lesson.id] && (
                                                        <div className="mt-4 pl-8">
                                                            {/* Resources */}
                                                            {lesson.resources?.length > 0 && (
                                                                <div className="mb-4">
                                                                    <h4 className="font-medium text-gray-700 mb-2">Tài liệu:</h4>
                                                                    <div className="space-y-2">
                                                                        {lesson.resources.map((resource) => (
                                                                            <div key={resource.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                                                <div className="flex items-center">
                                                                                    {getFileIcon(resource.type)}

                                                                                    <span className="ml-2 text-sm">{resource.title}</span>

                                                                                    {resource.is_preview ? (
                                                                                        <span className="ml-2 inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                                            <GlobeAltIcon className="w-4 h-4 mr-1" />
                                                                                            Public
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="ml-2 inline-flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                                                            <LockClosedIcon className="w-4 h-4 mr-1" />
                                                                                            Private
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <button
                                                                                        onClick={() => resource.type === 'video'
                                                                                            ? handleViewVideo(resource)
                                                                                            : handleViewDocument(resource)
                                                                                        }
                                                                                        className="text-blue-600 hover:text-blue-800"
                                                                                        title={resource.type === 'video' ? 'Xem video' : 'Xem tài liệu'}
                                                                                    >
                                                                                        <EyeIcon className="h-4 w-4" />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleDeleteResource(lesson.id, resource.id, resource.type)}
                                                                                        className="text-red-600 hover:text-red-800"
                                                                                        title="Xóa tài liệu"
                                                                                    >
                                                                                        <TrashIcon className="h-4 w-4" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Quiz */}
                                                            {lesson.quiz && (
                                                                <div className="mb-4">
                                                                    <h4 className="font-medium text-gray-700 mb-2">Quiz:</h4>
                                                                    <div className="bg-yellow-50 p-3 rounded">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <p className="font-medium">{lesson.quiz.title}</p>
                                                                                <p className="text-sm text-gray-600">
                                                                                    {lesson.quiz.duration_minutes} phút •
                                                                                    Điểm đậu: {lesson.quiz.pass_score}%
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <button className="text-blue-600 hover:text-blue-800">
                                                                                    <PencilIcon className="h-4 w-4" />
                                                                                </button>
                                                                                <button className="text-red-600 hover:text-red-800">
                                                                                    <TrashIcon className="h-4 w-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Add Resource Form */}
                                                {showAddResource === lesson.id && (
                                                    <div className="border-t p-4 bg-gray-50">
                                                        <h4 className="font-medium mb-3">Thêm tài liệu</h4>

                                                        {/* Tab chọn loại tài liệu */}
                                                        <div className="mb-4">
                                                            <div className="flex space-x-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        documentForm.setData('type', 'document');
                                                                        videoForm.setData('type', 'document');
                                                                    }}
                                                                    className={`px-4 py-2 rounded-md ${documentForm.data.type === 'document'
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                        }`}
                                                                >
                                                                    <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                                                                    Tài liệu
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        documentForm.setData('type', 'video');
                                                                        videoForm.setData('type', 'video');
                                                                    }}
                                                                    className={`px-4 py-2 rounded-md ${documentForm.data.type === 'video'
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                        }`}
                                                                >
                                                                    <PlayCircleIcon className="h-4 w-4 inline mr-2" />
                                                                    Video
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Form cho Document */}
                                                        {documentForm.data.type === 'document' && (
                                                            <form onSubmit={handleAddDocument}>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Tiêu đề
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={documentForm.data.title}
                                                                            onChange={(e) => documentForm.setData('title', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                        {documentForm.errors.title && (
                                                                            <div className="text-red-600 text-sm mt-1">
                                                                                {documentForm.errors.title}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="md:col-span-2">
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            File tài liệu
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            onChange={(e) => documentForm.setData('file', e.target.files[0])}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            accept=".pdf,.doc,.docx"
                                                                            required
                                                                        />
                                                                        {documentForm.errors.file && (
                                                                            <div className="text-red-600 text-sm mt-1">
                                                                                {documentForm.errors.file}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="md:col-span-2">
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={documentForm.data.is_preview}
                                                                                onChange={(e) => documentForm.setData('is_preview', e.target.checked)}
                                                                                className="mr-2"
                                                                            />
                                                                            Cho phép xem trước (không cần đăng ký)
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-end space-x-3 mt-4">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowAddResource(null)}
                                                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        disabled={documentForm.processing}
                                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                                    >
                                                                        {documentForm.processing ? 'Đang thêm...' : 'Thêm tài liệu'}
                                                                    </button>
                                                                </div>

                                                                {/* Upload Progress cho Document */}
                                                                {documentForm.data.uploadProgress > 0 && (
                                                                    <div className="mt-3">
                                                                        <p className="text-sm text-gray-600">Đang tải lên: {documentForm.data.uploadProgress}%</p>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                                style={{ width: `${documentForm.data.uploadProgress}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </form>
                                                        )}

                                                        {/* Form cho Video */}
                                                        {documentForm.data.type === 'video' && (
                                                            <form onSubmit={handleAddVideo}>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Tiêu đề video
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={videoForm.data.title}
                                                                            onChange={(e) => videoForm.setData('title', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                        {videoForm.errors.title && (
                                                                            <div className="text-red-600 text-sm mt-1">
                                                                                {videoForm.errors.title}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Chọn cách thêm video */}
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Cách thêm video
                                                                        </label>
                                                                        <div className="flex space-x-4">
                                                                            <label className="flex items-center">
                                                                                <input
                                                                                    type="radio"
                                                                                    name="uploadMethod"
                                                                                    value="file"
                                                                                    checked={videoForm.data.uploadMethod === 'file'}
                                                                                    onChange={(e) => videoForm.setData('uploadMethod', e.target.value)}
                                                                                    className="mr-2"
                                                                                />
                                                                                Upload file video
                                                                            </label>
                                                                            <label className="flex items-center">
                                                                                <input
                                                                                    type="radio"
                                                                                    name="uploadMethod"
                                                                                    value="url"
                                                                                    checked={videoForm.data.uploadMethod === 'url'}
                                                                                    onChange={(e) => videoForm.setData('uploadMethod', e.target.value)}
                                                                                    className="mr-2"
                                                                                />
                                                                                Nhập URL (YouTube, Vimeo, v.v.)
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    {/* File upload cho video */}
                                                                    {videoForm.data.uploadMethod === 'file' && (
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                File video
                                                                            </label>
                                                                            <input
                                                                                type="file"
                                                                                onChange={(e) => videoForm.setData('file', e.target.files[0])}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                accept="video/*"
                                                                                required
                                                                            />
                                                                            {videoForm.errors.file && (
                                                                                <div className="text-red-600 text-sm mt-1">
                                                                                    {videoForm.errors.file}
                                                                                </div>
                                                                            )}
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                Hỗ trợ: MP4, AVI, MOV, WMV, WebM (tối đa 100MB)
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {/* URL input cho video */}
                                                                    {videoForm.data.uploadMethod === 'url' && (
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                URL video
                                                                            </label>
                                                                            <input
                                                                                type="url"
                                                                                value={videoForm.data.url}
                                                                                onChange={(e) => videoForm.setData('url', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                placeholder="https://www.youtube.com/watch?v=..."
                                                                                required
                                                                            />
                                                                            {videoForm.errors.url && (
                                                                                <div className="text-red-600 text-sm mt-1">
                                                                                    {videoForm.errors.url}
                                                                                </div>
                                                                            )}
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                Hỗ trợ: YouTube, Vimeo và các URL video khác
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <div>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={videoForm.data.is_preview}
                                                                                onChange={(e) => videoForm.setData('is_preview', e.target.checked)}
                                                                                className="mr-2"
                                                                            />
                                                                            Cho phép xem trước (không cần đăng ký)
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-end space-x-3 mt-4">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowAddResource(null)}
                                                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        disabled={videoForm.processing}
                                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                                    >
                                                                        {videoForm.processing ? 'Đang thêm...' : 'Thêm video'}
                                                                    </button>
                                                                </div>

                                                                {/* Upload Progress cho Video */}
                                                                {videoForm.data.uploadProgress > 0 && (
                                                                    <div className="mt-3">
                                                                        <p className="text-sm text-gray-600">Đang tải lên: {videoForm.data.uploadProgress}%</p>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                                style={{ width: `${videoForm.data.uploadProgress}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </form>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Add Quiz Form */}
                                                {showAddQuiz === lesson.id && (
                                                    <div className="border-t p-4 bg-gray-50">
                                                        <h4 className="font-medium mb-3">Thêm Quiz</h4>
                                                        <form onSubmit={handleAddQuiz}>
                                                            <input type="hidden" value={lesson.id} onChange={(e) => quizForm.setData('lesson_id', lesson.id)} />
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Tiêu đề Quiz
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={quizForm.data.title}
                                                                            onChange={(e) => quizForm.setData('title', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Thời gian (phút)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={quizForm.data.duration_minutes}
                                                                            onChange={(e) => quizForm.setData('duration_minutes', parseInt(e.target.value))}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            min="1"
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Điểm đậu (%)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={quizForm.data.pass_score}
                                                                            onChange={(e) => quizForm.setData('pass_score', parseInt(e.target.value))}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            min="0"
                                                                            max="100"
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Questions */}
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h5 className="font-medium">Câu hỏi</h5>
                                                                        <button
                                                                            type="button"
                                                                            onClick={addQuizQuestion}
                                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                                        >
                                                                            + Thêm câu hỏi
                                                                        </button>
                                                                    </div>

                                                                    {quizForm.data.questions.map((question, index) => (
                                                                        <div key={index} className="border rounded-lg p-4 mb-3 bg-white">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <h6 className="font-medium">Câu hỏi {index + 1}</h6>
                                                                                {quizForm.data.questions.length > 1 && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeQuizQuestion(index)}
                                                                                        className="text-red-600 hover:text-red-800"
                                                                                    >
                                                                                        <TrashIcon className="h-4 w-4" />
                                                                                    </button>
                                                                                )}
                                                                            </div>

                                                                            <div className="space-y-3">
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                        Nội dung câu hỏi
                                                                                    </label>
                                                                                    <textarea
                                                                                        value={question.question_text}
                                                                                        onChange={(e) => {
                                                                                            const newQuestions = [...quizForm.data.questions];
                                                                                            newQuestions[index].question_text = e.target.value;
                                                                                            quizForm.setData('questions', newQuestions);
                                                                                        }}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                        rows="2"
                                                                                        required
                                                                                    />
                                                                                    {quizForm.errors[`questions.${index}.question_text`] && (
                                                                                        <div className="text-red-600 text-sm mt-1">
                                                                                            {quizForm.errors[`questions.${index}.question_text`]}
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                    {['A', 'B', 'C', 'D'].map((option) => (
                                                                                        <div key={option}>
                                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                                Đáp án {option}
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                value={question[`option_${option.toLowerCase()}`]}
                                                                                                onChange={(e) => {
                                                                                                    const newQuestions = [...quizForm.data.questions];
                                                                                                    newQuestions[index][`option_${option.toLowerCase()}`] = e.target.value;
                                                                                                    quizForm.setData('questions', newQuestions);
                                                                                                }}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                required
                                                                                            />
                                                                                            {quizForm.errors[`questions.${index}.option_${option.toLowerCase()}`] && (
                                                                                                <div className="text-red-600 text-sm mt-1">
                                                                                                    {quizForm.errors[`questions.${index}.option_${option.toLowerCase()}`]}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>

                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                        Đáp án đúng
                                                                                    </label>
                                                                                    <select
                                                                                        value={question.correct_option}
                                                                                        onChange={(e) => {
                                                                                            const newQuestions = [...quizForm.data.questions];
                                                                                            newQuestions[index].correct_option = e.target.value;
                                                                                            quizForm.setData('questions', newQuestions);
                                                                                        }}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                        required
                                                                                    >
                                                                                        <option value="A">A</option>
                                                                                        <option value="B">B</option>
                                                                                        <option value="C">C</option>
                                                                                        <option value="D">D</option>
                                                                                    </select>
                                                                                    {quizForm.errors[`questions.${index}.correct_option`] && (
                                                                                        <div className="text-red-600 text-sm mt-1">
                                                                                            {quizForm.errors[`questions.${index}.correct_option`]}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end space-x-3 mt-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowAddQuiz(null)}
                                                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                                >
                                                                    Hủy
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    disabled={quizForm.processing}
                                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                                                >
                                                                    {quizForm.processing ? 'Đang thêm...' : 'Thêm Quiz'}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có bài giảng</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Bắt đầu bằng cách tạo bài giảng đầu tiên.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'students' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Danh sách học viên</h3>
                                {course.enrollments?.length > 0 ? (
                                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                        <ul className="divide-y divide-gray-200">
                                            {course.enrollments.map((enrollment) => (
                                                <li key={enrollment.id}>
                                                    <div className="px-4 py-4 flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {enrollment.student?.name?.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {enrollment.student?.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {enrollment.student?.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Đăng ký: {new Date(enrollment.created_at).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có học viên</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Khóa học chưa có học viên nào đăng ký.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Modal */}
            <DocumentModal
                isOpen={showDocumentModal}
                onClose={closeDocumentModal}
                document={selectedDocument}
            />

            {/* Video Modal */}
            <VideoModal
                isOpen={showVideoModal}
                onClose={closeVideoModal}
                video={selectedVideo}
            />
        </InstructorLayout>
    );
};

export default CourseDetail;