import React, { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import { useImage } from '../../hooks/useImage'; // Import hook

const CreateCourse = () => {
    const { auth, categories } = usePage().props;
    const [formData, setFormData] = useState({
        title: '',
        category_ids: [],
        price: '',
        description: '',
        instructor_id: auth.user.id,
        course_image: null
    });
    console.log('CreateCourse props:', formData);
    // Use image hook
    const {
        imagePreview,
        imageError,
        isUploading,
        uploadProgress,
        handleImageUpload,
        handleDrop,
        removeImage,
        formatFileSize
    } = useImage();

    // Drag state
    const [isDragging, setIsDragging] = useState(false);

    // Handle file selection
    const onFileSelect = (file, dimensions) => {
        setFormData(prev => ({
            ...prev,
            course_image: file
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // Image upload wrapper
    const handleImageChange = (e) => {
        handleImageUpload(e, onFileSelect);
    };

    // Remove image wrapper
    const handleRemoveImage = () => {
        removeImage('image');
        setFormData(prev => ({
            ...prev,
            course_image: null
        }));
    };

    // Drag handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDropImage = (e) => {
        setIsDragging(false);
        handleDrop(e, onFileSelect);
    };

    function handleSubmit(e) {

        e.preventDefault();
        router.post(route('instructor.courses.store'), formData);
    }
    const stepperRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        let stepperInstance = null;
        let quillInstance = null;

        const initStepper = () => {
            if (window.Stepper && stepperRef.current) {
                stepperInstance = new window.Stepper(stepperRef.current, {
                    linear: false,
                    animation: true
                });

                // Add event listeners for next/previous buttons
                const nextBtns = document.querySelectorAll('.next-btn');
                const prevBtns = document.querySelectorAll('.prev-btn');

                const handleNext = () => {
                    if (stepperInstance) {
                        stepperInstance.next();
                    }
                };

                const handlePrev = () => {
                    if (stepperInstance) {
                        stepperInstance.previous();
                    }
                };

                nextBtns.forEach(btn => {
                    btn.addEventListener('click', handleNext);
                });

                prevBtns.forEach(btn => {
                    btn.addEventListener('click', handlePrev);
                });

                // Store cleanup functions
                stepperRef.current.cleanup = () => {
                    nextBtns.forEach(btn => {
                        btn.removeEventListener('click', handleNext);
                    });
                    prevBtns.forEach(btn => {
                        btn.removeEventListener('click', handlePrev);
                    });
                    stepperInstance = null;
                };
            } else {
                setTimeout(initStepper, 100);
            }
        };

        // Initialize Quill Editor
        const initQuill = () => {
            if (window.Quill && quillRef.current) {
                try {
                    quillInstance = new window.Quill(quillRef.current, {
                        modules: {
                            toolbar: '#quilltoolbar'
                        },
                        placeholder: 'Enter course description...',
                        theme: 'snow'
                    });
                    // Set initial content if exists
                    if (formData.description) {
                        quillInstance.root.innerHTML = formData.description;
                    }
                    // Listen for text changes
                    quillInstance.on('text-change', function () {
                        const content = quillInstance.root.innerHTML;
                        setFormData(prev => ({
                            ...prev,
                            description: content
                        }));
                    });
                } catch (error) {
                    console.error('❌ Error initializing Quill:', error);
                }
            } else {
                console.log('⏳ Quill not ready, retrying...');
                setTimeout(initQuill, 100);
            }
        };

        // Initialize both
        initStepper();
        initQuill();

        return () => {
            if (stepperRef.current && stepperRef.current.cleanup) {
                stepperRef.current.cleanup();
            }
            if (stepperInstance) {
                stepperInstance = null;
            }
            if (quillInstance) {
                quillInstance = null;
            }
        };
    }, []);

    const formatCurrency = (value) => {
        const numericValue = value.replace(/\D/g, '');
        const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formatted;
    };
    const handlePriceChange = (e) => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/[^0-9]/g, '');

        setFormData(prev => ({
            ...prev,
            price: numericValue
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => {
            const currentCategories = prev.category_ids || [];
            const isSelected = currentCategories.includes(categoryId);

            if (isSelected) {
                // Remove category
                return {
                    ...prev,
                    category_ids: currentCategories.filter(id => id !== categoryId)
                };
            } else {
                // Add category
                return {
                    ...prev,
                    category_ids: [...currentCategories, categoryId]
                };
            }
        });
    };
    const isCategorySelected = (categoryId) => {
        return formData.category_ids?.includes(categoryId) || false;
    };

    const [categorySearch, setCategorySearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const itemsPerPage = 9;

    const filteredCategories = categories?.filter(category =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = showAll
        ? filteredCategories
        : filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    return (
        <UserLayout>
            <>
                <main>
                    <section
                        className="py-0 bg-blue h-100px align-items-center d-flex h-200px rounded-0"
                        style={{
                            background: "url(assets/images/pattern/04.png) no-repeat center center",
                            backgroundSize: "cover"
                        }}
                    >
                        {/* Main banner background image */}
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center">
                                    {/* Title */}
                                    <h1 className="text-white">Tạo Một Khóa Học Mới</h1>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* =======================
Page Banner END */}
                    {/* =======================
Steps START */}
                    <section>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-8 mx-auto text-center">
                                    {/* Content */}
                                    <p className="text-center">
                                        Sử dụng giao diện này để thêm Khóa học mới vào cổng thông tin. Sau khi bạn hoàn tất việc thêm mục, mục đó sẽ được xem xét về chất lượng. Nếu được chấp thuận, khóa học của bạn sẽ được rao bán và bạn sẽ được thông báo qua email rằng khóa học của bạn đã được chấp nhận.
                                    </p>
                                </div>
                            </div>
                            <div className="card border rounded-3 mb-5">
                                <div
                                    id="stepper"
                                    className="bs-stepper stepper-outline"
                                    ref={stepperRef}
                                >
                                    {/* Card header */}
                                    <div className="card-header bg-light border-bottom px-lg-5">
                                        {/* Step Buttons START */}
                                        <div className="bs-stepper-header" role="tablist">
                                            {/* Step 1 */}
                                            <div className="step" data-target="#step-1">
                                                <div className="d-grid text-center align-items-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link step-trigger mb-0"
                                                        role="tab"
                                                        id="steppertrigger1"
                                                        aria-controls="step-1"
                                                    >
                                                        <span className="bs-stepper-circle">1</span>
                                                    </button>
                                                    <h6 className="bs-stepper-label d-none d-md-block">
                                                        Chi Tiết Khóa học
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="line" />
                                            {/* Step 2 */}
                                            <div className="step" data-target="#step-2">
                                                <div className="d-grid text-center align-items-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link step-trigger mb-0"
                                                        role="tab"
                                                        id="steppertrigger2"
                                                        aria-controls="step-2"
                                                    >
                                                        <span className="bs-stepper-circle">2</span>
                                                    </button>
                                                    <h6 className="bs-stepper-label d-none d-md-block">
                                                        Hình Ảnh Khóa Học
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="line" />
                                            {/* Step 3 */}
                                            <div className="step" data-target="#step-3">
                                                <div className="d-grid text-center align-items-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link step-trigger mb-0"
                                                        role="tab"
                                                        id="steppertrigger3"
                                                        aria-controls="step-3"
                                                    >
                                                        <span className="bs-stepper-circle">3</span>
                                                    </button>
                                                    <h6 className="bs-stepper-label d-none d-md-block">
                                                        Chờ Duyệt
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Step Buttons END */}
                                    </div>
                                    {/* Card body START */}
                                    <div className="card-body">
                                        <div className="bs-stepper-content">
                                            <form onSubmit={handleSubmit}>
                                                {/* Step 1 content START */}
                                                <div
                                                    id="step-1"
                                                    role="tabpanel"
                                                    className="content fade"
                                                    aria-labelledby="steppertrigger1"
                                                >
                                                    {/* Title */}
                                                    <h4>Chi Tiết Khóa Học</h4>
                                                    <hr /> {/* Divider */}
                                                    {/* Basic information START */}
                                                    <div className="row g-4">
                                                        {/* Course title */}
                                                        <div className="col-12">
                                                            <label className="form-label">Tiêu đề khoá học</label>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Enter course title"
                                                                value={formData.title}
                                                                onChange={handleInputChange}
                                                                id='title'
                                                                name='title'
                                                            />
                                                        </div>

                                                        {/* Course categories - Multiple Select */}
                                                        <div className="col-12">
                                                            <label className="form-label">
                                                                Danh mục khoá học
                                                                <span className="text-black">(Chọn một hoặc nhiều danh mục)</span>
                                                            </label>

                                                            {/* Search box */}
                                                            <div className="mb-3">
                                                                <div className="input-group">
                                                                    <span className="input-group-text">
                                                                        <i className="bi bi-search"></i>
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Tìm kiếm danh mục..."
                                                                        value={categorySearch}
                                                                        onChange={(e) => {
                                                                            setCategorySearch(e.target.value);
                                                                            setCurrentPage(1); // Reset to first page when searching
                                                                        }}
                                                                    />
                                                                    {categorySearch && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-secondary"
                                                                            onClick={() => {
                                                                                setCategorySearch('');
                                                                                setCurrentPage(1);
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-x"></i>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Stats and controls */}
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <div>
                                                                    <small className="text-black">
                                                                        Hiển thị {paginatedCategories.length} trong {filteredCategories.length} danh mục
                                                                        {categorySearch && ` (tìm kiếm: "${categorySearch}")`}
                                                                    </small>
                                                                </div>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => setShowAll(!showAll)}
                                                                    >
                                                                        {showAll ? 'Hiện phân trang' : 'Hiện tất cả'}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-success"
                                                                        onClick={() => setFormData(prev => ({
                                                                            ...prev,
                                                                            category_ids: filteredCategories.map(cat => cat.id)
                                                                        }))}
                                                                    >
                                                                        Chọn tất cả
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        onClick={() => setFormData(prev => ({ ...prev, category_ids: [] }))}
                                                                    >
                                                                        Bỏ chọn
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Selected categories display */}
                                                            {formData.category_ids?.length > 0 && (
                                                                <div className="mb-3">
                                                                    <div className="border rounded p-2 bg-light" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                                        <small className="text-black d-block mb-1">Đã chọn:</small>
                                                                        <div className="d-flex flex-wrap gap-1">
                                                                            {formData.category_ids.map(categoryId => {
                                                                                const category = categories?.find(cat => cat.id === categoryId);
                                                                                return category ? (
                                                                                    <span key={categoryId} className="badge bg-primary">
                                                                                        {category.name}
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn-close btn-close-white ms-1"
                                                                                            style={{ fontSize: '8px' }}
                                                                                            onClick={() => handleCategoryChange(categoryId)}
                                                                                        />
                                                                                    </span>
                                                                                ) : null;
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Categories grid */}
                                                            <div className="border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                                {paginatedCategories.length > 0 ? (
                                                                    <>
                                                                        <div className="row g-2">
                                                                            {paginatedCategories.map((category) => (
                                                                                <div key={category.id} className="col-md-4 col-sm-6">
                                                                                    <div
                                                                                        className={`card h-100 cursor-pointer border ${isCategorySelected(category.id)
                                                                                            ? 'border-primary bg-primary bg-opacity-10'
                                                                                            : 'border-light'
                                                                                            }`}
                                                                                        onClick={() => handleCategoryChange(category.id)}
                                                                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                                                    >
                                                                                        <div className="card-body p-2 text-center">
                                                                                            <div className="form-check">
                                                                                                <input
                                                                                                    className="form-check-input"
                                                                                                    type="checkbox"
                                                                                                    checked={isCategorySelected(category.id)}
                                                                                                    onChange={() => { }}
                                                                                                    style={{ pointerEvents: 'none' }}
                                                                                                />
                                                                                            </div>
                                                                                            <small className="fw-medium">{category.name}</small>
                                                                                            {isCategorySelected(category.id) && (
                                                                                                <i className="bi bi-check-circle-fill text-primary"></i>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        {/* Pagination controls */}
                                                                        {!showAll && totalPages > 1 && (
                                                                            <div className="d-flex justify-content-center mt-3">
                                                                                <nav>
                                                                                    <ul className="pagination pagination-sm">
                                                                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="page-link"
                                                                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                                                                disabled={currentPage === 1}
                                                                                            >
                                                                                                <i className="bi bi-chevron-left"></i>
                                                                                            </button>
                                                                                        </li>

                                                                                        {[...Array(totalPages)].map((_, index) => {
                                                                                            const pageNumber = index + 1;
                                                                                            // Show first, last, current, and adjacent pages
                                                                                            if (
                                                                                                pageNumber === 1 ||
                                                                                                pageNumber === totalPages ||
                                                                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                                                            ) {
                                                                                                return (
                                                                                                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="page-link"
                                                                                                            onClick={() => setCurrentPage(pageNumber)}
                                                                                                        >
                                                                                                            {pageNumber}
                                                                                                        </button>
                                                                                                    </li>
                                                                                                );
                                                                                            } else if (
                                                                                                pageNumber === currentPage - 2 ||
                                                                                                pageNumber === currentPage + 2
                                                                                            ) {
                                                                                                return (
                                                                                                    <li key={pageNumber} className="page-item disabled">
                                                                                                        <span className="page-link">...</span>
                                                                                                    </li>
                                                                                                );
                                                                                            }
                                                                                            return null;
                                                                                        })}

                                                                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="page-link"
                                                                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                                                                disabled={currentPage === totalPages}
                                                                                            >
                                                                                                <i className="bi bi-chevron-right"></i>
                                                                                            </button>
                                                                                        </li>
                                                                                    </ul>
                                                                                </nav>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <div className="text-center py-4">
                                                                        <i className="bi bi-search text-black fs-1"></i>
                                                                        <p className="text-black mb-0">
                                                                            {categorySearch ? 'Không tìm thấy danh mục phù hợp' : 'Không có danh mục nào'}
                                                                        </p>
                                                                        {categorySearch && (
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-primary mt-2"
                                                                                onClick={() => setCategorySearch('')}
                                                                            >
                                                                                Xóa bộ lọc
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Quick stats */}
                                                            <div className="mt-2 d-flex justify-content-between text-black small">
                                                                <span>Tổng cộng: {categories?.length || 0} danh mục</span>
                                                                <span>Đã chọn: {formData.category_ids?.length || 0}</span>
                                                            </div>
                                                        </div>

                                                        {/* Course price */}
                                                        <div className="col-md-6">
                                                            <label className="form-label">Giá khóa học</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formatCurrency(formData.price)}
                                                                    onChange={handlePriceChange}
                                                                    placeholder="0"
                                                                />
                                                                <span className="input-group-text">VNĐ</span>
                                                            </div>
                                                            {/* Hiển thị giá formatted bên dưới */}
                                                            {formData.price && (
                                                                <small className="text-black">
                                                                    Giá: {new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    }).format(formData.price)}
                                                                </small>
                                                            )}
                                                        </div>

                                                        {/* Course description */}
                                                        <div className="col-12">
                                                            <label className="form-label">Mô tả khoá học</label>

                                                            {/* Quill Toolbar */}
                                                            <div
                                                                className="bg-light border border-bottom-0 rounded-top py-3"
                                                                id="quilltoolbar"
                                                            >
                                                                <span className="ql-formats">
                                                                    <select className="ql-size">
                                                                        <option value="small"></option>
                                                                        <option selected></option>
                                                                        <option value="large"></option>
                                                                        <option value="huge"></option>
                                                                    </select>
                                                                </span>
                                                                <span className="ql-formats">
                                                                    <button className="ql-bold"></button>
                                                                    <button className="ql-italic"></button>
                                                                    <button className="ql-underline"></button>
                                                                    <button className="ql-strike"></button>
                                                                </span>
                                                                <span className="ql-formats">
                                                                    <select className="ql-color"></select>
                                                                    <select className="ql-background"></select>
                                                                </span>
                                                                <span className="ql-formats">
                                                                    <button className="ql-code-block"></button>
                                                                </span>
                                                                <span className="ql-formats">
                                                                    <button className="ql-list" value="ordered"></button>
                                                                    <button className="ql-list" value="bullet"></button>
                                                                    <button className="ql-indent" value="-1"></button>
                                                                    <button className="ql-indent" value="+1"></button>
                                                                </span>
                                                                <span className="ql-formats">
                                                                    <button className="ql-link"></button>
                                                                    <button className="ql-image"></button>
                                                                </span>
                                                                <span className="ql-formats">
                                                                    <button className="ql-clean"></button>
                                                                </span>
                                                            </div>

                                                            {/* Quill Editor Container */}
                                                            <div
                                                                className="bg-body border rounded-bottom h-400px overflow-hidden"
                                                                id="quilleditor"
                                                                ref={quillRef}
                                                            >
                                                                {/* Quill will replace this content */}
                                                            </div>
                                                        </div>

                                                        {/* Step 1 button */}
                                                        <div className="d-flex justify-content-end mt-3">
                                                            <button type="button" className="btn btn-primary next-btn mb-0">
                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* Basic information START */}
                                                </div>
                                                {/* Step 1 content END */}
                                                {/* Step 2 content START */}
                                                <div
                                                    id="step-2"
                                                    role="tabpanel"
                                                    className="content fade"
                                                    aria-labelledby="steppertrigger2"
                                                >
                                                    <h4>Hình Ảnh Khóa Học</h4>
                                                    <hr />

                                                    <div className="row">
                                                        {/* Upload section */}
                                                        <div className="col-12">
                                                            {!imagePreview ? (
                                                                // Upload area
                                                                <div
                                                                    className={`text-center justify-content-center align-items-center p-4 p-sm-5 border-2 border-dashed position-relative rounded-3 transition-all ${isDragging
                                                                        ? 'bg-primary bg-opacity-10 border-primary'
                                                                        : 'bg-light border-secondary'
                                                                        }`}
                                                                    onDragOver={handleDragOver}
                                                                    onDragLeave={handleDragLeave}
                                                                    onDrop={handleDropImage}
                                                                >
                                                                    {isUploading ? (
                                                                        // Upload progress
                                                                        <div>
                                                                            <i className="bi bi-cloud-upload text-primary fs-1 mb-3"></i>
                                                                            <h6 className="mb-2">Đang tải ảnh...</h6>
                                                                            <div className="progress mx-auto" style={{ width: '200px' }}>
                                                                                <div
                                                                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                                                                    style={{ width: `${uploadProgress}%` }}
                                                                                ></div>
                                                                            </div>
                                                                            <small className="text-muted">{uploadProgress}%</small>
                                                                        </div>
                                                                    ) : (
                                                                        // Upload prompt
                                                                        <div>
                                                                            <i className={`bi bi-cloud-upload fs-1 mb-3 ${isDragging ? 'text-primary' : 'text-secondary'
                                                                                }`}></i>
                                                                            <h6 className="my-2">
                                                                                {isDragging
                                                                                    ? 'Thả ảnh vào đây'
                                                                                    : 'Kéo thả ảnh vào đây hoặc'
                                                                                }
                                                                                {!isDragging && (
                                                                                    <label htmlFor="image" className="text-primary ms-1" style={{ cursor: "pointer" }}>
                                                                                        chọn file
                                                                                    </label>
                                                                                )}
                                                                            </h6>
                                                                            <input
                                                                                className="form-control d-none"
                                                                                type="file"
                                                                                name="course_image"
                                                                                id="image"
                                                                                accept="image/gif, image/jpeg, image/png"
                                                                                onChange={handleImageChange}
                                                                            />
                                                                            <p className="small mb-0 mt-2 text-muted">
                                                                                <b>Lưu ý:</b> Chỉ hỗ trợ JPG, JPEG, PNG. Kích thước đề xuất: 600px × 450px (tỷ lệ 4:3).
                                                                                <br />Dung lượng tối đa: 5MB
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                // Preview area khi đã có ảnh
                                                                <div className="border rounded-3 p-3">
                                                                    <div className="row">
                                                                        <div className="col-md-8">
                                                                            <div className="position-relative">
                                                                                <img
                                                                                    src={imagePreview}
                                                                                    alt="Course preview"
                                                                                    className="img-fluid rounded-3"
                                                                                    style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                                                                />
                                                                                <div className="position-absolute top-0 end-0 m-2">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-danger"
                                                                                        onClick={handleRemoveImage}
                                                                                        title="Xóa ảnh"
                                                                                    >
                                                                                        <i className="bi bi-x-lg"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="h-100 d-flex flex-column justify-content-center">
                                                                                <h6 className="text-success">
                                                                                    <i className="bi bi-check-circle me-2"></i>
                                                                                    Ảnh đã được tải lên
                                                                                </h6>

                                                                                {formData.course_image && (
                                                                                    <div className="mt-3">
                                                                                        <p className="mb-1">
                                                                                            <strong>Tên file:</strong> {formData.course_image.name}
                                                                                        </p>
                                                                                        <p className="mb-1">
                                                                                            <strong>Kích thước:</strong> {formatFileSize(formData.course_image.size)}
                                                                                        </p>
                                                                                        <p className="mb-1">
                                                                                            <strong>Loại:</strong> {formData.course_image.type}
                                                                                        </p>
                                                                                    </div>
                                                                                )}

                                                                                <div className="mt-3">
                                                                                    <label htmlFor="image-replace" className="btn btn-outline-primary btn-sm">
                                                                                        <i className="bi bi-arrow-repeat me-1"></i>
                                                                                        Thay đổi ảnh
                                                                                    </label>
                                                                                    <input
                                                                                        className="form-control d-none"
                                                                                        type="file"
                                                                                        id="image-replace"
                                                                                        accept="image/gif, image/jpeg, image/png"
                                                                                        onChange={handleImageChange}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Error display */}
                                                            {imageError && (
                                                                <div className="alert alert-warning mt-3">
                                                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                                                    {imageError}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Image guidelines */}
                                                        <div className="col-12 mt-4">
                                                            <div className="alert alert-info">
                                                                <h6 className="alert-heading">
                                                                    <i className="bi bi-info-circle me-2"></i>
                                                                    Hướng dẫn chọn ảnh bìa tốt
                                                                </h6>
                                                                <ul className="mb-0">
                                                                    <li>Sử dụng ảnh chất lượng cao, rõ nét</li>
                                                                    <li>Tỷ lệ khung hình 4:3 (600×450px) để hiển thị tốt nhất</li>
                                                                    <li>Tránh sử dụng quá nhiều text trên ảnh</li>
                                                                    <li>Chọn ảnh phù hợp với nội dung khóa học</li>
                                                                    <li>Đảm bảo ảnh không vi phạm bản quyền</li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Navigation buttons */}
                                                        <div className="d-flex justify-content-between mt-4">
                                                            <button type="button" className="btn btn-secondary prev-btn mb-0">
                                                                <i className="bi bi-arrow-left me-2"></i>
                                                                Quay lại
                                                            </button>
                                                            <button
                                                                className="btn btn-primary next-btn mb-0"
                                                                disabled={!formData.course_image}
                                                                type="button"
                                                            >
                                                                Tiếp tục
                                                                <i className="bi bi-arrow-right ms-2"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Step 2 content END */}
                                                {/* Step 3 content START */}
                                                <div
                                                    id="step-3"
                                                    role="tabpanel"
                                                    className="content fade"
                                                    aria-labelledby="steppertrigger3"
                                                >
                                                    {/* Title */}
                                                    <h4>Chờ Duyệt</h4>
                                                    <hr /> {/* Divider */}
                                                    <div className="row">

                                                        <p> Cảm ơn bạn đã gửi khóa học của mình. Chúng tôi sẽ xem xét và thông báo cho bạn qua email khi khóa học của bạn được phê duyệt.</p>
                                                        {/* Step 3 button */}
                                                        <div className="d-flex justify-content-between">
                                                            <button className="btn btn-secondary prev-btn me-2">
                                                                Previous
                                                            </button>
                                                            <div className="text-end">
                                                                <button type="submit" className="btn btn-success mb-0">
                                                                    <i className="bi bi-check-circle me-2"></i>
                                                                    Submit Course
                                                                </button>
                                                                <p className="mb-0 small mt-1 text-black">
                                                                    Your course will be reviewed before publishing
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Step 3 content END */}

                                            </form>
                                        </div>
                                    </div>
                                    {/* Card body END */}
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* =======================
Steps END */}
                </main>
                {/* **************** MAIN CONTENT END **************** */}
                {/* =======================
Footer START */}
                {/* =======================
Footer END */}
                {/* Popup modal for add lecture START */}
                <div
                    className="modal fade"
                    id="addLecture"
                    tabIndex={-1}
                    aria-labelledby="addLectureLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-dark">
                                <h5 className="modal-title text-white" id="addLectureLabel">
                                    Add Lecture
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-light mb-0"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <i className="bi bi-x-lg" />
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="row text-start g-3">
                                    {/* Course name */}
                                    <div className="col-12">
                                        <label className="form-label">
                                            Course name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter course name"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger-soft my-0"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button type="button" className="btn btn-success my-0">
                                    Save Lecture
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Popup modal for add lecture END */}
                {/* Popup modal for add topic START */}
                <div
                    className="modal fade"
                    id="addTopic"
                    tabIndex={-1}
                    aria-labelledby="addTopicLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-dark">
                                <h5 className="modal-title text-white" id="addTopicLabel">
                                    Add topic
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-light mb-0"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <i className="bi bi-x-lg" />
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="row text-start g-3">
                                    {/* Topic name */}
                                    <div className="col-md-6">
                                        <label className="form-label">Topic name</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter topic name"
                                        />
                                    </div>
                                    {/* Video link */}
                                    <div className="col-md-6">
                                        <label className="form-label">Video link</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter Video link"
                                        />
                                    </div>
                                    {/* Description */}
                                    <div className="col-12 mt-3">
                                        <label className="form-label">Course description</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            placeholder=""
                                            spellCheck="false"
                                            defaultValue={""}
                                        />
                                    </div>
                                    {/* Buttons */}
                                    <div className="col-6 mt-3">
                                        <div
                                            className="btn-group"
                                            role="group"
                                            aria-label="Basic radio toggle button group"
                                        >
                                            {/* Free button */}
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="options"
                                                id="option1"
                                                defaultChecked=""
                                            />
                                            <label
                                                className="btn btn-sm btn-light btn-primary-soft-check border-0 m-0"
                                                htmlFor="option1"
                                            >
                                                Free
                                            </label>
                                            {/* Premium button */}
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="options"
                                                id="option2"
                                            />
                                            <label
                                                className="btn btn-sm btn-light btn-primary-soft-check border-0 m-0"
                                                htmlFor="option2"
                                            >
                                                Premium
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger-soft my-0"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button type="button" className="btn btn-success my-0">
                                    Save topic
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Popup modal for add topic END */}
                {/* Popup modal for add faq START */}
                <div
                    className="modal fade"
                    id="addQuestion"
                    tabIndex={-1}
                    aria-labelledby="addQuestionLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-dark">
                                <h5 className="modal-title text-white" id="addQuestionLabel">
                                    Add FAQ
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-light mb-0"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <i className="bi bi-x-lg" />
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="row text-start g-3">
                                    {/* Question */}
                                    <div className="col-12">
                                        <label className="form-label">Question</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Write a question"
                                        />
                                    </div>
                                    {/* Answer */}
                                    <div className="col-12 mt-3">
                                        <label className="form-label">Answer</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            placeholder="Write a answer"
                                            spellCheck="false"
                                            defaultValue={""}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger-soft my-0"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button type="button" className="btn btn-success my-0">
                                    Save topic
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Popup modal for add faq END */}
            </>

        </UserLayout>
    );
}
export default CreateCourse;