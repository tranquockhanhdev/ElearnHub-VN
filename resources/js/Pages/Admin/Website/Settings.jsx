import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AdminLayout from "../../../Components/Layouts/AdminLayout";
import CreateUserModal from "@/Pages/Admin/User/CreateUserModal";
import EditUserModal from "@/Pages/Admin/User/EditUserModal";
import { toast } from "react-toastify";
export default function Settings({ setting, admins }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        site_name: setting?.site_name || "",
        contact_email: setting?.contact_email || "",
        support_phone: setting?.support_phone || "",
        facebook_url: setting?.facebook_url || "",
        footer_text: setting?.footer_text || "",
        maintenance_mode: setting?.maintenance_mode ? true : false,
        site_logo_url: setting?.site_logo_url || "",
        site_logo: null,
    });
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { flash } = usePage().props;
    const [message, setMessage] = useState("");
    const { auth } = usePage().props;
    const admin = auth.user;
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.settings.update"), {
            preserveScroll: true,
        });
    };

    const handleLogoChange = (e) => {
        setData("site_logo", e.target.files[0]);
    };

    const handleLogoUpload = (e) => {
        e.preventDefault();
        post(route("admin.settings.uploadLogo"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset("site_logo");
            },
        });
    };
    const handleRemoveLogo = (e) => {
        e.preventDefault();
        post(route("admin.settings.removeLogo"), {
            preserveScroll: true,
        });
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
    return (
        <AdminLayout>
            <Head title="Admin Settings" />
            <div className="page-content-wrapper border">
                <div className="row">
                    <div className="col-12 mb-3">
                        <h1 className="h3 mb-2 mb-sm-0">Admin Cài Đặt</h1>
                    </div>
                </div>
                <div className="row g-4">
                    {/* Left menu */}
                    <div className="col-xl-3">
                        <ul className="nav nav-pills nav-tabs-bg-dark flex-column">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    data-bs-toggle="tab"
                                    href="#tab-1"
                                >
                                    <i className="fas fa-globe fa-fw me-2"></i>
                                    Cài đặt website
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    href="#tab-4"
                                >
                                    <i className="fas fa-user-circle fa-fw me-2"></i>
                                    Cài đặt tài khoản
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Right content */}
                    <div className="col-xl-9">
                        <div className="tab-content">
                            {/* Tab 1: Website Settings */}
                            <div className="tab-pane show active" id="tab-1">
                                <div className="card shadow">
                                    <div className="card-header border-bottom">
                                        <h5 className="card-header-title">
                                            Cài đặt thông tin website
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        {/* Main Settings Form */}
                                        <form
                                            onSubmit={handleSubmit}
                                            className="row g-4"
                                        >
                                            {/* Site Name */}
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Site Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={data.site_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "site_name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.site_name && (
                                                    <div className="text-danger">
                                                        {errors.site_name}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contact Email */}
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Contact Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={data.contact_email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contact_email",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.contact_email && (
                                                    <div className="text-danger">
                                                        {errors.contact_email}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Support Phone */}
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Support Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={data.support_phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "support_phone",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* Facebook URL */}
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Facebook URL
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={data.facebook_url}
                                                    onChange={(e) =>
                                                        setData(
                                                            "facebook_url",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* Footer Text */}
                                            <div className="col-12">
                                                <label className="form-label">
                                                    Footer Text
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    value={data.footer_text}
                                                    onChange={(e) =>
                                                        setData(
                                                            "footer_text",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* Maintenance Mode */}
                                            <div className="col-12">
                                                <label className="form-label">
                                                    Maintenance Mode
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={
                                                        data.maintenance_mode
                                                            ? "1"
                                                            : "0"
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "maintenance_mode",
                                                            e.target.value ===
                                                                "1"
                                                        )
                                                    }
                                                >
                                                    <option value="0">
                                                        Disabled
                                                    </option>
                                                    <option value="1">
                                                        Enabled
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="col-12 mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? "Saving..."
                                                        : "Save Settings"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* Logo Upload Card (separated) */}
                                <div className="card mt-4">
                                    <div className="card-header border-bottom">
                                        <h5 className="card-header-title">
                                            Upload Site Logo
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        {/* Current Logo */}
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Current Logo
                                            </label>
                                            <br />
                                            {setting?.site_logo_url ? (
                                                <div>
                                                    <img
                                                        src={
                                                            setting.site_logo_url
                                                        }
                                                        alt="Site Logo"
                                                        style={{
                                                            maxHeight: 80,
                                                        }}
                                                    />
                                                    <form
                                                        onSubmit={
                                                            handleRemoveLogo
                                                        }
                                                        className="mt-2"
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            Remove Logo
                                                        </button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <span>No logo uploaded</span>
                                            )}
                                        </div>

                                        {/* Upload Form */}
                                        <form onSubmit={handleLogoUpload}>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Upload New Logo
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={handleLogoChange}
                                                    accept="image/*"
                                                />
                                                {errors.site_logo && (
                                                    <div className="text-danger">
                                                        {errors.site_logo}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={processing}
                                            >
                                                Upload Logo
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* Tab 4: Account Settings (chưa làm) */}
                            {/* Tab 2: Admin Account */}
                            <div className="tab-pane" id="tab-4">
                                <div className="card shadow">
                                    <div className="card-header border-bottom">
                                        <h5 className="card-header-title">
                                            Thông tin Quản trị viên
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-4">
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Admin Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={admin?.name ?? ""}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={admin?.email ?? ""}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={admin?.phone ?? ""}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label">
                                                    Role
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value="Admin"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5>Tài khoản Quản trị viên</h5>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowModal(true)}
                                        >
                                            <i className="fas fa-plus me-1"></i>{" "}
                                            Thêm tài khoản
                                        </button>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {admins.length > 0 ? (
                                                    admins.map(
                                                        (item, index) => (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    {index + 1}
                                                                </td>
                                                                <td>
                                                                    {item.name}
                                                                </td>
                                                                <td>
                                                                    {item.email}
                                                                </td>
                                                                <td>
                                                                    {item.phone ??
                                                                        "-"}
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`badge rounded-pill px-3 py-1 ${
                                                                            item.status ===
                                                                            "active"
                                                                                ? "bg-success text-white"
                                                                                : item.status ===
                                                                                  "inactive"
                                                                                ? "bg-danger text-white"
                                                                                : "bg-secondary text-white"
                                                                        }`}
                                                                    >
                                                                        {item.status
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                            item.status?.slice(
                                                                                1
                                                                            ) ||
                                                                            "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-warning me-2"
                                                                        onClick={() => {
                                                                            setSelectedUser(
                                                                                admins.find(
                                                                                    (
                                                                                        u
                                                                                    ) =>
                                                                                        u.id ===
                                                                                        item.id
                                                                                )
                                                                            );
                                                                            setShowEditModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => {
                                                                            setConfirmDeleteId(
                                                                                admins.find(
                                                                                    (
                                                                                        u
                                                                                    ) =>
                                                                                        u.id ===
                                                                                        item.id
                                                                                )
                                                                                    .id
                                                                            );
                                                                            setShowConfirmModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center"
                                                        >
                                                            No admin accounts
                                                            found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            </div>
        </AdminLayout>
    );
}
