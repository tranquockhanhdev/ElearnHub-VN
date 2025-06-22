import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "../../../Components/Layouts/AdminLayout";
import CourseCard from "../../../Components/Admin/CourseCard";
import DeleteConfirmModal from "../../../Components/Common/DeleteConfirmModal";
const AdminCourseList = ({ courses, stats }) => {
    // --- Get tab from URL if exists
    const searchParams = new URLSearchParams(window.location.search);
    const defaultTab = searchParams.get("view") || "grid";
    const [showModal, setShowModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [activeTab, setActiveTab] = useState(defaultTab);

    // --- Update URL when tab changes (without full reload)
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set("view", tab);
        router.get(
            url.pathname + url.search,
            {},
            { preserveScroll: true, replace: true }
        );
    };

    const openDeleteModal = (id) => {
        setSelectedCourseId(id);
        setShowModal(true);
    };
    const confirmDelete = () => {
        router.delete(`/admin/courses/${selectedCourseId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setSelectedCourseId(null);
            },
        });
    };

    const renderPagination = () => {
        const pages = [];
        const viewParam = `&view=${activeTab}`; // 👈 preserve view in pagination

        for (let i = 1; i <= courses.last_page; i++) {
            pages.push(
                <Link
                    preserveScroll
                    key={i}
                    href={`?page=${i}${viewParam}`}
                    className={`page-link ${
                        courses.current_page === i ? "active" : ""
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
    // Thêm vào đầu component:
    const { filters, categories = [], instructors = [] } = usePage().props;
    const [filterValues, setFilterValues] = useState({
        search: filters?.search || "",
        category: filters?.category || "",
        status: filters?.status || "",
        instructor: filters?.instructor || "",
        sort_by: filters?.sort_by || "created_at",
        sort_order: filters?.sort_order || "desc",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterValues((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        router.get(
            route("admin.admin-course"), // Thay bằng route name nếu có
            {
                ...filterValues,
                view: activeTab,
            },
            {
                preserveScroll: true,
                replace: true,
            }
        );
    };
    return (
        <AdminLayout>
            <div className="page-content-wrapper border">
                <div className="row mb-3">
                    <div className="col-12 d-sm-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-2 mb-sm-0">
                            Course List{" "}
                            <span className="badge bg-orange bg-opacity-10 text-orange">
                                {courses.total} total
                            </span>
                        </h1>
                        <Link
                            href="/admin/courses/create"
                            className="btn btn-sm btn-primary mb-0"
                        >
                            Create a Course
                        </Link>
                    </div>
                </div>
                {/* Stats cards */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div
                            className="p-4 rounded border text-center"
                            style={{
                                backgroundColor: "#ecfdf5",
                                borderColor: "#10b981",
                                color: "#059669",
                            }}
                        >
                            <h6 className="fw-semibold">Activated Courses</h6>
                            <h2 className="fw-bold">{stats.activated}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div
                            className="p-4 rounded border text-center"
                            style={{
                                backgroundColor: "#eef4ff",
                                borderColor: "#3b82f6",
                                color: "#1d4ed8",
                            }}
                        >
                            <h6 className="fw-semibold">Inactive Courses</h6>
                            <h2 className="fw-bold">{stats.inactivated}</h2>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div
                            className="p-4 rounded border text-center"
                            style={{
                                backgroundColor: "#fffbeb",
                                borderColor: "#f59e0b",
                                color: "#d97706",
                            }}
                        >
                            <h6 className="fw-semibold">Pending Courses</h6>
                            <h2 className="fw-bold">{stats.pending}</h2>
                        </div>
                    </div>
                </div>
                <div className="row g-2 align-items-end mb-4">
                    <div className="col-md-3">
                        <label className="form-label">Search</label>
                        <input
                            type="text"
                            name="search"
                            className="form-control"
                            placeholder="Search by title..."
                            value={filterValues.search}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            className="form-select"
                            value={filterValues.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            className="form-select"
                            value={filterValues.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Instructor</label>
                        <select
                            name="instructor"
                            className="form-select"
                            value={filterValues.instructor}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Instructors</option>
                            {instructors.map((instructor) => (
                                <option
                                    key={instructor.id}
                                    value={instructor.id}
                                >
                                    {instructor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-1">
                        <label className="form-label">Sort By</label>
                        <select
                            name="sort_by"
                            className="form-select"
                            value={filterValues.sort_by}
                            onChange={handleFilterChange}
                        >
                            <option value="created_at">Created Date</option>
                            <option value="title">Title</option>
                            <option value="price">Price</option>
                        </select>
                    </div>

                    <div className="col-md-1">
                        <label className="form-label">Order</label>
                        <select
                            name="sort_order"
                            className="form-select"
                            value={filterValues.sort_order}
                            onChange={handleFilterChange}
                        >
                            <option value="asc">Asc</option>
                            <option value="desc">Desc</option>
                        </select>
                    </div>

                    <div className="col-md-1 d-flex gap-1">
                        <button
                            className="btn btn-outline-secondary w-50"
                            title="Clear filters"
                            onClick={() => {
                                setFilterValues({
                                    search: "",
                                    category: "",
                                    status: "",
                                    instructor: "",
                                    sort_by: "created_at",
                                    sort_order: "desc",
                                });

                                const url = new URL(window.location.href);
                                const view =
                                    url.searchParams.get("view") || "grid";

                                router.get(
                                    route("admin.admin-course"),
                                    { view },
                                    {
                                        preserveScroll: true,
                                        replace: true,
                                    }
                                );
                            }}
                        >
                            <i className="bi bi-x-circle"></i>
                        </button>

                        <button
                            className="btn btn-primary w-50"
                            title="Apply filters"
                            onClick={applyFilters}
                        >
                            <i className="bi bi-funnel"></i>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${
                                activeTab === "grid" ? "active" : ""
                            }`}
                            onClick={() => handleTabChange("grid")}
                        >
                            Grid View
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${
                                activeTab === "list" ? "active" : ""
                            }`}
                            onClick={() => handleTabChange("list")}
                        >
                            List View
                        </button>
                    </li>
                </ul>

                {/* Grid View */}
                {activeTab === "grid" && (
                    <>
                        {courses.data.length > 0 ? (
                            <div className="row g-4">
                                {courses.data.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        onDelete={() =>
                                            openDeleteModal(course.id)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 border rounded">
                                No courses found
                            </div>
                        )}
                    </>
                )}

                {/* List View */}
                {activeTab === "list" && (
                    <div className="table-responsive border rounded">
                        <table className="table table-hover table-nowrap">
                            <thead className="table-light">
                                <tr>
                                    <th>Title</th>
                                    <th>Categories</th>
                                    <th>Instructor</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.data.map((course) => (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>
                                            {course.categories
                                                ?.map((c) => c.name)
                                                .join(", ") || "N/A"}
                                        </td>
                                        <td>
                                            {course.instructor?.name || "N/A"}
                                        </td>
                                        <td>${course.price}</td>
                                        <td>
                                            <Link
                                                href={`/admin/courses/${course.id}/edit`}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={() =>
                                                    openDeleteModal(course.id)
                                                }
                                            >
                                                <i className="bi bi-trash me-2"></i>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {courses.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No courses found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {courses.last_page > 1 && renderPagination()}
            </div>
            <DeleteConfirmModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmDelete}
                title="Delete Course"
                message="Are you sure you want to delete this course? This action cannot be undone."
            />
        </AdminLayout>
    );
};

export default AdminCourseList;
