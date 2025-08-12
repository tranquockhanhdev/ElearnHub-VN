import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

const CourseApprovalTable = ({ courses, onApprove, onReject }) => {
    const formatDate = (isoDate) => {
        if (!isoDate) return "---";
        return new Date(isoDate).toLocaleDateString("vi-VN");
    };

    const renderStatus = (status) => {
        switch (status) {
            case "accepted":
                return <span className="badge bg-success">Đã duyệt</span>;
            case "rejected":
                return <span className="badge bg-danger">Từ chối</span>;
            default:
                return (
                    <span className="badge bg-warning text-dark">
                        Chờ duyệt
                    </span>
                );
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Danh sách khóa học chờ duyệt</h5>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Hình ảnh</th>
                            <th scope="col">Tiêu đề</th>
                            <th scope="col">Giảng viên</th>
                            <th scope="col">Ngày tạo</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>
                                    <img
                                        src={
                                            course.img_url ||
                                            "/images/default-course.png"
                                        }
                                        alt={course.title}
                                        className="rounded"
                                        width={80}
                                        height={50}
                                    />
                                </td>
                                <td>{course.title}</td>
                                <td>{course.instructor?.name || "---"}</td>
                                <td>{formatDate(course.created_at)}</td>
                                <td>{renderStatus(course.status)}</td>
                                <td>
                                    {course.status === "pending" ? (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() =>
                                                    onApprove(course.id)
                                                }
                                            >
                                                Duyệt
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger me-2"
                                                onClick={() =>
                                                    onReject(course.id)
                                                }
                                            >
                                                Từ chối
                                            </button>
                                        </>
                                    ) : null}

                                    <Link
                                        href={route("admin.courses.show", {
                                            id: course.id,
                                        })}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Xem
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseApprovalTable;
