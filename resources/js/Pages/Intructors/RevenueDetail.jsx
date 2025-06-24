import React, { useState } from 'react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import Pagination from '../../Components/Pagination';
import { Link, router, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

const RevenueDetail = () => {
    const { course, payments, filters, stats } = usePage().props;
    const [openMenu, setOpenMenu] = useState('revenue');
    const [searchValue, setSearchValue] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? '' : menu);
    };

    // Function to submit filters to server
    const submitFilters = (newFilters) => {
        // Clean up empty values
        const cleanFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
        );

        router.get(route('instructor.revenue.details', course.id), cleanFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsSearching(true),
            onFinish: () => setIsSearching(false),
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    };

    const handleSearchButtonClick = () => {
        performSearch();
    };

    const performSearch = () => {
        const searchTerm = searchValue.trim();
        const newFilters = {
            ...filters,
            search: searchTerm || undefined,
            sort: filters?.sort || 'created_at',
            direction: filters?.direction || 'desc'
        };

        submitFilters(newFilters);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = {
            ...filters,
            [key]: value
        };

        if (key === 'sort' || key === 'direction') {
            if (filters?.search) {
                newFilters.search = filters.search;
            }
        }

        submitFilters(newFilters);
    };

    const handleClearFilters = () => {
        setSearchValue('');
        submitFilters({});
    };

    const handleClearSearch = () => {
        setSearchValue('');
        const newFilters = { ...filters };
        delete newFilters.search;
        submitFilters(newFilters);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            completed: { class: 'bg-success', text: 'Hoàn thành' },
            pending: { class: 'bg-warning', text: 'Đang chờ' },
            failed: { class: 'bg-danger', text: 'Thất bại' },
            cancelled: { class: 'bg-secondary', text: 'Đã hủy' }
        };

        const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status };
        return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    return (
        <InstructorLayout>
            <Head title="Quản lý doanh thu" />
            <main>
                <InfoIntructor />
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            {/* Sidebar - giữ nguyên */}
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
                                                    <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start active">
                                                        <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                        <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'revenue' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/revenue" className="list-group-item active" preserveScroll preserveState>Doanh Thu Khoá Học</Link>
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
                                                <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-content-between align-items-center w-100 text-start active">
                                                    <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                    <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'revenue' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/revenue" className="list-group-item active" preserveScroll preserveState>Doanh Thu Khoá Học</Link>
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
                                <div className="vstack gap-4">
                                    {/* Breadcrumb & Back Button */}
                                    <div className="d-flex align-items-center gap-3">
                                        <Link
                                            href="/instructor/revenue"
                                            className="btn btn-outline-secondary btn-sm"
                                            preserveScroll
                                            preserveState
                                        >
                                            <i className="bi bi-arrow-left me-1"></i>
                                            Quay lại
                                        </Link>
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb mb-0">
                                                <li className="breadcrumb-item">
                                                    <Link href="/instructor/revenue" className="text-decoration-none" preserveScroll preserveState>
                                                        Doanh thu
                                                    </Link>
                                                </li>
                                                <li className="breadcrumb-item active" aria-current="page">Chi tiết khóa học</li>
                                            </ol>
                                        </nav>
                                    </div>

                                    {/* Course Header */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col-md-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-xl me-3">
                                                            <img
                                                                src={course?.img_url || '/assets/images/courses/4by3/default.jpg'}
                                                                className="rounded"
                                                                alt={course?.title}
                                                                style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h1 className="h4 mb-1 fw-bold">{course?.title}</h1>
                                                            <p className="text-black mb-1">Giá khóa học: {formatCurrency(course?.price)}</p>
                                                            <small className="text-black">
                                                                Ngày tạo: {formatDate(course?.created_at)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 text-md-end">
                                                    <Link
                                                        href={route('courses.show', course?.slug)}
                                                        className="btn btn-outline-primary btn-sm"
                                                        target="_blank"
                                                    >
                                                        <i className="bi bi-eye me-1"></i>
                                                        Xem khóa học
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Statistics Cards */}
                                    <div className="row g-3">
                                        <div className="col-sm-6 col-xl-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-success bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-currency-dollar text-success fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">Tổng doanh thu</h6>
                                                    <h4 className="mb-0 text-success fw-bold">{formatCurrency(stats?.total_revenue || 0)}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-xl-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-people text-primary fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">Tổng học viên</h6>
                                                    <h4 className="mb-0 text-primary fw-bold">{stats?.total_students || 0}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-xl-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-info bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-calculator text-info fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">TB trên học viên</h6>
                                                    <h4 className="mb-0 text-info fw-bold">{formatCurrency(stats?.avg_revenue_per_student || 0)}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-xl-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-warning bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-calendar-month text-warning fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">Doanh thu tháng này</h6>
                                                    <h4 className="mb-0 text-warning fw-bold">{formatCurrency(stats?.revenue_this_month || 0)}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filters & Search */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="row g-3 align-items-center">
                                                {/* Search */}
                                                <div className="col-md-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light border-0">
                                                            <i className="bi bi-search text-black"></i>
                                                        </span>
                                                        <input
                                                            type="search"
                                                            className="form-control border-0 bg-light"
                                                            placeholder="Tìm kiếm học viên..."
                                                            value={searchValue}
                                                            onChange={(e) => setSearchValue(e.target.value)}
                                                            onKeyDown={handleSearch}
                                                            disabled={isSearching}
                                                        />
                                                        <button
                                                            className="btn btn-primary"
                                                            type="button"
                                                            onClick={handleSearchButtonClick}
                                                            disabled={isSearching}
                                                        >
                                                            {isSearching ? (
                                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            ) : (
                                                                <i className="bi bi-search me-1"></i>
                                                            )}
                                                            Tìm kiếm
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Status Filter */}
                                                <div className="col-md-2">
                                                    <select
                                                        className="form-select border-0 bg-light"
                                                        value={filters?.status || 'all'}
                                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                                        disabled={isSearching}
                                                    >
                                                        <option value="all">Tất cả trạng thái</option>
                                                        <option value="completed">Hoàn thành</option>
                                                        <option value="pending">Đang chờ</option>
                                                        <option value="failed">Thất bại</option>
                                                        <option value="cancelled">Đã hủy</option>
                                                    </select>
                                                </div>

                                                {/* Sort Field */}
                                                <div className="col-md-2">
                                                    <select
                                                        className="form-select border-0 bg-light"
                                                        value={filters?.sort || 'created_at'}
                                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                                        disabled={isSearching}
                                                    >
                                                        <option value="created_at">Ngày thanh toán</option>
                                                        <option value="student_name">Tên học viên</option>
                                                        <option value="amount">Số tiền</option>
                                                        <option value="status">Trạng thái</option>
                                                    </select>
                                                </div>

                                                {/* Sort Direction */}
                                                <div className="col-md-2">
                                                    <select
                                                        className="form-select border-0 bg-light"
                                                        value={filters?.direction || 'desc'}
                                                        onChange={(e) => handleFilterChange('direction', e.target.value)}
                                                        disabled={isSearching}
                                                    >
                                                        <option value="asc">Tăng dần</option>
                                                        <option value="desc">Giảm dần</option>
                                                    </select>
                                                </div>

                                                {/* Clear Button */}
                                                <div className="col-md-2">
                                                    <button
                                                        className="btn btn-outline-secondary w-100"
                                                        onClick={handleClearFilters}
                                                        title="Đặt lại bộ lọc"
                                                        disabled={isSearching}
                                                    >
                                                        {isSearching ? (
                                                            <div className="spinner-border spinner-border-sm" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        ) : (
                                                            <i className="bi bi-arrow-clockwise"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters Display */}
                                    {(filters?.search || (filters?.status && filters.status !== 'all') || (filters?.sort && filters.sort !== 'created_at') || (filters?.direction && filters.direction !== 'desc')) && (
                                        <div className="d-flex flex-wrap gap-2">
                                            {filters?.search && (
                                                <span className="badge bg-primary">
                                                    Tìm kiếm: "{filters.search}"
                                                    <button
                                                        className="btn-close btn-close-white ms-2"
                                                        onClick={handleClearSearch}
                                                    ></button>
                                                </span>
                                            )}
                                            {filters?.status && filters.status !== 'all' && (
                                                <span className="badge bg-secondary">
                                                    Trạng thái: {
                                                        filters.status === 'completed' ? 'Hoàn thành' :
                                                            filters.status === 'pending' ? 'Đang chờ' :
                                                                filters.status === 'failed' ? 'Thất bại' :
                                                                    filters.status === 'cancelled' ? 'Đã hủy' : filters.status
                                                    }
                                                </span>
                                            )}
                                            {filters?.sort && filters.sort !== 'created_at' && (
                                                <span className="badge bg-info">
                                                    Sắp xếp: {
                                                        filters.sort === 'student_name' ? 'Tên học viên' :
                                                            filters.sort === 'amount' ? 'Số tiền' :
                                                                filters.sort === 'status' ? 'Trạng thái' : filters.sort
                                                    }
                                                </span>
                                            )}
                                            {filters?.direction && filters.direction === 'asc' && (
                                                <span className="badge bg-warning">Tăng dần</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Payments List */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white border-0 py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0 fw-semibold">Danh sách thanh toán</h5>
                                                <span className="badge bg-light text-dark">{payments?.data?.length || 0} giao dịch</span>
                                            </div>
                                        </div>
                                        <div className="card-body p-0 position-relative">
                                            {/* Loading overlay */}
                                            {isSearching && (
                                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            )}

                                            {payments?.data?.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-hover mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th className="border-0 ps-4">Học viên</th>
                                                                <th className="border-0">Số tiền</th>
                                                                <th className="border-0">Phương thức</th>
                                                                <th className="border-0">Trạng thái</th>
                                                                <th className="border-0">Ngày thanh toán</th>
                                                                <th className="border-0 pe-4">Mã giao dịch</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {payments.data.map((payment) => (
                                                                <tr key={payment.id} className="align-middle">
                                                                    <td className="ps-4">
                                                                        <div>
                                                                            <h6 className="mb-1 fw-semibold">{payment.student_name}</h6>
                                                                            <small className="text-black">{payment.student_email}</small>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <span className="fw-bold text-success">{formatCurrency(payment.amount)}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span className="badge bg-light text-dark">
                                                                            {payment.payment_method === 'vnpay' ? 'VNPay' :
                                                                                payment.payment_method === 'momo' ? 'MoMo' :
                                                                                    payment.payment_method === 'bank_transfer' ? 'Chuyển khoản' :
                                                                                        payment.payment_method || 'Khác'}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        {getStatusBadge(payment.status)}
                                                                    </td>
                                                                    <td>
                                                                        <span className="text-black">{formatDate(payment.created_at)}</span>
                                                                    </td>
                                                                    <td className="pe-4">
                                                                        <code className="text-black small">{payment.transaction_id || payment.id}</code>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-5">
                                                    <div className="icon-lg bg-light rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-receipt text-black fs-1"></i>
                                                    </div>
                                                    <h5 className="text-black">Không có giao dịch nào</h5>
                                                    <p className="text-black mb-0">
                                                        {filters?.search ?
                                                            `Không tìm thấy giao dịch nào với từ khóa "${filters.search}"` :
                                                            'Khóa học này chưa có giao dịch thanh toán nào'
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Pagination */}
                                            {payments?.links && payments.data.length > 0 && (
                                                <div className="border-top p-4">
                                                    <Pagination
                                                        links={payments.links}
                                                        from={payments.from}
                                                        to={payments.to}
                                                        total={payments.total}
                                                        currentPage={payments.current_page}
                                                        lastPage={payments.last_page}
                                                    />
                                                </div>
                                            )}
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

export default RevenueDetail;