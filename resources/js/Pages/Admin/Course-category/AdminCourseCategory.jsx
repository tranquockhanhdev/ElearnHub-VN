import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import slugify from "slugify";
import AdminLayout from "../../../Components/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";
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

    const [flashMessage, setFlashMessage] = useState(null);
    const [localErrors, setLocalErrors] = useState({});

    useEffect(() => {
        if (flash.success) {
            setFlashMessage({ type: "success", message: flash.success });
            setTimeout(() => setFlashMessage(null), 3000);
        }
        if (flash.error) {
            setFlashMessage({ type: "danger", message: flash.error });
            setTimeout(() => setFlashMessage(null), 3000);
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
        router.post(route("admin.course-category.store"), formData, {
            onSuccess: () => {
                setFormData({ name: "", slug: "", status: "active" });
                setManualSlug(false);
                setShowCreateModal(false);
            },
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
        router.put(
            route("admin.course-category.update", editData.id),
            editData,
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setEditData(null);
                },
            }
        );
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(route("admin.course-category.destroy", deleteId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteId(null);
            },
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
                {flashMessage && (
                    <div
                        className={`alert alert-${flashMessage.type} alert-dismissible fade show`}
                        role="alert"
                    >
                        {flashMessage.message}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setFlashMessage(null)}
                        ></button>
                    </div>
                )}

                <div className="row mb-3">
                    <div className="col-12 d-sm-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-2 mb-sm-0">
                            Course Categories{" "}
                            <span className="badge bg-orange bg-opacity-10 text-orange">
                                {categories.total}
                            </span>
                        </h1>
                        <button
                            onClick={handleOpenCreateModal}
                            className="btn btn-sm btn-primary mb-0"
                        >
                            Create a Category
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
                                        placeholder="Search categories..."
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
                                        <option value="">Sort by</option>
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
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
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
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
                                        Clear Filters
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
                                        <th>Name</th>
                                        <th>Slug</th>
                                        <th>Status</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
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
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        confirmDelete(
                                                            category.id
                                                        )
                                                    }
                                                >
                                                    Delete
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
                                                No categories found.
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
            {showCreateModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Create New Category
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleCreateSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                localErrors.name
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                });
                                                if (!manualSlug) {
                                                    const generatedSlug =
                                                        slugify(
                                                            e.target.value,
                                                            {
                                                                lower: true,
                                                                strict: true,
                                                            }
                                                        );
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        slug: generatedSlug,
                                                    }));
                                                }
                                            }}
                                        />
                                        {localErrors.name && (
                                            <div className="invalid-feedback">
                                                {localErrors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Slug
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.slug ? "is-invalid" : ""
                                            }`}
                                            value={formData.slug}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    slug: e.target.value,
                                                });
                                                setManualSlug(true);
                                            }}
                                        />
                                        {localErrors.slug && (
                                            <div className="invalid-feedback">
                                                {localErrors.slug}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Status
                                        </label>
                                        <select
                                            className="form-select"
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                            <option value="suspended">
                                                Suspended
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setShowCreateModal(false)
                                        }
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal - Edit */}
            {showEditModal && editData && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Category</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                localErrors.name
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={editData.name}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                        {localErrors.name && (
                                            <div className="invalid-feedback">
                                                {localErrors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Slug
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                localErrors.slug
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={editData.slug || ""}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    slug: e.target.value,
                                                })
                                            }
                                        />
                                        {localErrors.slug && (
                                            <div className="invalid-feedback">
                                                {localErrors.slug}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Status
                                        </label>
                                        <select
                                            className="form-select"
                                            value={editData.status}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                            <option value="suspended">
                                                Suspended
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal - Delete Confirmation */}
            {showDeleteModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">
                                    Confirm Delete
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this category?
                                This action cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCourseCategory;
