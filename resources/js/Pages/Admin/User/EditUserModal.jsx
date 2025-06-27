import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";

const EditUserModal = ({ show, onClose, user }) => {
    const { errors } = usePage().props;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role_id: 3,
        status: "active", // hoặc giá trị mặc định phù hợp
    });

    const [localErrors, setLocalErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "",
                phone: user.phone || "",
                role_id: user.role_id || 3,
                status: user.status || 1,
            });
        }
    }, [user]);

    useEffect(() => {
        setLocalErrors(errors || {});
    }, [errors]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route("admin.users.update", user.id), formData, {
            onSuccess: () => handleClose(),
        });
    };

    const handleClose = () => {
        onClose();
        setLocalErrors({});
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white w-full max-w-2xl max-h-[95vh] rounded-2xl shadow-xl p-6 md:p-8 overflow-y-auto animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                    aria-label="Đóng"
                >
                    <span className="text-xl font-bold">&times;</span>
                </button>

                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chỉnh sửa người dùng
                    </h2>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col h-full text-sm text-gray-700 space-y-5"
                >
                    <div className="flex-grow space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                                        localErrors.name
                                            ? "border-red-500 focus:ring-red-500"
                                            : "focus:ring-blue-500"
                                    }`}
                                    required
                                />
                                {localErrors.name && (
                                    <p className="text-red-600 mt-1">
                                        {localErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                                        localErrors.email
                                            ? "border-red-500 focus:ring-red-500"
                                            : "focus:ring-blue-500"
                                    }`}
                                    required
                                />
                                {localErrors.email && (
                                    <p className="text-red-600 mt-1">
                                        {localErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Để trống nếu không đổi"
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                                        localErrors.password
                                            ? "border-red-500 focus:ring-red-500"
                                            : "focus:ring-blue-500"
                                    }`}
                                />
                                {localErrors.password && (
                                    <p className="text-red-600 mt-1">
                                        {localErrors.password}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                                        localErrors.phone
                                            ? "border-red-500 focus:ring-red-500"
                                            : "focus:ring-blue-500"
                                    }`}
                                />
                                {localErrors.phone && (
                                    <p className="text-red-600 mt-1">
                                        {localErrors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Vai trò
                                </label>
                                <select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 ${
                                        localErrors.role_id
                                            ? "border-red-500 focus:ring-red-500"
                                            : "focus:ring-blue-500"
                                    }`}
                                >
                                    <option value={1}>Admin</option>
                                    <option value={2}>Giảng viên</option>
                                    <option value={3}>Học viên</option>
                                </select>
                                {localErrors.role_id && (
                                    <p className="text-red-600 mt-1">
                                        {localErrors.role_id}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-800"
                                >
                                    Trạng thái{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={`block w-full appearance-none rounded-xl border px-4 py-2.5 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                                            localErrors.status
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
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

                                    {/* Custom dropdown icon */}
                                    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {localErrors.status && (
                                    <p className="text-sm text-red-600">
                                        {localErrors.status}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
