import React from "react";
import { Link } from "@inertiajs/react";

const CourseGridView = ({ courses, onDelete, formatDate }) => {
    if (!courses || courses.length === 0) {
        return (
            <div className="alert alert-warning text-center">
                Không có khóa học nào.
            </div>
        );
    }
    const getCourseImage = (course) => {
        if (!course.img_url) {
            return "/images/default-thumbnail.jpg";
        }
        if (course.img_url.startsWith("bannercourse/")) {
            return `/storage/${course.img_url}`;
        }
        return course.img_url;
    };
    return (
        <div className="row g-4">
            {courses.map((course) => (
                <div className="col-md-6 col-xl-4" key={course.id}>
                    <div className="card h-100 shadow-sm border">
                        <img
                            src={
                                getCourseImage(course)
                            }
                            className="card-img-top"
                            alt={course.title}
                            style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                            <h5 className="card-title mb-2 text-truncate">
                                {course.title}
                            </h5>
                            <p className="mb-1">
                                <strong>Giảng viên:</strong>{" "}
                                {course.instructor?.name || "---"}
                            </p>
                            <p className="mb-1">
                                <strong>Danh mục:</strong>{" "}
                                {course.categories.length > 0
                                    ? course.categories
                                        .map((cat) => cat.name)
                                        .join(", ")
                                    : "---"}
                            </p>
                            <p className="mb-1">
                                <strong>Trạng thái:</strong>{" "}
                                <span
                                    className={`badge bg-${course.status === "active"
                                        ? "success"
                                        : course.status === "pending"
                                            ? "warning"
                                            : "secondary"
                                        }`}
                                >
                                    {course.status}
                                </span>
                            </p>
                            <p className="mb-0">
                                <strong>Ngày tạo:</strong>{" "}
                                {formatDate(course.created_at)}
                            </p>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <Link
                                href={route("admin.courses.show", {
                                    id: course.id,
                                })}
                                className="btn btn-sm btn-outline-info me-2"
                                title="Xem chi tiết"
                            >
                                <i className="bi bi-eye"></i>
                            </Link>
                            <Link
                                href={route("admin.courses.edit", {
                                    id: course.id,
                                })}
                                className="btn btn-sm btn-outline-primary"
                            >
                                <i className="bi bi-pencil-square"></i>
                            </Link>

                            <button
                                onClick={() => onDelete(course.id)}
                                className="btn btn-sm btn-outline-danger"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseGridView;
