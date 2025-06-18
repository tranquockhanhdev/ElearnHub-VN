import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import EditUserModal from "@/Pages/Admin/User/EditUserModal";
import CreateUserModal from "@/Pages/Admin/User/CreateUserModal";
const AdminStudentList = ({ students }) => {
    const [activeTab, setActiveTab] = useState("grid");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const { flash } = usePage().props;
    const [blockUserId, setBlockUserId] = useState(null);
    const [message, setMessage] = useState("");
    const [filters, setFilters] = useState({
        keyword: "",
        email: "",
        status: "",
        sort: "",
    });
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.students"), filters, {
            preserveState: true,
        });
    };
    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            const timeout = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timeout);
        }
    }, [flash]);
    const formatDate = (isoDate) => {
        if (!isoDate) return "---";
        const date = new Date(isoDate);
        return date.toLocaleDateString("vi-VN");
    };
    const renderPagination = () => {
        const pages = [];

        for (let i = 1; i <= students.last_page; i++) {
            pages.push(
                <Link
                    key={i}
                    href={`?page=${i}`}
                    className={`page-link ${
                        students.current_page === i ? "active" : ""
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
    const handleDelete = () => {
        if (confirmDeleteId) {
            router.delete(route("admin.users.destroy", confirmDeleteId), {
                onSuccess: () => {
                    setShowConfirmModal(false);
                    setConfirmDeleteId(null);
                },
            });
        }
    };
    const handleBlockUser = (userId) => {
        router.put(
            route("admin.instructors.block", userId),
            {},
            {
                onSuccess: () => {
                    setShowBlockModal(false);
                    setSelectedUser(null);
                },
            }
        );
    };
    return (
        <AdminLayout>
            <div className="page-content-wrapper border">
                {/* Tiêu đề và nút thêm */}
                <div className="row align-items-center mb-3">
                    <div className="col-md-6">
                        <h1 className="h3 mb-0">Học Viên</h1>
                    </div>
                    <div className="col-md-6 text-end">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="bi bi-plus-circle me-1"></i> Thêm học
                            viên
                        </button>
                    </div>
                </div>
                {/* FLASH MESSAGE đẹp và rõ */}
                {message && (
                    <div className="row mb-3">
                        <div className="col-12">
                            <div
                                className="alert alert-success alert-dismissible fade show"
                                role="alert"
                            >
                                {message}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setMessage("")}
                                ></button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="card bg-transparent">
                    {/* Header */}
                    <div className="card-header bg-transparent border-bottom px-0">
                        <div className="row g-3 align-items-center justify-content-between">
                            <div className="col-md-8">
                                <div className="card shadow border-0 mb-4">
                                    <div className="card-header bg-white pb-0">
                                        <h5 className="mb-0 text-primary fw-bold">
                                            <i className="fas fa-filter me-2"></i>
                                            Bộ lọc học viên
                                        </h5>
                                    </div>
                                    <div className="card-body pt-3">
                                        <form onSubmit={handleSearch}>
                                            <div className="row gy-4">
                                                {/* Tên giảng viên */}
                                                <div className="col-lg-3 col-md-6">
                                                    <label className="form-label text-muted fw-semibold">
                                                        Tên học viên
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={
                                                            filters.name || ""
                                                        }
                                                        onChange={
                                                            handleFilterChange
                                                        }
                                                        className="form-control"
                                                        placeholder="Nhập tên"
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="col-lg-3 col-md-6">
                                                    <label className="form-label text-muted fw-semibold">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        value={
                                                            filters.email || ""
                                                        }
                                                        onChange={
                                                            handleFilterChange
                                                        }
                                                        className="form-control"
                                                        placeholder="example@email.com"
                                                    />
                                                </div>

                                                {/* Trạng thái */}
                                                <div className="col-lg-2 col-md-6">
                                                    <label className="form-label text-muted fw-semibold">
                                                        Trạng thái
                                                    </label>
                                                    <select
                                                        name="status"
                                                        value={filters.status}
                                                        onChange={
                                                            handleFilterChange
                                                        }
                                                        className="form-select"
                                                    >
                                                        <option value="">
                                                            Tất cả
                                                        </option>
                                                        <option value="active">
                                                            Hoạt động
                                                        </option>
                                                        <option value="inactive">
                                                            Vô hiệu
                                                        </option>
                                                        <option value="suspended">
                                                            Tạm khóa
                                                        </option>
                                                    </select>
                                                </div>

                                                {/* Sắp xếp */}
                                                <div className="col-lg-2 col-md-6">
                                                    <label className="form-label text-muted fw-semibold">
                                                        Sắp xếp
                                                    </label>
                                                    <select
                                                        name="sort"
                                                        value={filters.sort}
                                                        onChange={
                                                            handleFilterChange
                                                        }
                                                        className="form-select"
                                                    >
                                                        <option value="newest">
                                                            Mới nhất
                                                        </option>
                                                        <option value="oldest">
                                                            Cũ nhất
                                                        </option>
                                                        <option value="az">
                                                            Tên A-Z
                                                        </option>
                                                        <option value="za">
                                                            Tên Z-A
                                                        </option>
                                                    </select>
                                                </div>

                                                {/* Nút hành động */}
                                                <div className="col-lg-2 col-md-12">
                                                    <label className="form-label text-muted fw-semibold invisible">
                                                        Hành động
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary w-100"
                                                        >
                                                            <i className="fas fa-search me-1"></i>{" "}
                                                            Tìm kiếm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const cleared =
                                                                    {
                                                                        name: "",
                                                                        email: "",
                                                                        status: "",
                                                                        sort: "",
                                                                    };
                                                                setFilters(
                                                                    cleared
                                                                );
                                                                router.get(
                                                                    route(
                                                                        "admin.students"
                                                                    ),
                                                                    cleared,
                                                                    {
                                                                        preserveState: true,
                                                                    }
                                                                );
                                                            }}
                                                            className="btn btn-outline-secondary w-100"
                                                        >
                                                            <i className="fas fa-sync-alt me-1"></i>{" "}
                                                            Đặt lại
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <ul className="list-inline mb-0 nav nav-pills nav-pill-dark-soft border-0 justify-content-end">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link mb-0 me-2 ${
                                                activeTab === "grid"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => setActiveTab("grid")}
                                        >
                                            <i className="fas fa-fw fa-th-large"></i>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link mb-0 ${
                                                activeTab === "list"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => setActiveTab("list")}
                                        >
                                            <i className="fas fa-fw fa-list-ul"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="card-body px-0 pt-4">
                        <div className={activeTab === "grid" ? "row g-4" : ""}>
                            {students.data.length === 0 ? (
                                <div className="col-12">
                                    <div className="alert alert-warning">
                                        No students found.
                                    </div>
                                </div>
                            ) : (
                                students.data.map((student) =>
                                    activeTab === "grid" ? (
                                        <div
                                            className="col-md-6 col-xxl-4"
                                            key={student.id}
                                        >
                                            <div className="card bg-transparent border h-100">
                                                <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                                                    <div>
                                                        <h5 className="mb-0">
                                                            {student.name}
                                                        </h5>
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
                                                                    onClick={() => {
                                                                        setSelectedUser(
                                                                            student
                                                                        ); // Gán user được chọn
                                                                        setShowEditModal(
                                                                            true
                                                                        ); // Mở modal
                                                                    }}
                                                                >
                                                                    <i className="bi bi-pencil me-2"></i>{" "}
                                                                    Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item text-red-600 hover:bg-red-100"
                                                                    onClick={() => {
                                                                        setConfirmDeleteId(
                                                                            student.id
                                                                        );
                                                                        setShowConfirmModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    <i className="bi bi-trash me-2"></i>{" "}
                                                                    Xóa
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
                                                            <h6 className="mb-0 ms-2 fw-light">
                                                                Phone
                                                            </h6>
                                                        </div>
                                                        <span className="mb-0 fw-bold">
                                                            {student.phone ||
                                                                "N/A"}
                                                        </span>{" "}
                                                    </div>

                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="icon-md bg-warning bg-opacity-10 text-warning rounded-circle">
                                                                <i className="bi bi-person-check-fill"></i>
                                                            </div>
                                                            <h6 className="mb-0 ms-2 fw-light">
                                                                Status
                                                            </h6>
                                                        </div>
                                                        <span className="fw-bold">
                                                            {student.status ===
                                                            "active"
                                                                ? "Active"
                                                                : student.status ===
                                                                  "suspended"
                                                                ? "Suspended"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="card-footer bg-transparent border-top">
                                                    <div className="d-sm-flex justify-content-between align-items-center">
                                                        <h6 className="mb-2 mb-sm-0">
                                                            <i className="bi bi-calendar fa-fw text-orange me-2"></i>
                                                            <span className="text-body">
                                                                Join at:
                                                            </span>{" "}
                                                            {formatDate(
                                                                student.email_verified_at
                                                            )}
                                                        </h6>
                                                        <div>
                                                            <button className="btn btn-sm btn-outline-secondary me-2">
                                                                <i className="bi bi-eye-fill"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        student
                                                                    ); // lưu user muốn chặn
                                                                    setShowBlockModal(
                                                                        true
                                                                    ); // mở modal xác nhận
                                                                }}
                                                            >
                                                                <i className="fas fa-ban"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="card mb-3"
                                            key={student.id}
                                        >
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 className="mb-1">
                                                        {student.name}
                                                    </h5>
                                                    <p className="mb-1 text-muted">
                                                        {student.email}
                                                    </p>
                                                    <small>
                                                        Join at:{" "}
                                                        {formatDate(
                                                            student.email_verified_at
                                                        )}
                                                    </small>
                                                </div>
                                                <div>
                                                    <button className="btn btn-sm btn-outline-secondary me-2">
                                                        <i className="bi bi-eye-fill"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => {
                                                            setSelectedUser(
                                                                student
                                                            ); // lưu user muốn chặn
                                                            setShowBlockModal(
                                                                true
                                                            ); // mở modal xác nhận
                                                        }}
                                                    >
                                                        <i className="fas fa-ban"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                        {students.last_page > 1 && renderPagination()}
                    </div>
                </div>
                <CreateUserModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                />
                {showEditModal && selectedUser && (
                    <EditUserModal
                        show={showEditModal}
                        user={selectedUser}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                        }}
                    />
                )}
                {showConfirmModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-100 text-red-600 rounded-full p-2">
                                    <i className="bi bi-exclamation-triangle-fill text-xl"></i>
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Xác nhận xóa
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                Bạn có chắc chắn muốn{" "}
                                <span className="font-medium text-red-600">
                                    xóa người dùng này
                                </span>{" "}
                                không? Thao tác này không thể hoàn tác.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showBlockModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Xác nhận chặn người dùng
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Bạn có chắc chắn muốn{" "}
                                <span className="font-semibold text-red-600">
                                    chặn
                                </span>{" "}
                                tài khoản <strong>{selectedUser.name}</strong>{" "}
                                không?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowBlockModal(false)}
                                    className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() =>
                                        handleBlockUser(selectedUser.id)
                                    }
                                    className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                >
                                    Chặn
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminStudentList;
