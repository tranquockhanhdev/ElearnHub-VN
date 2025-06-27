import React, { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import EditUserModal from "@/Pages/Admin/User/EditUserModal";
import CreateUserModal from "@/Pages/Admin/User/CreateUserModal";
import InstructorCard from "@/Components/Admin/Common/User/InstructorCard";
import ConfirmModal from "@/Components/Admin/Common/User/ConfirmModal";
import FilterBar from "@/Components/Admin/Common/User/FilterBar";
import { toast } from "react-toastify";
import useUserFilters from "@/hooks/useUserFilters";

const AdminInstructorList = ({ instructors }) => {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("grid");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnblockModal, setShowUnblockModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isUnblocking, setIsUnblocking] = useState(false);

    const { filters, setFilters, handleChange, clearFilters } =
        useUserFilters();

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.instructors"), filters, {
            preserveState: true,
        });
    };

    const handleDelete = () => {
        if (!confirmDeleteId) return;
        setIsDeleting(true);
        router.delete(route("admin.users.destroy", { user: confirmDeleteId }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirmModal(false);
                setConfirmDeleteId(null);
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
                preserveScroll: true,
                onSuccess: () => {
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
                preserveScroll: true,
                onSuccess: () => {
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
        for (let i = 1; i <= instructors.last_page; i++) {
            pages.push(
                <Link
                    preserveScroll
                    key={i}
                    href={`?page=${i}`}
                    className={`page-link ${
                        instructors.current_page === i ? "active" : ""
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
                        <h1 className="h3 mb-0">Giảng Viên</h1>
                    </div>
                    <div className="col-md-6 text-end">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="bi bi-plus-circle me-1"></i> Thêm
                            giảng viên
                        </button>
                    </div>
                </div>

                <div className="card bg-transparent">
                    <div className="card-header bg-transparent border-bottom px-0">
                        <div className="row g-3 align-items-center justify-content-between">
                            <div className="col-md-8">
                                <FilterBar
                                    filters={filters}
                                    onChange={handleChange}
                                    onSearch={handleSearch}
                                    onClear={() => {
                                        clearFilters();
                                        router.get(
                                            route("admin.instructors"),
                                            {},
                                            { preserveState: true }
                                        );
                                    }}
                                />
                            </div>

                            <div className="col-md-3">
                                <ul className="list-inline nav nav-pills justify-content-end">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${
                                                activeTab === "grid"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => setActiveTab("grid")}
                                        >
                                            <i className="fas fa-th-large"></i>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${
                                                activeTab === "list"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => setActiveTab("list")}
                                        >
                                            <i className="fas fa-list-ul"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="card-body px-0 pt-4">
                        <div className={activeTab === "grid" ? "row g-4" : ""}>
                            {instructors.data.length === 0 ? (
                                <div className="col-12">
                                    <div className="alert alert-warning">
                                        Không có giảng viên nào.
                                    </div>
                                </div>
                            ) : (
                                instructors.data.map((instructor) => (
                                    <InstructorCard
                                        key={instructor.id}
                                        instructor={instructor}
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
                        {instructors.last_page > 1 && renderPagination()}
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

export default AdminInstructorList;
