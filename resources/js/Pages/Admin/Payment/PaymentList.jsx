import React, { useState } from "react";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import PaymentStats from "./PaymentStats";
const PaymentList = ({ payments, students, courses, filters, stats }) => {
    const [search, setSearch] = useState({
        student_id: filters.student_id || "",
        course_id: filters.course_id || "",
        status: filters.status || "",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route("admin.payments.index"), search, {
            preserveState: true,
        });
    };

    const handleReset = () => {
        const reset = {
            student_id: "",
            course_id: "",
            status: "",
            start_date: "",
            end_date: "",
        };
        setSearch(reset);
        router.get(route("admin.payments.index"), reset);
    };
    const renderPagination = (payments) => {
        const pages = [];

        for (let i = 1; i <= payments.last_page; i++) {
            pages.push(
                <Link
                    preserveScroll
                    key={i}
                    href={`?page=${i}`}
                    className={`page-link ${
                        payments.current_page === i ? "active" : ""
                    }`}
                >
                    {i}
                </Link>
            );
        }
        return (
            <nav className="mt-4">
                <ul className="pagination justify-content-center">
                    {pages.map((page, index) => (
                        <li key={index} className="page-item">
                            {page}
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };
    return (
        <AdminLayout>
            <div className="page-content-wrapper border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">Quản lý thanh toán</h1>
                    <a
                        href={route("admin.payments.export.excel", {
                            ...filters,
                        })}
                        className="btn btn-success"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="bi bi-file-earmark-excel me-1"></i> Xuất
                        Excel
                    </a>
                </div>
                <PaymentStats stats={stats} />
                {/* Bộ lọc nâng cao */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-light border-bottom">
                        <strong>Bộ lọc nâng cao</strong>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleFilter}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label">
                                        Học viên
                                    </label>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <select
                                            className="form-select"
                                            value={search.student_id}
                                            onChange={(e) =>
                                                setSearch({
                                                    ...search,
                                                    student_id: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Tất cả</option>
                                            {students.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">
                                        Khóa học
                                    </label>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">
                                            <i className="bi bi-journal-code"></i>
                                        </span>
                                        <select
                                            className="form-select"
                                            value={search.course_id}
                                            onChange={(e) =>
                                                setSearch({
                                                    ...search,
                                                    course_id: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Tất cả</option>
                                            {courses.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">
                                        Trạng thái
                                    </label>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">
                                            <i className="bi bi-info-circle"></i>
                                        </span>
                                        <select
                                            className="form-select"
                                            value={search.status}
                                            onChange={(e) =>
                                                setSearch({
                                                    ...search,
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Tất cả</option>
                                            <option value="completed">
                                                Hoàn tất
                                            </option>
                                            <option value="pending">
                                                Chờ xử lý
                                            </option>
                                            <option value="failed">
                                                Thất bại
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">
                                        Thao tác
                                    </label>
                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-primary w-100"
                                        >
                                            <i className="bi bi-search me-1"></i>{" "}
                                            Tìm kiếm
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={handleReset}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">
                                        Từ ngày
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={search.start_date}
                                        onChange={(e) =>
                                            setSearch({
                                                ...search,
                                                start_date: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">
                                        Đến ngày
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={search.end_date}
                                        onChange={(e) =>
                                            setSearch({
                                                ...search,
                                                end_date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bảng thanh toán */}
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Học viên</th>
                                <th>Khóa học</th>
                                <th>Phương thức</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center text-muted py-4"
                                    >
                                        Không có thanh toán nào.
                                    </td>
                                </tr>
                            ) : (
                                payments.data.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.student?.name}</td>
                                        <td>{p.course?.title}</td>
                                        <td>{p.method?.name}</td>
                                        <td>{p.amount.toLocaleString()} đ</td>
                                        <td>
                                            <span
                                                className={`badge bg-${
                                                    p.status === "completed"
                                                        ? "success"
                                                        : p.status === "pending"
                                                        ? "warning"
                                                        : "danger"
                                                }`}
                                            >
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(
                                                p.payment_time
                                            ).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="text-end">
                                            <Link
                                                href={route(
                                                    "admin.payments.show",
                                                    { id: p.id }
                                                )}
                                                className="btn btn-sm btn-outline-info"
                                            >
                                                <i className="bi bi-eye-fill me-1"></i>{" "}
                                                Xem
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {payments.last_page > 1 && renderPagination(payments)}
                </div>
            </div>
        </AdminLayout>
    );
};

export default PaymentList;
