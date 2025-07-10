import React, { useState, useEffect } from 'react';
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
    const [editingResourceOrder, setEditingResourceOrder] = useState(null);
    const [showEditQuiz, setShowEditQuiz] = useState(null);
    const [showEditDocument, setShowEditDocument] = useState(null);
    const [showEditVideo, setShowEditVideo] = useState(null);
    const [expandedResourceEdits, setExpandedResourceEdits] = useState({});

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
    // Form cho chỉnh sửa quiz
    const editQuizForm = useForm({
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
    useEffect(() => {
        if (showAddQuiz) {
            quizForm.setData('lesson_id', showAddQuiz);
        }
    }, [showAddQuiz]);
    // Form cho cập nhật order
    const orderForm = useForm({
        order: 1
    });
    const resourceOrderForm = useForm({
        order: 1
    });
    // Form cho chỉnh sửa tài liệu
    const editDocumentForm = useForm({
        title: '',
        file: null,
        is_preview: 0,
        uploadProgress: 0
    });

    // Form cho chỉnh sửa video
    const editVideoForm = useForm({
        title: '',
        file: null,
        url: '',
        uploadMethod: 'file',
        is_preview: 0,
        uploadProgress: 0
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
                // Kiểm tra định dạng file
                const fileName = videoForm.data.file.name.toLowerCase();
                if (!fileName.endsWith('.webm')) {
                    alert('Chỉ cho phép upload file định dạng WebM.');
                    return;
                }

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

    const handleAddQuiz = (e, lessonId) => {
        e.preventDefault();
        quizForm.setData('lesson_id', lessonId);
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
    const handleEditQuiz = (quiz) => {

        setShowEditQuiz(quiz.id);

        // Đảm bảo questions có dữ liệu đúng và correct_option được preserve
        const questionsData = quiz.questions && quiz.questions.length > 0
            ? quiz.questions.map(q => {
                return {
                    question_text: q.question_text || '',
                    option_a: q.option_a || '',
                    option_b: q.option_b || '',
                    option_c: q.option_c || '',
                    option_d: q.option_d || '',
                    correct_option: (q.correct_option || 'A').toString().toUpperCase()
                };
            })
            : [{
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_option: 'A'
            }];


        editQuizForm.setData({
            title: quiz.title || '',
            duration_minutes: quiz.duration_minutes || 30,
            pass_score: quiz.pass_score || 70,
            questions: questionsData
        });

        // Log để kiểm tra sau khi setData
        setTimeout(() => {
        }, 100);
    };
    // Function để cập nhật quiz
    const handleUpdateQuiz = (e, quizId) => {
        e.preventDefault();
        editQuizForm.put(route('instructor.courses.quizzes.update', [course.id, quizId]), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowEditQuiz(null);
                editQuizForm.reset();
            },
            onError: (errors) => {
                console.error('Lỗi cập nhật quiz:', errors);
            }
        });
    };
    // Function để xóa quiz
    const handleDeleteQuiz = (quizId, quizTitle) => {
        if (confirm(`Bạn có chắc chắn muốn xóa quiz "${quizTitle}"?`)) {
            router.delete(route('instructor.courses.quizzes.destroy', [course.id, quizId]), {
                preserveScroll: true,
                preserveState: true,
                onError: (errors) => {
                    console.error('Lỗi xóa quiz:', errors);
                }
            });
        }
    };

    // Function để thêm câu hỏi trong form chỉnh sửa
    const addEditQuizQuestion = () => {
        editQuizForm.setData('questions', [
            ...editQuizForm.data.questions,
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

    // Function để xóa câu hỏi trong form chỉnh sửa
    const removeEditQuizQuestion = (index) => {
        if (editQuizForm.data.questions.length > 1) {
            const newQuestions = editQuizForm.data.questions.filter((_, i) => i !== index);
            editQuizForm.setData('questions', newQuestions);
        }
    };
    const toggleLessonExpand = (lessonId) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };
    const toggleResourceEditsExpand = (resourceId) => {
        setExpandedResourceEdits(prev => ({
            ...prev,
            [resourceId]: !prev[resourceId]
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
    const hasApprovedResourcesOrQuiz = (lesson) => {
        // Kiểm tra resources
        if (lesson.resources && lesson.resources.length > 0) {
            const hasApprovedResource = lesson.resources.some(resource => resource.status === 'approved');
            if (hasApprovedResource) return true;
        }

        // Kiểm tra quiz
        if (lesson.quiz && lesson.quiz.status === 'approved') {
            return true;
        }

        return false;
    };

    // Cập nhật hàm handleUpdateStatusToDraft (thay thế hàm cũ từ dòng 373)
    const handleUpdateStatusToDraft = (resourceType, resourceId, currentStatus) => {
        if (currentStatus === 'draft') {
            alert('Tài nguyên này đã ở trạng thái nháp!');
            return;
        }

        // Kiểm tra điều kiện đặc biệt cho lesson
        if (resourceType === 'lesson') {
            const lesson = course.lessons.find(l => l.id === resourceId);
            if (lesson && hasApprovedResourcesOrQuiz(lesson)) {
                alert('Không thể chuyển bài giảng về nháp vì còn có tài liệu hoặc quiz đã được duyệt. Vui lòng chuyển tất cả tài liệu và quiz về nháp trước.');
                return;
            }
        }

        const confirmMessage = `Bạn có chắc chắn muốn chuyển ${resourceType === 'lesson' ? 'bài giảng' : resourceType === 'quiz' ? 'quiz' : 'tài liệu'} này về trạng thái nháp? Điều này sẽ ẩn nó khỏi học viên.`;

        if (confirm(confirmMessage)) {
            const routeName = getUpdateStatusRoute(resourceType);
            const routeParams = getUpdateStatusRouteParams(resourceType, resourceId);

            router.put(route(routeName, routeParams), {
                status: 'draft'
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Reload để cập nhật UI
                    router.reload({ only: ['course'] });
                },
                onError: (errors) => {
                    console.error('Lỗi cập nhật status:', errors);
                    alert('Có lỗi xảy ra khi cập nhật trạng thái.');
                }
            });
        }
    };
    // Helper function để lấy route name
    const getUpdateStatusRoute = (resourceType) => {
        switch (resourceType) {
            case 'lesson':
                return 'instructor.courses.lessons.update-status';
            case 'quiz':
                return 'instructor.courses.quizzes.update-status';
            case 'video':
                return 'instructor.courses.lessons.videos.update-status';
            case 'document':
                return 'instructor.courses.lessons.documents.update-status';
            default:
                throw new Error('Unknown resource type');
        }
    };

    // Helper function để lấy route parameters
    const getUpdateStatusRouteParams = (resourceType, resourceId) => {
        switch (resourceType) {
            case 'lesson':
                return [course.id, resourceId];
            case 'quiz':
                return [course.id, resourceId];
            case 'video':
            case 'document':
                // Cần tìm lesson ID cho resource này
                const resource = findResourceInLessons(resourceId);
                return [course.id, resource.lessonId, resourceId];
            default:
                throw new Error('Unknown resource type');
        }
    };

    // Helper function để tìm resource trong lessons
    const findResourceInLessons = (resourceId) => {
        for (const lesson of course.lessons || []) {
            for (const resource of lesson.resources || []) {
                if (resource.id === resourceId) {
                    return {
                        ...resource,
                        lessonId: lesson.id
                    };
                }
            }
        }
        throw new Error('Resource not found');
    };
    const handleUpdateResourceOrder = (resourceId, currentOrder) => {
        setEditingResourceOrder(resourceId);
        resourceOrderForm.setData('order', currentOrder);
    };

    const handleSaveResourceOrder = (lessonId, resourceId, resourceType) => {
        const updateRoute = resourceType === 'video'
            ? route('instructor.courses.lessons.videos.update-order', {
                id: course.id,
                lessonId: lessonId,
                videoId: resourceId
            })
            : route('instructor.courses.lessons.documents.update-order', {
                id: course.id,
                lessonId: lessonId,
                documentId: resourceId
            });

        resourceOrderForm.put(updateRoute, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setEditingResourceOrder(null);
            },
            onError: (errors) => {
                console.error('Lỗi cập nhật order tài liệu:', errors);
            }
        });
    };

    const handleCancelEditResourceOrder = () => {
        setEditingResourceOrder(null);
        resourceOrderForm.reset();
    };

    const handleCancelEditOrder = () => {
        setEditingOrder(null);
        orderForm.reset();
    };

    const handleSubmitForApproval = () => {
        if (confirm('Bạn có chắc chắn muốn gửi khóa học này để phê duyệt? Tất cả nội dung có trạng thái "Nháp" sẽ được chuyển thành "Chờ phê duyệt".')) {
            router.post(route('instructor.courses.submit-for-approval', course.id), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['course'] });
                }
            });
        }
    };

    const hasDraftContent = () => {
        // Kiểm tra course
        if (course.status === 'draft') return true;

        // Kiểm tra lessons
        if (course.lessons?.some(lesson => {
            if (lesson.status === 'draft') return true;

            // Kiểm tra resources
            if (lesson.resources?.some(resource => resource.status === 'draft')) return true;

            // Kiểm tra quiz
            if (lesson.quiz && lesson.quiz.status === 'draft') return true;

            return false;
        })) return true;

        return false;
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
        setSelectedDocument(document);
        setShowDocumentModal(true);
    };

    const handleViewVideo = (video) => {
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
    const handleDeleteResource = (lessonId, resourceId, type, resource) => {
        // Kiểm tra status của resource
        if (resource.status === 'approved') {
            if (confirm('Tài liệu này đã được phê duyệt. Bạn có muốn gửi yêu cầu xóa để admin xử lý không?')) {
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
                    },
                    onError: (errors) => {
                        console.error('Lỗi:', errors);
                        // Hiển thị thông báo lỗi cho user
                        if (errors.error) {
                            alert(errors.error);
                        }
                    }
                });
            }
        } else if (resource.status === 'draft' || resource.status === 'pending') {
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
                    },
                    onError: (errors) => {
                        console.error('Lỗi:', errors);
                        // Hiển thị thông báo lỗi cho user
                        if (errors.error) {
                            alert(errors.error);
                        }
                    }
                });
            }
        } else {
            alert('Không thể xóa tài liệu này do trạng thái không phù hợp.');
        }
    };
    // Function để bắt đầu chỉnh sửa document
    const handleEditDocument = (document) => {
        setShowEditDocument(document.id);
        editDocumentForm.setData({
            title: document.title || '',
            file: null,
            is_preview: document.is_preview || 0,
            uploadProgress: 0
        });
        console.log('Editing document:', document);
    };

    // Function để bắt đầu chỉnh sửa video
    const handleEditVideo = (video) => {
        setShowEditVideo(video.id);
        editVideoForm.setData({
            title: video.title || '',
            file: null,
            url: '',
            uploadMethod: 'file',
            is_preview: video.is_preview || 0,
            uploadProgress: 0
        });
    };

    // Function để submit edit document
    const handleSubmitEditDocument = async (e, documentId, lessonId) => {
        e.preventDefault();

        if (editDocumentForm.data.file) {
            // Chunk upload cho document edit
            await handleEditChunkUpload(editDocumentForm.data.file, lessonId, documentId, 'document');
        } else {
            // Chỉ cập nhật title và is_preview
            const formData = new FormData();
            formData.append('title', editDocumentForm.data.title);
            formData.append('is_preview', editDocumentForm.data.is_preview ? 1 : 0);

            try {
                const response = await axios.post(
                    route('instructor.courses.lessons.documents.edit', {
                        id: course.id,
                        lessonId: lessonId,
                        documentId: documentId
                    }),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                setShowEditDocument(null);
                editDocumentForm.reset();

                router.reload({
                    preserveScroll: true,
                    preserveState: false
                });
            } catch (error) {
                console.error('Error updating document:', error);
                alert('Có lỗi xảy ra khi cập nhật tài liệu.');
            }
        }
    };

    // Function để submit edit video
    const handleSubmitEditVideo = async (e, videoId, lessonId) => {
        e.preventDefault();

        if (editVideoForm.data.uploadMethod === 'file' && editVideoForm.data.file) {
            // Kiểm tra định dạng file
            const fileName = editVideoForm.data.file.name.toLowerCase();
            if (!fileName.endsWith('.webm')) {
                alert('Chỉ cho phép upload file định dạng WebM.');
                return;
            }

            // Chunk upload cho video edit
            await handleEditChunkUpload(editVideoForm.data.file, lessonId, videoId, 'video');
        } else if (editVideoForm.data.uploadMethod === 'url' && editVideoForm.data.url) {
            // URL upload cho video edit
            const formData = new FormData();
            formData.append('title', editVideoForm.data.title);
            formData.append('url', editVideoForm.data.url);
            formData.append('is_preview', editVideoForm.data.is_preview ? 1 : 0);

            try {
                const response = await axios.post(
                    route('instructor.courses.lessons.videos.edit', {
                        id: course.id,
                        lessonId: lessonId,
                        videoId: videoId
                    }),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                setShowEditVideo(null);
                editVideoForm.reset();

                router.reload({
                    preserveScroll: true,
                    preserveState: false
                });
            } catch (error) {
                console.error('Error updating video:', error);
                alert('Có lỗi xảy ra khi cập nhật video.');
            }
        } else {
            // Chỉ cập nhật title và is_preview
            const formData = new FormData();
            formData.append('title', editVideoForm.data.title);
            formData.append('is_preview', editVideoForm.data.is_preview ? 1 : 0);

            try {
                const response = await axios.post(
                    route('instructor.courses.lessons.videos.edit', {
                        id: course.id,
                        lessonId: lessonId,
                        videoId: videoId
                    }),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                setShowEditVideo(null);
                editVideoForm.reset();

                router.reload({
                    preserveScroll: true,
                    preserveState: false
                });
            } catch (error) {
                console.error('Error updating video:', error);
                alert('Có lỗi xảy ra khi cập nhật video.');
            }
        }
    };

    // Function để handle chunk upload cho edit
    const handleEditChunkUpload = async (file, lessonId, resourceId, type) => {
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        let uploadUrl, form;
        if (type === 'video') {
            uploadUrl = route('instructor.courses.lessons.videos.edit', {
                id: course.id,
                lessonId: lessonId,
                videoId: resourceId
            });
            form = editVideoForm;
        } else {
            uploadUrl = route('instructor.courses.lessons.documents.edit', {
                id: course.id,
                lessonId: lessonId,
                documentId: resourceId
            });
            form = editDocumentForm;
        }

        try {
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

            // Reset progress và đóng modal
            form.setData('uploadProgress', 0);
            if (type === 'video') {
                setShowEditVideo(null);
            } else {
                setShowEditDocument(null);
            }

            // Reset form
            form.reset();

            // Reload trang để hiển thị thay đổi
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

    // Function để hủy edit
    const handleCancelEdit = (type) => {
        if (type === 'video') {
            setShowEditVideo(null);
            editVideoForm.reset();
        } else {
            setShowEditDocument(null);
            editDocumentForm.reset();
        }
    };
    // Function để xóa bài giảng
    const handleDeleteLesson = (lessonId, lessonTitle, lesson) => {
        // Bỏ tất cả kiểm tra status, cho phép xóa thẳng
        if (confirm(`Bạn có chắc chắn muốn xóa bài giảng "${lessonTitle}"? Tất cả tài liệu và quiz trong bài giảng này cũng sẽ bị xóa.`)) {
            router.delete(route('instructor.courses.lessons.delete', {
                id: course.id,
                lessonId: lessonId
            }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Có thể thêm toast notification ở đây
                },
                onError: (errors) => {
                    console.error('Lỗi xóa bài giảng:', errors);
                    if (errors.general) {
                        alert(errors.general);
                    } else if (errors.error) {
                        alert(errors.error);
                    } else {
                        alert('Có lỗi xảy ra khi xóa bài giảng.');
                    }
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Đã duyệt';
            case 'draft':
                return 'Bản nháp';
            case 'pending':
                return 'Chờ duyệt';
            case 'rejected':
                return 'Bị từ chối';
            default:
                return status || 'Không xác định';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return '✓';
            case 'draft':
                return '📝';
            case 'pending':
                return '⏳';
            case 'rejected':
                return '✗';
            default:
                return '❓';
        }
    };
    // Thêm hàm helper này vào component
    const hasLinkedFiles = (lesson) => {
        // Kiểm tra xem lesson có resources (documents hoặc videos) hay không
        const hasResources = lesson.resources && lesson.resources.length > 0;

        // Kiểm tra xem lesson có quiz hay không
        const hasQuiz = lesson.quiz && lesson.quiz.id;

        return hasResources || hasQuiz;
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
                                {hasDraftContent() && (
                                    <button
                                        onClick={handleSubmitForApproval}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                                    >
                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Gửi phê duyệt
                                    </button>
                                )}
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
                        {hasDraftContent() && (
                            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            <strong>Thông báo:</strong> Khóa học này có nội dung ở trạng thái "Nháp".
                                            Bạn có thể gửi phê duyệt để chuyển tất cả nội dung "Nháp" thành "Chờ phê duyệt".
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-3">
                                                                        <h3 className="text-lg font-medium text-gray-900">
                                                                            {lesson.title}
                                                                        </h3>
                                                                        {/* Lesson Status Badge */}
                                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lesson.status)}`}>
                                                                            <span className="mr-1">{getStatusIcon(lesson.status)}</span>
                                                                            {getStatusText(lesson.status)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="mt-1 space-y-1">
                                                                        <p className="text-sm text-gray-500">
                                                                            {lesson.resources?.length || 0} tài liệu •
                                                                            {lesson.quiz ? ' Có quiz' : ' Chưa có quiz'}
                                                                        </p>
                                                                        {/* Lesson Note */}
                                                                        {lesson.note && (
                                                                            <p className="text-sm text-gray-600 italic bg-gray-50 px-2 py-1 rounded">
                                                                                <span className="font-medium">Ghi chú:</span> {lesson.note}
                                                                            </p>
                                                                        )}
                                                                    </div>
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
                                                            {lesson.status !== 'draft' && (
                                                                <button
                                                                    onClick={() => handleUpdateStatusToDraft('lesson', lesson.id, lesson.status)}
                                                                    className="text-orange-600 hover:text-orange-800 p-1"
                                                                    title="Chuyển về nháp"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            {!hasLinkedFiles(lesson) && (
                                                                <>

                                                                    <button
                                                                        onClick={() => handleDeleteLesson(lesson.id, lesson.title, lesson)}
                                                                        className="text-red-600 hover:text-red-800 p-2"
                                                                        title="Xóa bài giảng"
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </button>
                                                                </>
                                                            )}
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
                                                            {/* Sắp xếp và hiển thị resources theo thứ tự: documents trước, videos sau */}
                                                            {lesson.resources?.length > 0 && (
                                                                <div className="mb-4">
                                                                    <h4 className="font-medium text-gray-700 mb-2">Tài liệu:</h4>
                                                                    <div className="space-y-2">
                                                                        {/* Documents trước */}
                                                                        {lesson.resources
                                                                            .filter(resource => resource.type === 'document')
                                                                            .sort((a, b) => a.order - b.order)
                                                                            .map((resource) => (
                                                                                <div key={resource.id} className="bg-gray-50 p-3 rounded border">
                                                                                    <div className="flex items-start justify-between">
                                                                                        <div className="flex-1">
                                                                                            <div className="flex items-center space-x-2 mb-2">
                                                                                                {/* Resource Order Display/Edit */}
                                                                                                {editingResourceOrder === resource.id ? (
                                                                                                    <div className="flex items-center space-x-2">
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={resourceOrderForm.data.order}
                                                                                                            onChange={(e) => resourceOrderForm.setData('order', parseInt(e.target.value) || 1)}
                                                                                                            className="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                            min="1"
                                                                                                        />
                                                                                                        <button
                                                                                                            onClick={() => handleSaveResourceOrder(lesson.id, resource.id, resource.type)}
                                                                                                            disabled={resourceOrderForm.processing}
                                                                                                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                                                                                            title="Lưu"
                                                                                                        >
                                                                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={handleCancelEditResourceOrder}
                                                                                                            className="text-gray-600 hover:text-gray-800"
                                                                                                            title="Hủy"
                                                                                                        >
                                                                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <button
                                                                                                        onClick={() => handleUpdateResourceOrder(resource.id, resource.order)}
                                                                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs font-medium min-w-[2rem]"
                                                                                                        title="Chỉnh sửa thứ tự"
                                                                                                    >
                                                                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{resource.order}</span>
                                                                                                        <PencilIcon className="h-2 w-2" />
                                                                                                    </button>
                                                                                                )}

                                                                                                {getFileIcon(resource.type)}
                                                                                                <span className="text-sm font-medium">{resource.title}</span>

                                                                                                {/* Document Badge */}
                                                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                                                    📄 Document
                                                                                                </span>

                                                                                                {/* Resource Status Badge */}
                                                                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(resource.status)}`}>
                                                                                                    <span className="mr-1">{getStatusIcon(resource.status)}</span>
                                                                                                    {getStatusText(resource.status)}
                                                                                                </span>

                                                                                                {/* Preview Status */}
                                                                                                {resource.is_preview ? (
                                                                                                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                                                        <GlobeAltIcon className="w-3 h-3 mr-1" />
                                                                                                        Public
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span className="inline-flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                                                                        <LockClosedIcon className="w-3 h-3 mr-1" />
                                                                                                        Private
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>

                                                                                            {/* Resource Note */}
                                                                                            {resource.note && (
                                                                                                <div className="mt-2 text-xs text-gray-600 italic bg-white px-2 py-1 rounded border-l-2 border-green-200">
                                                                                                    <span className="font-medium">Ghi chú:</span> {resource.note}
                                                                                                </div>
                                                                                            )}

                                                                                            {/* File Type Info */}
                                                                                            <div className="mt-1 text-xs text-gray-500">
                                                                                                Loại: {resource.file_type || resource.type}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex items-center space-x-2 ml-3">
                                                                                            <button
                                                                                                onClick={() => handleViewDocument(resource)}
                                                                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                                                                title="Xem tài liệu"
                                                                                            >
                                                                                                <EyeIcon className="h-4 w-4" />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => handleEditDocument(resource)}
                                                                                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                                                                                title="Chỉnh sửa tài liệu"
                                                                                            >
                                                                                                <PencilIcon className="w-4 h-4" />
                                                                                            </button>
                                                                                            {resource.status !== 'draft' && (
                                                                                                <button
                                                                                                    onClick={() => handleUpdateStatusToDraft(resource.type, resource.id, resource.status)}
                                                                                                    className="text-orange-600 hover:text-orange-800 p-1"
                                                                                                    title="Chuyển về nháp"
                                                                                                >
                                                                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                            )}
                                                                                            <button
                                                                                                onClick={() => handleDeleteResource(lesson.id, resource.id, resource.type, resource)}
                                                                                                className="text-red-600 hover:text-red-800 p-1"
                                                                                                title="Xóa tài liệu"
                                                                                            >
                                                                                                <TrashIcon className="h-4 w-4" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* Resource Edits - thêm sau phần hiển thị resource chính */}
                                                                                    {resource.edits && resource.edits.length > 0 && (
                                                                                        <div className="mt-3">
                                                                                            <button
                                                                                                onClick={() => toggleResourceEditsExpand(resource.id)}
                                                                                                className="flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-800 font-medium"
                                                                                            >
                                                                                                {expandedResourceEdits[resource.id] ? (
                                                                                                    <ChevronDownIcon className="h-4 w-4" />
                                                                                                ) : (
                                                                                                    <ChevronRightIcon className="h-4 w-4" />
                                                                                                )}
                                                                                                <span>📝 Lịch sử chỉnh sửa ({resource.edits.length})</span>
                                                                                            </button>

                                                                                            {expandedResourceEdits[resource.id] && (
                                                                                                <div className="mt-2 pl-6 border-l-2 border-orange-200">
                                                                                                    <div className="space-y-2">
                                                                                                        {resource.edits
                                                                                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                                                            .map((edit) => (
                                                                                                                <div key={edit.id} className="bg-orange-50 p-3 rounded border border-orange-200">
                                                                                                                    <div className="flex items-start justify-between">
                                                                                                                        <div className="flex-1">
                                                                                                                            <div className="flex items-center space-x-2 mb-2">
                                                                                                                                <span className="text-sm font-medium text-orange-800">
                                                                                                                                    {edit.edited_title || resource.title}
                                                                                                                                </span>

                                                                                                                                {/* Trạng thái edit */}
                                                                                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(edit.status)}`}>
                                                                                                                                    <span className="mr-1">{getStatusIcon(edit.status)}</span>
                                                                                                                                    {getStatusText(edit.status)}
                                                                                                                                </span>

                                                                                                                                {/* Loại file */}
                                                                                                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                                                                                                    📄 {edit.edited_file_type || resource.file_type}
                                                                                                                                </span>

                                                                                                                                {/* Preview status */}
                                                                                                                                {edit.is_preview ? (
                                                                                                                                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                                                                                        <GlobeAltIcon className="w-3 h-3 mr-1" />
                                                                                                                                        Public
                                                                                                                                    </span>
                                                                                                                                ) : (
                                                                                                                                    <span className="inline-flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                                                                                                        <LockClosedIcon className="w-3 h-3 mr-1" />
                                                                                                                                        Private
                                                                                                                                    </span>
                                                                                                                                )}
                                                                                                                            </div>

                                                                                                                            {/* Ghi chú edit */}
                                                                                                                            {edit.note && (
                                                                                                                                <div className="mt-2 text-xs text-orange-600 italic bg-white px-2 py-1 rounded border-l-2 border-orange-300">
                                                                                                                                    <span className="font-medium">Ghi chú:</span> {edit.note}
                                                                                                                                </div>
                                                                                                                            )}

                                                                                                                            {/* Thời gian */}
                                                                                                                            <div className="mt-1 text-xs text-orange-500">
                                                                                                                                Chỉnh sửa lúc: {new Date(edit.created_at).toLocaleString('vi-VN')}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Videos - hiển thị sau documents */}
                                                            {lesson.resources?.filter(resource => resource.type === 'video').length > 0 && (
                                                                <div className="mb-4">
                                                                    <h4 className="font-medium text-gray-700 mb-2">Video:</h4>
                                                                    <div className="space-y-2">
                                                                        {lesson.resources
                                                                            .filter(resource => resource.type === 'video')
                                                                            .sort((a, b) => a.order - b.order)
                                                                            .map((resource) => (
                                                                                <div key={resource.id} className="bg-blue-50 p-3 rounded border border-blue-200">
                                                                                    <div className="flex items-start justify-between">
                                                                                        <div className="flex-1">
                                                                                            <div className="flex items-center space-x-2 mb-2">
                                                                                                {/* Resource Order Display/Edit */}
                                                                                                {editingResourceOrder === resource.id ? (
                                                                                                    <div className="flex items-center space-x-2">
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={resourceOrderForm.data.order}
                                                                                                            onChange={(e) => resourceOrderForm.setData('order', parseInt(e.target.value) || 1)}
                                                                                                            className="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                            min="1"
                                                                                                        />
                                                                                                        <button
                                                                                                            onClick={() => handleSaveResourceOrder(lesson.id, resource.id, resource.type)}
                                                                                                            disabled={resourceOrderForm.processing}
                                                                                                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                                                                                            title="Lưu"
                                                                                                        >
                                                                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={handleCancelEditResourceOrder}
                                                                                                            className="text-gray-600 hover:text-gray-800"
                                                                                                            title="Hủy"
                                                                                                        >
                                                                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <button
                                                                                                        onClick={() => handleUpdateResourceOrder(resource.id, resource.order)}
                                                                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs font-medium min-w-[2rem]"
                                                                                                        title="Chỉnh sửa thứ tự"
                                                                                                    >
                                                                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{resource.order}</span>
                                                                                                        <PencilIcon className="h-2 w-2" />
                                                                                                    </button>
                                                                                                )}

                                                                                                {getFileIcon(resource.type)}
                                                                                                <span className="text-sm font-medium">{resource.title}</span>

                                                                                                {/* Video Badge */}
                                                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                                                    🎥 Video
                                                                                                </span>

                                                                                                {/* Resource Status Badge */}
                                                                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(resource.status)}`}>
                                                                                                    <span className="mr-1">{getStatusIcon(resource.status)}</span>
                                                                                                    {getStatusText(resource.status)}
                                                                                                </span>

                                                                                                {/* Preview Status */}
                                                                                                {resource.is_preview ? (
                                                                                                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                                                        <GlobeAltIcon className="w-3 h-3 mr-1" />
                                                                                                        Public
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span className="inline-flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                                                                        <LockClosedIcon className="w-3 h-3 mr-1" />
                                                                                                        Private
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>

                                                                                            {/* Resource Note */}
                                                                                            {resource.note && (
                                                                                                <div className="mt-2 text-xs text-gray-600 italic bg-white px-2 py-1 rounded border-l-2 border-blue-200">
                                                                                                    <span className="font-medium">Ghi chú:</span> {resource.note}
                                                                                                </div>
                                                                                            )}

                                                                                            {/* File Type Info */}
                                                                                            <div className="mt-1 text-xs text-gray-500">
                                                                                                Loại: {resource.file_type || resource.type}
                                                                                                {resource.file_type === 'youtube' && ' • YouTube'}
                                                                                                {resource.file_type === 'vimeo' && ' • Vimeo'}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex items-center space-x-2 ml-3">
                                                                                            <button
                                                                                                onClick={() => handleViewVideo(resource)}
                                                                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                                                                title="Xem video"
                                                                                            >
                                                                                                <EyeIcon className="h-4 w-4" />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => handleEditVideo(resource)}
                                                                                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                                                                                title="Chỉnh sửa video"
                                                                                            >
                                                                                                <PencilIcon className="w-4 h-4" />
                                                                                            </button>
                                                                                            {resource.status !== 'draft' && (
                                                                                                <button
                                                                                                    onClick={() => handleUpdateStatusToDraft(resource.type, resource.id, resource.status)}
                                                                                                    className="text-orange-600 hover:text-orange-800 p-1"
                                                                                                    title="Chuyển về nháp"
                                                                                                >
                                                                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                            )}
                                                                                            <button
                                                                                                onClick={() => handleDeleteResource(lesson.id, resource.id, resource.type, resource)}
                                                                                                className="text-red-600 hover:text-red-800 p-1"
                                                                                                title="Xóa video"
                                                                                            >
                                                                                                <TrashIcon className="h-4 w-4" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* Resource Edits - thêm sau phần hiển thị resource chính */}
                                                                                    {resource.edits && resource.edits.length > 0 && (
                                                                                        <div className="mt-3">
                                                                                            <button
                                                                                                onClick={() => toggleResourceEditsExpand(resource.id)}
                                                                                                className="flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-800 font-medium"
                                                                                            >
                                                                                                {expandedResourceEdits[resource.id] ? (
                                                                                                    <ChevronDownIcon className="h-4 w-4" />
                                                                                                ) : (
                                                                                                    <ChevronRightIcon className="h-4 w-4" />
                                                                                                )}
                                                                                                <span>📝 Lịch sử chỉnh sửa ({resource.edits.length})</span>
                                                                                            </button>

                                                                                            {expandedResourceEdits[resource.id] && (
                                                                                                <div className="mt-2 pl-6 border-l-2 border-orange-200">
                                                                                                    <div className="space-y-2">
                                                                                                        {resource.edits
                                                                                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                                                            .map((edit) => (
                                                                                                                <div key={edit.id} className="bg-orange-50 p-3 rounded border border-orange-200">
                                                                                                                    <div className="flex items-start justify-between">
                                                                                                                        <div className="flex-1">
                                                                                                                            <div className="flex items-center space-x-2 mb-2">
                                                                                                                                <span className="text-sm font-medium text-orange-800">
                                                                                                                                    {edit.edited_title || resource.title}
                                                                                                                                </span>

                                                                                                                                {/* Trạng thái edit */}
                                                                                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(edit.status)}`}>
                                                                                                                                    <span className="mr-1">{getStatusIcon(edit.status)}</span>
                                                                                                                                    {getStatusText(edit.status)}
                                                                                                                                </span>

                                                                                                                                {/* Loại file */}
                                                                                                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                                                                                                    📄 {edit.edited_file_type || resource.file_type}
                                                                                                                                </span>

                                                                                                                                {/* Preview status */}
                                                                                                                                {edit.is_preview ? (
                                                                                                                                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                                                                                        <GlobeAltIcon className="w-3 h-3 mr-1" />
                                                                                                                                        Public
                                                                                                                                    </span>
                                                                                                                                ) : (
                                                                                                                                    <span className="inline-flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                                                                                                        <LockClosedIcon className="w-3 h-3 mr-1" />
                                                                                                                                        Private
                                                                                                                                    </span>
                                                                                                                                )}
                                                                                                                            </div>

                                                                                                                            {/* Ghi chú edit */}
                                                                                                                            {edit.note && (
                                                                                                                                <div className="mt-2 text-xs text-orange-600 italic bg-white px-2 py-1 rounded border-l-2 border-orange-300">
                                                                                                                                    <span className="font-medium">Ghi chú:</span> {edit.note}
                                                                                                                                </div>
                                                                                                                            )}

                                                                                                                            {/* Thời gian */}
                                                                                                                            <div className="mt-1 text-xs text-orange-500">
                                                                                                                                Chỉnh sửa lúc: {new Date(edit.created_at).toLocaleString('vi-VN')}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Quiz - hiển thị cuối cùng */}
                                                            {lesson.quiz && (
                                                                <div className="mb-4">
                                                                    <h4 className="font-medium text-gray-700 mb-2">Quiz:</h4>
                                                                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center space-x-2 mb-1">
                                                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                                        ❓ Quiz
                                                                                    </span>
                                                                                    <p className="font-medium">{lesson.quiz.title}</p>
                                                                                    {lesson.quiz.status && (
                                                                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(lesson.quiz.status)}`}>
                                                                                            <span className="mr-1">{getStatusIcon(lesson.quiz.status)}</span>
                                                                                            {getStatusText(lesson.quiz.status)}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-sm text-gray-600">
                                                                                    {lesson.quiz.duration_minutes} phút •
                                                                                    Điểm đậu: {lesson.quiz.pass_score}% •
                                                                                    {lesson.quiz.questions?.length || 0} câu hỏi
                                                                                </p>
                                                                                {lesson.quiz.note && (
                                                                                    <div className="mt-2 text-xs text-gray-600 italic bg-white px-2 py-1 rounded border-l-2 border-yellow-300">
                                                                                        <span className="font-medium">Ghi chú:</span> {lesson.quiz.note}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <button
                                                                                    onClick={() => handleEditQuiz(lesson.quiz)}
                                                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                                                    title="Chỉnh sửa quiz"
                                                                                >
                                                                                    <PencilIcon className="h-4 w-4" />
                                                                                </button>
                                                                                {lesson.quiz.status !== 'draft' && (
                                                                                    <button
                                                                                        onClick={() => handleUpdateStatusToDraft('quiz', lesson.quiz.id, lesson.quiz.status)}
                                                                                        className="text-orange-600 hover:text-orange-800 p-1"
                                                                                        title="Chuyển về nháp"
                                                                                    >
                                                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                        </svg>
                                                                                    </button>
                                                                                )}
                                                                                <button
                                                                                    onClick={() => handleDeleteQuiz(lesson.quiz.id, lesson.quiz.title)}
                                                                                    className="text-red-600 hover:text-red-800 p-1"
                                                                                    title="Xóa quiz"
                                                                                >
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
                                                                                accept=".webm,video/webm"
                                                                                required
                                                                            />
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                Chỉ hỗ trợ: WebM (tối đa 100MB)
                                                                            </p>
                                                                            {videoForm.errors.file && (
                                                                                <div className="text-red-600 text-sm mt-1">
                                                                                    {videoForm.errors.file}
                                                                                </div>
                                                                            )}

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
                                                        <form onSubmit={(e) => handleAddQuiz(e, lesson.id)}>

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
                                                {/* Edit Quiz Form */}
                                                {showEditQuiz === lesson.quiz?.id && (
                                                    <div className="border-t p-4 bg-gray-50">
                                                        <h4 className="font-medium mb-3">Chỉnh sửa Quiz</h4>

                                                        {/* Hiển thị lỗi chung */}
                                                        {(editQuizForm.errors.general || editQuizForm.errors.lesson_id) && (
                                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                                <div className="text-red-600 text-sm">
                                                                    {editQuizForm.errors.general || editQuizForm.errors.lesson_id}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <form onSubmit={(e) => handleUpdateQuiz(e, lesson.quiz.id)}>
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Tiêu đề Quiz
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={editQuizForm.data.title}
                                                                            onChange={(e) => editQuizForm.setData('title', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                        {editQuizForm.errors.title && (
                                                                            <div className="text-red-600 text-sm mt-1">
                                                                                {editQuizForm.errors.title}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Thời gian (phút)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={editQuizForm.data.duration_minutes}
                                                                            onChange={(e) => editQuizForm.setData('duration_minutes', parseInt(e.target.value))}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                        {editQuizForm.errors.duration_minutes && (
                                                                            <div className="text-red-600 text-sm mt-1">
                                                                                {editQuizForm.errors.duration_minutes}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Điểm đậu (%)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={editQuizForm.data.pass_score}
                                                                            onChange={(e) => editQuizForm.setData('pass_score', parseInt(e.target.value))}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                        {editQuizForm.errors.pass_score && (
                                                                            <div className="text-red-600 text-sm mt-1">
                                                                                {editQuizForm.errors.pass_score}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Questions */}
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h5 className="font-medium">Câu hỏi</h5>
                                                                        <button
                                                                            type="button"
                                                                            onClick={addEditQuizQuestion}
                                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                                        >
                                                                            + Thêm câu hỏi
                                                                        </button>
                                                                    </div>

                                                                    {/* Hiển thị lỗi chung cho questions */}
                                                                    {editQuizForm.errors.questions && (
                                                                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                                                                            <div className="text-red-600 text-sm">
                                                                                {editQuizForm.errors.questions}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {editQuizForm.data.questions.map((question, index) => (
                                                                        <div key={index} className="border rounded-lg p-4 mb-3 bg-white">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <h6 className="font-medium">Câu hỏi {index + 1}</h6>
                                                                                {editQuizForm.data.questions.length > 1 && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeEditQuizQuestion(index)}
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
                                                                                            const newQuestions = [...editQuizForm.data.questions];
                                                                                            newQuestions[index].question_text = e.target.value;
                                                                                            editQuizForm.setData('questions', newQuestions);
                                                                                        }}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                        rows="2"
                                                                                        required
                                                                                    />
                                                                                    {editQuizForm.errors[`questions.${index}.question_text`] && (
                                                                                        <div className="text-red-600 text-sm mt-1">
                                                                                            {editQuizForm.errors[`questions.${index}.question_text`]}
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
                                                                                                    const newQuestions = [...editQuizForm.data.questions];
                                                                                                    newQuestions[index][`option_${option.toLowerCase()}`] = e.target.value;
                                                                                                    editQuizForm.setData('questions', newQuestions);
                                                                                                }}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                required
                                                                                            />
                                                                                            {editQuizForm.errors[`questions.${index}.option_${option.toLowerCase()}`] && (
                                                                                                <div className="text-red-600 text-sm mt-1">
                                                                                                    {editQuizForm.errors[`questions.${index}.option_${option.toLowerCase()}`]}
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
                                                                                        value={question.correct_option.toUpperCase()}
                                                                                        onChange={(e) => {
                                                                                            const newQuestions = [...editQuizForm.data.questions];
                                                                                            newQuestions[index].correct_option = e.target.value;
                                                                                            editQuizForm.setData('questions', newQuestions);
                                                                                        }}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                        required
                                                                                    >
                                                                                        <option value="A">A</option>
                                                                                        <option value="B">B</option>
                                                                                        <option value="C">C</option>
                                                                                        <option value="D">D</option>
                                                                                    </select>
                                                                                    {editQuizForm.errors[`questions.${index}.correct_option`] && (
                                                                                        <div className="text-red-600 text-sm mt-1">
                                                                                            {editQuizForm.errors[`questions.${index}.correct_option`]}
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
                                                                    onClick={() => setShowEditQuiz(null)}
                                                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                                >
                                                                    Hủy
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    disabled={editQuizForm.processing}
                                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                                >
                                                                    {editQuizForm.processing ? 'Đang cập nhật...' : 'Cập nhật Quiz'}
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
            {/* Edit Document Modal */}
            {showEditDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa tài liệu</h3>
                        <form onSubmit={(e) => handleSubmitEditDocument(e, showEditDocument, course.lessons?.find(l =>
                            l.documents?.some(d => d.id === showEditDocument) ||
                            l.resources?.some(r => r.type === 'document' && r.id === showEditDocument)
                        )?.id)}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    value={editDocumentForm.data.title}
                                    onChange={(e) => editDocumentForm.setData('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    File mới (tùy chọn)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => editDocumentForm.setData('file', e.target.files[0])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    accept=".pdf,.doc,.docx"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Chỉ chọn file nếu muốn thay thế file hiện tại
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editDocumentForm.data.is_preview}
                                        onChange={(e) => editDocumentForm.setData('is_preview', e.target.checked)}
                                        className="mr-2"
                                    />
                                    Cho phép xem trước miễn phí
                                </label>
                            </div>

                            {editDocumentForm.data.uploadProgress > 0 && (
                                <div className="mb-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${editDocumentForm.data.uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{editDocumentForm.data.uploadProgress}% hoàn thành</p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => handleCancelEdit('document')}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                    disabled={editDocumentForm.data.uploadProgress > 0}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    disabled={editDocumentForm.processing || editDocumentForm.data.uploadProgress > 0}
                                >
                                    {editDocumentForm.data.uploadProgress > 0 ? 'Đang tải...' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Edit Video Modal */}
            {showEditVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa video</h3>
                        <form onSubmit={(e) => handleSubmitEditVideo(e, showEditVideo, course.lessons?.find(l =>
                            l.videos?.some(v => v.id === showEditVideo) ||
                            l.resources?.some(r => r.type === 'video' && r.id === showEditVideo)
                        )?.id)}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    value={editVideoForm.data.title}
                                    onChange={(e) => editVideoForm.setData('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cách thêm video mới (tùy chọn)
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="editUploadMethod"
                                            value="file"
                                            checked={editVideoForm.data.uploadMethod === 'file'}
                                            onChange={(e) => editVideoForm.setData('uploadMethod', e.target.value)}
                                            className="mr-2"
                                        />
                                        Upload file video
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="editUploadMethod"
                                            value="url"
                                            checked={editVideoForm.data.uploadMethod === 'url'}
                                            onChange={(e) => editVideoForm.setData('uploadMethod', e.target.value)}
                                            className="mr-2"
                                        />
                                        Nhập URL
                                    </label>
                                </div>
                            </div>

                            {editVideoForm.data.uploadMethod === 'file' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        File video mới (tùy chọn)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => editVideoForm.setData('file', e.target.files[0])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        accept=".webm,video/webm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Chỉ chọn file nếu muốn thay thế video hiện tại
                                    </p>
                                </div>
                            )}

                            {editVideoForm.data.uploadMethod === 'url' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL video mới (tùy chọn)
                                    </label>
                                    <input
                                        type="url"
                                        value={editVideoForm.data.url}
                                        onChange={(e) => editVideoForm.setData('url', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://youtube.com/watch?v=... hoặc https://vimeo.com/..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Chỉ nhập URL nếu muốn thay thế video hiện tại
                                    </p>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editVideoForm.data.is_preview}
                                        onChange={(e) => editVideoForm.setData('is_preview', e.target.checked)}
                                        className="mr-2"
                                    />
                                    Cho phép xem trước miễn phí
                                </label>
                            </div>

                            {editVideoForm.data.uploadProgress > 0 && (
                                <div className="mb-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${editVideoForm.data.uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{editVideoForm.data.uploadProgress}% hoàn thành</p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => handleCancelEdit('video')}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                    disabled={editVideoForm.data.uploadProgress > 0}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    disabled={editVideoForm.processing || editVideoForm.data.uploadProgress > 0}
                                >
                                    {editVideoForm.data.uploadProgress > 0 ? 'Đang tải...' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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