import React, { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import EditUserModal from "@/Pages/Admin/User/EditUserModal";
import CreateUserModal from "@/Pages/Admin/User/CreateUserModal";
import StudentCard from "@/Components/Admin/Common/User/StudentCard";
import ConfirmModal from "@/Components/Admin/Common/User/ConfirmModal";
import { toast } from "react-toastify";
import useUserFilters from "@/hooks/useUserFilters";
import FilterBar from "@/Components/Admin/Common/User/FilterBar";

const AdminStudentList = ({ students }) => {
    const { flash } = usePage().props;

    const [activeTab, setActiveTab] = useState("grid");
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

    const { filters, setFilters, handleChange, clearFilters } =
        useUserFilters();

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.students"), filters, { preserveState: true });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route("admin.users.destroy", { user: confirmDeleteId }), {
            onSuccess: () => setShowConfirmModal(false),
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
                onSuccess: () => setShowBlockModal(false),
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
                onSuccess: () => setShowUnblockModal(false),
                onFinish: () => setIsUnblocking(false),
            }
        );
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "---";
        return new Date(isoDate).toLocaleDateString("vi-VN");
    };

    const renderPagination = () => (
        <nav className="mt-4">
            <ul className="pagination justify-content-center">
                {Array.from({ length: students.last_page }, (_, i) => (
                    <li key={i} className="page-item">
                        <Link
                            preserveScroll
                            href={`?page=${i + 1}`}
                            className={`page-link ${
                                students.current_page === i + 1 ? "active" : ""
                            }`}
                        >
                            {i + 1}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );

    return (
        <AdminLayout>
            <div className="page-content-wrapper border p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">Học Viên</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus-circle me-1"></i> Thêm học viên
                    </button>
                </div>

                <div className="card shadow-sm">
                    <div className="card-header border-bottom bg-light px-4 py-3 d-flex flex-wrap justify-content-between align-items-center">
                        <FilterBar
                            filters={filters}
                            onChange={handleChange}
                            onSearch={handleSearch}
                            onClear={() => {
                                clearFilters();
                                router.get(
                                    route("admin.students"),
                                    {},
                                    { preserveState: true }
                                );
                            }}
                        />
                        <div className="btn-group mt-3 mt-md-0">
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

                    <div className="card-body px-4">
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
