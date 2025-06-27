import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const InfoIntructor = () => {
    const { auth, flash_success, flash_error } = usePage().props;

    // Get instructor data from auth
    const instructor = auth?.instructor;
    const user = auth?.user;

    return (
        <section className="pt-0">
            <div className="container-fluid px-0">
                <div
                    className="card bg-blue h-100px h-md-200px rounded-0"
                    style={{
                        background: 'url(assets/images/pattern/04.png) no-repeat center center',
                        backgroundSize: 'cover',
                    }}
                ></div>
            </div>
            <div className="container mt-n4">
                <div className="row">
                    <div className="col-12">
                        <div className="card bg-transparent card-body pb-0 ps-0 mt-2 mt-sm-0">
                            <div className="row d-sm-flex justify-sm-content-between mt-2 mt-md-0">
                                {/* Avatar */}
                                <div className="col-auto">
                                    <div className="avatar avatar-xxl position-relative mt-n3">
                                        <img
                                            className="avatar-img rounded-circle border-white border-3 shadow"
                                            src={
                                                instructor?.avatar
                                                    ? `/storage/${instructor.avatar}`
                                                    : '/assets/images/avatar/default.jpg'
                                            }
                                            alt={user?.name || 'Instructor'}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* Profile info */}
                                <div className="col d-sm-flex justify-content-between align-items-center">
                                    <div>
                                        <h1 className="my-1 fs-4">{user?.name}</h1>
                                        <p className="mb-0">
                                            <span className="badge bg-success">Giảng viên</span>
                                            {instructor?.profession && (
                                                <span className="text-black ms-2">• {instructor.profession}</span>
                                            )}
                                        </p>
                                        {instructor?.bio && (
                                            <p className="text-black small mt-1 mb-0">
                                                {instructor.bio.length > 100
                                                    ? instructor.bio.substring(0, 100) + '...'
                                                    : instructor.bio
                                                }
                                            </p>
                                        )}
                                    </div>
                                    {/* Button */}
                                    <div className="mt-2 mt-sm-0 d-flex gap-2">
                                        <Link
                                            href={route('instructor.profile.edit')}
                                            className="btn btn-outline-secondary btn-sm mb-0"
                                        >
                                            <i className="bi bi-pencil me-1"></i>
                                            Chỉnh sửa
                                        </Link>
                                        <Link
                                            href={route('instructor.courses.create')}
                                            className="btn btn-primary btn-sm mb-0"
                                        >
                                            <i className="bi bi-plus me-1"></i>
                                            Tạo khóa học
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced filter responsive toggler START */}
                        {/* Divider */}
                        <hr className="d-xl-none" />
                        <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center">
                            <a className="h6 mb-0 fw-bold d-xl-none" href="#">
                                Menu
                            </a>
                            <button
                                className="btn btn-primary d-xl-none"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasNavbar"
                                aria-controls="offcanvasNavbar"
                            >
                                <i className="fas fa-sliders-h"></i>
                            </button>
                        </div>
                        {/* Advanced filter responsive toggler END */}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default InfoIntructor;