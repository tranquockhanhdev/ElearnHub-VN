import React, { useState } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import { Link, usePage } from '@inertiajs/react';

const Checkout = () => {
    const { auth, flash_success, flash_error, course, paymentMethods } = usePage().props;

    // State để quản lý accordion và form
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [formData, setFormData] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        student_id: auth?.user?.id || null,
        course_id: course?.id || null,
        payment_method_id: null,
        payment_time: new Date().toISOString(),
        country: 'VN'
    });
    console.log('Checkout Page Loaded', { formData });
    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    // Get course image URL
    const getCourseImageUrl = (imgUrl) => {
        if (!imgUrl) return 'https://placehold.co/600x400/EEE/31343C';
        if (imgUrl.startsWith('http')) return imgUrl;
        return `/storage/${imgUrl}`;
    };

    // Handle accordion toggle - sửa lại để cập nhật payment_method_id
    const handleAccordionToggle = (index) => {
        const newActiveIndex = activeAccordion === index ? null : index;
        setActiveAccordion(newActiveIndex);

        // Cập nhật payment_method_id trong formData
        if (newActiveIndex !== null && paymentMethods[newActiveIndex]) {
            setFormData({
                ...formData,
                payment_method_id: paymentMethods[newActiveIndex].id
            });
        } else {
            setFormData({
                ...formData,
                payment_method_id: null
            });
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <UserLayout>
            <>
                {/* **************** MAIN CONTENT START **************** */}
                <main>
                    {/* =======================
Page Banner START */}
                    <section className="py-0 bg-gradient-primary">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="bg-white shadow-sm p-4 text-center rounded-4 border-0">
                                        <h1 className="m-0 fw-bold text-primary">
                                            <i className="bi bi-credit-card-2-front me-2"></i>
                                            Thanh toán
                                        </h1>
                                        {/* Breadcrumb */}
                                        <div className="d-flex justify-content-center mt-3">
                                            <nav aria-label="breadcrumb">
                                                <ol className="breadcrumb breadcrumb-dots mb-0">
                                                    <li className="breadcrumb-item">
                                                        <Link href="/" className="text-decoration-none">
                                                            <i className="bi bi-house-door me-1"></i>Trang chủ
                                                        </Link>
                                                    </li>
                                                    <li className="breadcrumb-item">
                                                        <Link href="/courses" className="text-decoration-none">Khóa học</Link>
                                                    </li>
                                                    <li className="breadcrumb-item active fw-semibold" aria-current="page">
                                                        Thanh toán
                                                    </li>
                                                </ol>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* =======================
Page Banner END */}

                    {/* =======================
Page content START */}
                    <section className="pt-5 pb-5" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="container">
                            {/* Security Badge */}
                            <div className="row justify-content-center mb-4">
                                <div className="col-lg-8">
                                    <div className="alert alert-success border-0 shadow-sm d-flex align-items-center">
                                        <i className="bi bi-shield-check fs-4 me-3 text-success"></i>
                                        <div>
                                            <h6 className="mb-1 fw-semibold">Giao dịch được bảo mật</h6>
                                            <small className="text-muted">Thông tin của bạn được mã hóa và bảo vệ bằng SSL 256-bit</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-4">
                                {/* Main content START */}
                                <div className="col-xl-8">
                                    {/* Alert for login */}
                                    {!auth?.user && (
                                        <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center mb-4">
                                            <i className="bi bi-exclamation-triangle-fill fs-4 me-3 text-warning"></i>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 fw-semibold">Cần đăng nhập để tiếp tục</h6>
                                                <small className="text-muted">Vui lòng đăng nhập để hoàn tất quá trình thanh toán</small>
                                            </div>
                                            <Link href="/login" className="btn btn-warning btn-sm ms-3">
                                                <i className="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
                                            </Link>
                                        </div>
                                    )}

                                    {/* Step Indicator */}
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-body p-4">
                                            <div className="row text-center">
                                                <div className="col-md-4">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                            <i className="bi bi-person-check fs-5"></i>
                                                        </div>
                                                        <h6 className="mt-2 mb-0 fw-semibold text-primary">Thông tin</h6>
                                                        <small className="text-muted">Nhập thông tin cá nhân</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                            <i className="bi bi-credit-card fs-5"></i>
                                                        </div>
                                                        <h6 className="mt-2 mb-0 text-muted">Thanh toán</h6>
                                                        <small className="text-muted">Chọn phương thức</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                            <i className="bi bi-check-circle fs-5"></i>
                                                        </div>
                                                        <h6 className="mt-2 mb-0 text-muted">Hoàn tất</h6>
                                                        <small className="text-muted">Xác nhận đơn hàng</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal info START */}
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-header bg-white border-0 p-4">
                                            <h5 className="mb-0 fw-bold d-flex align-items-center">
                                                <i className="bi bi-person-fill me-2 text-primary"></i>
                                                Thông tin thanh toán
                                            </h5>
                                            <p className="text-muted mb-0 mt-1">Vui lòng nhập thông tin chính xác để hoàn tất giao dịch</p>
                                        </div>
                                        <div className="card-body p-4">
                                            <form className="row g-4">
                                                {/* Name */}
                                                <div className="col-md-6">
                                                    <label htmlFor="yourName" className="form-label fw-semibold">
                                                        <i className="bi bi-person me-1"></i>Họ và tên <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-lg border-2"
                                                        id="yourName"
                                                        name="name"
                                                        placeholder="Nhập họ và tên đầy đủ"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        style={{ borderRadius: '12px' }}
                                                    />
                                                </div>
                                                {/* Email */}
                                                <div className="col-md-6">
                                                    <label htmlFor="emailInput" className="form-label fw-semibold">
                                                        <i className="bi bi-envelope me-1"></i>Email <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control form-control-lg border-2"
                                                        id="emailInput"
                                                        name="email"
                                                        placeholder="email@example.com"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        style={{ borderRadius: '12px' }}
                                                    />
                                                </div>

                                                {/* Country */}
                                                <div className="col-md-6">
                                                    <label htmlFor="country" className="form-label fw-semibold">
                                                        <i className="bi bi-geo-alt me-1"></i>Quốc gia <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className="form-select form-select-lg border-2"
                                                        id="country"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleInputChange}
                                                        style={{ borderRadius: '12px' }}
                                                    >
                                                        <option value="VN">🇻🇳 Việt Nam</option>
                                                        <option value="US">🇺🇸 Hoa Kỳ</option>
                                                        <option value="CN">🇨🇳 Trung Quốc</option>
                                                        <option value="JP">🇯🇵 Nhật Bản</option>
                                                    </select>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Payment method START */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white border-0 p-4">
                                            <h5 className="mb-0 fw-bold d-flex align-items-center">
                                                <i className="bi bi-credit-card me-2 text-primary"></i>
                                                Phương thức thanh toán
                                            </h5>
                                            <p className="text-muted mb-0 mt-1">Chọn phương thức thanh toán phù hợp với bạn</p>
                                        </div>
                                        <div className="card-body p-4">
                                            {paymentMethods && paymentMethods.length > 0 ? (
                                                <div className="row g-3">
                                                    {paymentMethods.map((method, index) => {
                                                        const isActive = activeAccordion === index;

                                                        return (
                                                            <div className="col-12" key={method.id}>
                                                                <div className={`card border-2 ${isActive ? 'border-primary shadow-sm' : 'border-light'} transition-all`} style={{ borderRadius: '16px' }}>
                                                                    <div className="card-header bg-transparent border-0 p-0">
                                                                        <button
                                                                            className={`btn w-100 text-start p-4 border-0 d-flex align-items-center ${isActive ? 'bg-light' : 'bg-white'}`}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                handleAccordionToggle(index);
                                                                                console.log('Selected payment method:', method);
                                                                                console.log('Updated formData:', { ...formData, payment_method_id: method.id });
                                                                            }}
                                                                            style={{ borderRadius: '16px' }}
                                                                        >
                                                                            <div className="d-flex align-items-center w-100">
                                                                                {/* Custom Radio */}
                                                                                <div className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${isActive ? 'bg-primary' : 'bg-light border'}`} style={{ width: '24px', height: '24px' }}>
                                                                                    {isActive && <i className="bi bi-check text-white small"></i>}
                                                                                </div>

                                                                                {method.icon && (
                                                                                    <div className="me-3 d-flex align-items-center justify-content-center bg-white rounded p-2" style={{ width: '50px', height: '50px' }}>
                                                                                        <img
                                                                                            src={method.icon}
                                                                                            alt={method.name}
                                                                                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                                                        />
                                                                                    </div>
                                                                                )}

                                                                                <div className="flex-grow-1">
                                                                                    <h6 className="mb-0 fw-bold text-dark">{method.name}</h6>
                                                                                    <small className="text-muted">
                                                                                        {method.code === 'vnpay' && 'Thanh toán qua VNPay'}
                                                                                        {method.code === 'momo' && 'Ví điện tử MoMo'}
                                                                                        {method.code === 'zalopay' && 'Ví điện tử ZaloPay'}
                                                                                        {method.code === 'card' && 'Thẻ tín dụng/ghi nợ'}
                                                                                        {method.code === 'banking' && 'Chuyển khoản ngân hàng'}
                                                                                    </small>
                                                                                </div>

                                                                                <i className={`bi ${isActive ? 'bi-chevron-up' : 'bi-chevron-down'} text-muted`}></i>
                                                                            </div>
                                                                        </button>
                                                                    </div>

                                                                    {/* Collapse content */}
                                                                    {isActive && (
                                                                        <div className="card-body pt-0 px-4 pb-4">
                                                                            {/* Hiển thị thông tin payment method được chọn */}
                                                                            <div className="alert alert-info border-0 mb-3">
                                                                                <small>
                                                                                    <i className="bi bi-info-circle me-1"></i>
                                                                                    Đã chọn: <strong>{method.name}</strong>
                                                                                </small>
                                                                            </div>

                                                                            {/* VNPay */}
                                                                            {method.code === 'vnpay' && (
                                                                                <div className="p-4 bg-light rounded-3">
                                                                                    <div className="d-flex align-items-center mb-3">
                                                                                        <i className="bi bi-shield-check text-success fs-4 me-3"></i>
                                                                                        <div>
                                                                                            <h6 className="mb-1 fw-semibold">Thanh toán an toàn với VNPay</h6>
                                                                                            <small className="text-muted">Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch</small>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="d-flex flex-wrap gap-2">
                                                                                        <span className="badge bg-primary">Visa</span>
                                                                                        <span className="badge bg-primary">Mastercard</span>
                                                                                        <span className="badge bg-primary">ATM Card</span>
                                                                                        <span className="badge bg-primary">Internet Banking</span>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* Credit/Debit Card */}
                                                                            {method.code === 'card' && (
                                                                                <div>
                                                                                    <div className="alert alert-info border-0 mb-4">
                                                                                        <i className="bi bi-info-circle me-2"></i>
                                                                                        <strong>Thông tin thẻ của bạn được mã hóa và bảo mật tuyệt đối</strong>
                                                                                    </div>

                                                                                    <form className="row g-4">
                                                                                        <div className="col-12">
                                                                                            <label className="form-label fw-semibold">
                                                                                                <i className="bi bi-credit-card me-1"></i>Số thẻ <span className="text-danger">*</span>
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control form-control-lg border-2"
                                                                                                placeholder="1234 5678 9012 3456"
                                                                                                maxLength="19"
                                                                                                style={{ borderRadius: '12px' }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                            <label className="form-label fw-semibold">
                                                                                                <i className="bi bi-calendar me-1"></i>Ngày hết hạn <span className="text-danger">*</span>
                                                                                            </label>
                                                                                            <div className="input-group">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="form-control form-control-lg border-2"
                                                                                                    placeholder="MM"
                                                                                                    maxLength="2"
                                                                                                    style={{ borderRadius: '12px 0 0 12px' }}
                                                                                                />
                                                                                                <span className="input-group-text bg-light border-2">/</span>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="form-control form-control-lg border-2"
                                                                                                    placeholder="YY"
                                                                                                    maxLength="2"
                                                                                                    style={{ borderRadius: '0 12px 12px 0' }}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                            <label className="form-label fw-semibold">
                                                                                                <i className="bi bi-lock me-1"></i>CVV <span className="text-danger">*</span>
                                                                                            </label>
                                                                                            <input
                                                                                                type="password"
                                                                                                className="form-control form-control-lg border-2"
                                                                                                placeholder="123"
                                                                                                maxLength="4"
                                                                                                style={{ borderRadius: '12px' }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-12">
                                                                                            <label className="form-label fw-semibold">
                                                                                                <i className="bi bi-person me-1"></i>Tên chủ thẻ <span className="text-danger">*</span>
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control form-control-lg border-2"
                                                                                                placeholder="NGUYEN VAN A"
                                                                                                style={{ borderRadius: '12px', textTransform: 'uppercase' }}
                                                                                            />
                                                                                        </div>
                                                                                    </form>
                                                                                </div>
                                                                            )}

                                                                            {/* Momo */}
                                                                            {method.code === 'momo' && (
                                                                                <div className="p-4 bg-light rounded-3">
                                                                                    <div className="d-flex align-items-center mb-3">
                                                                                        <div className="bg-pink rounded-circle p-2 me-3">
                                                                                            <i className="bi bi-phone text-white"></i>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h6 className="mb-1 fw-semibold">Thanh toán với MoMo</h6>
                                                                                            <small className="text-muted">Nhanh chóng, tiện lợi và bảo mật với ví MoMo</small>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="alert alert-success border-0 small">
                                                                                        <i className="bi bi-check-circle me-2"></i>
                                                                                        Bạn sẽ nhận được thông báo trên ứng dụng MoMo để xác nhận thanh toán
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* ZaloPay */}
                                                                            {method.code === 'zalopay' && (
                                                                                <div className="p-4 bg-light rounded-3">
                                                                                    <div className="d-flex align-items-center mb-3">
                                                                                        <div className="bg-info rounded-circle p-2 me-3">
                                                                                            <i className="bi bi-lightning text-white"></i>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h6 className="mb-1 fw-semibold">Thanh toán với ZaloPay</h6>
                                                                                            <small className="text-muted">Thanh toán siêu tốc cùng ZaloPay</small>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="alert alert-info border-0 small">
                                                                                        <i className="bi bi-info-circle me-2"></i>
                                                                                        Bạn cần có ứng dụng ZaloPay để hoàn tất thanh toán
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* Banking Transfer */}
                                                                            {method.code === 'banking' && (
                                                                                <div>
                                                                                    <div className="alert alert-warning border-0 mb-4">
                                                                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                                                                        <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng nội dung để được xử lý tự động
                                                                                    </div>

                                                                                    <div className="card bg-gradient-primary text-white border-0" style={{ borderRadius: '16px' }}>
                                                                                        <div className="card-body p-4">
                                                                                            <h6 className="mb-3 fw-bold">
                                                                                                <i className="bi bi-bank me-2"></i>Thông tin chuyển khoản
                                                                                            </h6>
                                                                                            <div className="row g-3">
                                                                                                <div className="col-sm-6">
                                                                                                    <small className="opacity-75">Ngân hàng</small>
                                                                                                    <div className="fw-bold">Vietcombank</div>
                                                                                                </div>
                                                                                                <div className="col-sm-6">
                                                                                                    <small className="opacity-75">Số tài khoản</small>
                                                                                                    <div className="fw-bold">0123456789</div>
                                                                                                </div>
                                                                                                <div className="col-sm-6">
                                                                                                    <small className="opacity-75">Chủ tài khoản</small>
                                                                                                    <div className="fw-bold">CÔNG TY EHUB</div>
                                                                                                </div>
                                                                                                <div className="col-sm-6">
                                                                                                    <small className="opacity-75">Nội dung</small>
                                                                                                    <div className="fw-bold">EHUB{course?.id || 'XXX'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-5">
                                                    <i className="bi bi-credit-card-2-front display-4 text-muted mb-3"></i>
                                                    <h5 className="text-muted">Chưa có phương thức thanh toán</h5>
                                                    <p className="text-muted">Vui lòng liên hệ quản trị viên để cấu hình phương thức thanh toán</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Payment method END */}
                                </div>
                                {/* Main content END */}

                                {/* Right sidebar START */}
                                <div className="col-xl-4">
                                    <div className="sticky-top" style={{ top: '100px' }}>
                                        {/* Order summary START */}
                                        <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                                            <div className="card-header bg-gradient-primary text-white border-0 p-4" style={{ borderRadius: '20px 20px 0 0' }}>
                                                <h4 className="mb-0 fw-bold d-flex align-items-center">
                                                    <i className="bi bi-cart-check me-2"></i>
                                                    Tóm tắt đơn hàng
                                                </h4>
                                            </div>
                                            <div className="card-body p-4">
                                                {/* Course item START */}
                                                {course ? (
                                                    <>
                                                        <div className="d-flex mb-4">
                                                            {/* Image */}
                                                            <div className="flex-shrink-0 me-3">
                                                                <img
                                                                    className="rounded-3 shadow-sm"
                                                                    src={getCourseImageUrl(course.img_url)}
                                                                    alt={course.title}
                                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                            {/* Info */}
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-2 fw-bold line-clamp-2">{course.title}</h6>
                                                                {/* Categories */}
                                                                <div className="mb-2">
                                                                    {course.categories && course.categories.length > 0 ? (
                                                                        course.categories.slice(0, 2).map((category, index) => (
                                                                            <span key={index} className="badge bg-light text-primary small me-1">
                                                                                {category.name}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="badge bg-light text-secondary small">
                                                                            Chưa phân loại
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {/* Price */}
                                                                <div className="fw-bold text-success fs-5">
                                                                    {formatPrice(course.price)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <hr className="my-4" />

                                                        {/* Price breakdown */}
                                                        <div className="mb-4">
                                                            <div className="d-flex justify-content-between mb-3">
                                                                <span className="fw-semibold">Giá khóa học</span>
                                                                <span className="fw-semibold">{formatPrice(course.price)}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-3">
                                                                <span className="text-muted">
                                                                    <i className="bi bi-tag me-1"></i>Giảm giá
                                                                </span>
                                                                <span className="text-success">-0₫</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-3">
                                                                <span className="text-muted">
                                                                    <i className="bi bi-percent me-1"></i>Thuế VAT
                                                                </span>
                                                                <span>Đã bao gồm</span>
                                                            </div>
                                                            <hr />
                                                            <div className="d-flex justify-content-between">
                                                                <span className="h5 fw-bold">Tổng cộng</span>
                                                                <span className="h5 fw-bold text-primary">{formatPrice(course.price)}</span>
                                                            </div>
                                                        </div>

                                                        {/* Benefits */}
                                                        <div className="mb-4">
                                                            <h6 className="fw-bold mb-3">
                                                                <i className="bi bi-gift me-2 text-primary"></i>Bạn sẽ nhận được:
                                                            </h6>
                                                            <ul className="list-unstyled small">
                                                                <li className="mb-2">
                                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                                    Truy cập khóa học trọn đời
                                                                </li>
                                                                <li className="mb-2">
                                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                                    Chứng chỉ hoàn thành
                                                                </li>
                                                                <li className="mb-2">
                                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                                    Hỗ trợ từ giảng viên
                                                                </li>
                                                                <li className="mb-2">
                                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                                    Học trên mọi thiết bị
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        {/* Payment Button */}
                                                        <div className="d-grid mb-3">
                                                            <button className="btn btn-lg btn-primary fw-bold py-3" style={{ borderRadius: '12px' }}>
                                                                <i className="bi bi-credit-card me-2"></i>
                                                                Hoàn tất thanh toán
                                                            </button>
                                                        </div>

                                                        {/* Money back guarantee */}
                                                        <div className="text-center">
                                                            <div className="d-flex align-items-center justify-content-center text-success mb-2">
                                                                <i className="bi bi-shield-check fs-5 me-2"></i>
                                                                <small className="fw-semibold">Đảm bảo hoàn tiền 30 ngày</small>
                                                            </div>
                                                            <small className="text-muted">
                                                                Bằng cách thanh toán, bạn đồng ý với{" "}
                                                                <Link href="#" className="text-decoration-none fw-semibold">
                                                                    Điều khoản dịch vụ
                                                                </Link>
                                                            </small>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center py-5">
                                                        <i className="bi bi-cart-x display-4 text-muted mb-3"></i>
                                                        <h5 className="text-muted">Chưa có khóa học</h5>
                                                        <p className="text-muted mb-4">Vui lòng chọn khóa học để tiếp tục</p>
                                                        <Link href="/courses" className="btn btn-primary">
                                                            <i className="bi bi-arrow-left me-1"></i>Chọn khóa học
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Order summary END */}

                                        {/* Trust badges */}
                                        <div className="card border-0 mt-4">
                                            <div className="card-body p-4 text-center">
                                                <h6 className="fw-bold mb-3">Thanh toán được bảo mật bởi</h6>
                                                <div className="d-flex justify-content-center align-items-center gap-3">
                                                    <img src="https://logowik.com/content/uploads/images/ssl-secured7869.jpg" style={{ height: '40px' }} />
                                                    <img src="https://logowik.com/content/uploads/images/verified-by-visa6450.jpg" style={{ height: '40px' }} />
                                                    <img src="https://logowik.com/content/uploads/images/mastercard-old9129.logowik.com.webp" style={{ height: '40px' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Right sidebar END */}
                            </div>
                        </div>
                    </section>
                    {/* =======================
Page content END */}
                </main>
                {/* **************** MAIN CONTENT END **************** */}
            </>
        </UserLayout>
    );
};

export default Checkout;