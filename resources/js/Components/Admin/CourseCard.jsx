import React from "react";
import { Link } from "@inertiajs/react";

const CourseCard = ({ course, onDelete }) => {
    return (
        <div className="col-md-6 col-xxl-4">
            <div className="card bg-transparent border h-100">
                <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                    <div>
                        <h5 className="mb-0">
                            <a href="#">{course.title}</a>
                        </h5>
                        <p className="mb-0 small">
                            {course.categories?.map((c) => c.name).join(", ") ||
                                "N/A"}
                        </p>
                    </div>
                    <div className="dropdown">
                        <a
                            href="#"
                            className="btn btn-sm btn-light btn-round"
                            data-bs-toggle="dropdown"
                        >
                            <i className="bi bi-three-dots fa-fw"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end shadow rounded">
                            <li>
                                <Link
                                    className="dropdown-item"
                                    href={`/admin/courses/${course.id}/edit`}
                                >
                                    <i className="bi bi-pencil-square me-2"></i>
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={onDelete}
                                >
                                    <i className="bi bi-trash me-2"></i>
                                    Remove
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card-body">
                    <div className="mb-3 text-center">
                        <img
                            src={course.img_url || "/images/placeholder.jpg"}
                            alt={course.title}
                            className="img-fluid rounded"
                            style={{
                                maxHeight: "180px",
                                objectFit: "cover",
                                width: "100%",
                                transition: "opacity 0.3s ease-in-out",
                            }}
                            onError={(e) => {
                                if (!e.target.src.includes("placeholder.jpg")) {
                                    e.target.onerror = null; // Ngắt vòng lặp
                                    e.target.src = "/images/placeholder.jpg";
                                }
                            }}
                        />
                    </div>
                    <p className="text-muted small">
                        {(course.description?.slice(0, 100) ||
                            "No description available") + "..."}
                    </p>
                    <div className="d-flex justify-content-between mb-2">
                        <h6 className="mb-0 fw-light">Instructor</h6>
                        <span className="fw-bold">
                            {course.instructor?.name || "N/A"}
                        </span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h6 className="mb-0 fw-light">Price</h6>
                        <span className="fw-bold">${course.price}</span>
                    </div>
                </div>

                <div className="card-footer bg-transparent border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted small">ID: {course.id}</span>
                    <a
                        href="#"
                        className="btn btn-link text-body p-0"
                        title="View"
                    >
                        <i className="bi bi-eye-fill"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
