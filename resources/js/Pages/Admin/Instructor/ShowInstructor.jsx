import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { usePage, Head, router } from "@inertiajs/react";
import AdminLayout from "../../../Components/Layouts/AdminLayout";
import { route } from "ziggy-js";

export default function InstructorDetail({ instructor, courses }) {
    const { courseStats } = usePage().props;

    const totalCourses = courseStats.total;
    const activeCourses = courseStats.active;
    const pendingCourses = courseStats.pending;
    const inactiveCourses = courseStats.inactive;
    const profile = instructor.instructor;
    const { flash } = usePage().props;

    const [message, setMessage] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [form, setForm] = useState({
        bio: profile?.bio || "",
        profession: profile?.profession || "",
        facebook_url: profile?.facebook_url || "",
        twitter_url: profile?.twitter_url || "",
        linkedin_url: profile?.linkedin_url || "",
    });

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            const timeout = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timeout);
        }
    }, [flash]);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = new FormData();
        Object.keys(form).forEach((key) => {
            payload.append(key, form[key]);
        });

        if (avatarFile) {
            payload.append("avatar", avatarFile);
        }

        payload.append("_method", "PUT");

        router.post(route("admin.instructors.update", instructor.id), payload, {
            forceFormData: true,
            onSuccess: () => setShowEdit(false),
        });
    };

    const renderPagination = () => {
        const pages = [];

        for (let i = 1; i <= courses.last_page; i++) {
            pages.push(
                <Link
                    preserveScroll
                    key={i}
                    href={`?page=${i}`}
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

    const handleRemoveAvatar = () => {
        if (confirm("Bạn có chắc muốn xoá ảnh đại diện?")) {
            router.delete(
                route("admin.instructors.remove-avatar", instructor.id),
                {
                    onSuccess: () => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                    },
                }
            );
        }
    };

    return (
        <AdminLayout>
            <Head title={`Instructor - ${instructor.full_name}`} />

            <div className="page-content-wrapper border p-4">
                {/* Title */}
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="h3 mb-0 text-dark">Instructor Detail</h1>
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
                <div className="row g-4">
                    {/* Personal Info - Left Side */}
                    <div className="col-xxl-6 col-lg-8">
                        <div className="card border rounded-3 shadow-sm h-100">
                            <div className="card-header bg-light border-bottom">
                                <h5 className="card-header-title mb-0 text-dark">
                                    Personal Information
                                </h5>
                            </div>
                            <div className="card-body">
                                {/* Avatar & Name */}
                                <div className="d-flex align-items-center mb-4 gap-3">
                                    {instructor.instructor?.avatar ? (
                                        <img
                                            src={instructor.instructor.avatar}
                                            alt="Instructor Avatar"
                                            className="rounded-circle"
                                            width="80"
                                            height="80"
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold"
                                            style={{ width: 80, height: 80 }}
                                        >
                                            N/A
                                        </div>
                                    )}
                                    <div>
                                        <h5 className="mb-0 text-dark">
                                            {instructor.name}
                                        </h5>
                                        <div className="text-muted fst-italic">
                                            {instructor.instructor
                                                ?.profession || "No profession"}
                                        </div>
                                    </div>
                                </div>

                                {/* Info List */}
                                <ul className="list-group list-group-borderless">
                                    <li className="list-group-item">
                                        <strong>Name:</strong>{" "}
                                        <span className="text-dark">
                                            {instructor.name}
                                        </span>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Mobile:</strong>{" "}
                                        <span className="text-dark">
                                            {instructor.phone}
                                        </span>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Email:</strong>{" "}
                                        <span className="text-dark">
                                            {instructor.email}
                                        </span>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Joining Date:</strong>{" "}
                                        <span className="text-dark">
                                            {instructor.created_at}
                                        </span>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Bio:</strong>{" "}
                                        <span className="text-dark">
                                            {instructor.instructor?.bio ||
                                                "No bio available"}
                                        </span>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Social:</strong>{" "}
                                        <div className="mt-1 d-flex gap-2">
                                            {instructor.instructor
                                                ?.facebook_url && (
                                                <a
                                                    href={
                                                        instructor.instructor
                                                            .facebook_url
                                                    }
                                                    className="text-primary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Facebook
                                                </a>
                                            )}
                                            {instructor.instructor
                                                ?.twitter_url && (
                                                <a
                                                    href={
                                                        instructor.instructor
                                                            .twitter_url
                                                    }
                                                    className="text-info"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Twitter
                                                </a>
                                            )}
                                            {instructor.instructor
                                                ?.linkedin_url && (
                                                <a
                                                    href={
                                                        instructor.instructor
                                                            .linkedin_url
                                                    }
                                                    className="text-primary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    LinkedIn
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                </ul>
                                <button
                                    className="btn btn-primary mb-3"
                                    onClick={() => setShowEdit(true)}
                                >
                                    Chỉnh sửa thông tin
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats - Right Side - Redesigned */}
                    <div className="col-xxl-6 col-lg-4">
                        <div className="card border rounded-3 shadow-sm h-100">
                            <div className="card-header bg-light border-bottom">
                                <h5 className="card-header-title mb-0 text-dark">
                                    Course Statistics
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-column gap-3">
                                    {/* Total Courses */}
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 rounded border">
                                        <div>
                                            <h6 className="mb-1 text-primary">
                                                Total Courses
                                            </h6>
                                            <span className="fw-bold fs-5 text-dark">
                                                {totalCourses}
                                            </span>
                                        </div>
                                        <i className="bi bi-collection-play fs-3 text-primary"></i>
                                    </div>

                                    {/* Active Courses */}
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded border">
                                        <div>
                                            <h6 className="mb-1 text-success">
                                                Active
                                            </h6>
                                            <span className="fw-bold fs-5 text-dark">
                                                {activeCourses}
                                            </span>
                                        </div>
                                        <i className="bi bi-check-circle fs-3 text-success"></i>
                                    </div>

                                    {/* Pending Courses */}
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-warning bg-opacity-10 rounded border">
                                        <div>
                                            <h6 className="mb-1 text-warning">
                                                Pending
                                            </h6>
                                            <span className="fw-bold fs-5 text-dark">
                                                {pendingCourses}
                                            </span>
                                        </div>
                                        <i className="bi bi-clock-history fs-3 text-warning"></i>
                                    </div>

                                    {/* Inactive Courses */}
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded border">
                                        <div>
                                            <h6 className="mb-1 text-danger">
                                                Inactive
                                            </h6>
                                            <span className="fw-bold fs-5 text-dark">
                                                {inactiveCourses}
                                            </span>
                                        </div>
                                        <i className="bi bi-x-circle fs-3 text-danger"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course List */}
                    <div className="col-12">
                        <div className="card border rounded-3 shadow-sm">
                            <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 text-dark">Courses List</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover table-bordered align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="text-dark">
                                                    Course Name
                                                </th>
                                                <th className="text-dark">
                                                    Categories
                                                </th>
                                                <th className="text-dark">
                                                    Status
                                                </th>
                                                <th className="text-dark">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.data.map((course) => (
                                                <tr key={course.id}>
                                                    <td className="text-dark">
                                                        <a
                                                            href={`/courses/${course.id}`}
                                                            className="fw-semibold text-primary text-decoration-none"
                                                        >
                                                            {course.title}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        {course.categories &&
                                                        course.categories
                                                            .length > 0 ? (
                                                            course.categories.map(
                                                                (category) => (
                                                                    <span
                                                                        key={
                                                                            category.id
                                                                        }
                                                                        className="badge bg-info-subtle text-info rounded-pill me-1"
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </span>
                                                                )
                                                            )
                                                        ) : (
                                                            <span className="text-muted">
                                                                No Categories
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge rounded-pill px-3 py-2 ${
                                                                course.status ===
                                                                "active"
                                                                    ? "bg-success text-white"
                                                                    : course.status ===
                                                                      "pending"
                                                                    ? "bg-warning text-dark"
                                                                    : "bg-danger text-white"
                                                            }`}
                                                        >
                                                            {course.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                course.status.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <a
                                                            href={`/courses/${course.id}`}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            View
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                            {courses.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center text-muted"
                                                    >
                                                        No courses available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {courses.last_page > 1 &&
                                        renderPagination()}
                                </div>
                            </div>
                            {/* <div className="card-footer bg-transparent">Pagination here</div> */}
                        </div>
                    </div>
                </div>
            </div>
            {showEdit && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <form onSubmit={handleSubmit} className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Cập nhật thông tin giảng viên
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEdit(false)}
                                ></button>
                            </div>
                            <div className="modal-body row">
                                {/* Avatar preview & upload */}
                                <div className="col-md-4 text-center">
                                    <label className="form-label fw-semibold">
                                        Ảnh đại diện
                                    </label>
                                    <div className="mb-3">
                                        {avatarPreview ? (
                                            <>
                                                <img
                                                    src={avatarPreview}
                                                    alt="Preview"
                                                    className="rounded-circle border mb-2"
                                                    style={{
                                                        width: 120,
                                                        height: 120,
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleRemoveAvatar()
                                                        }
                                                    >
                                                        Xoá ảnh đại diện
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div
                                                className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 120,
                                                    height: 120,
                                                }}
                                            >
                                                No Avatar
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="form-control"
                                    />
                                </div>

                                {/* Other fields */}
                                <div className="col-md-8">
                                    {[
                                        "bio",
                                        "profession",
                                        "facebook_url",
                                        "twitter_url",
                                        "linkedin_url",
                                    ].map((field) => (
                                        <div className="mb-3" key={field}>
                                            <label className="form-label text-capitalize">
                                                {field.replace("_", " ")}
                                            </label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={form[field]}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowEdit(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
