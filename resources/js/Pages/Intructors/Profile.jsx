import React, { useState, useEffect } from 'react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

const Profile = () => {
    const { user, instructor, flash } = usePage().props;
    const [openMenu, setOpenMenu] = useState('profile');
    const [activeTab, setActiveTab] = useState('profile');
    const [imagePreview, setImagePreview] = useState(null);
    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? '' : menu);
    };

    // Profile form
    const profileForm = useForm({
        name: user?.name || '',
        phone: user?.phone || '',
        bio: instructor?.bio || '',
        profession: instructor?.profession || '',
        facebook_url: instructor?.facebook_url || '',
        twitter_url: instructor?.twitter_url || '',
        linkedin_url: instructor?.linkedin_url || '',
        avatar: null,
    });
    // Add this useEffect after your state declarations
    useEffect(() => {
        // Cleanup function to revoke object URLs
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);
    // Password form
    const passwordForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post(route('instructor.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                profileForm.setData('avatar', null);
                setImagePreview(null); // Clear preview

                // Show success notification
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-success alert-dismissible fade show';
                alertElement.innerHTML = `
                <i class="bi bi-check-circle me-2"></i>
                Cập nhật hồ sơ thành công!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

                // Insert the alert at the top of the main content
                const mainContent = document.querySelector('.col-xl-9 .vstack');
                if (mainContent) {
                    mainContent.insertBefore(alertElement, mainContent.children[1]);

                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        if (alertElement.parentNode) {
                            alertElement.remove();
                        }
                    }, 5000);
                }
            },
            onError: (errors) => {
                // Show error notification
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-danger alert-dismissible fade show';
                alertElement.innerHTML = `
                <i class="bi bi-exclamation-triangle me-2"></i>
                Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

                const mainContent = document.querySelector('.col-xl-9 .vstack');
                if (mainContent) {
                    mainContent.insertBefore(alertElement, mainContent.children[1]);

                    setTimeout(() => {
                        if (alertElement.parentNode) {
                            alertElement.remove();
                        }
                    }, 5000);
                }
            }
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post(route('instructor.profile.change-password'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();

                // Show success notification
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-success alert-dismissible fade show';
                alertElement.innerHTML = `
                <i class="bi bi-check-circle me-2"></i>
                Đổi mật khẩu thành công!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

                const mainContent = document.querySelector('.col-xl-9 .vstack');
                if (mainContent) {
                    mainContent.insertBefore(alertElement, mainContent.children[1]);

                    setTimeout(() => {
                        if (alertElement.parentNode) {
                            alertElement.remove();
                        }
                    }, 5000);
                }
            },
            onError: (errors) => {
                // Show error notification
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-danger alert-dismissible fade show';
                alertElement.innerHTML = `
                <i class="bi bi-exclamation-triangle me-2"></i>
                Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

                const mainContent = document.querySelector('.col-xl-9 .vstack');
                if (mainContent) {
                    mainContent.insertBefore(alertElement, mainContent.children[1]);

                    setTimeout(() => {
                        if (alertElement.parentNode) {
                            alertElement.remove();
                        }
                    }, 5000);
                }
            }
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            profileForm.setData('avatar', file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAvatar = () => {
        if (confirm('Bạn có chắc chắn muốn xóa ảnh đại diện không?')) {
            profileForm.delete(route('instructor.profile.delete-avatar'), {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        return status === 'active' ?
            <span className="badge bg-success">Hoạt động</span> :
            <span className="badge bg-danger">Không hoạt động</span>;
    };

    return (
        <InstructorLayout>
            <Head title="Hồ sơ giảng viên" />
            <main>
                <InfoIntructor />
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <nav className="navbar navbar-light navbar-expand-xl mx-0">
                                    {/* Mobile: Offcanvas */}
                                    <div className="offcanvas offcanvas-end d-xl-none" tabIndex="-1" id="offcanvasNavbar">
                                        <div className="offcanvas-header bg-light">
                                            <h5 className="offcanvas-title">Hồ sơ của tôi</h5>
                                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
                                        </div>
                                        <div className="offcanvas-body p-3">
                                            <div className="bg-dark border rounded-3 p-3 w-100">
                                                <div className="list-group list-group-dark list-group-borderless">
                                                    <Link className="list-group-item" href="/instructor/dashboard" preserveScroll preserveState>
                                                        <i className="bi bi-grid fa-fw me-2"></i>Tổng quan
                                                    </Link>

                                                    {/* Quản lý khóa học */}
                                                    <button onClick={() => toggleMenu('courses')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                        <span><i className="bi bi-journal-text fa-fw me-2"></i>Quản lý khóa học</span>
                                                        <i className={`bi ms-auto ${openMenu === 'courses' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'courses' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/courses" className="list-group-item" preserveScroll preserveState>Khóa học của tôi</Link>
                                                        </div>
                                                    )}

                                                    {/* Học viên */}
                                                    <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                        <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'students' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/students" className="list-group-item" preserveScroll preserveState>Danh sách học viên</Link>
                                                        </div>
                                                    )}

                                                    {/* Doanh thu & Thanh toán */}
                                                    <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                        <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                        <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'revenue' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/revenue" className="list-group-item" preserveScroll preserveState>Doanh Thu Khoá Học</Link>
                                                        </div>
                                                    )}

                                                    {/* Tài khoản giảng viên */}
                                                    <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start active">
                                                        <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'profile' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/profile" className="list-group-item active" preserveScroll preserveState>Chỉnh sửa thông tin</Link>
                                                        </div>
                                                    )}

                                                    {/* Đăng xuất */}
                                                    <Link href="/logout" as="button" method="post" className="list-group-item text-danger bg-danger-soft-hover" preserveScroll preserveState>
                                                        <i className="bi bi-box-arrow-right fa-fw me-2"></i>Đăng xuất
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: static sidebar */}
                                    <div className="d-none d-xl-block w-100">
                                        <div className="bg-dark border rounded-3 p-3 w-100">
                                            <div className="list-group list-group-dark list-group-borderless">
                                                <Link className="list-group-item" href="/instructor/dashboard" preserveScroll preserveState>
                                                    <i className="bi bi-grid fa-fw me-2"></i>Tổng quan
                                                </Link>

                                                {/* Quản lý khóa học */}
                                                <button onClick={() => toggleMenu('courses')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                    <span><i className="bi bi-journal-text fa-fw me-2"></i>Quản lý khóa học</span>
                                                    <i className={`bi ms-auto ${openMenu === 'courses' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'courses' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/courses" className="list-group-item" preserveScroll preserveState>Khóa học của tôi</Link>
                                                    </div>
                                                )}

                                                {/* Học viên */}
                                                <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                    <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'students' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/students" className="list-group-item" preserveScroll preserveState>Danh sách học viên</Link>
                                                    </div>
                                                )}

                                                {/* Doanh thu & Thanh toán */}
                                                <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                    <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                    <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'revenue' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/revenue" className="list-group-item" preserveScroll preserveState>Doanh Thu Khoá Học</Link>
                                                    </div>
                                                )}

                                                {/* Tài khoản giảng viên */}
                                                <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start active">
                                                    <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'profile' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/profile" className="list-group-item active" preserveScroll preserveState>Chỉnh sửa thông tin</Link>
                                                    </div>
                                                )}

                                                {/* Đăng xuất */}
                                                <Link href="/logout" as="button" method="post" className="list-group-item text-danger bg-danger-soft-hover" preserveScroll preserveState>
                                                    <i className="bi bi-box-arrow-right fa-fw me-2"></i>Đăng xuất
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>

                            {/* Main Content */}
                            <div className="col-xl-9">
                                <div className="vstack gap-4">
                                    {/* Page Header */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h1 className="h3 mb-2 fw-bold">Hồ sơ giảng viên</h1>
                                            <p className="text-black mb-0">Quản lý thông tin cá nhân và tài khoản của bạn</p>
                                        </div>
                                    </div>

                                    {/* Flash Messages */}
                                    {flash?.success && (
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            <i className="bi bi-check-circle me-2"></i>
                                            {flash.success}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>
                                    )}

                                    {flash?.error && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            {flash.error}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>
                                    )}

                                    {/* Account Info Card */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-light border-0 py-3">
                                            <h5 className="mb-0 fw-semibold">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Thông tin tài khoản
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-semibold">Email</label>
                                                        <div className="d-flex align-items-center">
                                                            <span className="text-black">{user?.email}</span>
                                                            {user?.email_verified_at && (
                                                                <span className="badge bg-success ms-2">
                                                                    <i className="bi bi-shield-check me-1"></i>
                                                                    Đã xác thực
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-semibold">Trạng thái tài khoản</label>
                                                        <div>
                                                            {getStatusBadge(user?.status)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-semibold">Ngày đăng ký</label>
                                                        <p className="text-black mb-0">{formatDate(user?.created_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-semibold">Vai trò</label>
                                                        <p className="text-black mb-0">{user?.role?.name || 'Giảng viên'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tab Navigation */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <ul className="nav nav-tabs" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                                        onClick={() => setActiveTab('profile')}
                                                        type="button"
                                                    >
                                                        <i className="bi bi-person me-2"></i>
                                                        Thông tin cá nhân
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                                                        onClick={() => setActiveTab('password')}
                                                        type="button"
                                                    >
                                                        <i className="bi bi-shield-lock me-2"></i>
                                                        Đổi mật khẩu
                                                    </button>
                                                </li>
                                            </ul>

                                            <div className="tab-content mt-4">
                                                {/* Profile Tab */}
                                                {activeTab === 'profile' && (
                                                    <div className="tab-pane fade show active">
                                                        <form onSubmit={handleProfileSubmit}>
                                                            <div className="row">
                                                                {/* Avatar Section */}
                                                                <div className="col-12 mb-4">
                                                                    <label className="form-label fw-semibold">Ảnh đại diện</label>
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <div className="avatar avatar-xl">
                                                                            <img
                                                                                src={
                                                                                    imagePreview ||
                                                                                    (instructor?.avatar ? `/storage/${instructor.avatar}` : '/assets/images/avatar/default.jpg')
                                                                                }
                                                                                className="rounded-circle"
                                                                                alt="Avatar"
                                                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <input
                                                                                type="file"
                                                                                id="avatar"
                                                                                className="d-none"
                                                                                accept="image/*"
                                                                                onChange={handleAvatarChange}
                                                                            />
                                                                            <label htmlFor="avatar" className="btn btn-outline-primary btn-sm me-2">
                                                                                <i className="bi bi-upload me-1"></i>
                                                                                Chọn ảnh
                                                                            </label>
                                                                            {(instructor?.avatar || imagePreview) && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-outline-danger btn-sm me-2"
                                                                                    onClick={() => {
                                                                                        if (instructor?.avatar) {
                                                                                            handleDeleteAvatar();
                                                                                        } else {
                                                                                            setImagePreview(null);
                                                                                            profileForm.setData('avatar', null);
                                                                                            document.getElementById('avatar').value = '';
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <i className="bi bi-trash me-1"></i>
                                                                                    Xóa
                                                                                </button>
                                                                            )}
                                                                            {imagePreview && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-outline-secondary btn-sm"
                                                                                    onClick={() => {
                                                                                        setImagePreview(null);
                                                                                        profileForm.setData('avatar', null);
                                                                                        document.getElementById('avatar').value = '';
                                                                                    }}
                                                                                >
                                                                                    <i className="bi bi-x-circle me-1"></i>
                                                                                    Hủy xem trước
                                                                                </button>
                                                                            )}
                                                                            <div className="form-text">Chọn ảnh JPEG, PNG, GIF. Tối đa 2MB.</div>
                                                                            {imagePreview && (
                                                                                <div className="form-text text-success">
                                                                                    <i className="bi bi-eye me-1"></i>
                                                                                    Đang xem trước ảnh mới
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {profileForm.errors.avatar && (
                                                                        <div className="text-danger small mt-1">{profileForm.errors.avatar}</div>
                                                                    )}
                                                                </div>

                                                                {/* Name */}
                                                                <div className="col-md-6 mb-3">
                                                                    <label className="form-label fw-semibold">Họ và tên *</label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${profileForm.errors.name ? 'is-invalid' : ''}`}
                                                                        value={profileForm.data.name}
                                                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                                                        placeholder="Nhập họ và tên"
                                                                    />
                                                                    {profileForm.errors.name && (
                                                                        <div className="invalid-feedback">{profileForm.errors.name}</div>
                                                                    )}
                                                                </div>

                                                                {/* Phone */}
                                                                <div className="col-md-6 mb-3">
                                                                    <label className="form-label fw-semibold">Số điện thoại</label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${profileForm.errors.phone ? 'is-invalid' : ''}`}
                                                                        value={profileForm.data.phone}
                                                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                                                        placeholder="Nhập số điện thoại"
                                                                    />
                                                                    {profileForm.errors.phone && (
                                                                        <div className="invalid-feedback">{profileForm.errors.phone}</div>
                                                                    )}
                                                                </div>

                                                                {/* Profession */}
                                                                <div className="col-md-6 mb-3">
                                                                    <label className="form-label fw-semibold">Nghề nghiệp</label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${profileForm.errors.profession ? 'is-invalid' : ''}`}
                                                                        value={profileForm.data.profession}
                                                                        onChange={(e) => profileForm.setData('profession', e.target.value)}
                                                                        placeholder="VD: Giảng viên lập trình"
                                                                    />
                                                                    {profileForm.errors.profession && (
                                                                        <div className="invalid-feedback">{profileForm.errors.profession}</div>
                                                                    )}
                                                                </div>

                                                                {/* Bio */}
                                                                <div className="col-12 mb-3">
                                                                    <label className="form-label fw-semibold">Giới thiệu bản thân</label>
                                                                    <textarea
                                                                        className={`form-control ${profileForm.errors.bio ? 'is-invalid' : ''}`}
                                                                        rows="4"
                                                                        value={profileForm.data.bio}
                                                                        onChange={(e) => profileForm.setData('bio', e.target.value)}
                                                                        placeholder="Giới thiệu về bản thân, kinh nghiệm và chuyên môn của bạn..."
                                                                    ></textarea>
                                                                    {profileForm.errors.bio && (
                                                                        <div className="invalid-feedback">{profileForm.errors.bio}</div>
                                                                    )}
                                                                </div>

                                                                {/* Social Links */}
                                                                <div className="col-12 mb-3">
                                                                    <h6 className="fw-semibold mb-3">Liên kết mạng xã hội</h6>

                                                                    <div className="row">
                                                                        <div className="col-md-4 mb-3">
                                                                            <label className="form-label">
                                                                                <i className="bi bi-facebook me-2 text-primary"></i>
                                                                                Facebook
                                                                            </label>
                                                                            <input
                                                                                type="url"
                                                                                className={`form-control ${profileForm.errors.facebook_url ? 'is-invalid' : ''}`}
                                                                                value={profileForm.data.facebook_url}
                                                                                onChange={(e) => profileForm.setData('facebook_url', e.target.value)}
                                                                                placeholder="https://facebook.com/username"
                                                                            />
                                                                            {profileForm.errors.facebook_url && (
                                                                                <div className="invalid-feedback">{profileForm.errors.facebook_url}</div>
                                                                            )}
                                                                        </div>

                                                                        <div className="col-md-4 mb-3">
                                                                            <label className="form-label">
                                                                                <i className="bi bi-twitter me-2 text-info"></i>
                                                                                Twitter
                                                                            </label>
                                                                            <input
                                                                                type="url"
                                                                                className={`form-control ${profileForm.errors.twitter_url ? 'is-invalid' : ''}`}
                                                                                value={profileForm.data.twitter_url}
                                                                                onChange={(e) => profileForm.setData('twitter_url', e.target.value)}
                                                                                placeholder="https://twitter.com/username"
                                                                            />
                                                                            {profileForm.errors.twitter_url && (
                                                                                <div className="invalid-feedback">{profileForm.errors.twitter_url}</div>
                                                                            )}
                                                                        </div>

                                                                        <div className="col-md-4 mb-3">
                                                                            <label className="form-label">
                                                                                <i className="bi bi-linkedin me-2 text-primary"></i>
                                                                                LinkedIn
                                                                            </label>
                                                                            <input
                                                                                type="url"
                                                                                className={`form-control ${profileForm.errors.linkedin_url ? 'is-invalid' : ''}`}
                                                                                value={profileForm.data.linkedin_url}
                                                                                onChange={(e) => profileForm.setData('linkedin_url', e.target.value)}
                                                                                placeholder="https://linkedin.com/in/username"
                                                                            />
                                                                            {profileForm.errors.linkedin_url && (
                                                                                <div className="invalid-feedback">{profileForm.errors.linkedin_url}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Submit Button */}
                                                                <div className="col-12">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-primary"
                                                                        disabled={profileForm.processing}
                                                                    >
                                                                        {profileForm.processing ? (
                                                                            <>
                                                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                                                    <span className="visually-hidden">Loading...</span>
                                                                                </div>
                                                                                Đang cập nhật...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="bi bi-check2 me-2"></i>
                                                                                Cập nhật hồ sơ
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}

                                                {/* Password Tab */}
                                                {activeTab === 'password' && (
                                                    <div className="tab-pane fade show active">
                                                        <form onSubmit={handlePasswordSubmit}>
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <div className="mb-3">
                                                                        <label className="form-label fw-semibold">Mật khẩu hiện tại *</label>
                                                                        <input
                                                                            type="password"
                                                                            className={`form-control ${passwordForm.errors.current_password ? 'is-invalid' : ''}`}
                                                                            value={passwordForm.data.current_password}
                                                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                                            placeholder="Nhập mật khẩu hiện tại"
                                                                        />
                                                                        {passwordForm.errors.current_password && (
                                                                            <div className="invalid-feedback">{passwordForm.errors.current_password}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label className="form-label fw-semibold">Mật khẩu mới *</label>
                                                                        <input
                                                                            type="password"
                                                                            className={`form-control ${passwordForm.errors.new_password ? 'is-invalid' : ''}`}
                                                                            value={passwordForm.data.new_password}
                                                                            onChange={(e) => passwordForm.setData('new_password', e.target.value)}
                                                                            placeholder="Nhập mật khẩu mới"
                                                                        />
                                                                        {passwordForm.errors.new_password && (
                                                                            <div className="invalid-feedback">{passwordForm.errors.new_password}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label className="form-label fw-semibold">Xác nhận mật khẩu mới *</label>
                                                                        <input
                                                                            type="password"
                                                                            className="form-control"
                                                                            value={passwordForm.data.new_password_confirmation}
                                                                            onChange={(e) => passwordForm.setData('new_password_confirmation', e.target.value)}
                                                                            placeholder="Nhập lại mật khẩu mới"
                                                                        />
                                                                    </div>

                                                                    <div className="alert alert-info">
                                                                        <i className="bi bi-info-circle me-2"></i>
                                                                        Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số.
                                                                    </div>

                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-warning"
                                                                        disabled={passwordForm.processing}
                                                                    >
                                                                        {passwordForm.processing ? (
                                                                            <>
                                                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                                                    <span className="visually-hidden">Loading...</span>
                                                                                </div>
                                                                                Đang thay đổi...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="bi bi-shield-lock me-2"></i>
                                                                                Đổi mật khẩu
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </InstructorLayout>
    );
};

export default Profile;