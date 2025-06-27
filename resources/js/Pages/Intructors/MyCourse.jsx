import React, { useState } from 'react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import Pagination from '../../Components/Pagination';
import { Link, router, usePage } from '@inertiajs/react';

const MyCourse = () => {
    const { courses, filters, auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [sortFilter, setSortFilter] = useState(filters.sort || 'newest');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount || 0);
    };

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu)
    }
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };
    const getCourseImage = (course) => {

        if (!course.img_url) {
            return '/assets/images/courses/4by3/default.jpg';
        }

        if (course.img_url.startsWith('bannercourse/')) {
            return `/storage/${course.img_url}`;
        }

        return course.img_url;
    };
    // Apply filters
    const applyFilters = () => {
        router.get(route('instructor.courses.index'), {
            search: searchTerm,
            status: statusFilter,
            sort: sortFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'status') {
            setStatusFilter(value);
        } else if (filterType === 'sort') {
            setSortFilter(value);
        }

        router.get(route('instructor.courses.index'), {
            search: searchTerm,
            status: filterType === 'status' ? value : statusFilter,
            sort: filterType === 'sort' ? value : sortFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle delete
    const handleDelete = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (courseToDelete) {
            router.delete(route('instructor.courses.destroy', courseToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                },
                onError: () => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                }
            });
        }
    };

    // Get status badge class
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'badge bg-success';
            case 'pending':
                return 'badge bg-warning';
            case 'inactive':
                return 'badge bg-secondary';
            case 'suspended':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Đã duyệt';
            case 'pending':
                return 'Chờ duyệt';
            case 'inactive':
                return 'Không hoạt động';
            case 'suspended':
                return 'Bị từ chối';
            default:
                return 'Không xác định';
        }
    };

    return (
        <InstructorLayout>
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

                                                    <Link className="list-group-item" href="/instructor/dashboard" preserveScroll>
                                                        <i className="bi bi-grid fa-fw me-2"></i>Tổng quan
                                                    </Link>

                                                    {/* Quản lý khóa học */}
                                                    <button onClick={() => toggleMenu('courses')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-journal-text fa-fw me-2"></i>Quản lý khóa học</span>
                                                        <i className={`bi ms-auto ${openMenu === 'courses' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'courses' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/courses" className="list-group-item" preserveScroll>Khóa học của tôi</Link>

                                                        </div>
                                                    )}

                                                    {/* Học viên */}
                                                    <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'students' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/students" className="list-group-item" preserveScroll>Danh sách học viên</Link>
                                                        </div>
                                                    )}

                                                    {/* Doanh thu & Thanh toán */}
                                                    <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                        <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'revenue' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/revenue" className="list-group-item" preserveScroll>Doanh Thu Khoá Học</Link>
                                                        </div>
                                                    )}

                                                    {/* Tài khoản giảng viên */}
                                                    <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'profile' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/profile" className="list-group-item" preserveScroll>Chỉnh sửa thông tin</Link>
                                                        </div>
                                                    )}

                                                    {/* Đăng xuất */}
                                                    <Link href="/logout" as="button" method="post" className="list-group-item text-danger bg-danger-soft-hover" preserveScroll>
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

                                                <Link className="list-group-item" href="/instructor/dashboard" preserveScroll>
                                                    <i className="bi bi-grid fa-fw me-2"></i>Tổng quan
                                                </Link>

                                                {/* Quản lý khóa học */}
                                                <button onClick={() => toggleMenu('courses')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-journal-text fa-fw me-2"></i>Quản lý khóa học</span>
                                                    <i className={`bi ms-auto ${openMenu === 'courses' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'courses' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/courses" className="list-group-item" preserveScroll>Khóa học của tôi</Link>

                                                    </div>
                                                )}

                                                {/* Học viên */}
                                                <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'students' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/students" className="list-group-item" preserveScroll>Danh sách học viên</Link>
                                                    </div>
                                                )}

                                                {/* Doanh thu & Thanh toán */}
                                                <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                    <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'revenue' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/revenue" className="list-group-item" preserveScroll>Doanh Thu Khoá Học</Link>
                                                    </div>
                                                )}

                                                {/* Tài khoản giảng viên */}
                                                <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'profile' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/profile" className="list-group-item" preserveScroll>Chỉnh sửa thông tin</Link>

                                                    </div>
                                                )}

                                                {/* Đăng xuất */}
                                                <Link href="/logout" as="button" method="post" className="list-group-item text-danger bg-danger-soft-hover" preserveScroll>
                                                    <i className="bi bi-box-arrow-right fa-fw me-2"></i>Đăng xuất
                                                </Link>

                                            </div>
                                        </div>
                                    </div>

                                </nav>
                            </div>

                            {/* Main Content */}
                            <div className="col-xl-9">
                                {/* Page Header */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-sm-flex justify-content-between align-items-center mb-4">
                                            <h1 className="h3 mb-2 mb-sm-0">Khóa học của tôi</h1>
                                            <Link
                                                href="/instructor/courses/create"
                                                className="btn btn-primary-soft mb-0"
                                            >
                                                <i className="bi bi-plus-circle me-2"></i>Tạo khóa học mới
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Search and Filters */}
                                <div className="card border bg-transparent rounded-3">
                                    <div className="card-header bg-transparent border-bottom">
                                        <h5 className="mb-0">Tìm kiếm và lọc</h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSearch} className="row g-3">
                                            {/* Search */}
                                            <div className="col-md-6">
                                                <label className="form-label">Tìm kiếm khóa học</label>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Nhập tên khóa học..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                    <button className="btn btn-primary" type="submit">
                                                        <i className="bi bi-search"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Status Filter */}
                                            <div className="col-md-3">
                                                <label className="form-label">Trạng thái</label>
                                                <select
                                                    className="form-select"
                                                    value={statusFilter}
                                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                                >
                                                    <option value="all">Tất cả</option>
                                                    <option value="active">Đã duyệt</option>
                                                    <option value="inactive">Không hoạt động</option>
                                                    <option value="suspended">Bị từ chối</option>
                                                    <option value="pending">Chờ duyệt</option>
                                                </select>
                                            </div>

                                            {/* Sort Filter */}
                                            <div className="col-md-3">
                                                <label className="form-label">Sắp xếp</label>
                                                <select
                                                    className="form-select"
                                                    value={sortFilter}
                                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                                >
                                                    <option value="newest">Mới nhất</option>
                                                    <option value="oldest">Cũ nhất</option>
                                                    <option value="title">Tên A-Z</option>
                                                    <option value="price_low">Giá thấp đến cao</option>
                                                    <option value="price_high">Giá cao đến thấp</option>
                                                    <option value="most_enrolled">Nhiều học viên nhất</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* Course Stats */}
                                <div className="row g-4 mb-4">
                                    <div className="col-sm-6 col-lg-4">
                                        <div className="text-center p-4 bg-primary bg-opacity-10 border border-primary border-opacity-10 rounded-3">
                                            <i className="bi bi-book-half fs-1 text-primary"></i>
                                            <h4 className="text-primary">{courses.total}</h4>
                                            <p className="mb-0 h6 fw-light">Tổng khóa học</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-4">
                                        <div className="text-center p-4 bg-success bg-opacity-10 border border-success border-opacity-10 rounded-3">
                                            <i className="bi bi-check-circle fs-1 text-success"></i>
                                            <h4 className="text-success">
                                                {courses.data.filter(course => course.status === 'active').length}
                                            </h4>
                                            <p className="mb-0 h6 fw-light">Đã duyệt</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-4">
                                        <div className="text-center p-4 bg-warning bg-opacity-10 border border-warning border-opacity-10 rounded-3">
                                            <i className="bi bi-clock fs-1 text-warning"></i>
                                            <h4 className="text-warning">
                                                {courses.data.filter(course => course.status === 'pending').length}
                                            </h4>
                                            <p className="mb-0 h6 fw-light">Chờ duyệt</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Course List */}
                                <div className="card border bg-transparent">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="d-sm-flex justify-content-between align-items-center">
                                            <h5 className="mb-2 mb-sm-0">
                                                Danh sách khóa học ({courses.total} khóa học)
                                            </h5>
                                            <span className="small">
                                                Hiển thị {courses.from} - {courses.to} trong tổng số {courses.total} khóa học
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {courses.data.length > 0 ? (
                                            <>
                                                {/* Course Items */}
                                                <div className="row g-4">
                                                    {courses.data.map((course) => (
                                                        <div key={course.id} className="col-sm-6 col-xl-4">
                                                            <div className="card shadow h-100">
                                                                {/* Course Image */}
                                                                <div className="position-relative">
                                                                    <img
                                                                        src={getCourseImage(course)
                                                                        }
                                                                        className="card-img-top"
                                                                        alt={course.title}
                                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                                    />
                                                                    <div className="position-absolute top-0 end-0 m-2">
                                                                        <span className={getStatusBadge(course.status)}>
                                                                            {getStatusText(course.status)}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Course Content */}
                                                                <div className="card-body pb-0">
                                                                    {/* Course Categories */}
                                                                    <div className="d-flex justify-content-between mb-2">
                                                                        <div className="d-flex flex-wrap gap-1">
                                                                            {course.categories?.slice(0, 2).map((category) => (
                                                                                <span
                                                                                    key={category.id}
                                                                                    className="badge bg-light text-dark"
                                                                                >
                                                                                    {category.name}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        <span className="h6 fw-light text-primary">
                                                                            {formatCurrency(course.price)}
                                                                        </span>
                                                                    </div>

                                                                    {/* Course Title */}
                                                                    <h5 className="card-title">
                                                                        <Link
                                                                            href={route('instructor.courses.show', course.id)}
                                                                            className="text-decoration-none"
                                                                        >
                                                                            {course.title}
                                                                        </Link>
                                                                    </h5>

                                                                    {/* Course Description */}
                                                                    <p className="text-truncate-2 mb-2">
                                                                        {course.description}
                                                                    </p>

                                                                    {/* Course Stats */}
                                                                    <div className="row gx-2 mb-3">
                                                                        <div className="col-sm-6">
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="bi bi-people-fill text-orange me-2"></i>
                                                                                <span className="small">
                                                                                    {course.enrollments_count} học viên
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-6">
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="bi bi-calendar3 text-info me-2"></i>
                                                                                <span className="small">
                                                                                    {formatDate(course.created_at)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Course Actions */}
                                                                <div className="card-footer bg-transparent pt-0">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <Link
                                                                            href={route('instructor.courses.show', course.id)}
                                                                            className="btn btn-outline-primary btn-sm"
                                                                        >
                                                                            <i className="bi bi-eye me-1"></i>Chi tiết
                                                                        </Link>
                                                                        <div className="btn-group">
                                                                            <Link
                                                                                href={route('instructor.courses.edit', course.id)}
                                                                                className="btn btn-sm btn-light"
                                                                                title="Chỉnh sửa"
                                                                            >
                                                                                <i className="bi bi-pencil-square"></i>
                                                                            </Link>
                                                                            <button
                                                                                className="btn btn-sm btn-light text-danger"
                                                                                onClick={() => handleDelete(course)}
                                                                                title="Xóa"
                                                                                disabled={course.enrollments_count > 0}
                                                                            >
                                                                                <i className="bi bi-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Pagination */}
                                                <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
                                                    <Pagination links={courses.links} />
                                                </div>
                                            </>
                                        ) : (
                                            /* Empty State */
                                            <div className="text-center py-5">
                                                <i className="bi bi-book display-1 text-muted"></i>
                                                <h4 className="mt-3">Chưa có khóa học nào</h4>
                                                <p className="text-muted">
                                                    {searchTerm || statusFilter !== 'all'
                                                        ? 'Không tìm thấy khóa học nào phù hợp với điều kiện tìm kiếm.'
                                                        : 'Bạn chưa tạo khóa học nào. Hãy tạo khóa học đầu tiên của bạn!'
                                                    }
                                                </p>
                                                <Link
                                                    href="/instructor/courses/create"
                                                    className="btn btn-primary"
                                                >
                                                    <i className="bi bi-plus-circle me-2"></i>Tạo khóa học mới
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xác nhận xóa khóa học</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowDeleteModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Bạn có chắc chắn muốn xóa khóa học "<strong>{courseToDelete?.title}</strong>"?</p>
                                    <p className="text-danger">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Hành động này không thể hoàn tác!
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmDelete}
                                    >
                                        Xóa khóa học
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    .text-truncate-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    .text-orange {
                        color: #fd7e14 !important;
                    }
                `}</style>
            </main>
        </InstructorLayout>
    );
};

export default MyCourse;