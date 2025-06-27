import React, { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import { useImage } from "@/hooks/useImage";

const AdminCreateCourse = () => {
    const { auth, categories, instructors, flash_error, old, errors } =
        usePage().props;

    const [formData, setFormData] = useState({
        title: old?.title || "",
        category_ids: old?.category_ids || [],
        price: old?.price || "",
        description: old?.description || "",
        instructor_id: auth.user.id,
        course_image: null,
        status: old?.status || "inactive",
    });

    const {
        imagePreview,
        imageError,
        isUploading,
        uploadProgress,
        handleImageUpload,
        handleDrop,
        removeImage,
        formatFileSize,
    } = useImage();

    const [isDragging, setIsDragging] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(false);

    const stepperRef = useRef(null);
    const quillRef = useRef(null);
    const itemsPerPage = 9;

    // Event handlers
    const onFileSelect = (file, dimensions) => {
        setFormData((prev) => ({ ...prev, course_image: file }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        handleImageUpload(e, onFileSelect);
    };

    const handleRemoveImage = () => {
        removeImage("image");
        setFormData((prev) => ({ ...prev, course_image: null }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("admin.courses.store"), formData);
    };

    const formatCurrency = (value) => {
        const numericValue = value.replace(/\D/g, "");
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handlePriceChange = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, "");
        setFormData((prev) => ({ ...prev, price: numericValue }));
    };

    const handleCategoryChange = (categoryId) => {
        setFormData((prev) => {
            const currentCategories = prev.category_ids || [];
            const isSelected = currentCategories.includes(categoryId);

            return {
                ...prev,
                category_ids: isSelected
                    ? currentCategories.filter((id) => id !== categoryId)
                    : [...currentCategories, categoryId],
            };
        });
    };

    const isCategorySelected = (categoryId) => {
        return formData.category_ids?.includes(categoryId) || false;
    };

    // Category filtering and pagination
    const filteredCategories =
        categories?.filter((category) =>
            category.name.toLowerCase().includes(categorySearch.toLowerCase())
        ) || [];

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = showAll
        ? filteredCategories
        : filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    // Initialize Stepper and Quill
    useEffect(() => {
        let stepperInstance = null;
        let quillInstance = null;

        const initStepper = () => {
            if (window.Stepper && stepperRef.current) {
                stepperInstance = new window.Stepper(stepperRef.current, {
                    linear: false,
                    animation: true,
                });

                const nextBtns = document.querySelectorAll(".next-btn");
                const prevBtns = document.querySelectorAll(".prev-btn");

                // Function to scroll to center of stepper
                const scrollToStepper = () => {
                    setTimeout(() => {
                        if (stepperRef.current) {
                            const stepperTop = stepperRef.current.offsetTop;
                            const stepperHeight =
                                stepperRef.current.offsetHeight;
                            const windowHeight = window.innerHeight;

                            // Tính toán vị trí để stepper ở giữa màn hình
                            const scrollPosition =
                                stepperTop -
                                windowHeight / 2 +
                                stepperHeight / 2;

                            window.scrollTo({
                                top: Math.max(0, scrollPosition),
                                behavior: "smooth",
                            });
                        }
                    }, 150);
                };

                const handleNext = () => {
                    stepperInstance?.next();
                    scrollToStepper();
                };

                const handlePrev = () => {
                    stepperInstance?.previous();
                    scrollToStepper();
                };

                // Listen for stepper events
                stepperRef.current.addEventListener(
                    "shown.bs-stepper",
                    scrollToStepper
                );

                nextBtns.forEach((btn) =>
                    btn.addEventListener("click", handleNext)
                );
                prevBtns.forEach((btn) =>
                    btn.addEventListener("click", handlePrev)
                );

                stepperRef.current.cleanup = () => {
                    nextBtns.forEach((btn) =>
                        btn.removeEventListener("click", handleNext)
                    );
                    prevBtns.forEach((btn) =>
                        btn.removeEventListener("click", handlePrev)
                    );
                    stepperRef.current?.removeEventListener(
                        "shown.bs-stepper",
                        scrollToStepper
                    );
                };
            } else {
                setTimeout(initStepper, 100);
            }
        };

        const initQuill = () => {
            if (window.Quill && quillRef.current) {
                try {
                    quillInstance = new window.Quill(quillRef.current, {
                        modules: { toolbar: "#quilltoolbar" },
                        placeholder: "Enter course description...",
                        theme: "snow",
                    });

                    if (formData.description) {
                        quillInstance.root.innerHTML = formData.description;
                    }

                    quillInstance.on("text-change", () => {
                        const content = quillInstance.root.innerHTML;
                        setFormData((prev) => ({
                            ...prev,
                            description: content,
                        }));
                    });
                } catch (error) {
                    console.error("❌ Error initializing Quill:", error);
                }
            } else {
                setTimeout(initQuill, 100);
            }
        };

        initStepper();
        initQuill();

        return () => {
            if (stepperRef.current?.cleanup) {
                stepperRef.current.cleanup();
            }
            stepperInstance = null;
            quillInstance = null;
        };
    }, []);

    return (
        <AdminLayout>
            <main>
                {/* Error Messages */}
                {flash_error && (
                    <div
                        className="alert alert-danger alert-dismissible fade show"
                        role="alert"
                    >
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {flash_error}
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                        ></button>
                    </div>
                )}

                {errors && Object.keys(errors).length > 0 && (
                    <div
                        className="alert alert-danger alert-dismissible fade show"
                        role="alert"
                    >
                        <h6 className="alert-heading">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Có lỗi xảy ra khi tạo khóa học:
                        </h6>
                        <ul className="mb-0">
                            {Object.entries(errors).map(([field, messages]) => (
                                <li key={field}>
                                    <strong>
                                        {field === "title"
                                            ? "Tiêu đề"
                                            : field === "category_ids"
                                            ? "Danh mục"
                                            : field === "price"
                                            ? "Giá"
                                            : field === "description"
                                            ? "Mô tả"
                                            : field === "course_image"
                                            ? "Hình ảnh"
                                            : field === "general"
                                            ? "Chung"
                                            : field}
                                        :
                                    </strong>{" "}
                                    {Array.isArray(messages)
                                        ? messages.join(", ")
                                        : messages}
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                        ></button>
                    </div>
                )}

                {/* Banner */}
                <section
                    className="py-0 bg-blue h-100px align-items-center d-flex h-200px rounded-0"
                    style={{
                        background:
                            "url(assets/images/pattern/04.png) no-repeat center center",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center">
                                <h1 className="text-white">
                                    Tạo Một Khóa Học Mới
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section>
                    <div className="container">
                        <div className="card border rounded-3 mb-5">
                            <div
                                id="stepper"
                                className="bs-stepper stepper-outline"
                                ref={stepperRef}
                            >
                                {/* Stepper Header */}
                                <div className="card-header bg-light border-bottom px-lg-5">
                                    <div
                                        className="bs-stepper-header"
                                        role="tablist"
                                    >
                                        <div
                                            className="step"
                                            data-target="#step-1"
                                        >
                                            <div className="d-grid text-center align-items-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-link step-trigger mb-0"
                                                    role="tab"
                                                    id="steppertrigger1"
                                                    aria-controls="step-1"
                                                >
                                                    <span className="bs-stepper-circle">
                                                        1
                                                    </span>
                                                </button>
                                                <h6 className="bs-stepper-label d-none d-md-block">
                                                    Chi Tiết Khóa học
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="line" />
                                        <div
                                            className="step"
                                            data-target="#step-2"
                                        >
                                            <div className="d-grid text-center align-items-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-link step-trigger mb-0"
                                                    role="tab"
                                                    id="steppertrigger2"
                                                    aria-controls="step-2"
                                                >
                                                    <span className="bs-stepper-circle">
                                                        2
                                                    </span>
                                                </button>
                                                <h6 className="bs-stepper-label d-none d-md-block">
                                                    Hình Ảnh Khóa Học{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="line" />
                                        <div
                                            className="step"
                                            data-target="#step-3"
                                        >
                                            <div className="d-grid text-center align-items-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-link step-trigger mb-0"
                                                    role="tab"
                                                    id="steppertrigger3"
                                                    aria-controls="step-3"
                                                >
                                                    <span className="bs-stepper-circle">
                                                        3
                                                    </span>
                                                </button>
                                                <h6 className="bs-stepper-label d-none d-md-block">
                                                    Hoàn Thành
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stepper Content */}
                                <div className="card-body">
                                    <div className="bs-stepper-content">
                                        <form onSubmit={handleSubmit}>
                                            {/* Step 1: Course Details */}
                                            <div
                                                id="step-1"
                                                role="tabpanel"
                                                className="content fade"
                                                aria-labelledby="steppertrigger1"
                                            >
                                                <h4>Chi Tiết Khóa Học</h4>
                                                <hr />

                                                <div className="row g-4">
                                                    {/* Course Title */}
                                                    <div className="col-12">
                                                        <label className="form-label">
                                                            Tiêu đề khoá học
                                                        </label>
                                                        <input
                                                            className={`form-control ${
                                                                errors?.title
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            type="text"
                                                            placeholder="Enter course title"
                                                            value={
                                                                formData.title
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            name="title"
                                                        />
                                                        {errors?.title && (
                                                            <div className="invalid-feedback">
                                                                {Array.isArray(
                                                                    errors.title
                                                                )
                                                                    ? errors
                                                                          .title[0]
                                                                    : errors.title}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Categories */}
                                                    <div className="col-12">
                                                        <label className="form-label">
                                                            Danh mục khoá học
                                                            <span className="text-muted">
                                                                (Chọn một hoặc
                                                                nhiều danh mục)
                                                            </span>
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
                                                                    value={
                                                                        categorySearch
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setCategorySearch(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                        setCurrentPage(
                                                                            1
                                                                        );
                                                                    }}
                                                                />
                                                                {categorySearch && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary"
                                                                        onClick={() => {
                                                                            setCategorySearch(
                                                                                ""
                                                                            );
                                                                            setCurrentPage(
                                                                                1
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-x"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Controls */}
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <small className="text-muted">
                                                                Hiển thị{" "}
                                                                {
                                                                    paginatedCategories.length
                                                                }{" "}
                                                                trong{" "}
                                                                {
                                                                    filteredCategories.length
                                                                }{" "}
                                                                danh mục
                                                                {categorySearch &&
                                                                    ` (tìm kiếm: "${categorySearch}")`}
                                                            </small>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        setShowAll(
                                                                            !showAll
                                                                        )
                                                                    }
                                                                >
                                                                    {showAll
                                                                        ? "Hiện phân trang"
                                                                        : "Hiện tất cả"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-success"
                                                                    onClick={() =>
                                                                        setFormData(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                category_ids:
                                                                                    filteredCategories.map(
                                                                                        (
                                                                                            cat
                                                                                        ) =>
                                                                                            cat.id
                                                                                    ),
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    Chọn tất cả
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() =>
                                                                        setFormData(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                category_ids:
                                                                                    [],
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    Bỏ chọn
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Selected categories */}
                                                        {formData.category_ids
                                                            ?.length > 0 && (
                                                            <div className="mb-3">
                                                                <div
                                                                    className="border rounded p-2 bg-light"
                                                                    style={{
                                                                        maxHeight:
                                                                            "100px",
                                                                        overflowY:
                                                                            "auto",
                                                                    }}
                                                                >
                                                                    <small className="text-muted d-block mb-1">
                                                                        Đã chọn:
                                                                    </small>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {formData.category_ids.map(
                                                                            (
                                                                                categoryId
                                                                            ) => {
                                                                                const category =
                                                                                    categories?.find(
                                                                                        (
                                                                                            cat
                                                                                        ) =>
                                                                                            cat.id ===
                                                                                            categoryId
                                                                                    );
                                                                                return category ? (
                                                                                    <span
                                                                                        key={
                                                                                            categoryId
                                                                                        }
                                                                                        className="badge bg-primary"
                                                                                    >
                                                                                        {
                                                                                            category.name
                                                                                        }
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn-close btn-close-white ms-1"
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    "8px",
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                handleCategoryChange(
                                                                                                    categoryId
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                ) : null;
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Categories grid */}
                                                        <div
                                                            className="border rounded p-3"
                                                            style={{
                                                                maxHeight:
                                                                    "400px",
                                                                overflowY:
                                                                    "auto",
                                                            }}
                                                        >
                                                            {paginatedCategories.length >
                                                            0 ? (
                                                                <>
                                                                    <div className="row g-2">
                                                                        {paginatedCategories.map(
                                                                            (
                                                                                category
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        category.id
                                                                                    }
                                                                                    className="col-md-4 col-sm-6"
                                                                                >
                                                                                    <div
                                                                                        className={`card h-100 cursor-pointer border ${
                                                                                            isCategorySelected(
                                                                                                category.id
                                                                                            )
                                                                                                ? "border-primary bg-primary bg-opacity-10"
                                                                                                : "border-light"
                                                                                        }`}
                                                                                        onClick={() =>
                                                                                            handleCategoryChange(
                                                                                                category.id
                                                                                            )
                                                                                        }
                                                                                        style={{
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                    >
                                                                                        <div className="card-body p-2 text-center">
                                                                                            <div className="form-check">
                                                                                                <input
                                                                                                    className="form-check-input"
                                                                                                    type="checkbox"
                                                                                                    checked={isCategorySelected(
                                                                                                        category.id
                                                                                                    )}
                                                                                                    onChange={() => {}}
                                                                                                    style={{
                                                                                                        pointerEvents:
                                                                                                            "none",
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                            <small className="fw-medium">
                                                                                                {
                                                                                                    category.name
                                                                                                }
                                                                                            </small>
                                                                                            {isCategorySelected(
                                                                                                category.id
                                                                                            ) && (
                                                                                                <i className="bi bi-check-circle-fill text-primary"></i>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>

                                                                    {/* Pagination */}
                                                                    {!showAll &&
                                                                        totalPages >
                                                                            1 && (
                                                                            <div className="d-flex justify-content-center mt-3">
                                                                                <nav>
                                                                                    <ul className="pagination pagination-sm">
                                                                                        <li
                                                                                            className={`page-item ${
                                                                                                currentPage ===
                                                                                                1
                                                                                                    ? "disabled"
                                                                                                    : ""
                                                                                            }`}
                                                                                        >
                                                                                            <button
                                                                                                type="button"
                                                                                                className="page-link"
                                                                                                onClick={() =>
                                                                                                    setCurrentPage(
                                                                                                        currentPage -
                                                                                                            1
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    currentPage ===
                                                                                                    1
                                                                                                }
                                                                                            >
                                                                                                <i className="bi bi-chevron-left"></i>
                                                                                            </button>
                                                                                        </li>

                                                                                        {[
                                                                                            ...Array(
                                                                                                totalPages
                                                                                            ),
                                                                                        ].map(
                                                                                            (
                                                                                                _,
                                                                                                index
                                                                                            ) => {
                                                                                                const pageNumber =
                                                                                                    index +
                                                                                                    1;
                                                                                                if (
                                                                                                    pageNumber ===
                                                                                                        1 ||
                                                                                                    pageNumber ===
                                                                                                        totalPages ||
                                                                                                    (pageNumber >=
                                                                                                        currentPage -
                                                                                                            1 &&
                                                                                                        pageNumber <=
                                                                                                            currentPage +
                                                                                                                1)
                                                                                                ) {
                                                                                                    return (
                                                                                                        <li
                                                                                                            key={
                                                                                                                pageNumber
                                                                                                            }
                                                                                                            className={`page-item ${
                                                                                                                currentPage ===
                                                                                                                pageNumber
                                                                                                                    ? "active"
                                                                                                                    : ""
                                                                                                            }`}
                                                                                                        >
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                className="page-link"
                                                                                                                onClick={() =>
                                                                                                                    setCurrentPage(
                                                                                                                        pageNumber
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                {
                                                                                                                    pageNumber
                                                                                                                }
                                                                                                            </button>
                                                                                                        </li>
                                                                                                    );
                                                                                                } else if (
                                                                                                    pageNumber ===
                                                                                                        currentPage -
                                                                                                            2 ||
                                                                                                    pageNumber ===
                                                                                                        currentPage +
                                                                                                            2
                                                                                                ) {
                                                                                                    return (
                                                                                                        <li
                                                                                                            key={
                                                                                                                pageNumber
                                                                                                            }
                                                                                                            className="page-item disabled"
                                                                                                        >
                                                                                                            <span className="page-link">
                                                                                                                ...
                                                                                                            </span>
                                                                                                        </li>
                                                                                                    );
                                                                                                }
                                                                                                return null;
                                                                                            }
                                                                                        )}

                                                                                        <li
                                                                                            className={`page-item ${
                                                                                                currentPage ===
                                                                                                totalPages
                                                                                                    ? "disabled"
                                                                                                    : ""
                                                                                            }`}
                                                                                        >
                                                                                            <button
                                                                                                type="button"
                                                                                                className="page-link"
                                                                                                onClick={() =>
                                                                                                    setCurrentPage(
                                                                                                        currentPage +
                                                                                                            1
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    currentPage ===
                                                                                                    totalPages
                                                                                                }
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
                                                                    <i className="bi bi-search text-muted fs-1"></i>
                                                                    <p className="text-muted mb-0">
                                                                        {categorySearch
                                                                            ? "Không tìm thấy danh mục phù hợp"
                                                                            : "Không có danh mục nào"}
                                                                    </p>
                                                                    {categorySearch && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-primary mt-2"
                                                                            onClick={() =>
                                                                                setCategorySearch(
                                                                                    ""
                                                                                )
                                                                            }
                                                                        >
                                                                            Xóa
                                                                            bộ
                                                                            lọc
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="mt-2 d-flex justify-content-between text-muted small">
                                                            <span>
                                                                Tổng cộng:{" "}
                                                                {categories?.length ||
                                                                    0}{" "}
                                                                danh mục
                                                            </span>
                                                            <span>
                                                                Đã chọn:{" "}
                                                                {formData
                                                                    .category_ids
                                                                    ?.length ||
                                                                    0}
                                                            </span>
                                                        </div>

                                                        {errors?.category_ids && (
                                                            <div className="text-danger mt-2">
                                                                <small>
                                                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                                                    {Array.isArray(
                                                                        errors.category_ids
                                                                    )
                                                                        ? errors
                                                                              .category_ids[0]
                                                                        : errors.category_ids}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-md-6">
                                                        <label className="form-label">
                                                            Giá khóa học
                                                        </label>
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                className={`form-control ${
                                                                    errors?.price
                                                                        ? "is-invalid"
                                                                        : ""
                                                                }`}
                                                                value={formatCurrency(
                                                                    formData.price
                                                                )}
                                                                onChange={
                                                                    handlePriceChange
                                                                }
                                                                placeholder="0"
                                                            />
                                                            <span className="input-group-text">
                                                                VNĐ
                                                            </span>
                                                            {errors?.price && (
                                                                <div className="invalid-feedback">
                                                                    {Array.isArray(
                                                                        errors.price
                                                                    )
                                                                        ? errors
                                                                              .price[0]
                                                                        : errors.price}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {formData.price && (
                                                            <small className="text-muted">
                                                                Giá:{" "}
                                                                {new Intl.NumberFormat(
                                                                    "vi-VN",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "VND",
                                                                    }
                                                                ).format(
                                                                    formData.price
                                                                )}
                                                            </small>
                                                        )}
                                                    </div>
                                                    {/* Instructor Selection */}
                                                    <div className="col-md-6">
                                                        <label className="form-label">
                                                            Chọn Giảng viên
                                                        </label>
                                                        <select
                                                            name="instructor_id"
                                                            className={`form-select ${
                                                                errors?.instructor_id
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            value={
                                                                formData.instructor_id
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                        >
                                                            <option value="">
                                                                -- Chọn giảng
                                                                viên --
                                                            </option>
                                                            {instructors?.map(
                                                                (
                                                                    instructor
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            instructor.id
                                                                        }
                                                                        value={
                                                                            instructor.id
                                                                        }
                                                                    >
                                                                        {
                                                                            instructor.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                        {errors?.instructor_id && (
                                                            <div className="invalid-feedback">
                                                                {Array.isArray(
                                                                    errors.instructor_id
                                                                )
                                                                    ? errors
                                                                          .instructor_id[0]
                                                                    : errors.instructor_id}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">
                                                            Trạng thái khóa học
                                                        </label>
                                                        <select
                                                            name="status"
                                                            className={`form-select ${
                                                                errors?.status
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            value={
                                                                formData.status
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                        >
                                                            <option value="pending">
                                                                Chờ duyệt
                                                            </option>
                                                            <option value="active">
                                                                Đang hoạt động
                                                            </option>
                                                            <option value="inactive">
                                                                Không hoạt động
                                                            </option>
                                                            <option value="suspended">
                                                                Tạm khóa
                                                            </option>
                                                        </select>
                                                        {errors?.status && (
                                                            <div className="invalid-feedback">
                                                                {Array.isArray(
                                                                    errors.status
                                                                )
                                                                    ? errors
                                                                          .status[0]
                                                                    : errors.status}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Description */}
                                                    <div className="col-12">
                                                        <label className="form-label">
                                                            Mô tả khoá học
                                                        </label>

                                                        {/* Quill Toolbar */}
                                                        <div
                                                            className="bg-light border border-bottom-0 rounded-top py-3"
                                                            id="quilltoolbar"
                                                        >
                                                            <span className="ql-formats">
                                                                <select className="ql-size">
                                                                    <option value="small"></option>
                                                                    <option
                                                                        selected
                                                                    ></option>
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
                                                                <button
                                                                    className="ql-list"
                                                                    value="ordered"
                                                                ></button>
                                                                <button
                                                                    className="ql-list"
                                                                    value="bullet"
                                                                ></button>
                                                                <button
                                                                    className="ql-indent"
                                                                    value="-1"
                                                                ></button>
                                                                <button
                                                                    className="ql-indent"
                                                                    value="+1"
                                                                ></button>
                                                            </span>
                                                            <span className="ql-formats">
                                                                <button className="ql-link"></button>
                                                                <button className="ql-image"></button>
                                                            </span>
                                                            <span className="ql-formats">
                                                                <button className="ql-clean"></button>
                                                            </span>
                                                        </div>

                                                        <div
                                                            className="bg-body border rounded-bottom h-400px overflow-hidden"
                                                            ref={quillRef}
                                                        ></div>

                                                        {errors?.description && (
                                                            <div className="text-danger mt-2">
                                                                <small>
                                                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                                                    {Array.isArray(
                                                                        errors.description
                                                                    )
                                                                        ? errors
                                                                              .description[0]
                                                                        : errors.description}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="d-flex justify-content-end mt-3">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary next-btn mb-0"
                                                        >
                                                            Tiếp tục
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Step 2: Image Upload */}
                                            <div
                                                id="step-2"
                                                role="tabpanel"
                                                className="content fade"
                                                aria-labelledby="steppertrigger2"
                                            >
                                                <h4>
                                                    Hình Ảnh Khóa Học{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </h4>
                                                <hr />

                                                {errors?.course_image && (
                                                    <div className="alert alert-danger">
                                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                                        <strong>
                                                            Bắt buộc:
                                                        </strong>{" "}
                                                        {Array.isArray(
                                                            errors.course_image
                                                        )
                                                            ? errors
                                                                  .course_image[0]
                                                            : errors.course_image}
                                                    </div>
                                                )}

                                                <div className="row">
                                                    <div className="col-12">
                                                        {!imagePreview ? (
                                                            <div
                                                                className={`text-center justify-content-center align-items-center p-4 p-sm-5 border-2 border-dashed position-relative rounded-3 ${
                                                                    errors?.course_image
                                                                        ? "bg-danger bg-opacity-10 border-danger"
                                                                        : isDragging
                                                                        ? "bg-primary bg-opacity-10 border-primary"
                                                                        : "bg-light border-secondary"
                                                                }`}
                                                                onDragOver={
                                                                    handleDragOver
                                                                }
                                                                onDragLeave={
                                                                    handleDragLeave
                                                                }
                                                                onDrop={
                                                                    handleDropImage
                                                                }
                                                            >
                                                                <div className="position-absolute top-0 start-0 m-2">
                                                                    <span className="badge bg-danger">
                                                                        Bắt buộc
                                                                    </span>
                                                                </div>

                                                                {isUploading ? (
                                                                    <div>
                                                                        <i className="bi bi-cloud-upload text-primary fs-1 mb-3"></i>
                                                                        <h6 className="mb-2">
                                                                            Đang
                                                                            tải
                                                                            ảnh...
                                                                        </h6>
                                                                        <div
                                                                            className="progress mx-auto"
                                                                            style={{
                                                                                width: "200px",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className="progress-bar progress-bar-striped progress-bar-animated"
                                                                                style={{
                                                                                    width: `${uploadProgress}%`,
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        <small className="text-muted">
                                                                            {
                                                                                uploadProgress
                                                                            }
                                                                            %
                                                                        </small>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <i
                                                                            className={`bi bi-cloud-upload fs-1 mb-3 ${
                                                                                errors?.course_image
                                                                                    ? "text-danger"
                                                                                    : isDragging
                                                                                    ? "text-primary"
                                                                                    : "text-secondary"
                                                                            }`}
                                                                        ></i>
                                                                        <h6 className="my-2">
                                                                            {isDragging
                                                                                ? "Thả ảnh vào đây"
                                                                                : "Kéo thả ảnh vào đây hoặc"}
                                                                            {!isDragging && (
                                                                                <label
                                                                                    htmlFor="image"
                                                                                    className="text-primary ms-1"
                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                >
                                                                                    chọn
                                                                                    file
                                                                                </label>
                                                                            )}
                                                                        </h6>
                                                                        <input
                                                                            className="form-control d-none"
                                                                            type="file"
                                                                            name="course_image"
                                                                            id="image"
                                                                            accept="image/gif, image/jpeg, image/png"
                                                                            onChange={
                                                                                handleImageChange
                                                                            }
                                                                        />
                                                                        <p className="small mb-0 mt-2 text-muted">
                                                                            <b>
                                                                                Lưu
                                                                                ý:
                                                                            </b>{" "}
                                                                            Chỉ
                                                                            hỗ
                                                                            trợ
                                                                            JPG,
                                                                            JPEG,
                                                                            PNG.
                                                                            Kích
                                                                            thước
                                                                            đề
                                                                            xuất:
                                                                            600px
                                                                            ×
                                                                            450px
                                                                            (tỷ
                                                                            lệ
                                                                            4:3).
                                                                            <br />
                                                                            Dung
                                                                            lượng
                                                                            tối
                                                                            đa:
                                                                            2MB
                                                                            <br />
                                                                            <span className="text-danger">
                                                                                <strong>
                                                                                    *
                                                                                    Bắt
                                                                                    buộc
                                                                                    phải
                                                                                    có
                                                                                    ảnh
                                                                                    bìa
                                                                                </strong>
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="border rounded-3 p-3 border-success">
                                                                <div className="row">
                                                                    <div className="col-md-8">
                                                                        <div className="position-relative">
                                                                            <img
                                                                                src={
                                                                                    imagePreview
                                                                                }
                                                                                alt="Course preview"
                                                                                className="img-fluid rounded-3"
                                                                                style={{
                                                                                    maxHeight:
                                                                                        "300px",
                                                                                    width: "100%",
                                                                                    objectFit:
                                                                                        "cover",
                                                                                }}
                                                                            />
                                                                            <div className="position-absolute top-0 end-0 m-2">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-danger"
                                                                                    onClick={
                                                                                        handleRemoveImage
                                                                                    }
                                                                                    title="Xóa ảnh"
                                                                                >
                                                                                    <i className="bi bi-x-lg"></i>
                                                                                </button>
                                                                            </div>
                                                                            <div className="position-absolute top-0 start-0 m-2">
                                                                                <span className="badge bg-success">
                                                                                    <i className="bi bi-check-circle me-1"></i>
                                                                                    Đã
                                                                                    tải
                                                                                    lên
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="h-100 d-flex flex-column justify-content-center">
                                                                            <h6 className="text-success">
                                                                                <i className="bi bi-check-circle me-2"></i>
                                                                                Ảnh
                                                                                đã
                                                                                được
                                                                                tải
                                                                                lên
                                                                                thành
                                                                                công
                                                                            </h6>

                                                                            {formData.course_image && (
                                                                                <div className="mt-3">
                                                                                    <p className="mb-1">
                                                                                        <strong>
                                                                                            Tên
                                                                                            file:
                                                                                        </strong>{" "}
                                                                                        {
                                                                                            formData
                                                                                                .course_image
                                                                                                .name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="mb-1">
                                                                                        <strong>
                                                                                            Kích
                                                                                            thước:
                                                                                        </strong>{" "}
                                                                                        {formatFileSize(
                                                                                            formData
                                                                                                .course_image
                                                                                                .size
                                                                                        )}
                                                                                    </p>
                                                                                    <p className="mb-1">
                                                                                        <strong>
                                                                                            Loại:
                                                                                        </strong>{" "}
                                                                                        {
                                                                                            formData
                                                                                                .course_image
                                                                                                .type
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            <div className="mt-3">
                                                                                <label
                                                                                    htmlFor="image-replace"
                                                                                    className="btn btn-outline-primary btn-sm"
                                                                                >
                                                                                    <i className="bi bi-arrow-repeat me-1"></i>
                                                                                    Thay
                                                                                    đổi
                                                                                    ảnh
                                                                                </label>
                                                                                <input
                                                                                    className="form-control d-none"
                                                                                    type="file"
                                                                                    id="image-replace"
                                                                                    accept="image/gif, image/jpeg, image/png"
                                                                                    onChange={
                                                                                        handleImageChange
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {imageError && (
                                                            <div className="alert alert-warning mt-3">
                                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                                {imageError}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="col-12 mt-4">
                                                        <div className="alert alert-info">
                                                            <h6 className="alert-heading">
                                                                <i className="bi bi-info-circle me-2"></i>
                                                                Hướng dẫn chọn
                                                                ảnh bìa (Bắt
                                                                buộc)
                                                            </h6>
                                                            <ul className="mb-0">
                                                                <li>
                                                                    <strong>
                                                                        Bắt
                                                                        buộc:
                                                                    </strong>{" "}
                                                                    Mỗi khóa học
                                                                    phải có ảnh
                                                                    bìa
                                                                </li>
                                                                <li>
                                                                    Sử dụng ảnh
                                                                    chất lượng
                                                                    cao, rõ nét
                                                                </li>
                                                                <li>
                                                                    Tỷ lệ khung
                                                                    hình 4:3
                                                                    (600×450px)
                                                                    để hiển thị
                                                                    tốt nhất
                                                                </li>
                                                                <li>
                                                                    Tránh sử
                                                                    dụng quá
                                                                    nhiều text
                                                                    trên ảnh
                                                                </li>
                                                                <li>
                                                                    Chọn ảnh phù
                                                                    hợp với nội
                                                                    dung khóa
                                                                    học
                                                                </li>
                                                                <li>
                                                                    Đảm bảo ảnh
                                                                    không vi
                                                                    phạm bản
                                                                    quyền
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary prev-btn mb-0"
                                                        >
                                                            <i className="bi bi-arrow-left me-2"></i>
                                                            Quay lại
                                                        </button>
                                                        <button
                                                            className={`btn next-btn mb-0 ${
                                                                !formData.course_image
                                                                    ? "btn-outline-primary"
                                                                    : "btn-primary"
                                                            }`}
                                                            disabled={
                                                                !formData.course_image
                                                            }
                                                            type="button"
                                                            title={
                                                                !formData.course_image
                                                                    ? "Vui lòng tải lên ảnh bìa để tiếp tục"
                                                                    : ""
                                                            }
                                                        >
                                                            {!formData.course_image ? (
                                                                <>
                                                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                                                    Cần ảnh bìa
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Tiếp tục
                                                                    <i className="bi bi-arrow-right ms-2"></i>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Step 3: Review */}
                                            <div
                                                id="step-3"
                                                role="tabpanel"
                                                className="content fade"
                                                aria-labelledby="steppertrigger3"
                                            >
                                                <h4>Hoàn Thành</h4>
                                                <hr />

                                                <div className="row">
                                                    <p>
                                                        Bước cuối cùng, hãy kiểm
                                                        tra lại thông tin khóa
                                                        học của bạn và chắc chắn
                                                        rằng mọi thứ đều chính
                                                        xác.
                                                    </p>

                                                    <div className="col-12 mb-4">
                                                        <div className="card bg-light">
                                                            <div className="card-body">
                                                                <h6>
                                                                    Tóm tắt khóa
                                                                    học:
                                                                </h6>
                                                                <ul className="list-unstyled">
                                                                    <li>
                                                                        <strong>
                                                                            Tiêu
                                                                            đề:
                                                                        </strong>{" "}
                                                                        {
                                                                            formData.title
                                                                        }
                                                                    </li>
                                                                    <li>
                                                                        <strong>
                                                                            Danh
                                                                            mục:
                                                                        </strong>{" "}
                                                                        {formData
                                                                            .category_ids
                                                                            ?.length ||
                                                                            0}{" "}
                                                                        danh mục
                                                                        được
                                                                        chọn
                                                                    </li>
                                                                    <li>
                                                                        <strong>
                                                                            Giá:
                                                                        </strong>{" "}
                                                                        {new Intl.NumberFormat(
                                                                            "vi-VN",
                                                                            {
                                                                                style: "currency",
                                                                                currency:
                                                                                    "VND",
                                                                            }
                                                                        ).format(
                                                                            formData.price ||
                                                                                0
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <strong>
                                                                            Ảnh
                                                                            bìa:
                                                                        </strong>
                                                                        {formData.course_image ? (
                                                                            <span className="text-success">
                                                                                <i className="bi bi-check-circle me-1"></i>
                                                                                Đã
                                                                                tải
                                                                                lên
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-danger">
                                                                                <i className="bi bi-x-circle me-1"></i>
                                                                                Chưa
                                                                                có
                                                                                ảnh
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-between">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary prev-btn me-2"
                                                        >
                                                            Quay lại
                                                        </button>
                                                        <div className="text-end">
                                                            <button
                                                                type="submit"
                                                                className={`btn mb-0 ${
                                                                    !formData.course_image
                                                                        ? "btn-outline-success"
                                                                        : "btn-success"
                                                                }`}
                                                                disabled={
                                                                    !formData.course_image
                                                                }
                                                                title={
                                                                    !formData.course_image
                                                                        ? "Vui lòng tải lên ảnh bìa trước khi gửi"
                                                                        : ""
                                                                }
                                                            >
                                                                {!formData.course_image ? (
                                                                    <>
                                                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                                                        Thiếu
                                                                        ảnh bìa
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-check-circle me-2"></i>
                                                                        Thêm
                                                                        khóa học
                                                                    </>
                                                                )}
                                                            </button>
                                                            <p className="mb-0 small mt-1 text-muted">
                                                                {!formData.course_image
                                                                    ? "Cần có ảnh bìa để gửi khóa học"
                                                                    : "Your course will be reviewed before publishing"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </AdminLayout>
    );
};

export default AdminCreateCourse;
