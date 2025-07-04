import React, { useState } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import VideoModal from '../../Components/VideoModal';
import DocumentModal from '../../Components/DocumentModal';
import { Link, usePage } from '@inertiajs/react';

const CourseDetail = () => {
    const { auth, flash_success, flash_error, course, isEnrolled, instructorDetails } = usePage().props;
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCurriculumExpanded, setIsCurriculumExpanded] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    // Get course image URL
    const getCourseImageUrl = (imgUrl) => {
        if (!imgUrl) return 'https://placehold.co/600x400/EEE/31343C';
        if (imgUrl.startsWith('http')) return imgUrl;
        return `/storage/${imgUrl}`;
    };

    // Get instructor info
    const getInstructorInfo = () => {
        if (!instructorDetails) {
            return {
                bio: 'Thông tin giảng viên đang được cập nhật',
                avatar: '/assets/images/avatar/default.jpg',
            };
        }

        return {
            bio: instructorDetails.bio || 'Thông tin giảng viên đang được cập nhật',
            avatar: instructorDetails.avatar || '/assets/images/avatar/default.jpg',
        };
    };

    const instructor = getInstructorInfo();

    // Handle resource preview
    const handleResourcePreview = async (resource) => {
        if (!canAccessResource(resource)) {
            alert('Bạn cần đăng ký khóa học để xem tài liệu này');
            return;
        }

        try {
            if (resource.type === 'video') {
                setSelectedVideo(resource);
                setShowVideoModal(true);
            } else if (resource.type === 'document') {
                setSelectedDocument(resource);
                setShowDocumentModal(true);
            } else {
                // Download file
                window.open(getResourceUrl(resource), '_blank');
            }
        } catch (error) {
            console.error('Error previewing resource:', error);
            alert('Không thể xem trước tài liệu này');
        }
    };

    // Check if user can access resource
    const canAccessResource = (resource) => {
        // Nếu là preview resource thì ai cũng có thể xem
        if (resource.is_preview) {
            return true;
        }
        // Nếu không phải preview thì phải đăng ký khóa học
        return isEnrolled;
    };

    // Get resource URL
    const getResourceUrl = (resource) => {
        if (!resource.file_url) return '';
        if (resource.file_url.startsWith('http')) return resource.file_url;
        return `/storage/${resource.file_url}`;
    };

    // Get resource button - cập nhật logic
    const getResourceButton = (resource) => {
        // Chỉ hiển thị nút cho tài liệu miễn phí hoặc user đã enroll
        if (resource.is_preview) {
            return {
                text: 'Xem miễn phí',
                class: 'btn btn-sm btn-success mb-0',
                onClick: () => handleResourcePreview(resource),
                show: true
            };
        } else if (isEnrolled) {
            return {
                text: 'Xem',
                class: 'btn btn-sm btn-primary mb-0',
                onClick: () => handleResourcePreview(resource),
                show: true
            };
        } else {
            // Không hiển thị nút cho tài liệu premium khi chưa enroll
            return {
                text: 'Premium',
                class: 'btn btn-sm btn-outline-warning mb-0',
                onClick: () => alert('Vui lòng đăng ký khóa học để truy cập'),
                show: false // Ẩn nút
            };
        }
    };

    // Get resource icon - cập nhật để hiển thị khóa cho premium
    const getResourceIcon = (resource) => {
        if (resource.is_preview) {
            // Tài liệu miễn phí - hiển thị icon tương ứng
            if (resource.type === 'video') {
                return 'fas fa-play text-success';
            } else if (resource.type === 'document') {
                return 'fas fa-file-alt text-success';
            }
            return 'fas fa-file text-success';
        } else if (isEnrolled) {
            // User đã enroll - hiển thị icon bình thường
            if (resource.type === 'video') {
                return 'fas fa-play text-primary';
            } else if (resource.type === 'document') {
                return 'fas fa-file-alt text-primary';
            }
            return 'fas fa-file text-primary';
        } else {
            // Tài liệu premium chưa enroll - hiển thị khóa
            return 'fas fa-lock text-muted';
        }
    };

    // Process and sort lesson content by type and order
    const processLessonContent = (lesson) => {
        console.log(lesson);
        const content = [];

        // 1. Add videos first (sorted by order)
        if (lesson.resources && lesson.resources.length > 0) {
            const videos = lesson.resources
                .filter(resource => resource.type === 'video')
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            videos.forEach(video => {
                content.push({
                    type: 'video',
                    data: video,
                    order: video.order || 0,
                    id: `video-${video.id}`,
                    sortPriority: 1 // Videos first
                });
            });
        }

        // 2. Add documents second (sorted by order)
        if (lesson.resources && lesson.resources.length > 0) {
            const documents = lesson.resources
                .filter(resource => resource.type === 'document')
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            documents.forEach(document => {
                content.push({
                    type: 'document',
                    data: document,
                    order: document.order || 0,
                    id: `document-${document.id}`,
                    sortPriority: 2 // Documents second
                });
            });
        }
        console.log(lesson.quiz);
        // 3. Add quiz last
        if (lesson.quiz) {
            content.push({
                type: 'quiz',
                data: lesson.quiz,
                order: lesson.quiz.order || 999,
                id: `quiz-${lesson.quiz.id}`,
                sortPriority: 3 // Quiz last
            });
        }

        // Final sort by priority, then by order within each type
        return content.sort((a, b) => {
            if (a.sortPriority !== b.sortPriority) {
                return a.sortPriority - b.sortPriority;
            }
            return a.order - b.order;
        });
    };

    // Handle quiz preview
    const handleQuizPreview = (quiz) => {
        if (!canAccessQuiz(quiz)) {
            alert('Bạn cần đăng ký khóa học để làm quiz này');
            return;
        }

        // Redirect to course learning page
        window.location.href = `/student/course/${course.id}/learn`;
    };

    // Check if user can access quiz
    const canAccessQuiz = (quiz) => {
        // Quiz luôn yêu cầu phải mua khóa học
        return isEnrolled;
    };

    // Get quiz button
    const getQuizButton = (quiz) => {
        if (isEnrolled) {
            return {
                text: 'Làm quiz',
                class: 'btn btn-sm btn-primary mb-0',
                onClick: () => handleQuizPreview(quiz),
                show: true
            };
        } else {
            return {
                text: 'Premium',
                class: 'btn btn-sm btn-outline-warning mb-0',
                onClick: () => alert('Vui lòng đăng ký khóa học để truy cập'),
                show: false
            };
        }
    };

    // Get quiz icon
    const getQuizIcon = (quiz) => {
        if (isEnrolled) {
            return 'fas fa-question-circle text-primary';
        } else {
            return 'fas fa-lock text-muted';
        }
    };

    // Render content item (video, document, or quiz)
    const renderContentItem = (item, itemIndex, totalItems) => {
        if (item.type === 'video') {
            return renderVideoItem(item.data, itemIndex, totalItems);
        } else if (item.type === 'document') {
            return renderDocumentItem(item.data, itemIndex, totalItems);
        } else if (item.type === 'quiz') {
            return renderQuizItem(item.data, itemIndex, totalItems);
        }
        return null;
    };

    // Render video item
    const renderVideoItem = (resource, itemIndex, totalItems) => {
        const button = getResourceButton(resource);

        return (
            <div key={`video-${resource.id}`}>
                <div className="d-sm-flex justify-content-sm-between align-items-center">
                    <div className="d-flex">
                        <button className={`btn ${resource.is_preview ? 'btn-success-soft' : isEnrolled ? 'btn-primary-soft' : 'btn-light'} btn-round mb-0 flex-shrink-0`}>
                            <i className={getResourceIcon(resource)} />
                        </button>
                        <div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
                            <h6 className="mb-0 d-flex align-items-center flex-wrap">
                                <span className="me-2 mb-1">{resource.title}</span>
                                <div className="d-flex flex-wrap gap-1">
                                    {/* Video Badge */}
                                    <span className="badge bg-primary rounded-pill small ">
                                        <i className="fas fa-play me-1"></i>
                                        Video
                                    </span>
                                    {resource.is_preview === 1 ? (
                                        <span className="badge bg-success rounded-pill small">
                                            <i className="fas fa-eye me-1"></i>
                                            Miễn phí
                                        </span>
                                    ) : (
                                        <span className="badge bg-secondary rounded-pill small">
                                            <i className="fas fa-lock me-1"></i>
                                            Riêng tư
                                        </span>
                                    )}
                                    {!resource.is_preview && !isEnrolled && (
                                        <span className="badge bg-warning text-dark rounded-pill small">
                                            <i className="fas fa-crown me-1"></i>
                                            Premium
                                        </span>
                                    )}
                                </div>
                            </h6>
                            <p className="mb-2 mb-sm-0 small text-muted">
                                Video •
                                {resource.file_type && ` ${resource.file_type.toUpperCase()}`}
                                {resource.file_type === 'youtube' && ' • YouTube'}
                                {resource.file_type === 'vimeo' && ' • Vimeo'}
                                {/* {!resource.is_preview && !isEnrolled && (
									<span className="text-warning"> • Cần đăng ký</span>
								)} */}
                            </p>
                        </div>
                    </div>

                    {/* Hiển thị nút cho video miễn phí */}
                    {resource.is_preview && (
                        <button
                            className={button.class}
                            onClick={button.onClick}
                        >
                            <i className="fas fa-eye me-1"></i>
                            {button.text}
                        </button>
                    )}

                    {/* Hiển thị link vào học cho video premium khi đã enroll */}
                    {!resource.is_preview && isEnrolled && (
                        <Link
                            href={`/student/course/${course.id}/learn`}
                            className="btn btn-sm btn-primary mb-0"
                        >
                            <i className="fas fa-arrow-right me-1"></i>
                            Vào học ngay
                        </Link>
                    )}

                    {/* Hiển thị thông báo cho video premium */}
                    {!resource.is_preview && !isEnrolled && (
                        <div className="text-center">
                            {!auth?.user ? (
                                <Link href="/login" className="btn btn-sm btn-outline-primary">
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Đăng nhập
                                </Link>
                            ) : (
                                <small className="text-muted">
                                    <i className="fas fa-lock me-1"></i>
                                    Cần đăng ký khóa học
                                </small>
                            )}
                        </div>
                    )}
                </div>

                {itemIndex < totalItems - 1 && <hr />}
            </div>
        );
    };

    // Render document item
    const renderDocumentItem = (resource, itemIndex, totalItems) => {
        const button = getResourceButton(resource);

        return (
            <div key={`document-${resource.id}`}>
                <div className="d-sm-flex justify-content-sm-between align-items-center">
                    <div className="d-flex">
                        <button className={`btn ${resource.is_preview ? 'btn-success-soft' : isEnrolled ? 'btn-primary-soft' : 'btn-light'} btn-round mb-0 flex-shrink-0`}>
                            <i className={getResourceIcon(resource)} />
                        </button>
                        <div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
                            <h6 className="mb-0 d-flex align-items-center flex-wrap">
                                <span className="me-2 mb-1">{resource.title}</span>
                                <div className="d-flex flex-wrap gap-1">
                                    {/* Document Badge */}
                                    <span className="badge bg-info text-white rounded-pill small">
                                        <i className="fas fa-file-alt me-1"></i>
                                        Tài liệu
                                    </span>
                                    {resource.is_preview === 1 ? (
                                        <span className="badge bg-success rounded-pill small">
                                            <i className="fas fa-eye me-1"></i>
                                            Miễn phí
                                        </span>
                                    ) : (
                                        <span className="badge bg-secondary rounded-pill small">
                                            <i className="fas fa-lock me-1"></i>
                                            Riêng tư
                                        </span>
                                    )}
                                    {!resource.is_preview && !isEnrolled && (
                                        <span className="badge bg-warning text-dark rounded-pill small">
                                            <i className="fas fa-crown me-1"></i>
                                            Premium
                                        </span>
                                    )}
                                </div>
                            </h6>
                            <p className="mb-2 mb-sm-0 small text-muted">
                                Tài liệu •
                                {resource.file_type && ` ${resource.file_type.toUpperCase()}`}
                                {/* {!resource.is_preview && !isEnrolled && (
									<span className="text-warning"> • Cần đăng ký</span>
								)} */}
                            </p>
                        </div>
                    </div>

                    {/* Hiển thị nút cho tài liệu miễn phí */}
                    {resource.is_preview && (
                        <button
                            className={button.class}
                            onClick={button.onClick}
                        >
                            <i className="fas fa-eye me-1"></i>
                            {button.text}
                        </button>
                    )}

                    {/* Hiển thị link vào học cho tài liệu premium khi đã enroll */}
                    {!resource.is_preview && isEnrolled && (
                        <Link
                            href={`/student/course/${course.id}/learn`}
                            className="btn btn-sm btn-primary mb-0"
                        >
                            <i className="fas fa-arrow-right me-1"></i>
                            Vào học ngay
                        </Link>
                    )}

                    {/* Hiển thị thông báo cho tài liệu premium */}
                    {!resource.is_preview && !isEnrolled && (
                        <div className="text-center">
                            {!auth?.user ? (
                                <Link href="/login" className="btn btn-sm btn-outline-primary">
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Đăng nhập
                                </Link>
                            ) : (
                                <small className="text-muted">
                                    <i className="fas fa-lock me-1"></i>
                                    Cần đăng ký khóa học
                                </small>
                            )}
                        </div>
                    )}
                </div>

                {itemIndex < totalItems - 1 && <hr />}
            </div>
        );
    };

    // Render quiz item
    const renderQuizItem = (quiz, itemIndex, totalItems) => {
        const button = getQuizButton(quiz);

        return (
            <div key={`quiz-${quiz.id}`}>
                <div className="d-sm-flex justify-content-sm-between align-items-center">
                    <div className="d-flex">
                        <button className={`btn ${isEnrolled ? 'btn-primary-soft' : 'btn-light'} btn-round mb-0 flex-shrink-0`}>
                            <i className={getQuizIcon(quiz)} />
                        </button>
                        <div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
                            <h6 className="mb-0 d-flex align-items-center flex-wrap">
                                <span className="me-2 mb-1">{quiz.title}</span>
                                <div className="d-flex flex-wrap gap-1">
                                    {/* Quiz Badge */}
                                    <span className="badge bg-warning text-dark rounded-pill small">
                                        <i className="fas fa-question-circle me-1"></i>
                                        Quiz
                                    </span>
                                    {!isEnrolled && (
                                        <span className="badge bg-warning text-dark rounded-pill small">
                                            <i className="fas fa-crown me-1"></i>
                                            Premium
                                        </span>
                                    )}
                                </div>
                            </h6>
                            <p className="mb-2 mb-sm-0 small text-muted">
                                Quiz • {quiz.questions_count || 0} câu hỏi
                                {quiz.duration_minutes && ` • ${quiz.duration_minutes} phút`}
                                {quiz.pass_score && ` • Điểm đậu: ${quiz.pass_score}%`}
                            </p>
                        </div>
                    </div>

                    {/* Hiển thị link vào học cho quiz khi đã enroll */}
                    {isEnrolled && (
                        <Link
                            href={`/student/course/${course.id}/learn`}
                            className="btn btn-sm btn-primary mb-0"
                        >
                            <i className="fas fa-arrow-right me-1"></i>
                            Vào học ngay
                        </Link>
                    )}

                    {/* Hiển thị thông báo cho quiz premium */}
                    {!isEnrolled && (
                        <div className="text-center">
                            {!auth?.user ? (
                                <Link href="/login" className="btn btn-sm btn-outline-primary">
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Đăng nhập
                                </Link>
                            ) : (
                                <small className="text-muted">
                                    <i className="fas fa-lock me-1"></i>
                                    Cần đăng ký khóa học
                                </small>
                            )}
                        </div>
                    )}
                </div>

                {itemIndex < totalItems - 1 && <hr />}
            </div>
        );
    };

    // Calculate statistics - cập nhật để tính cả quiz
    const getStatistics = () => {
        if (!course.lessons) return {
            totalLessons: 0,
            totalVideos: 0,
            totalDocuments: 0,
            totalQuizzes: 0,
            previewVideos: 0,
            previewDocuments: 0
        };

        let totalVideos = 0;
        let totalDocuments = 0;
        let totalQuizzes = 0;
        let previewVideos = 0;
        let previewDocuments = 0;

        course.lessons.forEach(lesson => {
            if (lesson.resources) {
                // Count videos
                const videos = lesson.resources.filter(r => r.type === 'video');
                totalVideos += videos.length;
                previewVideos += videos.filter(r => r.is_preview).length;

                // Count documents
                const documents = lesson.resources.filter(r => r.type === 'document');
                totalDocuments += documents.length;
                previewDocuments += documents.filter(r => r.is_preview).length;
            }

            // Count quizzes
            if (lesson.quiz) {
                totalQuizzes += 1;
                // Quiz không có preview, tất cả đều là premium
            }
        });

        return {
            totalLessons: course.lessons.length,
            totalVideos,
            totalDocuments,
            totalQuizzes,
            previewVideos,
            previewDocuments,
            // Backward compatibility
            totalResources: totalVideos + totalDocuments,
            previewResources: previewVideos + previewDocuments
        };
    };

    const stats = getStatistics();

    // Render categories
    const renderCategories = () => {
        if (!course.categories || course.categories.length === 0) {
            return <span className="badge bg-light text-dark small">Chưa phân loại</span>;
        }
        return course.categories.map((category, index) => (
            <span key={index} className="badge bg-primary text-white small me-1">
                {category.name}
            </span>
        ));
    };

    // Render description with HTML
    const renderDescription = () => {
        if (!course.description) return 'Chưa có mô tả cho khóa học này.';
        return { __html: course.description };
    };

    // Render action button based on enrollment status
    const renderActionButton = () => {
        if (!auth?.user) {
            return (
                <Link href="/login" className="btn btn-success">
                    Đăng nhập để mua
                </Link>
            );
        }

        if (isEnrolled) {
            return (
                <Link
                    href={`/student/course/${course.id}/learn`}
                    className="btn btn-primary"
                >
                    <i className="fas fa-play me-2"></i>
                    Vào học ngay
                </Link>
            );
        }

        return (
            <Link
                href={`/student/checkout/${course.id}`}
                className="btn btn-success"
            >
                Mua ngay
            </Link>
        );
    };

    return (
        <UserLayout>
            <>
                {/* Video Modal */}
                {showVideoModal && (
                    <VideoModal
                        isOpen={showVideoModal}
                        onClose={() => {
                            setShowVideoModal(false);
                            setSelectedVideo(null);
                        }}
                        video={selectedVideo}
                    />
                )}

                {/* Document Modal */}
                {showDocumentModal && (
                    <DocumentModal
                        isOpen={showDocumentModal}
                        onClose={() => {
                            setShowDocumentModal(false);
                            setSelectedDocument(null);
                        }}
                        document={selectedDocument}
                    />
                )}

                {/* **************** MAIN CONTENT START **************** */}
                <main>
                    <section className="pt-3 pt-xl-5">
                        <div className="container" data-sticky-container="">
                            <div className="row g-4">
                                {/* Main content START */}
                                <div className="col-xl-8">
                                    <div className="row g-4">
                                        {/* Title START */}
                                        <div className="col-12">
                                            {/* Update notification banner */}
                                            <div className="alert alert-info border-0 d-flex align-items-center mb-3" role="alert">
                                                <div className="flex-shrink-0">
                                                    <i className="fas fa-sync-alt text-info fa-spin me-2"></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="alert-heading mb-1">
                                                        <i className="fas fa-bell me-1"></i>
                                                        Khóa học đang được cập nhật liên tục
                                                    </h6>
                                                    <p className="mb-0 small">
                                                        Nội dung khóa học được cập nhật hàng ngày với kiến thức mới nhất.
                                                        Học viên sẽ được truy cập miễn phí vào tất cả nội dung mới được thêm vào sau khi mua khoá học.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Categories */}
                                            <div className="mb-2">
                                                {renderCategories()}
                                            </div>

                                            {/* Title */}
                                            <h2>{course.title || 'Tên khóa học'}</h2>

                                            {/* Short description */}
                                            <p>
                                                {course.short_description ||
                                                    'Khóa học này sẽ cung cấp cho bạn những kiến thức và kỹ năng cần thiết để thành công trong lĩnh vực của mình.'
                                                }
                                            </p>

                                            {/* Course stats */}
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
                                                    <i className="fas fa-user-graduate me-2" />
                                                    {course.enrollments?.length || 0} Đã tham gia
                                                </li>
                                                <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
                                                    <i className="fas fa-signal me-2" />
                                                    Tất cả cấp độ
                                                </li>
                                                <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
                                                    <i className="bi bi-patch-exclamation-fill me-2" />
                                                    Cập nhật {new Date(course.updated_at).toLocaleDateString('vi-VN')}
                                                </li>
                                                <li className="list-inline-item fw-light h6">
                                                    <i className="fas fa-globe me-2" />
                                                    Tiếng Việt
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Title END */}

                                        {/* Course Image */}
                                        <div className="col-12 position-relative">
                                            <div className="rounded-3 overflow-hidden">
                                                <img
                                                    src={getCourseImageUrl(course.img_url)}
                                                    alt={course.title}
                                                    className="img-fluid w-100"
                                                    style={{ height: '400px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>

                                        {/* About course START */}
                                        <div className="col-12">
                                            <div className="card border">
                                                {/* Card header START */}
                                                <div className="card-header border-bottom">
                                                    <h3 className="mb-0">Mô tả khóa học</h3>
                                                </div>
                                                {/* Card header END */}

                                                {/* Card body START */}
                                                <div className="card-body">
                                                    <div dangerouslySetInnerHTML={renderDescription()} />

                                                    {/* Collapse body */}
                                                    {isExpanded && (
                                                        <div id="collapseContent" className="mt-3">
                                                            <p>
                                                                Khóa học này được thiết kế để cung cấp cho bạn những kiến thức
                                                                thực tế và ứng dụng cao. Bạn sẽ được học từ những chuyên gia
                                                                hàng đầu trong lĩnh vực với nhiều năm kinh nghiệm.
                                                            </p>
                                                            <p className="mb-0">
                                                                Với phương pháp giảng dạy hiện đại và tương tác, bạn sẽ nhanh chóng
                                                                nắm bắt được những kỹ năng cần thiết để áp dụng vào thực tế công việc.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Collapse button */}
                                                    <button
                                                        className="btn btn-link p-0 mb-0 mt-2 btn-more d-flex align-items-center"
                                                        onClick={() => setIsExpanded(!isExpanded)}
                                                    >
                                                        Xem <span className="see-more ms-1">{isExpanded ? 'ít hơn' : 'thêm'}</span>
                                                        <i className={`fas fa-angle-${isExpanded ? 'up' : 'down'} ms-2`} />
                                                    </button>

                                                    {/* What you'll learn */}
                                                    <h5 className="mt-4">Bạn sẽ học được gì</h5>
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <ul className="list-group list-group-borderless">
                                                                <li className="list-group-item h6 fw-light d-flex mb-0">
                                                                    <i className="fas fa-check-circle text-success me-2" />
                                                                    Nắm vững kiến thức cơ bản
                                                                </li>
                                                                <li className="list-group-item h6 fw-light d-flex mb-0">
                                                                    <i className="fas fa-check-circle text-success me-2" />
                                                                    Ứng dụng vào thực tế
                                                                </li>
                                                                <li className="list-group-item h6 fw-light d-flex mb-0">
                                                                    <i className="fas fa-check-circle text-success me-2" />
                                                                    Phát triển kỹ năng chuyên môn
                                                                </li>
                                                                <li className="list-group-item h6 fw-light d-flex mb-0">
                                                                    <i className="fas fa-check-circle text-success me-2" />
                                                                    Làm việc với dự án thực tế
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <ul className="list-group list-group-borderless">
                                                                <li className="list-group-item h6 fw-light d-flex mb-0">
                                                                    <i className="fas fa-check-circle text-success me-2" />
                                                                    Tư duy giải quyết vấn đề
                                                                </li>
                                                                <li className="list-group-item h6 fw-light d-flex mb-0">
                                                                    <i className="fas fa-check-circle text-success me-2" />
                                                                    Kỹ năng làm việc nhóm
                                                                </li>
                                                                <li className="list-group-item h6 fw-light d-flex mb-0">
                                                                    <i className="fas fa-check-circle text-success me-2" />
                                                                    Cập nhật xu hướng mới
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Card body END */}
                                            </div>
                                        </div>
                                        {/* About course END */}

                                        {/* Curriculum START */}
                                        <div className="col-12">
                                            <div className="card border rounded-3">
                                                {/* Card header START */}
                                                <div className="card-header border-bottom">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h3 className="mb-0">Nội dung khóa học</h3>
                                                        <div className="text-end">
                                                            <p className="mb-0 text-muted small">
                                                                {stats.totalLessons} bài học •
                                                                {stats.totalVideos} video •
                                                                {stats.totalDocuments} tài liệu •
                                                                {stats.totalQuizzes} quiz
                                                            </p>
                                                            {(stats.previewVideos > 0 || stats.previewDocuments > 0) && (
                                                                <p className="mb-0 text-success small">
                                                                    {stats.previewVideos > 0 && `${stats.previewVideos} video miễn phí`}
                                                                    {stats.previewVideos > 0 && stats.previewDocuments > 0 && ' • '}
                                                                    {stats.previewDocuments > 0 && `${stats.previewDocuments} tài liệu miễn phí`}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Card header END */}

                                                {/* Card body START */}
                                                <div className="card-body">
                                                    {course.lessons && course.lessons.length > 0 ? (
                                                        <div className="row g-4">
                                                            {course.lessons.slice(0, isCurriculumExpanded ? course.lessons.length : 2).map((lesson, lessonIndex) => {
                                                                const lessonContent = processLessonContent(lesson);

                                                                // Count content by type for display
                                                                const videoCount = lessonContent.filter(item => item.type === 'video').length;
                                                                const documentCount = lessonContent.filter(item => item.type === 'document').length;
                                                                const quizCount = lessonContent.filter(item => item.type === 'quiz').length;
                                                                const previewCount = lessonContent.filter(item => item.data.is_preview).length;

                                                                return (
                                                                    <div key={lesson.id} className="col-12">
                                                                        <h5 className="mb-4">
                                                                            Chương {lessonIndex + 1}: {lesson.title}
                                                                            <span className="text-muted small">
                                                                                ({lessonContent.length} nội dung
                                                                                {videoCount > 0 && `: ${videoCount} video`}
                                                                                {documentCount > 0 && `, ${documentCount} tài liệu`}
                                                                                {quizCount > 0 && `, ${quizCount} quiz`}
                                                                                {previewCount > 0 && ` • ${previewCount} miễn phí`}
                                                                                )
                                                                            </span>
                                                                        </h5>

                                                                        {lessonContent.length > 0 ? (
                                                                            lessonContent.map((item, itemIndex) =>
                                                                                renderContentItem(item, itemIndex, lessonContent.length)
                                                                            )
                                                                        ) : (
                                                                            <div className="text-center py-3">
                                                                                <p className="text-muted mb-0">Chương này chưa có nội dung</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}

                                                            {/* Collapse button */}
                                                            {course.lessons.length > 2 && (
                                                                <div className="col-12">
                                                                    <button
                                                                        className="btn btn-link mb-0 mt-4 btn-more d-flex align-items-center justify-content-center"
                                                                        onClick={() => setIsCurriculumExpanded(!isCurriculumExpanded)}
                                                                    >
                                                                        Xem <span className="see-more ms-1">
                                                                            {isCurriculumExpanded ? 'ít hơn' : `thêm ${course.lessons.length - 2} chương`}
                                                                        </span>
                                                                        <i className={`fas fa-angle-${isCurriculumExpanded ? 'up' : 'down'} ms-2`} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-5">
                                                            <div className="icon-lg bg-light rounded-circle mx-auto mb-3">
                                                                <i className="bi bi-book text-muted fs-1"></i>
                                                            </div>
                                                            <h5 className="text-muted">Nội dung đang được cập nhật</h5>
                                                            <p className="text-muted mb-0">
                                                                Khóa học này đang trong quá trình xây dựng nội dung
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Card body END */}
                                            </div>
                                        </div>
                                        {/* Curriculum END */}
                                    </div>
                                </div>
                                {/* Main content END */}

                                {/* Right sidebar START */}
                                <div className="col-xl-4">
                                    <div data-sticky="" data-margin-top={80} data-sticky-for={768}>
                                        <div className="row g-4">
                                            <div className="col-md-6 col-xl-12">
                                                {/* Course info START */}
                                                <div className="card card-body border p-4">
                                                    {/* Price and share button */}
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        {/* Price */}
                                                        {!isEnrolled && (
                                                            <h3 className="fw-bold mb-0 me-2 text-success">
                                                                {formatPrice(course.price)}
                                                            </h3>
                                                        )}
                                                        {isEnrolled && (
                                                            <h3 className="fw-bold mb-0 me-2 text-primary">
                                                                Đã đăng ký
                                                            </h3>
                                                        )}
                                                        {/* Share button with dropdown */}
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn btn-sm btn-light rounded mb-0 small"
                                                                type="button"
                                                                id="dropdownShare"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="fas fa-fw fa-share-alt" />
                                                            </button>
                                                            {/* dropdown menu */}
                                                            <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded">
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fab fa-twitter-square me-2" />
                                                                        Twitter
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fab fa-facebook-square me-2" />
                                                                        Facebook
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fab fa-linkedin me-2" />
                                                                        LinkedIn
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fas fa-copy me-2" />
                                                                        Sao chép link
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Buttons */}
                                                    <div className="mt-3 d-grid">
                                                        {renderActionButton()}
                                                    </div>

                                                    {/* Divider */}
                                                    <hr />

                                                    {/* Update notice */}
                                                    <div className="bg-light rounded p-3 mb-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fas fa-calendar-alt text-primary"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-2">
                                                                <h6 className="mb-1 text-primary">Cập nhật thường xuyên</h6>
                                                                <p className="mb-0 small text-muted">
                                                                    Khóa học được cập nhật nội dung mới hàng tuần
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Course includes */}
                                                    <h5 className="mb-3">Khóa học bao gồm</h5>
                                                    <ul className="list-group list-group-borderless border-0">
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-book-open text-primary" />
                                                                Bài học
                                                            </span>
                                                            <span>{stats.totalLessons}</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-play text-primary" />
                                                                Video
                                                            </span>
                                                            <span>{stats.totalVideos}</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-file text-primary" />
                                                                Tài liệu
                                                            </span>
                                                            <span>{stats.totalDocuments}</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-question-circle text-primary" />
                                                                Quiz
                                                            </span>
                                                            <span>{stats.totalQuizzes}</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-eye text-primary" />
                                                                Xem trước miễn phí
                                                            </span>
                                                            <span>{stats.previewVideos + stats.previewDocuments + stats.previewQuizzes}</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-signal text-primary" />
                                                                Cấp độ
                                                            </span>
                                                            <span>Tất cả</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-globe text-primary" />
                                                                Ngôn ngữ
                                                            </span>
                                                            <span>Tiếng Việt</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-user-clock text-primary" />
                                                                Truy cập
                                                            </span>
                                                            <span>Trọn đời</span>
                                                        </li>
                                                        <li className="list-group-item px-0 d-flex justify-content-between">
                                                            <span className="h6 fw-light mb-0">
                                                                <i className="fas fa-fw fa-sync-alt text-success" />
                                                                Cập nhật nội dung
                                                            </span>
                                                            <span className="text-success small">Hàng tuần</span>
                                                        </li>
                                                    </ul>

                                                    {/* Divider */}
                                                    <hr />

                                                    {/* Instructor info */}
                                                    <div className="d-sm-flex align-items-center">
                                                        {/* Avatar image */}
                                                        <div className="avatar avatar-xl">
                                                            <img
                                                                className="avatar-img rounded-circle"
                                                                src={`/storage/${instructor.avatar}`}
                                                                alt={instructor.name}
                                                            />
                                                        </div>
                                                        <div className="ms-sm-3 mt-2 mt-sm-0">                                            <h5 className="mb-0">
                                                            <Link
                                                                href={route('instructor.profile', course.instructor.id)}
                                                                className="text-decoration-none"
                                                            >
                                                                {course.instructor.name}
                                                            </Link>
                                                        </h5>
                                                            <p className="mb-0 small">{instructor.bio}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Course info END */}
                                            </div>
                                        </div>
                                        {/* Row End */}
                                    </div>
                                </div>
                                {/* Right sidebar END */}
                            </div>
                            {/* Row END */}
                        </div>
                    </section>
                </main>
                {/* **************** MAIN CONTENT END **************** */}
            </>
        </UserLayout>
    );
};

export default CourseDetail;