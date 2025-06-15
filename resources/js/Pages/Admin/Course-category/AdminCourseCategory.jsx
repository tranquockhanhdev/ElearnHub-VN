import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import slugify from "slugify";
import AdminLayout from "../../../Components/Layouts/AdminLayout";

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
                                {categories.length}
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
                    <div className="card-header bg-light border-bottom">
                        <div className="row g-3 align-items-center justify-content-between">
                            <div className="col-md-8">
                                <form className="rounded position-relative">
                                    <input
                                        className="form-control bg-body"
                                        type="search"
                                        placeholder="Search"
                                    />
                                    <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0">
                                        <i className="fas fa-search fs-6"></i>
                                    </button>
                                </form>
                            </div>
                            <div className="col-md-3">
                                <select className="form-select border-0">
                                    <option value="">Sort by</option>
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                </select>
                            </div>
                        </div>
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
                                    {categories.map((category, index) => (
                                        <tr key={category.id}>
                                            <td>{index + 1}</td>
                                            <td>{category.name}</td>
                                            <td>{category.slug}</td>
                                            <td>
                                                <span
                                                    className={`btn-sm rounded-pill px-2 py-1 fw-semibold 
                          ${
                              category.status === "active"
                                  ? "bg-success text-white"
                                  : ""
                          }
                          ${
                              category.status === "inactive"
                                  ? "bg-secondary text-white"
                                  : ""
                          }
                          ${
                              category.status === "suspended"
                                  ? "bg-danger text-white"
                                  : ""
                          }`}
                                                >
                                                    {category.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        category.status.slice(
                                                            1
                                                        )}
                                                </span>
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
                                    {categories.length === 0 && (
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
