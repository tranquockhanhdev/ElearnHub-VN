import React, { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import EditUserModal from "@/Pages/Admin/User/EditUserModal";
import CreateUserModal from "@/Pages/Admin/User/CreateUserModal";
import StudentCard from "@/Components/Admin/Common/User/StudentCard";
import ConfirmModal from "@/Components/Admin/Common/User/ConfirmModal";
import { toast } from "react-toastify";

const AdminStudentList = ({ students }) => {
    const { flash } = usePage().props;

    const [activeTab, setActiveTab] = useState("grid");
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        status: "",
        sort: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);

    const [showUnblockModal, setShowUnblockModal] = useState(false);
    const [isUnblocking, setIsUnblocking] = useState(false);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.students"), filters, { preserveState: true });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route("admin.users.destroy", { user: confirmDeleteId }), {
            onSuccess: () => {
                toast.success("Xóa thành công!");
                setShowConfirmModal(false);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleBlockUser = () => {
        if (!selectedUser) return;
        setIsBlocking(true);
        router.put(
            route("admin.instructors.block", { user: selectedUser.id }),
            {},
            {
                onSuccess: () => {
                    toast.success("Người dùng đã bị chặn.");
                    setShowBlockModal(false);
                },
                onFinish: () => setIsBlocking(false),
            }
        );
    };

    const handleUnblockUser = () => {
        if (!selectedUser) return;
        setIsUnblocking(true);
        router.put(
            route("admin.instructors.unblock", { user: selectedUser.id }),
            {},
            {
                onSuccess: () => {
                    toast.success("Người dùng đã được mở chặn.");
                    setShowUnblockModal(false);
                },
                onFinish: () => setIsUnblocking(false),
            }
        );
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "---";
        return new Date(isoDate).toLocaleDateString("vi-VN");
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= students.last_page; i++) {
            pages.push(
                <Link
                    preserveScroll
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

    return (
        <AdminLayout>
            <div className="page-content-wrapper border">
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

                <div className="card bg-transparent">
                    <div className="card-header bg-transparent border-bottom px-0">
                        <div className="row g-3 align-items-center justify-content-between">
                            {/* BỘ LỌC */}
                            <div className="col-md-8">
                                <form
                                    onSubmit={handleSearch}
                                    className="row gy-3 gx-3"
                                >
                                    <div className="col-lg-3">
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Tên học viên"
                                            value={filters.name}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <input
                                            type="text"
                                            name="email"
                                            className="form-control"
                                            placeholder="Email"
                                            value={filters.email}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <select
                                            name="status"
                                            className="form-select"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Tất cả</option>
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
                                    <div className="col-lg-2">
                                        <select
                                            name="sort"
                                            className="form-select"
                                            value={filters.sort}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="newest">
                                                Mới nhất
                                            </option>
                                            <option value="oldest">
                                                Cũ nhất
                                            </option>
                                            <option value="az">Tên A-Z</option>
                                            <option value="za">Tên Z-A</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-2 d-flex gap-2">
                                        <button
                                            className="btn btn-primary w-100"
                                            type="submit"
                                            title="Tìm kiếm"
                                        >
                                            <i className="fas fa-search"></i>
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary w-100"
                                            type="button"
                                            onClick={() => {
                                                const cleared = {
                                                    name: "",
                                                    email: "",
                                                    status: "",
                                                    sort: "",
                                                };
                                                setFilters(cleared);
                                                router.get(
                                                    route("admin.students"),
                                                    cleared,
                                                    {
                                                        preserveState: true,
                                                    }
                                                );
                                            }}
                                            title="Đặt lại bộ lọc"
                                        >
                                            <i className="fas fa-sync-alt"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-3 text-end">
                                <div className="btn-group" role="group">
                                    <button
                                        className={`btn btn-outline-primary ${
                                            activeTab === "grid" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("grid")}
                                    >
                                        <i className="fas fa-th"></i>
                                    </button>
                                    <button
                                        className={`btn btn-outline-primary ${
                                            activeTab === "list" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("list")}
                                    >
                                        <i className="fas fa-list"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LIST */}
                    <div className="card-body px-0 pt-4">
                        <div className={activeTab === "grid" ? "row g-4" : ""}>
                            {students.data.length === 0 ? (
                                <div className="col-12">
                                    <div className="alert alert-warning text-center">
                                        Không có học viên nào.
                                    </div>
                                </div>
                            ) : (
                                students.data.map((student) => (
                                    <StudentCard
                                        key={student.id}
                                        student={student}
                                        formatDate={formatDate}
                                        viewType={activeTab}
                                        onEdit={(user) => {
                                            setSelectedUser(user);
                                            setShowEditModal(true);
                                        }}
                                        onDelete={(id) => {
                                            setConfirmDeleteId(id);
                                            setShowConfirmModal(true);
                                        }}
                                        onBlock={(user) => {
                                            setSelectedUser(user);
                                            setShowBlockModal(true);
                                        }}
                                        onUnblock={(user) => {
                                            setSelectedUser(user);
                                            setShowUnblockModal(true);
                                        }}
                                    />
                                ))
                            )}
                        </div>
                        {students.last_page > 1 && renderPagination()}
                    </div>
                </div>

                {/* Modals */}
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
                <ConfirmModal
                    show={showConfirmModal}
                    title="Xóa người dùng"
                    message="Bạn có chắc chắn muốn xóa người dùng này?"
                    confirmText="Xóa"
                    cancelText="Hủy"
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleDelete}
                    isProcessing={isDeleting}
                />
                <ConfirmModal
                    show={showBlockModal}
                    title="Chặn người dùng"
                    message="Bạn có chắc chắn muốn chặn người dùng này?"
                    confirmText="Chặn"
                    cancelText="Hủy"
                    onCancel={() => setShowBlockModal(false)}
                    onConfirm={handleBlockUser}
                    isProcessing={isBlocking}
                />
                <ConfirmModal
                    show={showUnblockModal}
                    title="Mở chặn người dùng"
                    message="Bạn có chắc chắn muốn mở chặn người dùng này?"
                    confirmText="Mở chặn"
                    cancelText="Hủy"
                    onCancel={() => setShowUnblockModal(false)}
                    onConfirm={handleUnblockUser}
                    isProcessing={isUnblocking}
                    type="success"
                />
            </div>
        </AdminLayout>
    );
};

export default AdminStudentList;
