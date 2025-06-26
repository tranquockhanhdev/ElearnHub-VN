import React, { useState } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';

const Checkout = () => {
    const { auth, flash_success, flash_error, course, paymentMethods } = usePage().props;

    const [currentStep, setCurrentStep] = useState(1);
    const [activeAccordion, setActiveAccordion] = useState(null); // Thay đổi từ 0 thành null
    const [formData, setFormData] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        student_id: auth?.user?.id || null,
        course_id: course?.id || null,
        payment_method_id: null,
        payment_time: new Date().toISOString(),
        country: 'VN'
    });

    const [errors, setErrors] = useState({});

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const getCourseImageUrl = (imgUrl) => {
        if (!imgUrl) return 'https://placehold.co/600x400/EEE/31343C';
        if (imgUrl.startsWith('http')) return imgUrl;
        return `/storage/${imgUrl}`;
    };

    // Handle accordion toggle - cập nhật logic
    const handleAccordionToggle = (index) => {
        const newActiveIndex = activeAccordion === index ? null : index;
        setActiveAccordion(newActiveIndex);

        if (newActiveIndex !== null && paymentMethods[newActiveIndex]) {
            setFormData({
                ...formData,
                payment_method_id: paymentMethods[newActiveIndex].id
            });
            // Xóa lỗi khi user chọn phương thức thanh toán
            if (errors.payment_method_id) {
                setErrors({
                    ...errors,
                    payment_method_id: null
                });
            }
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
        // Xóa lỗi khi user nhập lại
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ và tên';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.payment_method_id) {
            newErrors.payment_method_id = 'Vui lòng chọn phương thức thanh toán';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle complete payment
    const handleCompletePayment = () => {
        if (validateForm()) {
            setCurrentStep(2); // Chuyển sang bước xác nhận
        }
    };

    const handleConfirmAndPay = async () => {
        try {
            const response = await axios.post(route('student.checkout.process', course.id), formData);

            const url = response.data.redirect_url ?? response.data.data;
            if (url) {
                window.location.href = url;

            } else {
                alert("Không lấy được link thanh toán VNPay");
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                setCurrentStep(1);
            }
        }
    };
    // Get selected payment method
    const getSelectedPaymentMethod = () => {
        return paymentMethods?.find(method => method.id === formData.payment_method_id);
    };

    return (
        <UserLayout>
            <>
                {/* **************** MAIN CONTENT START **************** */}
                <main>
                    {/* Page Banner */}
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

                    {/* Page content */}
                    <section className="pt-5 pb-5" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="container">
                            {/* Security Badge */}
                            <div className="row justify-content-center mb-4">
                                <div className="col-lg-8">
                                    <div className="alert alert-success border-0 shadow-sm d-flex align-items-center">
                                        <i className="bi bi-shield-check fs-4 me-3 text-success"></i>
                                        <div>
                                            <h6 className="mb-1 fw-semibold">Giao dịch được bảo mật</h6>
                                            <small className="text-gray-400d">Thông tin của bạn được mã hóa và bảo vệ bằng SSL 256-bit</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-4">
                                {/* Main content START */}
                                <div className="col-xl-8">
                                    {/* Step Indicator */}
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-body p-4">
                                            <div className="row text-center">
                                                <div className="col-md-4">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light text-gray-400d'}`} style={{ width: '50px', height: '50px' }}>
                                                            <i className="bi bi-person-check fs-5"></i>
                                                        </div>
                                                        <h6 className={`mt-2 mb-0 fw-semibold ${currentStep >= 1 ? 'text-primary' : 'text-gray-400d'}`}>Thông tin</h6>
                                                        <small className="text-gray-400d">Nhập thông tin cá nhân</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light text-gray-400d'}`} style={{ width: '50px', height: '50px' }}>
                                                            <i className="bi bi-check-square fs-5"></i>
                                                        </div>
                                                        <h6 className={`mt-2 mb-0 ${currentStep >= 2 ? 'text-primary fw-semibold' : 'text-gray-400d'}`}>Xác nhận</h6>
                                                        <small className="text-gray-400d">Kiểm tra thông tin</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 3 ? 'bg-success text-white' : 'bg-light text-gray-400d'}`} style={{ width: '50px', height: '50px' }}>
                                                            <i className="bi bi-check-circle fs-5"></i>
                                                        </div>
                                                        <h6 className={`mt-2 mb-0 ${currentStep >= 3 ? 'text-success fw-semibold' : 'text-gray-400d'}`}>Hoàn tất</h6>
                                                        <small className="text-gray-400d">Thanh toán thành công</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STEP 1: Thông tin thanh toán */}
                                    {currentStep === 1 && (
                                        <>
                                            {/* Personal info START */}
                                            <div className="card border-0 shadow-sm mb-4">
                                                <div className="card-header bg-white border-0 p-4">
                                                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                                                        <i className="bi bi-person-fill me-2 text-primary"></i>
                                                        Thông tin thanh toán
                                                    </h5>
                                                    <p className="text-gray-400d mb-0 mt-1">Vui lòng nhập thông tin chính xác để hoàn tất giao dịch</p>
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
                                                                className={`form-control form-control-lg border-2 ${errors.name ? 'is-invalid' : ''}`}
                                                                id="yourName"
                                                                name="name"
                                                                placeholder="Nhập họ và tên đầy đủ"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                style={{ borderRadius: '12px' }}
                                                            />
                                                            {errors.name && (
                                                                <div className="text-danger small mt-1">
                                                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                                                    {errors.name}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Email */}
                                                        <div className="col-md-6">
                                                            <label htmlFor="emailInput" className="form-label fw-semibold">
                                                                <i className="bi bi-envelope me-1"></i>Email <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="email"
                                                                className={`form-control form-control-lg border-2 ${errors.email ? 'is-invalid' : ''}`}
                                                                id="emailInput"
                                                                name="email"
                                                                placeholder="email@example.com"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                style={{ borderRadius: '12px' }}
                                                            />
                                                            {errors.email && (
                                                                <div className="text-danger small mt-1">
                                                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                                                    {errors.email}
                                                                </div>
                                                            )}
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
                                                    <p className="text-gray-400d mb-0 mt-1">Chọn phương thức thanh toán phù hợp với bạn</p>
                                                </div>
                                                <div className="card-body p-4">
                                                    {paymentMethods && paymentMethods.length > 0 ? (
                                                        <div className="row g-3">
                                                            {paymentMethods.map((method, index) => {
                                                                const isActive = activeAccordion === index;
                                                                return (
                                                                    <div className="col-12" key={method.id}>
                                                                        <div className={`card border-2 ${isActive ? 'border-primary shadow-sm' : 'border-light'} transition-all cursor-pointer`} style={{ borderRadius: '16px' }}>
                                                                            <div className="card-header bg-transparent border-0 p-0">
                                                                                <button
                                                                                    className={`btn w-100 text-start p-4 border-0 d-flex align-items-center ${isActive ? 'bg-light' : 'bg-white'} hover-effect`}
                                                                                    type="button"
                                                                                    onClick={() => handleAccordionToggle(index)}
                                                                                    style={{ borderRadius: '16px' }}
                                                                                >
                                                                                    <div className="d-flex align-items-center w-100">
                                                                                        {/* Custom Radio */}
                                                                                        <div className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${isActive ? 'bg-primary' : 'bg-light border'}`} style={{ width: '24px', height: '24px' }}>
                                                                                            {isActive && <i className="bi bi-check text-white small"></i>}
                                                                                        </div>

                                                                                        <div className="flex-grow-1">
                                                                                            <h6 className="mb-0 fw-bold text-dark">{method.name}</h6>
                                                                                            <small className="text-gray-400d">
                                                                                                {method.code === 'vnpay' && 'Thanh toán qua VNPay'}
                                                                                                {method.code === 'momo' && 'Ví điện tử MoMo'}
                                                                                                {method.code === 'zalopay' && 'Ví điện tử ZaloPay'}
                                                                                                {method.code === 'card' && 'Thẻ tín dụng/ghi nợ'}
                                                                                                {method.code === 'banking' && 'Chuyển khoản ngân hàng'}
                                                                                            </small>
                                                                                        </div>

                                                                                        <div className="me-2">
                                                                                            <small className="text-gray-400d">Nhấn để chọn</small>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                            </div>

                                                                            {/* Thêm phần mô tả chi tiết khi được chọn */}
                                                                            {isActive && (
                                                                                <div className="card-body pt-0 px-4 pb-4">
                                                                                    <div className="bg-light p-3 rounded-3">
                                                                                        <div className="d-flex align-items-center">
                                                                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                                                            <small className="text-gray-400d">
                                                                                                Đã chọn {method.name} làm phương thức thanh toán
                                                                                            </small>
                                                                                        </div>
                                                                                        {method.code === 'vnpay' && (
                                                                                            <div className="mt-2">
                                                                                                <small className="text-gray-400d">
                                                                                                    • Hỗ trợ các ngân hàng trong nước<br />
                                                                                                    • Thanh toán an toàn, bảo mật<br />
                                                                                                    • Xử lý giao dịch nhanh chóng
                                                                                                </small>
                                                                                            </div>
                                                                                        )}
                                                                                        {method.code === 'momo' && (
                                                                                            <div className="mt-2">
                                                                                                <small className="text-gray-400d">
                                                                                                    • Thanh toán bằng ví MoMo<br />
                                                                                                    • Quét QR Code hoặc nhập số điện thoại<br />
                                                                                                    • Giao dịch tức thì
                                                                                                </small>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-5">
                                                            <i className="bi bi-credit-card-2-front display-4 text-gray-400d mb-3"></i>
                                                            <h5 className="text-gray-400d">Chưa có phương thức thanh toán</h5>
                                                            <p className="text-gray-400d">Vui lòng liên hệ quản trị viên để cấu hình phương thức thanh toán</p>
                                                        </div>
                                                    )}

                                                    {/* Hiển thị thông báo khi chưa chọn phương thức thanh toán */}
                                                    {activeAccordion === null && paymentMethods && paymentMethods.length > 0 && (
                                                        <div className="alert alert-info border-0 mt-3">
                                                            <div className="d-flex align-items-center">
                                                                <i className="bi bi-info-circle me-2"></i>
                                                                <small>Vui lòng chọn một phương thức thanh toán để tiếp tục</small>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Hiển thị lỗi phương thức thanh toán */}
                                                    {errors.payment_method_id && (
                                                        <div className="text-danger small mt-2">
                                                            <i className="bi bi-exclamation-triangle me-1"></i>
                                                            {errors.payment_method_id}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* STEP 2: Xác nhận thông tin */}
                                    {currentStep === 2 && (
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-gradient-primary text-white border-0 p-4">
                                                <h5 className="mb-0 fw-bold d-flex align-items-center">
                                                    <i className="bi bi-check-square me-2"></i>
                                                    Xác nhận thông tin thanh toán
                                                </h5>
                                                <p className="mb-0 mt-1 opacity-75">Vui lòng kiểm tra lại thông tin trước khi thanh toán</p>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-4">
                                                    {/* Thông tin khách hàng */}
                                                    <div className="col-md-6">
                                                        <h6 className="fw-bold mb-3">
                                                            <i className="bi bi-person-check me-2 text-primary"></i>
                                                            Thông tin khách hàng
                                                        </h6>
                                                        <div className="bg-light p-3 rounded-3">
                                                            <div className="row g-2">
                                                                <div className="col-12">
                                                                    <small className="text-gray-400d">Họ và tên:</small>
                                                                    <div className="fw-semibold">{formData.name}</div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <small className="text-gray-400d">Email:</small>
                                                                    <div className="fw-semibold">{formData.email}</div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <small className="text-gray-400d">Quốc gia:</small>
                                                                    <div className="fw-semibold">
                                                                        {formData.country === 'VN' && '🇻🇳 Việt Nam'}
                                                                        {formData.country === 'US' && '🇺🇸 Hoa Kỳ'}
                                                                        {formData.country === 'CN' && '🇨🇳 Trung Quốc'}
                                                                        {formData.country === 'JP' && '🇯🇵 Nhật Bản'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Phương thức thanh toán */}
                                                    <div className="col-md-6">
                                                        <h6 className="fw-bold mb-3">
                                                            <i className="bi bi-credit-card me-2 text-primary"></i>
                                                            Phương thức thanh toán
                                                        </h6>
                                                        <div className="bg-light p-3 rounded-3">
                                                            {getSelectedPaymentMethod() && (
                                                                <div className="d-flex align-items-center">
                                                                    <div className="me-3">
                                                                        <div className="bg-primary rounded-circle p-2">
                                                                            <i className="bi bi-credit-card text-white"></i>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="fw-semibold">{getSelectedPaymentMethod().name}</div>
                                                                        <small className="text-gray-400d">
                                                                            {getSelectedPaymentMethod().code === 'vnpay' && 'Thanh toán qua VNPay'}
                                                                            {getSelectedPaymentMethod().code === 'momo' && 'Ví điện tử MoMo'}
                                                                            {getSelectedPaymentMethod().code === 'zalopay' && 'Ví điện tử ZaloPay'}
                                                                            {getSelectedPaymentMethod().code === 'card' && 'Thẻ tín dụng/ghi nợ'}
                                                                            {getSelectedPaymentMethod().code === 'banking' && 'Chuyển khoản ngân hàng'}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Thông tin khóa học */}
                                                    <div className="col-12">
                                                        <h6 className="fw-bold mb-3">
                                                            <i className="bi bi-book me-2 text-primary"></i>
                                                            Thông tin khóa học
                                                        </h6>
                                                        {course && (
                                                            <div className="bg-light p-3 rounded-3">
                                                                <div className="d-flex">
                                                                    <img
                                                                        className="rounded me-3"
                                                                        src={getCourseImageUrl(course.img_url)}
                                                                        alt={course.title}
                                                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                    />
                                                                    <div className="flex-grow-1">
                                                                        <h6 className="mb-1 fw-bold">{course.title}</h6>
                                                                        <div className="mb-2">
                                                                            {course.categories && course.categories.length > 0 ? (
                                                                                course.categories.slice(0, 2).map((category, index) => (
                                                                                    <span key={index} className="badge bg-primary small me-1">
                                                                                        {category.name}
                                                                                    </span>
                                                                                ))
                                                                            ) : (
                                                                                <span className="badge bg-secondary small">Chưa phân loại</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="fw-bold text-success">{formatPrice(course.price)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="d-flex gap-3 mt-4">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setCurrentStep(1)}
                                                    >
                                                        <i className="bi bi-arrow-left me-2"></i>
                                                        Quay lại chỉnh sửa
                                                    </button>
                                                    <button
                                                        className="btn btn-primary flex-grow-1"
                                                        onClick={handleConfirmAndPay}
                                                    >
                                                        <i className="bi bi-credit-card me-2"></i>
                                                        Xác nhận và bắt đầu thanh toán
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}


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
                                                                <span className="text-gray-400d">
                                                                    <i className="bi bi-tag me-1"></i>Giảm giá
                                                                </span>
                                                                <span className="text-success">-0₫</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-3">
                                                                <span className="text-gray-400d">
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
                                                        {currentStep === 1 && (
                                                            <div className="d-grid mb-3">
                                                                <button
                                                                    className="btn btn-lg btn-primary fw-bold py-3"
                                                                    style={{ borderRadius: '12px' }}
                                                                    onClick={handleCompletePayment}
                                                                >
                                                                    <i className="bi bi-credit-card me-2"></i>
                                                                    Hoàn tất thanh toán
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Money back guarantee */}
                                                        <div className="text-center">
                                                            <div className="d-flex align-items-center justify-content-center text-success mb-2">
                                                                <i className="bi bi-shield-check fs-5 me-2"></i>
                                                                <small className="fw-semibold">Đảm bảo hoàn tiền 30 ngày</small>
                                                            </div>
                                                            <small className="text-gray-400d">
                                                                Bằng cách thanh toán, bạn đồng ý với{" "}
                                                                <Link href="#" className="text-decoration-none fw-semibold">
                                                                    Điều khoản dịch vụ
                                                                </Link>
                                                            </small>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center py-5">
                                                        <i className="bi bi-cart-x display-4 text-gray-400d mb-3"></i>
                                                        <h5 className="text-gray-400d">Chưa có khóa học</h5>
                                                        <p className="text-gray-400d mb-4">Vui lòng chọn khóa học để tiếp tục</p>
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
                </main>
                {/* **************** MAIN CONTENT END **************** */}
            </>
        </UserLayout>
    );
};

export default Checkout;