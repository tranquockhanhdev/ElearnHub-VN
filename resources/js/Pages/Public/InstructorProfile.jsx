import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import UserLayout from '../../Components/Layouts/UserLayout';

const InstructorProfile = () => {
    const { instructor, courses, stats } = usePage().props;
    console.log(instructor, courses, stats);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getCourseImageUrl = (imgUrl) => {
        if (!imgUrl) return '/assets/images/courses/default.jpg';
        if (imgUrl.startsWith('http')) return imgUrl;
        return `/storage/${imgUrl}`;
    };

    return (
        <UserLayout>
            <main>
                {/* Hero Section */}
                <section className="pt-5 pb-0">
                    <div className="container">
                        <div className="row g-0 g-lg-5 align-items-center">
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="col-md-6 col-lg-12">
                                        <div className="text-center">
                                            <div className="avatar avatar-xxl mb-3">
                                                <img
                                                    className="avatar-img rounded-circle shadow"
                                                    src={instructor.avatar ? `/storage/${instructor.avatar}` : '/assets/images/avatar/default.jpg'}
                                                    alt={instructor.name}
                                                />
                                            </div>
                                            <h1 className="mb-0">{instructor.user.name}</h1>
                                            <p className="mb-3">{instructor.bio || 'Giảng viên tại EHub'}</p>
                                            {instructor.profession && (
                                                <div className="mb-3">
                                                    <span className="badge bg-primary-soft text-primary fs-6">
                                                        {instructor.profession}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Social Media Links */}
                                            {(instructor.facebook_url || instructor.twitter_url || instructor.linkedin_url) && (
                                                <div className="mt-3">
                                                    <h6 className="mb-2">Kết nối với tôi:</h6>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        {instructor.facebook_url && (
                                                            <a
                                                                href={instructor.facebook_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary rounded-circle"
                                                                style={{ width: '40px', height: '40px' }}
                                                            >
                                                                <i className="fab fa-facebook-f"></i>
                                                            </a>
                                                        )}
                                                        {instructor.twitter_url && (
                                                            <a
                                                                href={instructor.twitter_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-info rounded-circle"
                                                                style={{ width: '40px', height: '40px' }}
                                                            >
                                                                <i className="fab fa-twitter"></i>
                                                            </a>
                                                        )}
                                                        {instructor.linkedin_url && (
                                                            <a
                                                                href={instructor.linkedin_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary rounded-circle"
                                                                style={{ width: '40px', height: '40px' }}
                                                            >
                                                                <i className="fab fa-linkedin-in"></i>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <div className="row g-4">
                                    <div className="col-sm-6">
                                        <div className="text-center text-sm-start">
                                            <h4 className="text-orange mb-0">{stats.total_courses}</h4>
                                            <p className="mb-0 h6 fw-light">Khóa học</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="text-center text-sm-start">
                                            <h4 className="text-purple mb-0">{stats.total_students}</h4>
                                            <p className="mb-0 h6 fw-light">Học viên</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="text-center text-sm-start">
                                            <h4 className="text-success mb-0">{stats.total_reviews}</h4>
                                            <p className="mb-0 h6 fw-light">Đánh giá</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="text-center text-sm-start">
                                            <h4 className="text-info mb-0">{stats.average_rating}/5</h4>
                                            <p className="mb-0 h6 fw-light">Điểm trung bình</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                {instructor.experience && (
                    <section className="pt-4 pb-0">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="card shadow rounded-2 p-0">
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h3 className="mb-0">Về tôi</h3>
                                        </div>
                                        <div className="card-body p-4">
                                            <p className="mb-0">{instructor.experience}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Courses Section */}
                <section className="pt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="d-sm-flex justify-content-between align-items-center mb-4">
                                    <h2 className="mb-2 mb-sm-0">Khóa học của {instructor.user.name}</h2>
                                    <span className="h6 fw-light mb-0">({courses.length} khóa học)</span>
                                </div>
                            </div>
                        </div>

                        {courses.length > 0 ? (
                            <div className="row g-4">
                                {courses.map((course, index) => (
                                    <div key={course.id} className="col-sm-6 col-lg-4 col-xl-3">
                                        <div className="card shadow h-100">
                                            <img
                                                src={getCourseImageUrl(course.img_url)}
                                                className="card-img-top"
                                                alt={course.title}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body pb-0">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="badge bg-purple bg-opacity-10 text-purple">
                                                        {course.categories && course.categories.length > 0
                                                            ? course.categories[0].name
                                                            : 'Khóa học'
                                                        }
                                                    </span>
                                                    <a href="#" className="h6 mb-0">
                                                        <i className="far fa-heart"></i>
                                                    </a>
                                                </div>
                                                <h5 className="card-title fw-normal">
                                                    <Link
                                                        href={route('courses.show', course.slug)}
                                                        className="text-decoration-none"
                                                    >
                                                        {course.title}
                                                    </Link>
                                                </h5>
                                                <p className="mb-2 text-truncate-2">
                                                    {course.short_description}
                                                </p>
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item me-0 small">
                                                        <i className="fas fa-star text-warning"></i>
                                                    </li>
                                                    <li className="list-inline-item me-0 small">
                                                        <i className="fas fa-star text-warning"></i>
                                                    </li>
                                                    <li className="list-inline-item me-0 small">
                                                        <i className="fas fa-star text-warning"></i>
                                                    </li>
                                                    <li className="list-inline-item me-0 small">
                                                        <i className="fas fa-star text-warning"></i>
                                                    </li>
                                                    <li className="list-inline-item me-0 small">
                                                        <i className="far fa-star text-warning"></i>
                                                    </li>
                                                    <li className="list-inline-item ms-2 h6 fw-light mb-0">4.0</li>
                                                    <li className="list-inline-item h6 fw-light mb-0">
                                                        ({course.enrollments?.length || 0})
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="card-footer pt-0 pb-3">
                                                <hr />
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="col-auto">
                                                        <p className="h6 fw-light mb-0">{formatPrice(course.price)}</p>
                                                    </div>
                                                    <div className="col-auto">
                                                        <Link
                                                            href={route('courses.show', course.slug)}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Xem khóa học
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-12">
                                    <div className="text-center py-5">
                                        <div className="icon-lg bg-light rounded-circle mx-auto mb-3">
                                            <i className="bi bi-book text-muted fs-1"></i>
                                        </div>
                                        <h4 className="text-muted">Chưa có khóa học nào</h4>
                                        <p className="text-muted mb-0">
                                            Giảng viên này chưa tạo khóa học nào
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </UserLayout>
    );
};

export default InstructorProfile;
