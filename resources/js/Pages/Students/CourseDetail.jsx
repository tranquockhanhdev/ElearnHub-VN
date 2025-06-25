import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '../../Components/Layouts/UserLayout';
import StudentVideoModal from '../../Components/StudentVideoModal';
import DocumentModal from '../../Components/DocumentModal';
import {
    PlayCircleIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    LockClosedIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    BookOpenIcon,
    VideoCameraIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

const CourseDetail = () => {
    const { course, progress, auth } = usePage().props;
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [expandedLessons, setExpandedLessons] = useState(new Set());
    const [currentProgress, setCurrentProgress] = useState(progress);

    // Mở lesson đầu tiên mặc định
    useEffect(() => {
        if (course.lessons && course.lessons.length > 0) {
            setExpandedLessons(new Set([course.lessons[0].id]));
        }
    }, [course.lessons]);

    // Xử lý khi video hoàn thành
    const handleVideoComplete = (videoId) => {
        setCurrentProgress(prev => ({
            ...prev,
            completedResources: [...(prev.completedResources || []), videoId]
        }));
    };

    // Xử lý khi document được xem
    const handleDocumentView = (documentId) => {
        if (!currentProgress?.completedResources?.includes(documentId)) {
            setCurrentProgress(prev => ({
                ...prev,
                completedResources: [...(prev.completedResources || []), documentId]
            }));
            markDocumentComplete(documentId);
        }
    };

    // Đánh dấu document đã hoàn thành
    const markDocumentComplete = async (documentId) => {
        try {
            await fetch(`/student/course/${course.id}/resource/${documentId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
        } catch (error) {
            console.error('Error marking document as complete:', error);
        }
    };

    // Tính toán tiến độ khóa học
    const calculateProgress = () => {
        if (!course.lessons || course.lessons.length === 0) return 0;

        let totalItems = 0;
        let completedItems = 0;

        course.lessons.forEach(lesson => {
            const items = getLessonItems(lesson);
            totalItems += items.length;
            completedItems += items.filter(item => item.isCompleted).length;
        });

        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };

    // Lấy các item trong lesson (sắp xếp theo: Video -> Quiz -> Document)
    const getLessonItems = (lesson) => {
        const items = [];

        if (lesson.resources) {
            // 1. Thêm tất cả Videos (sắp xếp theo order của video)
            const videos = lesson.resources
                .filter(resource => resource.type === 'video')
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            videos.forEach((video, index) => {
                items.push({
                    id: `video_${video.id}`,
                    type: 'video',
                    title: video.title,
                    data: video,
                    isCompleted: currentProgress?.completedResources?.includes(video.id) || false,
                    duration: video.duration || null,
                    order: 100 + index, // Video có priority 100+
                    originalOrder: video.order || 0
                });
            });

            // 3. Thêm tất cả Documents (sắp xếp theo order của document)
            const documents = lesson.resources
                .filter(resource => resource.type === 'document')
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            documents.forEach((document, index) => {
                items.push({
                    id: `document_${document.id}`,
                    type: 'document',
                    title: document.title,
                    data: document,
                    isCompleted: currentProgress?.completedResources?.includes(document.id) || false,
                    order: 300 + index, // Document có priority 300+
                    originalOrder: document.order || 0
                });
            });
        }

        // 2. Thêm Quiz (ở giữa videos và documents)
        if (lesson.quiz) {
            items.push({
                id: `quiz_${lesson.quiz.id}`,
                type: 'quiz',
                title: lesson.quiz.title || 'Bài kiểm tra',
                data: lesson.quiz,
                isCompleted: currentProgress?.completedQuizzes?.includes(lesson.quiz.id) || false,
                order: 200, // Quiz có priority 200 (giữa video và document)
                originalOrder: 0
            });
        }

        // Sắp xếp theo order tổng
        return items.sort((a, b) => a.order - b.order);
    };

    // Kiểm tra xem item có thể truy cập được không
    const canAccessItem = (lesson, itemIndex, item) => {
        // Document luôn có thể truy cập
        if (item.type === 'document') return true;

        const items = getLessonItems(lesson);

        // Item đầu tiên luôn có thể truy cập
        if (itemIndex === 0) return true;

        // Đối với quiz, cần kiểm tra tất cả video trước đó đã hoàn thành
        if (item.type === 'quiz') {
            // Lấy tất cả videos trong lesson này
            const videosInLesson = items.filter(i => i.type === 'video');
            return videosInLesson.every(video => video.isCompleted);
        }

        // Đối với video, kiểm tra video trước đó đã hoàn thành
        if (item.type === 'video') {
            // Lấy tất cả videos trước item này
            const videosBeforeThis = items
                .filter(i => i.type === 'video')
                .slice(0, items.filter(i => i.type === 'video').findIndex(v => v.id === item.id));

            return videosBeforeThis.every(video => video.isCompleted);
        }

        return true;
    };

    // Kiểm tra xem lesson có thể truy cập được không
    const canAccessLesson = (lessonIndex) => {
        if (lessonIndex === 0) return true;

        // Kiểm tra lesson trước đó đã hoàn thành chưa
        const previousLesson = course.lessons[lessonIndex - 1];
        const previousItems = getLessonItems(previousLesson);

        // Lesson được coi là hoàn thành khi tất cả video và quiz đã hoàn thành
        const requiredItems = previousItems.filter(item =>
            item.type === 'video' || item.type === 'quiz'
        );

        return requiredItems.every(item => item.isCompleted);
    };

    // Toggle mở rộng lesson
    const toggleLesson = (lessonId) => {
        const newExpanded = new Set(expandedLessons);
        if (newExpanded.has(lessonId)) {
            newExpanded.delete(lessonId);
        } else {
            newExpanded.add(lessonId);
        }
        setExpandedLessons(newExpanded);
    };

    // Xử lý click vào item
    const handleItemClick = (item, lesson, itemIndex) => {
        const itemCanAccess = canAccessItem(lesson, itemIndex, item);

        if (!itemCanAccess) {
            let message = 'Bạn cần hoàn thành bài học trước để mở khóa nội dung này!';

            if (item.type === 'quiz') {
                message = 'Bạn cần hoàn thành tất cả video trong bài học này để mở khóa quiz!';
            } else if (item.type === 'video') {
                message = 'Bạn cần hoàn thành video trước đó để mở khóa video này!';
            }

            alert(message);
            return;
        }

        switch (item.type) {
            case 'video':
                setSelectedVideo(item.data);
                setShowVideoModal(true);
                break;
            case 'document':
                setSelectedDocument(item.data);
                setShowDocumentModal(true);
                handleDocumentView(item.data.id);
                break;
            case 'quiz':
                window.location.href = `/student/quiz/${item.data.id}`;
                break;
        }
    };

    // Lấy icon cho từng loại item
    const getItemIcon = (type, isCompleted, canAccess) => {
        const baseClasses = "w-5 h-5";

        if (isCompleted) {
            return <CheckCircleIcon className={`${baseClasses} text-green-500`} />;
        }

        if (type === 'document') {
            return <DocumentTextIcon className={`${baseClasses} text-orange-500`} />;
        }

        if (!canAccess) {
            return <LockClosedIcon className={`${baseClasses} text-gray-400`} />;
        }

        switch (type) {
            case 'video':
                return <PlayCircleIcon className={`${baseClasses} text-blue-500`} />;
            case 'quiz':
                return <AcademicCapIcon className={`${baseClasses} text-purple-500`} />;
            default:
                return <ClockIcon className={`${baseClasses} text-gray-500`} />;
        }
    };

    // Lấy màu badge cho lesson status
    const getLessonStatusBadge = (lesson, lessonIndex, items) => {
        const canAccess = canAccessLesson(lessonIndex);

        // Chỉ tính video và quiz cho progress (bỏ qua document)
        const requiredItems = items.filter(item => item.type !== 'document');
        const completedRequiredItems = requiredItems.filter(item => item.isCompleted).length;
        const progressPercent = requiredItems.length > 0 ?
            Math.round((completedRequiredItems / requiredItems.length) * 100) : 0;

        if (!canAccess) {
            return { color: 'bg-gray-100 text-gray-400', text: 'Khóa' };
        }

        if (progressPercent === 100) {
            return { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' };
        }

        if (progressPercent > 0) {
            return { color: 'bg-blue-100 text-blue-800', text: `${progressPercent}%` };
        }

        return { color: 'bg-yellow-100 text-yellow-800', text: 'Chưa bắt đầu' };
    };

    // Lấy thông tin trạng thái item
    const getItemStatusInfo = (item, lesson, itemIndex) => {
        const canAccess = canAccessItem(lesson, itemIndex, item);

        if (item.type === 'document') {
            return { canAccess: true, message: 'Có thể xem tự do' };
        }

        if (item.type === 'quiz') {
            const items = getLessonItems(lesson);
            const videosInLesson = items.filter(i => i.type === 'video');
            const completedVideos = videosInLesson.filter(v => v.isCompleted).length;

            if (!canAccess) {
                return {
                    canAccess: false,
                    message: `Cần hoàn thành ${videosInLesson.length - completedVideos} video nữa`
                };
            }
        }

        return { canAccess, message: null };
    };

    const progressPercentage = calculateProgress();

    return (
        <UserLayout>
            <Head title={`Học: ${course.title}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('student.courselist')}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                    <span>Quay lại</span>
                                </Link>
                                <div className="border-l border-gray-300 pl-4">
                                    <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">
                                        {course.title}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {course.lessons?.length || 0} bài học
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-600">
                                    Tiến trình: <span className="font-semibold text-blue-600">{progressPercentage}%</span>
                                </div>
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Course Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <BookOpenIcon className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
                                    </div>
                                    <p className="text-gray-600 mt-2">
                                        Thứ tự học: <span className="font-medium">Video → Quiz → Tài liệu</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        • Video: Học theo thứ tự • Quiz: Sau khi hoàn thành video • Tài liệu: Xem tự do
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {course.lessons?.map((lesson, lessonIndex) => {
                                        const items = getLessonItems(lesson);
                                        const canAccess = canAccessLesson(lessonIndex);
                                        const isExpanded = expandedLessons.has(lesson.id);
                                        const statusBadge = getLessonStatusBadge(lesson, lessonIndex, items);

                                        return (
                                            <div key={lesson.id} className="lesson-item">
                                                <button
                                                    onClick={() => canAccess && toggleLesson(lesson.id)}
                                                    className={`w-full p-6 text-left hover:bg-gray-50 transition-colors ${!canAccess ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                                        }`}
                                                    disabled={!canAccess}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <div className={`
                                                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                                                    ${statusBadge.color.includes('green') ? 'bg-green-500 text-white' :
                                                                        statusBadge.color.includes('blue') ? 'bg-blue-500 text-white' :
                                                                            statusBadge.color.includes('yellow') ? 'bg-yellow-500 text-white' :
                                                                                'bg-gray-300 text-gray-600'}
                                                                `}>
                                                                    {statusBadge.color.includes('green') ? '✓' : lessonIndex + 1}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                                        {lesson.title}
                                                                    </h3>
                                                                    <div className="flex items-center space-x-2 mt-1">
                                                                        <span className="text-xs text-gray-500">
                                                                            {items.filter(i => i.type === 'video').length} video, {' '}
                                                                            {lesson.quiz ? '1 quiz, ' : ''}
                                                                            {items.filter(i => i.type === 'document').length} tài liệu
                                                                        </span>
                                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                                            {statusBadge.text}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="ml-4 flex items-center space-x-2">
                                                            {!canAccess && <LockClosedIcon className="w-5 h-5 text-gray-400" />}
                                                            <ChevronDownIcon className={`
                                                                w-5 h-5 text-gray-400 transform transition-transform duration-200
                                                                ${isExpanded ? 'rotate-180' : ''}
                                                            `} />
                                                        </div>
                                                    </div>
                                                </button>

                                                {isExpanded && canAccess && (
                                                    <div className="bg-gray-50 border-t border-gray-100">
                                                        {items.map((item, itemIndex) => {
                                                            const statusInfo = getItemStatusInfo(item, lesson, itemIndex);

                                                            return (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => handleItemClick(item, lesson, itemIndex)}
                                                                    className={`
                                                                        w-full px-8 py-4 text-left hover:bg-white transition-colors 
                                                                        flex items-center space-x-4 border-b border-gray-100 last:border-b-0
                                                                        ${!statusInfo.canAccess
                                                                            ? 'opacity-50 cursor-not-allowed'
                                                                            : 'cursor-pointer hover:shadow-sm'
                                                                        }
                                                                    `}
                                                                    disabled={!statusInfo.canAccess}
                                                                >
                                                                    <div className="flex-shrink-0">
                                                                        {getItemIcon(item.type, item.isCompleted, statusInfo.canAccess)}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className={`
                                                                            font-medium truncate
                                                                            ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}
                                                                        `}>
                                                                            {item.title}
                                                                        </h4>
                                                                        <div className="flex items-center space-x-2 mt-1">
                                                                            <span className={`
                                                                                text-xs px-2 py-0.5 rounded-full font-medium
                                                                                ${item.type === 'video' ? 'bg-blue-100 text-blue-800' :
                                                                                    item.type === 'document' ? 'bg-orange-100 text-orange-800' :
                                                                                        'bg-purple-100 text-purple-800'}
                                                                            `}>
                                                                                {item.type === 'video' ? 'Video' :
                                                                                    item.type === 'document' ? 'Tài liệu' : 'Quiz'}
                                                                                {item.originalOrder > 0 && ` #${item.originalOrder}`}
                                                                            </span>
                                                                            {statusInfo.message && (
                                                                                <span className={`text-xs font-medium ${item.type === 'document' ? 'text-blue-600' :
                                                                                    statusInfo.canAccess ? 'text-green-600' : 'text-orange-600'
                                                                                    }`}>
                                                                                    • {statusInfo.message}
                                                                                </span>
                                                                            )}
                                                                            {item.duration && (
                                                                                <span className="text-xs text-gray-500">
                                                                                    • {item.duration}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex-shrink-0">
                                                                        {item.isCompleted && (
                                                                            <div className="flex items-center space-x-1 text-green-600">
                                                                                <CheckCircleIcon className="w-4 h-4" />
                                                                            </div>
                                                                        )}
                                                                        {!statusInfo.canAccess && (
                                                                            <LockClosedIcon className="w-4 h-4 text-gray-400" />
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Course Info */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Course Info Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="text-center">
                                        <img
                                            src={course.img_url ? `/storage/${course.img_url}` : '/images/default-course.jpg'}
                                            alt={course.title}
                                            className="w-full h-32 object-cover rounded-lg mb-4"
                                        />
                                        <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Giảng viên: {course.instructor?.name}
                                        </p>

                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                {progressPercentage}%
                                            </div>
                                            <div className="text-sm text-blue-700">
                                                Tiến độ hoàn thành
                                            </div>
                                            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Learning Tips */}
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />
                                        Quy tắc học tập
                                    </h4>
                                    <ul className="text-sm text-gray-700 space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">1.</span>
                                            <span><strong>Video:</strong> Xem theo thứ tự, hoàn thành 85% để mở khóa tiếp theo</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-600 mr-2">2.</span>
                                            <span><strong>Quiz:</strong> Mở sau khi hoàn thành tất cả video trong bài</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-600 mr-2">3.</span>
                                            <span><strong>Tài liệu:</strong> Có thể xem và tải về bất cứ lúc nào</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Video Modal */}
            <StudentVideoModal
                isOpen={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                video={selectedVideo}
                courseId={course.id}
                onVideoComplete={handleVideoComplete}
            />

            {/* Document Modal */}
            <DocumentModal
                isOpen={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                document={selectedDocument}
            />
        </UserLayout>
    );
};

export default CourseDetail;