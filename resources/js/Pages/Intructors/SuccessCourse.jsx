import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoIntructor from '../../Components/InfoIntructor';

const SuccessCourse = () => {
    const { auth } = usePage().props;

    return (
        <UserLayout>
            <>
                {/* **************** MAIN CONTENT START **************** */}
                <main>
                    <section className="overflow-hidden pt-0 pt-sm-5">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-8 col-md-10 text-center">
                                    {/* Success Icon - Centered */}
                                    <div className="d-flex justify-content-center mb-4">
                                        <div className="position-relative">
                                            {/* Background Circle */}
                                            <div
                                                className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                                style={{ width: '150px', height: '150px' }}
                                            >
                                                <i className="bi bi-check-lg text-white" style={{ fontSize: '4rem' }}></i>
                                            </div>

                                            {/* Decorative Elements */}
                                            <div className="position-absolute top-0 start-0">
                                                <div className="bg-primary rounded-circle" style={{ width: '20px', height: '20px', transform: 'translate(-10px, -10px)' }}></div>
                                            </div>
                                            <div className="position-absolute top-0 end-0">
                                                <div className="bg-warning rounded-circle" style={{ width: '15px', height: '15px', transform: 'translate(10px, -5px)' }}></div>
                                            </div>
                                            <div className="position-absolute bottom-0 start-0">
                                                <div className="bg-info rounded-circle" style={{ width: '12px', height: '12px', transform: 'translate(-5px, 10px)' }}></div>
                                            </div>
                                            <div className="position-absolute bottom-0 end-0">
                                                <div className="bg-danger rounded-circle" style={{ width: '18px', height: '18px', transform: 'translate(15px, 15px)' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Success Message */}
                                    <div className="mb-4">
                                        <h2 className="text-success mb-3">
                                            <i className="bi bi-party-party me-2"></i>
                                            Chúc mừng!
                                        </h2>
                                        <h4 className="mb-3">Khóa học của bạn đã được gửi thành công</h4>

                                        {/* Status Steps */}
                                        <div className="row justify-content-center mt-4 mb-4">
                                            <div className="col-md-8">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    {/* Step 1 - Completed */}
                                                    <div className="text-center">
                                                        <div className="bg-success rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                            <i className="bi bi-check text-white"></i>
                                                        </div>
                                                        <small className="text-success fw-bold">Đã gửi</small>
                                                    </div>

                                                    {/* Line */}
                                                    <div className="flex-fill mx-2">
                                                        <hr className="border-2 border-warning" />
                                                    </div>

                                                    {/* Step 2 - In Progress */}
                                                    <div className="text-center">
                                                        <div className="bg-warning rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                            <i className="bi bi-clock text-white"></i>
                                                        </div>
                                                        <small className="text-warning fw-bold">Đang xét duyệt</small>
                                                    </div>

                                                    {/* Line */}
                                                    <div className="flex-fill mx-2">
                                                        <hr className="border-2 border-muted" />
                                                    </div>

                                                    {/* Step 3 - Pending */}
                                                    <div className="text-center">
                                                        <div className="bg-light border rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                            <i className="bi bi-star text-muted"></i>
                                                        </div>
                                                        <small className="text-muted">Xuất bản</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Information Card */}
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-body p-4">
                                            <div className="row align-items-center">
                                                <div className="col-md-3">
                                                    <i className="bi bi-info-circle text-primary" style={{ fontSize: '3rem' }}></i>
                                                </div>
                                                <div className="col-md-9 text-start">
                                                    <h6 className="card-title mb-2">Điều gì sẽ xảy ra tiếp theo?</h6>
                                                    <ul className="list-unstyled mb-0">
                                                        <li className="mb-2">
                                                            <i className="bi bi-check-circle text-success me-2"></i>
                                                            Chúng tôi sẽ xem xét khóa học của bạn trong <strong>2-3 ngày làm việc</strong>
                                                        </li>

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                                        <Link
                                            href={route('instructor.dashboard')}
                                            className="btn btn-primary btn-lg px-4"
                                        >
                                            <i className="bi bi-house me-2"></i>
                                            Về Trang Chủ
                                        </Link>
                                        <Link
                                            href={route('instructor.courses.create')}
                                            className="btn btn-outline-primary btn-lg px-4"
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Tạo Khóa Học Mới
                                        </Link>
                                    </div>

                                    {/* Tips Section */}
                                    <div className="mt-5 pt-4 border-top">
                                        <h6 className="text-muted mb-3">💡 Mẹo để khóa học được duyệt nhanh hơn:</h6>
                                        <div className="row text-start">
                                            <div className="col-md-4 mb-3">
                                                <div className="text-center">
                                                    <i className="bi bi-image text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                                                    <h6>Hình ảnh chất lượng</h6>
                                                    <small className="text-muted">Sử dụng ảnh bìa rõ nét, tỷ lệ 4:3</small>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <div className="text-center">
                                                    <i className="bi bi-file-text text-success mb-2" style={{ fontSize: '2rem' }}></i>
                                                    <h6>Mô tả chi tiết</h6>
                                                    <small className="text-muted">Viết mô tả rõ ràng, đầy đủ thông tin</small>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <div className="text-center">
                                                    <i className="bi bi-tags text-warning mb-2" style={{ fontSize: '2rem' }}></i>
                                                    <h6>Danh mục phù hợp</h6>
                                                    <small className="text-muted">Chọn đúng danh mục cho khóa học</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                {/* **************** MAIN CONTENT END **************** */}
            </>
        </UserLayout>
    );
}

export default SuccessCourse;