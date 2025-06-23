import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import slugify from "slugify";
import AdminLayout from "../../../Components/Layouts/AdminLayout";
import CreateCategoryModal from "@/Components/Admin/Common/CourseCategory/CreateCategoryModal";
import EditCategoryModal from "@/Components/Admin/Common/CourseCategory/EditCategoryModal";
import DeleteConfirmModal from "@/Components/Admin/Common/CourseCategory/DeleteConfirmModal";
import { Link } from "@inertiajs/react";
import { toast } from "react-toastify";
const AdminCourseCategory = () => {
    const { categories, errors, flash } = usePage().props;

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        status: "active",
    });
    const [manualSlug, setManualSlug] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [editData, setEditData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [flashMessage, setFlashMessage] = useState(null);
    const [localErrors, setLocalErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    useEffect(() => {
        setLocalErrors(errors);
    }, [errors]);

    useEffect(() => {
        if (!manualSlug && formData.name) {
            const generatedSlug = slugify(formData.name, {
                lower: true,
                strict: true,
            });
            setFormData((prev) => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.name, manualSlug]);
    useEffect(() => {
        if (editData && !manualSlug) {
            const generatedSlug = slugify(editData.name || "", {
                lower: true,
                strict: true,
            });
            setEditData((prev) => ({ ...prev, slug: generatedSlug }));
        }
    }, [editData?.name, manualSlug]);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(route("admin.course-category.store"), formData, {
            onSuccess: () => {
                setFormData({ name: "", slug: "", status: "active" });
                setManualSlug(false);
                setShowCreateModal(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };
    const handleOpenCreateModal = () => {
        setFormData({ name: "", slug: "", status: "active" });
        setManualSlug(false);
        setLocalErrors({});
        setShowCreateModal(true);
    };
    const handleOpenEditModal = (category) => {
        setManualSlug(false);
        setEditData(category);
        setLocalErrors({});
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(
            route("admin.course-category.update", editData.id),
            editData,
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setEditData(null);
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route("admin.course-category.destroy", deleteId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteId(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };
    const handleChangeStatus = (id, newStatus) => {
        router.patch(`/admin/course-category/${id}/status`, {
            status: newStatus,
        });
    };
    const renderPagination = (categories) => {
        const pages = [];

        for (let i = 1; i <= categories.last_page; i++) {
            pages.push(
                <Link
                    preserveScroll
                    key={i}
                    href={`?page=${i}`}
                    className={`page-link ${
                        categories.current_page === i ? "active" : ""
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
    const [filters, setFilters] = useState({
        search: categories?.filters?.search || "",
        sort: categories?.filters?.sort || "",
        status: categories?.filters?.status || "",
    });
    const handleSearchSortChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route("admin.admin-course-category"), filters, {
            preserveScroll: true,
            preserveState: true,
        });
    };
    // Thực hiện gọi API lọc
    const applyFilter = (updatedFilters) => {
        router.get(route("admin.admin-course-category"), updatedFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Dùng debounce cho search để tránh spam request khi đang gõ
    let debounceTimer;
    const debounceFilter = (newFilters) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            applyFilter(newFilters);
        }, 500); // delay 500ms
    };

    return (
        <AdminLayout>
            <div className="page-content-wrapper border">
                <div className="row mb-3">
                    <div className="col-12 d-sm-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-2 mb-sm-0">
                            Danh Mục Khóa Học{" "}
                            <span className="badge bg-orange bg-opacity-10 text-orange">
                                {categories.total}
                            </span>
                        </h1>
                        <button
                            onClick={handleOpenCreateModal}
                            className="btn btn-sm btn-primary mb-0"
                        >
                            Thêm danh mục
                        </button>
                    </div>
                </div>

                <div className="card bg-transparent border">
                    <div className="card-header bg-light border-bottom py-3 px-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter(filters); // Chỉ áp dụng khi Enter
                            }}
                        >
                            <div className="row g-3 align-items-center">
                                {/* Search Input */}
                                <div className="col-12 col-md-6 position-relative">
                                    <input
                                        type="text"
                                        className="form-control ps-4"
                                        name="search"
                                        placeholder="Tìm kiếm danh mục..."
                                        value={filters.search}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                search: e.target.value,
                                            }))
                                        }
                                    />
                                    <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                </div>

                                {/* Sort Filter */}
                                <div className="col-6 col-md-2">
                                    <select
                                        className="form-select"
                                        name="sort"
                                        value={filters.sort}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const updated = {
                                                ...filters,
                                                sort: value,
                                            };
                                            setFilters(updated);
                                            applyFilter(updated); // Áp dụng ngay
                                        }}
                                    >
                                        <option value="">Sắp xếp theo</option>
                                        <option value="newest">Mới nhất</option>
                                        <option value="oldest">Cũ nhất</option>
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="col-6 col-md-2">
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={filters.status}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const updated = {
                                                ...filters,
                                                status: value,
                                            };
                                            setFilters(updated);
                                            applyFilter(updated); // Áp dụng ngay
                                        }}
                                    >
                                        <option value="">
                                            Tất cả trang thái
                                        </option>
                                        <option value="active">
                                            Hoạt động
                                        </option>
                                        <option value="inactive">
                                            Không hoạt động
                                        </option>
                                    </select>
                                </div>

                                {/* Clear Filter Button */}
                                <div className="col-12 col-md-2 text-md-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100"
                                        onClick={() => {
                                            const reset = {
                                                search: "",
                                                sort: "",
                                                status: "",
                                            };
                                            setFilters(reset);
                                            applyFilter(reset);
                                        }}
                                    >
                                        Xóa Bộ Lọc
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Tên</th>
                                        <th>Slug</th>
                                        <th>Trạng Thái</th>
                                        <th>Ngày Thêm</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.data.map((category, index) => (
                                        <tr key={category.id}>
                                            <td>
                                                {(categories.current_page - 1) *
                                                    categories.per_page +
                                                    index +
                                                    1}
                                            </td>
                                            <td>{category.name}</td>
                                            <td>{category.slug}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button
                                                        className={`btn btn-sm dropdown-toggle ${
                                                            category.status ===
                                                            "active"
                                                                ? "btn-success"
                                                                : category.status ===
                                                                  "inactive"
                                                                ? "btn-secondary"
                                                                : "btn-warning"
                                                        }`}
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        {category.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            category.status.slice(
                                                                1
                                                            )}
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        {[
                                                            "active",
                                                            "inactive",
                                                        ].map(
                                                            (statusOption) => (
                                                                <li
                                                                    key={
                                                                        statusOption
                                                                    }
                                                                >
                                                                    <button
                                                                        className={`dropdown-item ${
                                                                            statusOption ===
                                                                            category.status
                                                                                ? "active"
                                                                                : ""
                                                                        }`}
                                                                        onClick={() =>
                                                                            handleChangeStatus(
                                                                                category.id,
                                                                                statusOption
                                                                            )
                                                                        }
                                                                    >
                                                                        {statusOption
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                            statusOption.slice(
                                                                                1
                                                                            )}
                                                                    </button>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            </td>

                                            <td>
                                                {new Date(
                                                    category.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-success me-1"
                                                    onClick={() =>
                                                        handleOpenEditModal(
                                                            category
                                                        )
                                                    }
                                                >
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        confirmDelete(
                                                            category.id
                                                        )
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="text-center"
                                            >
                                                Không tìm thấy danh mục nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {categories.last_page > 1 &&
                                renderPagination(categories)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal - Create */}
            <CreateCategoryModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateSubmit}
                formData={formData}
                setFormData={setFormData}
                errors={localErrors}
                manualSlug={manualSlug}
                setManualSlug={setManualSlug}
                isSubmitting={isSubmitting}
            />

            {/* Modal - Edit */}

            <EditCategoryModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditSubmit}
                editData={editData}
                setEditData={setEditData}
                errors={localErrors}
                isSubmitting={isSubmitting}
            />

            {/* Modal - Delete Confirmation */}
            <DeleteConfirmModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </AdminLayout>
    );
};

export default AdminCourseCategory;
