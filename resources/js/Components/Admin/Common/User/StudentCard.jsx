import React from "react";
import { Link } from "@inertiajs/react";

/**
 * Component hiển thị thông tin một học viên
 */
const StudentCard = ({
    student,
    formatDate,
    viewType = "grid", // 'grid' hoặc 'list'
    onEdit,
    onDelete,
    onBlock,
    onUnblock,
}) => {
    // Button xử lý chặn hoặc mở chặn tùy theo trạng thái
    const renderBlockButton = () => {
        const isSuspended = student.status === "suspended";

        return (
            <button
                className={`btn btn-sm ${
                    isSuspended ? "btn-outline-success" : "btn-outline-danger"
                }`}
                onClick={() =>
                    isSuspended ? onUnblock?.(student) : onBlock?.(student)
                }
            >
                <i
                    className={`fas ${
                        isSuspended ? "fa-unlock" : "fa-ban"
                    } me-1`}
                ></i>
                {isSuspended ? "Mở chặn" : "Chặn"}
            </button>
        );
    };

    // Danh sách dạng list
    if (viewType === "list") {
        return (
            <div className="card mb-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1">{student.name}</h5>
                        <p className="mb-1 text-muted">{student.email}</p>
                        <small>
                            Join at: {formatDate(student.email_verified_at)}
                        </small>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => onEdit?.(student)}
                        >
                            <i className="bi-pencil-square"></i>
                        </button>
                        {renderBlockButton()}
                    </div>
                </div>
            </div>
        );
    }

    // Danh sách dạng grid (thẻ)
    return (
        <div className="col-md-6 col-xxl-4">
            <div className="card bg-transparent border h-100">
                <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                    <div>
                        <h5 className="mb-0">{student.name}</h5>
                        <span className="text-body small">
                            <i className="fas fa-envelope fa-fw me-1"></i>{" "}
                            {student.email}
                        </span>
                    </div>
                    <div className="dropdown text-end">
                        <button
                            className="btn btn-sm btn-light btn-round small mb-0"
                            data-bs-toggle="dropdown"
                        >
                            <i className="bi bi-three-dots fa-fw"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow rounded">
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => onEdit?.(student)}
                                >
                                    <i className="bi bi-pencil me-2"></i> Edit
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={() => onDelete?.(student.id)}
                                >
                                    <i className="bi bi-trash me-2"></i> Xóa
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <div className="icon-md bg-info bg-opacity-10 text-info rounded-circle">
                                <i className="bi bi-telephone-fill"></i>
                            </div>
                            <h6 className="mb-0 ms-2 fw-light">Phone</h6>
                        </div>
                        <span className="mb-0 fw-bold">
                            {student.phone || "N/A"}
                        </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <div className="icon-md bg-warning bg-opacity-10 text-warning rounded-circle">
                                <i className="bi bi-person-check-fill"></i>
                            </div>
                            <h6 className="mb-0 ms-2 fw-light">Status</h6>
                        </div>
                        <span className="fw-bold text-capitalize">
                            {student.status}
                        </span>
                    </div>
                </div>

                <div className="card-footer bg-transparent border-top">
                    <div className="d-sm-flex justify-content-between align-items-center">
                        <h6 className="mb-2 mb-sm-0">
                            <i className="bi bi-calendar fa-fw text-orange me-2"></i>
                            <span className="text-body">Tham gia:</span>
                            {""}
                            {formatDate(student.created_at)}
                        </h6>
                        <div className="d-flex gap-2">
                            <Link
                                href={route("admin.students.show", {
                                    id: student.id,
                                })}
                                className="btn btn-sm btn-outline-secondary"
                            >
                                <i className="bi bi-eye-fill"></i>
                            </Link>
                            {renderBlockButton()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
