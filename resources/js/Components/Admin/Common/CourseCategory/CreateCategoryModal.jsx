// File: Components/Admin/CourseCategory/CreateCategoryModal.jsx

import React from "react";
import slugify from "slugify";

const CreateCategoryModal = ({
    show,
    onClose,
    onSubmit,
    formData,
    setFormData,
    errors,
    manualSlug,
    setManualSlug,
    isSubmitting,
}) => {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Danh Mục Mới</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Tên</label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.name ? "is-invalid" : ""
                                    }`}
                                    value={formData.name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: value,
                                        }));
                                        if (!manualSlug) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                slug: slugify(value, {
                                                    lower: true,
                                                    strict: true,
                                                }),
                                            }));
                                        }
                                    }}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.slug ? "is-invalid" : ""
                                    }`}
                                    value={formData.slug}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            slug: e.target.value,
                                        }));
                                        setManualSlug(true);
                                    }}
                                />
                                {errors.slug && (
                                    <div className="invalid-feedback">
                                        {errors.slug}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Trạng Thái</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            status: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="active">Hoạt Động</option>
                                    <option value="inactive">
                                        Không Hoạt Động
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Hủy Bỏ
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang Thêm..." : "Thêm"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCategoryModal;
