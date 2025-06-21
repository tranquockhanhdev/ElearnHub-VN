import React, { useState } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import { Link, usePage, router, useForm } from '@inertiajs/react';

const Profile = () => {
    const { auths, flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');

    // Form cho cập nhật profile - chỉ 3 trường
    const { data, setData, put, processing, errors, reset } = useForm({
        name: auths.user.name || '',
        email: auths.user.email || '',
        phone: auths.user.phone || '',
    });

    // Form cho đổi mật khẩu
    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('student.profile.update'));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        putPassword(route('student.password.update'), {
            onSuccess: () => {
                resetPassword();
            }
        });
    };

    return (
        <UserLayout>
            <main className="bg-light min-vh-100">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-bottom">
                    <InfoStudent />
                </div>

                {/* Main Content */}
                <div className="container py-4">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-xl-3">
                            <nav className="navbar navbar-light navbar-expand-xl mx-0">
                                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar">
                                    <div className="offcanvas-header bg-light">
                                        <h5 className="offcanvas-title">Hồ sơ của tôi</h5>
                                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
                                    </div>
                                    <div className="offcanvas-body p-3 p-xl-0">
                                        <div className="bg-dark border rounded-3 pb-0 p-3 w-100">
                                            <div className="list-group list-group-dark list-group-borderless">
                                                <Link className="list-group-item " href="/student/dashboard" preserveScroll>
                                                    <i className="bi bi-ui-checks-grid fa-fw me-2"></i>Bảng điều khiển
                                                </Link>
                                                <Link className="list-group-item" href="/student/courselist" preserveScroll>
                                                    <i className="bi bi-basket fa-fw me-2"></i>Khóa học của tôi
                                                </Link>
                                                <Link className="list-group-item" href="/student/payments" preserveScroll>
                                                    <i className="bi bi-credit-card-2-front fa-fw me-2"></i>Lịch Sử thanh toán
                                                </Link>
                                                <Link className="list-group-item active" href="/student/profile" preserveScroll>
                                                    <i className="bi bi-pencil-square fa-fw me-2"></i>Chỉnh sửa hồ sơ
                                                </Link>
                                                <Link className="list-group-item text-danger bg-danger-soft-hover" href="/logout" method="post" as="button">
                                                    <i className="fas fa-sign-out-alt fa-fw me-2"></i>Đăng xuất
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>

                        {/* Main Content Area */}
                        <div className="col-xl-9 ">
                            {/* Page Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="h3 mb-1">Hồ sơ cá nhân</h2>
                                    <p className="text-muted mb-0">
                                        Quản lý thông tin cá nhân và bảo mật tài khoản
                                    </p>
                                </div>
                            </div>

                            {/* Flash Messages */}
                            {flash && flash.success && (
                                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                                    <i className="bi bi-check-circle me-2"></i>
                                    {flash.success}
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            )}

                            {flash && flash.error && (
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {flash.error}
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            )}

                            {/* Profile Card */}
                            <div className="card border-0 shadow-sm">
                                {/* Tab Navigation */}
                                <div className="card-header bg-white border-bottom">
                                    <ul className="nav nav-pills card-header-pills">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('profile')}
                                            >
                                                <i className="bi bi-person me-2"></i>
                                                Thông tin cá nhân
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('password')}
                                            >
                                                <i className="bi bi-lock me-2"></i>
                                                Đổi mật khẩu
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-body p-4">
                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <div>
                                            <div className="row mb-4">
                                                <div className="col-md-4 text-center mb-4 mb-md-0">
                                                    <div className="position-relative d-inline-block">
                                                        <div className="avatar-xl bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                                                            <i className="bi bi-person display-4 text-muted"></i>
                                                        </div>
                                                    </div>
                                                    <h5 className="mb-1">{auths.user.name}</h5>
                                                    <p className="text-muted mb-2">{auths.user.email}</p>
                                                    <span className={`badge ${auths.user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                        {auths.user.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                                    </span>
                                                </div>
                                                <div className="col-md-8">
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="row g-3">
                                                            <div className="col-12">
                                                                <label className="form-label fw-medium">
                                                                    <i className="bi bi-person me-2"></i>Họ và tên
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                                    value={data.name}
                                                                    onChange={(e) => setData('name', e.target.value)}
                                                                    placeholder="Nhập họ và tên"
                                                                    required
                                                                />
                                                                {errors.name && (
                                                                    <div className="invalid-feedback">{errors.name}</div>
                                                                )}
                                                            </div>
                                                            <div className="col-12">
                                                                <label className="form-label fw-medium">
                                                                    <i className="bi bi-envelope me-2"></i>Email
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                                    value={data.email}
                                                                    onChange={(e) => setData('email', e.target.value)}
                                                                    placeholder="Nhập địa chỉ email"
                                                                    readOnly
                                                                />
                                                                {errors.email && (
                                                                    <div className="invalid-feedback">{errors.email}</div>
                                                                )}
                                                            </div>
                                                            <div className="col-12">
                                                                <label className="form-label fw-medium">
                                                                    <i className="bi bi-telephone me-2"></i>Số điện thoại
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                                    value={data.phone}
                                                                    onChange={(e) => setData('phone', e.target.value)}
                                                                    placeholder="Nhập số điện thoại"
                                                                />
                                                                {errors.phone && (
                                                                    <div className="invalid-feedback">{errors.phone}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-end mt-4 gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-light"
                                                                onClick={() => reset()}
                                                            >
                                                                <i className="bi bi-arrow-counterclockwise me-2"></i>
                                                                Đặt lại
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary"
                                                                disabled={processing}
                                                            >
                                                                {processing ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                                        Đang lưu...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-check2 me-2"></i>
                                                                        Lưu thay đổi
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password Tab */}
                                    {activeTab === 'password' && (
                                        <div>
                                            <div className="row justify-content-center">
                                                <div className="col-md-6">
                                                    <div className="text-center mb-4">
                                                        <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                                            <i className="bi bi-shield-lock display-6 text-primary"></i>
                                                        </div>
                                                        <h4>Đổi mật khẩu</h4>
                                                        <p className="text-muted">Cập nhật mật khẩu để bảo mật tài khoản</p>
                                                    </div>

                                                    <form onSubmit={handlePasswordSubmit}>
                                                        {/* Hidden username field for accessibility */}
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={auths.user.email}
                                                            autoComplete="username"
                                                            style={{ display: 'none' }}
                                                            readOnly
                                                            tabIndex="-1"
                                                        />

                                                        <div className="mb-3">
                                                            <label className="form-label fw-medium">
                                                                <i className="bi bi-lock me-2"></i>Mật khẩu hiện tại
                                                            </label>
                                                            <input
                                                                type="password"
                                                                className={`form-control ${passwordErrors.current_password ? 'is-invalid' : ''}`}
                                                                value={passwordData.current_password}
                                                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                                placeholder="Nhập mật khẩu hiện tại"
                                                                autoComplete="current-password"
                                                                required
                                                            />
                                                            {passwordErrors.current_password && (
                                                                <div className="invalid-feedback">{passwordErrors.current_password}</div>
                                                            )}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label fw-medium">
                                                                <i className="bi bi-key me-2"></i>Mật khẩu mới
                                                            </label>
                                                            <input
                                                                type="password"
                                                                className={`form-control ${passwordErrors.password ? 'is-invalid' : ''}`}
                                                                value={passwordData.password}
                                                                onChange={(e) => setPasswordData('password', e.target.value)}
                                                                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                                                autoComplete="new-password"
                                                                required
                                                            />
                                                            {passwordErrors.password && (
                                                                <div className="invalid-feedback">{passwordErrors.password}</div>
                                                            )}
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="form-label fw-medium">
                                                                <i className="bi bi-check-circle me-2"></i>Xác nhận mật khẩu mới
                                                            </label>
                                                            <input
                                                                type="password"
                                                                className={`form-control ${passwordErrors.password_confirmation ? 'is-invalid' : ''}`}
                                                                value={passwordData.password_confirmation}
                                                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                                placeholder="Nhập lại mật khẩu mới"
                                                                autoComplete="new-password"
                                                                required
                                                            />
                                                            {passwordErrors.password_confirmation && (
                                                                <div className="invalid-feedback">{passwordErrors.password_confirmation}</div>
                                                            )}
                                                        </div>
                                                        <div className="d-grid gap-2">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary"
                                                                disabled={passwordProcessing}
                                                            >
                                                                {passwordProcessing ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                                        Đang cập nhật...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-shield-check me-2"></i>
                                                                        Cập nhật mật khẩu
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-light"
                                                                onClick={() => resetPassword()}
                                                            >
                                                                <i className="bi bi-x-circle me-2"></i>
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .avatar-xl {
                    width: 120px;
                    height: 120px;
                }
                .nav-pills .nav-link {
                    border-radius: 8px;
                    font-weight: 500;
                }
                .nav-pills .nav-link.active {
                    background-color: #007bff;
                }
                .list-group-item.active {
                    background-color: #e3f2fd;
                    color: #1976d2;
                    border-color: #e3f2fd;
                }
                .list-group-item:hover {
                    background-color: #f8f9fa;
                }
                .form-control:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
            `}</style>
        </UserLayout>
    );
};

export default Profile;