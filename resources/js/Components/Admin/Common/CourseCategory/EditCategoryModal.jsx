// File: Components/Admin/CourseCategory/EditCategoryModal.jsx

import React from "react";

const EditCategoryModal = ({
    show,
    onClose,
    onSubmit,
    editData,
    setEditData,
    errors,
    isSubmitting,
}) => {
    if (!show || !editData) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chỉnh Sửa Danh Mục</h5>
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
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
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
                                    value={editData.slug || ""}
                                    onChange={(e) =>
                                        setEditData((prev) => ({
                                            ...prev,
                                            slug: e.target.value,
                                        }))
                                    }
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
                                    value={editData.status}
                                    onChange={(e) =>
                                        setEditData((prev) => ({
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
                                {isSubmitting ? "Đang Cập Nhật..." : "Cập Nhật"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;
