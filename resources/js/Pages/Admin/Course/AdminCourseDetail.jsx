import React from "react";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

const AdminCourseDetail = ({ course }) => {
    const formatDate = (isoDate) => {
        if (!isoDate) return "---";
        return new Date(isoDate).toLocaleDateString("vi-VN");
    };

    const statusMap = {
        active: {
            label: "Hoạt động",
            class: "success",
            icon: "bi-check-circle",
        },
        pending: {
            label: "Chờ duyệt",
            class: "warning",
            icon: "bi-hourglass-split",
        },
        inactive: {
            label: "Ngưng hoạt động",
            class: "secondary",
            icon: "bi-slash-circle",
        },
    };

    const status = statusMap[course.status] || {
        label: "Không rõ",
        class: "dark",
        icon: "bi-question-circle",
    };

    return (
        <AdminLayout>
            <div className="page-content-wrapper p-4 border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">Chi tiết khóa học</h1>
                    <Link
                        href={route("admin.admin-course")}
                        className="btn btn-outline-secondary"
                    >
                        <i className="bi bi-arrow-left me-1"></i> Quay lại
                    </Link>
                </div>

                <div className="row g-4">
                    {/* Hình ảnh */}
                    <div className="col-md-5">
                        <div className="card shadow-sm border">
                            {course.img_url ? (
                                <img
                                    src={course.img_url}
                                    alt={course.title}
                                    className="card-img-top rounded-top"
                                    style={{
                                        maxHeight: "300px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div className="card-body text-center py-5">
                                    <i className="bi bi-image fs-1 text-muted"></i>
                                    <p className="text-muted mt-2">
                                        Không có ảnh
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thông tin */}
                    <div className="col-md-7">
                        <div className="card shadow-sm border h-100">
                            <div className="card-body">
                                <h3 className="card-title mb-3">
                                    {course.title}
                                </h3>

                                <p className="mb-2">
                                    <i className="bi bi-person-badge me-2 text-primary"></i>
                                    <strong>Giảng viên:</strong>{" "}
                                    {course.instructor?.name || "N/A"}
                                </p>

                                <p className="mb-2">
                                    <i className="bi bi-tags me-2 text-success"></i>
                                    <strong>Danh mục:</strong>{" "}
                                    {course.categories.length > 0
                                        ? course.categories
                                              .map((c) => c.name)
                                              .join(", ")
                                        : "Chưa phân loại"}
                                </p>

                                <p className="mb-2">
                                    <i
                                        className={`bi ${status.icon} me-2 text-${status.class}`}
                                    ></i>
                                    <strong>Trạng thái:</strong>{" "}
                                    <span
                                        className={`badge bg-${status.class}`}
                                    >
                                        {status.label}
                                    </span>
                                </p>

                                <p className="mb-2">
                                    <i className="bi bi-calendar me-2 text-warning"></i>
                                    <strong>Ngày tạo:</strong>{" "}
                                    {formatDate(course.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mô tả */}
                <div className="card shadow-sm mt-4 border">
                    <div className="card-header bg-light fw-bold">
                        <i className="bi bi-card-text me-2"></i> Mô tả khóa học
                    </div>
                    <div className="card-body">
                        {course.description ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: course.description,
                                }}
                                className="text-secondary"
                                style={{ lineHeight: "1.7" }}
                            />
                        ) : (
                            <p className="text-muted fst-italic">
                                Không có mô tả.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCourseDetail;
