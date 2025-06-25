import React, { useState, useEffect } from "react";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import { router, usePage, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "react-toastify";
import ConfirmModal from "@/Components/Admin/Common/User/ConfirmModal";
import CourseGridView from "@/Components/Admin/Common/Course/CourseGridView";
import CourseTableView from "@/Components/Admin/Common/Course/CourseTableView";
import CourseFilterBar from "@/Components/Admin/Common/Course/CourseFilterBar";

const AdminCourseList = ({
    courses,
    stats,
    categories,
    instructors,
    filters,
}) => {
    const { flash } = usePage().props;

    const [activeTab, setActiveTab] = useState(filters?.tab || "grid");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        search: filters.search || "",
        category: filters.category || "",
        status: filters.status || "",
        instructor: filters.instructor || "",
        sort_by: filters.sort_by || "created_at",
        sort_order: filters.sort_order || "desc",
        tab: filters.tab || "grid",
        page: filters.page || 1,
    });

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const formatDate = (isoDate) => {
        if (!isoDate) return "---";
        return new Date(isoDate).toLocaleDateString("vi-VN");
    };

    const handleDelete = (id) => {
        setConfirmDeleteId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(route("admin.courses.destroy", { id: confirmDeleteId }), {
            onSuccess: () => {
                toast.success("Đã xóa khóa học");
                setShowConfirmModal(false);
                setConfirmDeleteId(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.admin-course"),
            { ...searchFilters, page: 1 },
            {
                preserveState: true,
            }
        );
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const updatedFilters = { ...searchFilters, tab, page: 1 };
        setSearchFilters(updatedFilters);
        router.get(route("admin.admin-course"), updatedFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const renderStats = () => (
        <div className="row g-4 mb-4">
            <div className="col-md-3">
                <div
                    className="p-4 rounded text-center h-100"
                    style={{
                        backgroundColor: "#eef4ff",
                        border: "1px solid #3f83f8",
                        color: "#3f83f8",
                    }}
                >
                    <div className="mb-2">
                        <i className="bi bi-collection-play fs-2"></i>
                    </div>
                    <h6 className="fw-bold mb-1 text-muted">Tổng khóa học</h6>
                    <h2 className="fw-bold m-0">{stats.total}</h2>
                </div>
            </div>
            <div className="col-md-3">
                <div
                    className="p-4 rounded text-center h-100"
                    style={{
                        backgroundColor: "#eafaf1",
                        border: "1px solid #3bb77e",
                        color: "#3bb77e",
                    }}
                >
                    <div className="mb-2">
                        <i className="bi bi-check-circle fs-2"></i>
                    </div>
                    <h6 className="fw-bold mb-1 text-muted">Đang hoạt động</h6>
                    <h2 className="fw-bold m-0">{stats.active}</h2>
                </div>
            </div>
            <div className="col-md-3">
                <div
                    className="p-4 rounded text-center h-100"
                    style={{
                        backgroundColor: "#fff9eb",
                        border: "1px solid #f6c23e",
                        color: "#f6c23e",
                    }}
                >
                    <div className="mb-2">
                        <i className="bi bi-hourglass-split fs-2"></i>
                    </div>
                    <h6 className="fw-bold mb-1 text-muted">Chờ duyệt</h6>
                    <h2 className="fw-bold m-0">{stats.pending}</h2>
                </div>
            </div>
            <div className="col-md-3">
                <div
                    className="p-4 rounded text-center h-100"
                    style={{
                        backgroundColor: "#f4f4f4",
                        border: "1px solid #6c757d",
                        color: "#6c757d",
                    }}
                >
                    <div className="mb-2">
                        <i className="bi bi-slash-circle fs-2"></i>
                    </div>
                    <h6 className="fw-bold mb-1 text-muted">Ngưng hoạt động</h6>
                    <h2 className="fw-bold m-0">{stats.inactive}</h2>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="page-content-wrapper border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">Danh sách khóa học</h1>
                    <Link
                        href={route("admin.courses.create")}
                        className="btn btn-primary"
                    >
                        <i className="bi bi-plus-circle me-2"></i> Thêm khóa học
                    </Link>
                </div>

                {renderStats()}

                <CourseFilterBar
                    filters={searchFilters}
                    setFilters={setSearchFilters}
                    onSearch={handleSearch}
                    categories={categories}
                    instructors={instructors}
                    activeTab={activeTab}
                />

                <div className="d-flex justify-content-end mb-3">
                    <div className="btn-group">
                        <button
                            className={`btn btn-outline-primary ${
                                activeTab === "grid" ? "active" : ""
                            }`}
                            onClick={() => handleTabChange("grid")}
                        >
                            {" "}
                            <i className="bi bi-grid"></i>
                        </button>
                        <button
                            className={`btn btn-outline-primary ${
                                activeTab === "list" ? "active" : ""
                            }`}
                            onClick={() => handleTabChange("list")}
                        >
                            {" "}
                            <i className="bi bi-list"></i>
                        </button>
                    </div>
                </div>

                {activeTab === "grid" ? (
                    <CourseGridView
                        courses={courses.data}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                    />
                ) : (
                    <CourseTableView
                        courses={courses.data}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                    />
                )}

                {courses.last_page > 1 && (
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            {Array.from(
                                { length: courses.last_page },
                                (_, i) => (
                                    <li key={i} className="page-item">
                                        <Link
                                            preserveScroll
                                            href={route("admin.admin-course", {
                                                ...searchFilters,
                                                page: i + 1,
                                            })}
                                            className={`page-link ${
                                                courses.current_page === i + 1
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            {i + 1}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </nav>
                )}

                <ConfirmModal
                    show={showConfirmModal}
                    title="Xóa khóa học"
                    message="Bạn có chắc chắn muốn xóa khóa học này?"
                    confirmText="Xóa"
                    cancelText="Hủy"
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={confirmDelete}
                    isProcessing={isDeleting}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminCourseList;
