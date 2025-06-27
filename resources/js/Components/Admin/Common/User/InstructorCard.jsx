import React from "react";
import { Link } from "@inertiajs/react";

const InstructorCard = ({
    instructor,
    formatDate,
    viewType = "grid",
    onEdit,
    onDelete,
    onBlock,
    onUnblock,
}) => {
    // Nút chặn/mở chặn
    const renderBlockButton = () => {
        if (instructor.status === "suspended") {
            return (
                <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => onUnblock(instructor)}
                >
                    <i className="fas fa-unlock"></i> Mở chặn
                </button>
            );
        }
        return (
            <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onBlock(instructor)}
            >
                <i className="fas fa-ban"></i> Chặn
            </button>
        );
    };

    // ✅ LIST VIEW
    if (viewType === "list") {
        return (
            <div className="card mb-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1">{instructor.name}</h5>
                        <p className="mb-1 text-muted">{instructor.email}</p>
                        <small>
                            Tham gia: {formatDate(instructor.created_at)}
                        </small>
                    </div>
                    <div className="d-flex gap-2">
                        <Link
                            href={route("admin.instructors.show", {
                                id: instructor.id,
                            })}
                            className="btn btn-sm btn-outline-secondary"
                        >
                            <i className="bi bi-eye-fill"></i>
                        </Link>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit?.(instructor)}
                        >
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete?.(instructor.id)}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                        {renderBlockButton()}
                    </div>
                </div>
            </div>
        );
    }

    // ✅ GRID VIEW
    return (
        <div className="col-md-6 col-xxl-4">
            <div className="card bg-transparent border h-100">
                <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                    <div>
                        <h5 className="mb-0">{instructor.name}</h5>
                        <span className="text-body small">
                            <i className="fas fa-envelope fa-fw me-1"></i>{" "}
                            {instructor.email}
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
                                    onClick={() => onEdit?.(instructor)}
                                >
                                    <i className="bi bi-pencil me-2"></i> Chỉnh
                                    sửa
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={() => onDelete?.(instructor.id)}
                                >
                                    <i className="bi bi-trash me-2"></i> Xoá
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
                            {instructor.phone || "N/A"}
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
                            {instructor.status}
                        </span>
                    </div>
                </div>

                <div className="card-footer bg-transparent border-top">
                    <div className="d-sm-flex justify-content-between align-items-center">
                        <h6 className="mb-2 mb-sm-0">
                            <i className="bi bi-calendar fa-fw text-orange me-2"></i>
                            <span className="text-body">Tham gia:</span>{" "}
                            {formatDate(instructor.created_at)}
                        </h6>
                        <div className="d-flex gap-2">
                            <Link
                                href={route("admin.instructors.show", {
                                    id: instructor.id,
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

export default InstructorCard;
