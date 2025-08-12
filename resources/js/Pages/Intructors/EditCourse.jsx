import React, { useState, useEffect } from 'react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import { Link, router, usePage, useForm } from '@inertiajs/react';

const EditCourse = () => {
    const { course, categories, auth, errors, flash, pendingEdit } = usePage().props;
    const [openMenu, setOpenMenu] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        title: pendingEdit?.edited_title || course?.title || '',
        description: pendingEdit?.edited_description || course?.description || '',
        price: pendingEdit?.edited_price || course?.price || '',
        category_ids: pendingEdit?.categories?.map(cat => cat.id) || course?.categories?.map(cat => cat.id) || [],
        course_image: null,
        status: course?.status || 'draft',
        _method: 'PUT'
    });

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount || 0);
    };

    const getCourseImage = (course) => {
        if (!course?.img_url) {
            return '/assets/images/courses/4by3/default.jpg';
        }

        if (course.img_url.startsWith('bannercourse/')) {
            return `/storage/${course.img_url}`;
        }

        return course.img_url;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.courses.update', course.id), {
            forceFormData: true,
            onSuccess: () => {
                // Success message is handled by flash message
            }
        });
    };

    const handleCategoryChange = (categoryId) => {
        const updatedCategories = data.category_ids.includes(categoryId)
            ? data.category_ids.filter(id => id !== categoryId)
            : [...data.category_ids, categoryId];

        setData('category_ids', updatedCategories);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('course_image', file);
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
                                {/* Header */}
                                <div className="card bg-transparent border rounded-3">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="d-sm-flex justify-content-between align-items-center">
                                            <h3 className="mb-2 mb-sm-0">Chỉnh sửa khóa học</h3>
                                            <Link
                                                href={route('instructor.courses.index')}
                                                className="btn btn-sm btn-primary-soft mb-0"
                                            >
                                                <i className="bi bi-arrow-left me-2"></i>Quay lại danh sách
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Flash Messages */}
                                    {flash?.success && (
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            {flash.success}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>
                                    )}
                                    {flash?.error && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            {flash.error}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>
                                    )}

                                    {/* Pending Edit Request Alert */}
                                    {pendingEdit && (
                                        <div className="alert alert-info alert-dismissible fade show" role="alert">
                                            <i className="bi bi-info-circle me-2"></i>
                                            <strong>Thông báo:</strong> Bạn có yêu cầu chỉnh sửa đang chờ admin phê duyệt.
                                            Dữ liệu hiện tại trong form là dữ liệu từ yêu cầu chỉnh sửa.
                                            Khóa học vẫn hiển thị với nội dung gốc cho đến khi được phê duyệt.
                                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                        </div>
                                    )}

                                    <div className="card-body">
                                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                                            {/* Course Title */}
                                            <div className="mb-4">
                                                <label className="form-label">Tiêu đề khóa học <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    placeholder="Nhập tiêu đề khóa học"

                                                />
                                                {errors.title && (
                                                    <div className="invalid-feedback">{errors.title}</div>
                                                )}
                                            </div>

                                            {/* Course Description */}
                                            <div className="mb-4">
                                                <label className="form-label">Mô tả khóa học <span className="text-danger">*</span></label>
                                                <textarea
                                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                    rows="5"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Nhập mô tả chi tiết về khóa học"

                                                ></textarea>
                                                {errors.description && (
                                                    <div className="invalid-feedback">{errors.description}</div>
                                                )}
                                            </div>

                                            {/* Course Price */}
                                            <div className="mb-4">
                                                <label className="form-label">Giá khóa học (VNĐ) <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    placeholder="Nhập giá khóa học"

                                                />
                                                {errors.price && (
                                                    <div className="invalid-feedback">{errors.price}</div>
                                                )}
                                                {data.price && (
                                                    <div className="form-text text-success">
                                                        Giá hiển thị: {formatCurrency(data.price)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Categories */}
                                            <div className="mb-4">
                                                <label className="form-label">Danh mục khóa học <span className="text-danger">*</span></label>
                                                <div className="row">
                                                    {categories && categories.map((category) => (
                                                        <div key={category.id} className="col-sm-6 col-lg-4">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`category-${category.id}`}
                                                                    checked={data.category_ids.includes(category.id)}
                                                                    onChange={() => handleCategoryChange(category.id)}
                                                                />
                                                                <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                                                    {category.name}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {errors.category_ids && (
                                                    <div className="text-danger mt-1">{errors.category_ids}</div>
                                                )}
                                            </div>

                                            {/* Current Course Image */}
                                            <div className="mb-4">
                                                <label className="form-label">Ảnh khóa học hiện tại</label>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <img
                                                            src={getCourseImage(course)}
                                                            alt={course?.title}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Upload New Image */}
                                            <div className="mb-4">
                                                <label className="form-label">Cập nhật ảnh khóa học</label>
                                                <input
                                                    type="file"
                                                    className={`form-control ${errors.course_image ? 'is-invalid' : ''}`}
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                <div className="form-text">Chọn file ảnh mới nếu muốn thay đổi. Định dạng: JPG, PNG, GIF. Kích thước tối đa: 2MB</div>
                                                {errors.course_image && (
                                                    <div className="invalid-feedback">{errors.course_image}</div>
                                                )}
                                            </div>

                                            {/* Course Status */}
                                            <div className="mb-4">
                                                <label className="form-label">Trạng thái khóa học</label>
                                                <select
                                                    className="form-select"
                                                    value={data.status}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    disabled
                                                >
                                                    <option value="draft">Nháp</option>
                                                    <option value="pending">Chờ phê duyệt</option>
                                                    <option value="active">Đã phê duyệt</option>
                                                    <option value="inactive">Tạm dừng</option>
                                                </select>
                                                <div className="form-text">
                                                    {data.status === 'draft' && 'Khóa học đang ở trạng thái nháp, chưa được công khai'}
                                                    {data.status === 'pending' && 'Khóa học đang chờ admin phê duyệt'}
                                                    {data.status === 'active' && 'Khóa học đã được phê duyệt và công khai'}
                                                    {data.status === 'inactive' && 'Khóa học đã tạm dừng hoạt động'}
                                                </div>
                                            </div>

                                            {/* Course Info */}
                                            <div className="mb-4">
                                                <div className="bg-light rounded p-3">
                                                    <h6 className="mb-2">Thông tin khóa học</h6>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <small className="text-muted">Slug:</small>
                                                            <div className="fw-bold">{course?.slug}</div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <small className="text-muted">Ngày tạo:</small>
                                                            <div className="fw-bold">
                                                                {course?.created_at ? new Date(course.created_at).toLocaleDateString('vi-VN') : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submit Buttons */}
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    disabled={processing}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                            {course?.status === 'active' ? 'Đang gửi yêu cầu...' : 'Đang cập nhật...'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check-circle me-2"></i>
                                                            {course?.status === 'active' ? 'Gửi yêu cầu chỉnh sửa' : 'Cập nhật khóa học'}
                                                        </>
                                                    )}
                                                </button>

                                                <Link
                                                    href={route('instructor.courses.index')}
                                                    className="btn btn-outline-secondary"
                                                >
                                                    Hủy bỏ
                                                </Link>
                                            </div>
                                        </form>
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

export default EditCourse;