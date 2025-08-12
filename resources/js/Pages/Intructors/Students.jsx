import React, { useState } from 'react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import Pagination from '../../Components/Pagination';
import { Link, router, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

const Students = () => {
    const { students, courses, filters, stats } = usePage().props;
    const [openMenu, setOpenMenu] = useState('students');

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'search') {
            delete newFilters.search;
        }
        router.get(route('instructor.students'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            const searchValue = e.key === 'Enter' ? e.target.value : document.getElementById('searchInput').value;
            handleFilterChange('search', searchValue);
        }
    };

    const handleSort = (field) => {
        let direction = 'asc'; // Default direction for new field

        // If clicking on the same field that's already being sorted
        if (filters.sort === field) {
            // Toggle between asc and desc
            direction = filters.direction === 'asc' ? 'desc' : 'asc';
        }

        // Call both parameters together to ensure they're sent in the same request
        const newFilters = {
            ...filters,
            sort: field,
            direction: direction
        };

        router.get(route('instructor.students'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getSortIcon = (field) => {
        if (filters.sort !== field) return 'bi-arrow-down-up';
        return filters.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-success',
            completed: 'bg-primary',
            cancelled: 'bg-danger',
            pending: 'bg-warning'
        };
        const labels = {
            active: 'Đang học',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
            pending: 'Chờ xác nhận'
        };
        return { class: badges[status] || 'bg-secondary', label: labels[status] || status };
    };

    return (
        <InstructorLayout>
            <Head title="Quản lý học viên" />
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
                                                    <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start active">
                                                        <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'students' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/students" className="list-group-item active" preserveScroll preserveState>Danh sách học viên</Link>
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
                                                    <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                        <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'profile' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/profile" className="list-group-item" preserveScroll preserveState>Chỉnh sửa thông tin</Link>

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
                                                <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start active">
                                                    <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'students' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/students" className="list-group-item active" preserveScroll preserveState>Danh sách học viên</Link>
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
                                                <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start">
                                                    <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'profile' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/profile" className="list-group-item" preserveScroll preserveState>Chỉnh sửa thông tin</Link>

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
                                {/* Header */}
                                <div className="card bg-transparent border rounded-3">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="row g-3 align-items-center justify-content-between">
                                            <div className="col">
                                                <h1 className="card-title mb-0">
                                                    <i className="bi bi-people fa-fw me-2"></i>
                                                    Quản lý học viên
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics Cards */}
                                <div className="row g-4 mb-4 mt-2">
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-warning bg-opacity-15 border border-warning border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-0">{stats?.total_students || 0}</h4>
                                                    <span className="text-body fw-light">Tổng học viên</span>
                                                </div>
                                                <div className="icon-xl fs-1 text-warning">
                                                    <i className="bi bi-people-fill"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-success bg-opacity-15 border border-success border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-0">{stats?.new_this_month || 0}</h4>
                                                    <span className="text-body fw-light">Mới tháng này</span>
                                                </div>
                                                <div className="icon-xl fs-1 text-success">
                                                    <i className="bi bi-person-plus-fill"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-primary bg-opacity-15 border border-primary border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-0">{stats?.active_enrollments || 0}</h4>
                                                    <span className="text-body fw-light">Đang học</span>
                                                </div>
                                                <div className="icon-xl fs-1 text-primary">
                                                    <i className="bi bi-book-fill"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-info bg-opacity-15 border border-info border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-0">{stats?.completed_enrollments || 0}</h4>
                                                    <span className="text-body fw-light">Hoàn thành</span>
                                                </div>
                                                <div className="icon-xl fs-1 text-info">
                                                    <i className="bi bi-trophy-fill"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="card border bg-transparent rounded-3">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="row g-3 align-items-center">
                                            {/* Search */}
                                            <div className="col-md-6 col-lg-4">
                                                <div className="position-relative">
                                                    <input
                                                        id="searchInput"
                                                        type="search"
                                                        className="form-control pe-5"
                                                        placeholder="Tìm theo tên hoặc email..."
                                                        defaultValue={filters?.search || ''}
                                                        onKeyDown={handleSearch}
                                                    />
                                                    <button
                                                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y p-0 me-2"
                                                        type="button"
                                                        onClick={handleSearch}
                                                    >
                                                        <i className="bi bi-search"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Course Filter */}
                                            <div className="col-md-3 col-lg-2">
                                                <select
                                                    className="form-select"
                                                    value={filters?.course_id || 'all'}
                                                    onChange={(e) => handleFilterChange('course_id', e.target.value)}
                                                >
                                                    <option value="all">Tất cả khóa học</option>
                                                    {courses?.map(course => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Status Filter */}
                                            <div className="col-md-3 col-lg-2">
                                                <select
                                                    className="form-select"
                                                    value={filters?.status || 'all'}
                                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                                >
                                                    <option value="all">Tất cả trạng thái</option>
                                                    <option value="active">Đang học</option>
                                                    <option value="completed">Hoàn thành</option>
                                                </select>
                                            </div>

                                            {/* Clear Filters */}
                                            <div className="col-md-12 col-lg-4 text-end">
                                                <button
                                                    className="btn btn-light"
                                                    onClick={() => router.get(route('instructor.students'), {}, {
                                                        preserveScroll: true,
                                                        preserveState: true
                                                    })}
                                                >
                                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                                    Đặt lại bộ lọc
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Students Table */}
                                    <div className="card-body">
                                        {students?.data?.length > 0 ? (
                                            <>
                                                <div className="table-responsive border-0">
                                                    <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" className="border-0 rounded-start">
                                                                    <button
                                                                        className="btn btn-link text-decoration-none p-0 text-reset"
                                                                        onClick={() => handleSort('name')}
                                                                    >
                                                                        Học viên
                                                                        <i className={`bi ${getSortIcon('name')} ms-1`}></i>
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="border-0">
                                                                    <button
                                                                        className="btn btn-link text-decoration-none p-0 text-reset"
                                                                        onClick={() => handleSort('email')}
                                                                    >
                                                                        Email
                                                                        <i className={`bi ${getSortIcon('email')} ms-1`}></i>
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="border-0">
                                                                    <button
                                                                        className="btn btn-link text-decoration-none p-0 text-reset"
                                                                        onClick={() => handleSort('course')}
                                                                    >
                                                                        Khóa học
                                                                        <i className={`bi ${getSortIcon('course')} ms-1`}></i>
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="border-0">Trạng thái</th>
                                                                <th scope="col" className="border-0">
                                                                    <button
                                                                        className="btn btn-link text-decoration-none p-0 text-reset"
                                                                        onClick={() => handleSort('enrolled_at')}
                                                                    >
                                                                        Ngày đăng ký
                                                                        <i className={`bi ${getSortIcon('enrolled_at')} ms-1`}></i>
                                                                    </button>
                                                                </th>
                                                                <th scope="col" className="border-0 rounded-end">Thao tác</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {students.data.map((student) => {
                                                                const statusBadge = getStatusBadge(student.enrollment_status || 'active');
                                                                return (
                                                                    <tr key={`${student.id}-${student.course_id}`}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center position-relative">
                                                                                <div className="avatar avatar-md">
                                                                                    <img className="avatar-img rounded-circle" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png" alt="avatar" />
                                                                                </div>
                                                                                <div className="mb-0 ms-2">
                                                                                    <h6 className="mb-0">
                                                                                        <a href="#" className="stretched-link">{student.name}</a>
                                                                                    </h6>
                                                                                    {student.role_id === 3 && (
                                                                                        <small className="text-black d-block">
                                                                                            <i className="bi bi-person-badge fa-fw me-1"></i>
                                                                                            Học viên
                                                                                        </small>
                                                                                    )}

                                                                                    <span className="text-body small">
                                                                                        <i className="bi bi-calendar fa-fw me-1 mt-1"></i>
                                                                                        Tham gia: {new Date(student.created_at).toLocaleDateString('vi-VN')}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center text-sm-start">
                                                                            <span className="text-body">{student.email}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-primary bg-opacity-10 text-primary">{student.course_title}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className={`badge ${statusBadge.class}`}>
                                                                                {statusBadge.label}
                                                                            </span>
                                                                        </td>
                                                                        <td>{new Date(student.enrolled_at).toLocaleDateString('vi-VN')}</td>
                                                                        <td>
                                                                            <div className="dropdown dropstart">
                                                                                <a href="#" className="btn btn-light btn-round btn-sm" role="button" id={`dropdownShare${student.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                                                    <i className="bi bi-three-dots fa-fw"></i>
                                                                                </a>
                                                                                <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby={`dropdownShare${student.id}`}>
                                                                                    <li>
                                                                                        <a className="dropdown-item" href="#">
                                                                                            <i className="bi bi-envelope fa-fw me-2"></i>Gửi tin nhắn
                                                                                        </a>
                                                                                    </li>
                                                                                    <li>
                                                                                        <a className="dropdown-item" href="#">
                                                                                            <i className="bi bi-eye fa-fw me-2"></i>Xem chi tiết
                                                                                        </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Pagination */}
                                                <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
                                                    <p className="mb-0 text-center text-sm-start">
                                                        Hiển thị {students.from} đến {students.to} trong tổng số {students.total} học viên
                                                    </p>
                                                    <Pagination links={students.links} className="justify-content-center" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="bi bi-people display-1 text-muted"></i>
                                                <h4 className="mt-3">Chưa có học viên nào</h4>
                                                <p className="text-muted">
                                                    {Object.values(filters || {}).some(v => v && v !== 'all')
                                                        ? 'Không tìm thấy học viên nào phù hợp với bộ lọc.'
                                                        : 'Chưa có học viên nào đăng ký khóa học của bạn.'}
                                                </p>
                                                {Object.values(filters || {}).some(v => v && v !== 'all') && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => router.get(route('instructor.students'), {}, {
                                                            preserveScroll: true,
                                                            preserveState: true
                                                        })}
                                                    >
                                                        Xóa bộ lọc
                                                    </button>
                                                )}
                                            </div>
                                        )}
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

export default Students;