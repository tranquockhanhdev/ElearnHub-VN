import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const InstructorLayout = ({ children }) => {
    const { auth, flash_success, flash_error } = usePage().props;

    // Get instructor data from auth
    const instructor = auth?.instructor;
    const user = auth?.user;

    return (
        <>
            {/* Header START */}
            <header className="navbar-light navbar-sticky header-static">
                {/* Logo Nav START */}
                <nav className="navbar navbar-expand-xl">
                    <div className="container">
                        {/* Logo START */}
                        <div className="navbar-brand">
                            <img className="light-mode-item navbar-brand-item" src="/assets/images/logo.svg" alt="logo" />
                            <img className="dark-mode-item navbar-brand-item" src="/assets/images/logo-light.svg" alt="logo" />
                        </div>
                        {/* Logo END */}

                        {/* Responsive navbar toggler */}
                        <button
                            className="navbar-toggler ms-auto"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                            aria-controls="navbarCollapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-animation">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>

                        {/* Nav Main menu START */}
                        <ul className="navbar-nav navbar-nav-scroll mx-auto">
                            {/* Hiển thị cho người dùng chưa đăng nhập */}
                            {!auth.user && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/">Trang Chủ</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/about">Giới Thiệu</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/courses">Khóa Học</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/login">Đăng Nhập</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/register">Đăng Ký</Link>
                                    </li>
                                </>
                            )}

                            {/* Hiển thị cho học viên (role 3) */}
                            {auth.user?.role === 3 && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/">Trang Chủ</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/about">Giới Thiệu</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/courses">Khóa Học</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/student/courselist">Khóa Học Của Tôi</Link>
                                    </li>
                                </>
                            )}

                            {/* Ẩn tất cả cho giảng viên (role 2) */}
                            {auth.user?.role === 2 && null}
                        </ul>
                        {/* Nav Main menu END */}

                        {/* Profile START */}
                        {auth?.user && (
                            <div className="dropdown ms-1 ms-lg-0">
                                <a
                                    className="avatar avatar-sm p-0"
                                    href="#"
                                    id="profileDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img
                                        className="avatar-img rounded-circle"
                                        src={
                                            instructor?.avatar
                                                ? `/storage/${instructor.avatar}`
                                                : '/assets/images/avatar/default.jpg'
                                        }
                                        alt="User Avatar"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </a>
                                <ul
                                    className="dropdown-menu dropdown-menu-end shadow-lg rounded-xl border-0 p-4 dropdown-animation"
                                    aria-labelledby="profileDropdown"
                                    style={{ minWidth: '280px' }}
                                >
                                    {/* Header */}
                                    <li className="pb-3 mb-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar me-3">
                                                <img
                                                    className="avatar-img rounded-circle shadow-sm"
                                                    src={
                                                        instructor?.avatar
                                                            ? `/storage/${instructor.avatar}`
                                                            : '/assets/images/avatar/default.jpg'
                                                    }
                                                    alt="User"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 fw-semibold text-dark">
                                                    {auth.user.name}
                                                </h6>
                                                <p className="mb-0 small text-muted text-truncate" style={{ maxWidth: '180px' }}>
                                                    {auth.user.email}
                                                </p>
                                                <span className="badge bg-primary-soft text-primary mt-1 small">
                                                    {{
                                                        1: 'Admin',
                                                        2: 'Giảng viên',
                                                        3: 'Học viên'
                                                    }[auth.user.role] || 'Không rõ'}
                                                </span>
                                            </div>
                                        </div>
                                    </li>

                                    {/* Menu Items */}
                                    <li className="mb-2">
                                        <Link
                                            className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none"
                                            href={auth.user.role === 2 ? "/instructor/profile" : "/student/profile"}
                                        >
                                            <i className="bi bi-person-circle me-3 text-primary" style={{ fontSize: '18px' }}></i>
                                            <span className="fw-medium">Chỉnh sửa hồ sơ</span>
                                        </Link>
                                    </li>

                                    {/* Hiển thị "Khóa học của tôi" cho học viên */}
                                    {auth.user.role === 3 && (
                                        <li className="mb-2">
                                            <Link
                                                className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none"
                                                href="/student/courselist"
                                            >
                                                <i className="bi bi-book me-3 text-success" style={{ fontSize: '18px' }}></i>
                                                <span className="fw-medium">Khóa học của tôi</span>
                                            </Link>
                                        </li>
                                    )}

                                    {/* Hiển thị "Khóa học của tôi" cho giảng viên */}
                                    {auth.user.role === 2 && (
                                        <li className="mb-2">
                                            <Link
                                                className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none"
                                                href="/instructor/courses"
                                            >
                                                <i className="bi bi-journal-text me-3 text-success" style={{ fontSize: '18px' }}></i>
                                                <span className="fw-medium">Khóa học của tôi</span>
                                            </Link>
                                        </li>
                                    )}

                                    {/* Hiển thị "Học viên" cho giảng viên */}
                                    {auth.user.role === 2 && (
                                        <li className="mb-2">
                                            <Link
                                                className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none"
                                                href="/instructor/students"
                                            >
                                                <i className="bi bi-people me-3 text-info" style={{ fontSize: '18px' }}></i>
                                                <span className="fw-medium">Học viên của tôi</span>
                                            </Link>
                                        </li>
                                    )}

                                    {/* Hiển thị "Doanh thu" cho giảng viên */}
                                    {auth.user.role === 2 && (
                                        <li className="mb-2">
                                            <Link
                                                className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none"
                                                href="/instructor/revenue"
                                            >
                                                <i className="bi bi-cash-stack me-3 text-warning" style={{ fontSize: '18px' }}></i>
                                                <span className="fw-medium">Doanh thu</span>
                                            </Link>
                                        </li>
                                    )}

                                    {/* Hiển thị dashboard cho từng role */}
                                    {auth.user.role === 3 && (
                                        <li className="mb-2">
                                            <Link
                                                className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none"
                                                href="/student/dashboard"
                                            >
                                                <i className="bi bi-speedometer2 me-3 text-info" style={{ fontSize: '18px' }}></i>
                                                <span className="fw-medium">Bảng điều khiển</span>
                                            </Link>
                                        </li>
                                    )}

                                    {auth.user.role === 2 && (
                                        <li className="mb-2">
                                            <Link
                                                className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none"
                                                href="/instructor/dashboard"
                                            >
                                                <i className="bi bi-speedometer2 me-3 text-info" style={{ fontSize: '18px' }}></i>
                                                <span className="fw-medium">Bảng điều khiển</span>
                                            </Link>
                                        </li>
                                    )}

                                    {/* Divider */}
                                    <li><hr className="dropdown-divider my-3" /></li>

                                    {/* Logout */}
                                    <li>
                                        <Link
                                            className="dropdown-item rounded-lg py-2 px-3 d-flex align-items-center text-decoration-none text-danger"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.post(route('logout'));
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-right fa-fw me-2"></i> Đăng xuất
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Profile END */}
                    </div>
                </nav>
                {/* Logo Nav END */}
            </header>
            {/* Header END */}

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer START */}
            <footer className="bg-dark pt-5 footer">
                <div className="container">
                    {/* Row START */}
                    <div className="row g-4">
                        {/* Widget 1 START */}
                        <div className="col-lg-3">
                            {/* Logo */}
                            <Link className="me-0" href="/">
                                <img className="h-40px" src="/assets/images/logo-light.svg" alt="logo" />
                            </Link>
                            <p className="my-3 text-muted">
                                K Edu – Không chỉ là nơi học IT, mà còn là nơi bắt đầu hành trình phát triển nghề nghiệp của bạn.
                            </p>
                            {/* Social media icons */}
                            <ul className="list-inline mb-0 mt-3">
                                <li className="list-inline-item">
                                    <a className="btn btn-white btn-sm shadow px-2 text-facebook" href="#">
                                        <i className="fab fa-fw fa-facebook-f"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="btn btn-white btn-sm shadow px-2 text-instagram" href="#">
                                        <i className="fab fa-fw fa-instagram"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="btn btn-white btn-sm shadow px-2 text-twitter" href="#">
                                        <i className="fab fa-fw fa-twitter"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="btn btn-white btn-sm shadow px-2 text-linkedin" href="#">
                                        <i className="fab fa-fw fa-linkedin-in"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* Widget 1 END */}

                        {/* Widget 2 START */}
                        <div className="col-lg-6">
                            <div className="row g-4">
                                {/* Link block 1 */}
                                <div className="col-6 col-md-4">
                                    <h5 className="mb-2 mb-md-4 text-white">Công Ty</h5>
                                    <ul className="nav flex-column text-primary-hover">
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/about">Giới Thiệu</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/contact">Liên Hệ Với Chúng Tôi</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/blog">Bài Viết</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/library">Thư Viện</Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Link block 2 */}
                                <div className="col-6 col-md-4">
                                    <h5 className="mb-2 mb-md-4 text-white">Cộng Đồng</h5>
                                    <ul className="nav flex-column text-primary-hover">
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/resources">Tài Liệu</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/faq">FAQ</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/forum">Diễn Đàn</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/sitemap">Sitemap</Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Link block 3 */}
                                <div className="col-6 col-md-4">
                                    <h5 className="mb-2 mb-md-4 text-white">Giáo Viên</h5>
                                    <ul className="nav flex-column text-primary-hover">
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/become-instructor">Trở Thành Giáo Viên</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/teaching-guide">Cách Hướng Dẫn</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/terms">Điều Khoản & Điều Kiện</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* Widget 2 END */}

                        {/* Widget 3 START */}
                        <div className="col-lg-3">
                            <h5 className="mb-2 mb-md-4 text-white">Liên Hệ</h5>
                            {/* Contact info */}
                            <p className="mb-2 text-muted">
                                SĐT: <span className="h6 fw-light text-white ms-2">+1234 568 963</span>
                                <span className="d-block small">(9:AM đến 8:PM IST)</span>
                            </p>
                            <p className="mb-0 text-muted">
                                Email: <span className="h6 fw-light text-white ms-2">example@gmail.com</span>
                            </p>

                            {/* App store buttons */}
                            <div className="row g-2 mt-2">
                                <div className="col-6 col-sm-4 col-md-3 col-lg-6">
                                    <a href="#">
                                        <img src="/assets/images/client/google-play.svg" alt="Google Play" />
                                    </a>
                                </div>
                                <div className="col-6 col-sm-4 col-md-3 col-lg-6">
                                    <a href="#">
                                        <img src="/assets/images/client/app-store.svg" alt="App Store" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Widget 3 END */}
                    </div>
                    {/* Row END */}

                    {/* Divider */}
                    <hr className="mt-4 mb-0" />

                    {/* Bottom footer */}
                    <div className="py-3">
                        <div className="container px-0">
                            <div className="d-md-flex justify-content-between align-items-center py-3 text-center text-md-left">
                                {/* Copyright text */}
                                <div className="text-muted text-primary-hover">
                                    Copyrights <Link href="#" className="text-reset">©2025 K Edu</Link>. All rights reserved.
                                </div>
                                {/* Footer links */}
                                <div className="mt-3 mt-md-0">
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item text-primary-hover">
                                            <Link className="nav-link" href="/terms">Terms of Use</Link>
                                        </li>
                                        <li className="list-inline-item text-primary-hover">
                                            <Link className="nav-link pe-0" href="/privacy">Privacy Policy</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Footer END */}
        </>
    );
};

export default InstructorLayout;