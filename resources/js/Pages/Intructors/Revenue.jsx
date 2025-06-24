import React, { useState } from 'react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import Pagination from '../../Components/Pagination';
import { Link, router, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

const Revenue = () => {
    const { courses, filters, stats } = usePage().props;
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

        router.get(route('instructor.revenue.index'), cleanFilters, {
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
            search: searchTerm || undefined, // undefined will be filtered out
            sort: filters?.sort || 'created_at',
            direction: filters?.direction || 'desc'
        };

        submitFilters(newFilters);
    };

    const handleSortChange = (field) => {
        let direction = 'desc';

        if (filters?.sort === field) {
            direction = filters.direction === 'asc' ? 'desc' : 'asc';
        }

        const newFilters = {
            ...filters,
            sort: field,
            direction: direction
        };

        submitFilters(newFilters);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = {
            ...filters,
            [key]: value
        };

        // If changing sort/direction, keep existing search
        if (key === 'sort' || key === 'direction') {
            if (filters?.search) {
                newFilters.search = filters.search;
            }
        }

        submitFilters(newFilters);
    };

    const handleClearFilters = () => {
        setSearchValue('');
        submitFilters({}); // Submit empty filters
    };

    const handleClearSearch = () => {
        setSearchValue('');
        const newFilters = { ...filters };
        delete newFilters.search;
        submitFilters(newFilters);
    };

    const getSortIcon = (field) => {
        if (filters?.sort !== field) return 'bi-arrow-down-up';
        return filters.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
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
                                    {/* Page Header */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h1 className="h3 mb-2 fw-bold">Doanh thu & Thanh toán</h1>
                                            <p className="text-black mb-0">Quản lý doanh thu từ các khóa học của bạn</p>
                                        </div>
                                    </div>

                                    {/* Statistics Cards */}
                                    <div className="row g-3">
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-orange bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-journal-text text-orange fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">Tổng khóa học</h6>
                                                    <h3 className="mb-0 text-orange fw-bold">{stats?.total_courses || 0}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-success bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-currency-dollar text-success fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">Tổng doanh thu</h6>
                                                    <h3 className="mb-0 text-success fw-bold fs-6">{formatCurrency(stats?.total_revenue || 0)}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-people text-primary fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">Tổng học viên</h6>
                                                    <h3 className="mb-0 text-primary fw-bold">{stats?.total_students || 0}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-lg-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body text-center p-4">
                                                    <div className="icon-lg bg-info bg-opacity-10 rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-graph-up text-info fs-4"></i>
                                                    </div>
                                                    <h6 className="text-black mb-1">Doanh thu tháng này</h6>
                                                    <h3 className="mb-0 text-info fw-bold fs-6">{formatCurrency(stats?.revenue_this_month || 0)}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filters & Search */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="row g-3 align-items-center">
                                                {/* Search */}
                                                <div className="col-md-5">
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light border-0">
                                                            <i className="bi bi-search text-black"></i>
                                                        </span>
                                                        <input
                                                            type="search"
                                                            className="form-control border-0 bg-light"
                                                            placeholder="Tìm kiếm khóa học..."
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

                                                {/* Sort Field */}
                                                <div className="col-md-3">
                                                    <select
                                                        className="form-select border-0 bg-light"
                                                        value={filters?.sort || 'created_at'}
                                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                                        disabled={isSearching}
                                                    >
                                                        <option value="created_at">Ngày tạo</option>
                                                        <option value="title">Tên khóa học</option>
                                                        <option value="total_revenue">Doanh thu</option>
                                                        <option value="total_students">Học viên</option>
                                                    </select>
                                                </div>

                                                {/* Sort Direction */}
                                                <div className="col-md-3">
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
                                                <div className="col-md-1">
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
                                    {(filters?.search || (filters?.sort && filters.sort !== 'created_at') || (filters?.direction && filters.direction !== 'desc')) && (
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
                                            {filters?.sort && filters.sort !== 'created_at' && (
                                                <span className="badge bg-secondary">
                                                    Sắp xếp: {
                                                        filters.sort === 'title' ? 'Tên khóa học' :
                                                            filters.sort === 'total_revenue' ? 'Doanh thu' :
                                                                filters.sort === 'total_students' ? 'Học viên' : filters.sort
                                                    }
                                                </span>
                                            )}
                                            {filters?.direction && filters.direction === 'asc' && (
                                                <span className="badge bg-info">Tăng dần</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Courses List */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white border-0 py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0 fw-semibold">Danh sách khóa học</h5>
                                                <span className="badge bg-light text-dark">{courses?.data?.length || 0} khóa học</span>
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

                                            {courses?.data?.length > 0 ? (
                                                <div className="row g-0">
                                                    {courses.data.map((course, index) => (
                                                        <div key={course.id} className={`col-12 ${index !== courses.data.length - 1 ? 'border-bottom' : ''}`}>
                                                            <div className="p-4 hover-bg-light">
                                                                <div className="row align-items-center">
                                                                    {/* Course Info */}
                                                                    <div className="col-md-4">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="avatar avatar-lg me-3">
                                                                                <img
                                                                                    src={course.img_url || '/assets/images/courses/4by3/default.jpg'}
                                                                                    className="rounded"
                                                                                    alt={course.title}
                                                                                    style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <h6 className="mb-1 fw-semibold">
                                                                                    <Link
                                                                                        href={route('instructor.revenue.details', course.id)}
                                                                                        className="text-decoration-none text-dark hover-text-primary"
                                                                                        preserveScroll
                                                                                        preserveState
                                                                                    >
                                                                                        {course.title}
                                                                                    </Link>
                                                                                </h6>
                                                                                <small className="text-black">Giá: {formatCurrency(course.price)}</small>
                                                                                <br />
                                                                                <small className="text-black">{new Date(course.created_at).toLocaleDateString('vi-VN')}</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Revenue Stats */}
                                                                    <div className="col-md-6">
                                                                        <div className="row text-center">
                                                                            <div className="col-3">
                                                                                <div className="mb-2">
                                                                                    <h6 className="text-success mb-0 fw-bold">{formatCurrency(course.total_revenue)}</h6>
                                                                                    <small className="text-black">Tổng doanh thu</small>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3">
                                                                                <div className="mb-2">
                                                                                    <h6 className="text-primary mb-0 fw-bold">{course.total_students}</h6>
                                                                                    <small className="text-black">Học viên</small>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3">
                                                                                <div className="mb-2">
                                                                                    <h6 className="text-info mb-0 fw-bold">{formatCurrency(course.avg_revenue_per_month)}</h6>
                                                                                    <small className="text-black">TB/tháng</small>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3">
                                                                                <div className="mb-2">
                                                                                    <h6 className="text-warning mb-0 fw-bold">{parseFloat(course.avg_students_per_month).toFixed(1)}</h6>
                                                                                    <small className="text-black">HV/tháng</small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Action */}
                                                                    <div className="col-md-2 text-end">
                                                                        <Link
                                                                            href={route('instructor.revenue.details', course.id)}
                                                                            className="btn btn-sm btn-outline-primary"
                                                                            preserveScroll
                                                                            preserveState
                                                                        >
                                                                            <i className="bi bi-eye me-1"></i>Chi tiết
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-5">
                                                    <div className="icon-lg bg-light rounded-circle mx-auto mb-3">
                                                        <i className="bi bi-journal-x text-black fs-1"></i>
                                                    </div>
                                                    <h5 className="text-black">Không có khóa học nào</h5>
                                                    <p className="text-black mb-0">
                                                        {filters?.search ?
                                                            `Không tìm thấy khóa học nào với từ khóa "${filters.search}"` :
                                                            'Bạn chưa có khóa học nào hoặc không có dữ liệu doanh thu'
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Pagination */}
                                            {courses?.links && courses.data.length > 0 && (
                                                <div className="border-top p-4">
                                                    <Pagination
                                                        links={courses.links}
                                                        from={courses.from}
                                                        to={courses.to}
                                                        total={courses.total}
                                                        currentPage={courses.current_page}
                                                        lastPage={courses.last_page}
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

export default Revenue;