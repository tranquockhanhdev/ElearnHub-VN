import React from "react";
import { Link } from "@inertiajs/react";

const CourseTableView = ({ courses, onDelete, formatDate }) => {
    if (!courses || courses.length === 0) {
        return (
            <div className="alert alert-warning text-center">
                Không có khóa học nào.
            </div>
        );
    }
    const getCourseImage = (course) => {

        if (!course.img_url) {
            return '/assets/images/courses/4by3/default.jpg';
        }

        if (course.img_url.startsWith('bannercourse/')) {
            return `/storage/${course.img_url}`;
        }

        return course.img_url;
    };
    return (
        <div className="table-responsive">
            <table className="table table-bordered align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Khóa học</th>
                        <th>Giảng viên</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={course.id}>
                            <td>{index + 1}</td>
                            <td className="d-flex align-items-center gap-2">
                                <img
                                    src={
                                        getCourseImage(course)
                                    }
                                    alt={course.title}
                                    style={{
                                        width: "60px",
                                        height: "40px",
                                        objectFit: "cover",
                                    }}
                                />
                                <span>{course.title}</span>
                            </td>
                            <td>{course.instructor?.name || "---"}</td>
                            <td>
                                {course.categories.length > 0
                                    ? course.categories
                                        .map((cat) => cat.name)
                                        .join(", ")
                                    : "---"}
                            </td>
                            <td>
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
                            </td>
                            <td>{formatDate(course.created_at)}</td>
                            <td className="text-center">
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
                                    className="btn btn-sm btn-outline-primary me-1"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Link>

                                <button
                                    onClick={() => onDelete(course.id)}
                                    className="btn btn-sm btn-outline-danger"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseTableView;
