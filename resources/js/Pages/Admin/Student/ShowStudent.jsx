import React from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Components/Layouts/AdminLayout";
const ShowStudent = ({ student, enrollments }) => {
    const { data } = enrollments;
    const renderPagination = (enrollments) => {
        const pages = [];

        for (let i = 1; i <= enrollments.last_page; i++) {
            pages.push(
                <Link
                    key={i}
                    href={`?page=${i}`}
                    className={`page-link ${
                        enrollments.current_page === i ? "active" : ""
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
            <div className="p-6 space-y-8">
                {/* Info học viên (giữ nguyên như phiên bản cũ) */}
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">
                        Thông tin học viên
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p>
                                <span className="font-semibold">Tên:</span>{" "}
                                {student.name}
                            </p>
                            <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {student.email}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Số điện thoại:
                                </span>{" "}
                                {student.phone || "Chưa cập nhật"}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-semibold">
                                    Trạng thái:
                                </span>{" "}
                                {student.status === "active"
                                    ? "Hoạt động"
                                    : "Đã chặn"}
                            </p>
                            <p>
                                <span className="font-semibold">Ngày tạo:</span>{" "}
                                {new Date(
                                    student.created_at
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-semibold">Vai trò:</span>{" "}
                                Học viên
                            </p>
                        </div>
                    </div>
                </div>

                {/* Danh sách khóa học */}
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">
                        Khóa học đã đăng ký
                    </h2>

                    {data.length > 0 ? (
                        <>
                            <table className="min-w-full bg-white border border-gray-200 rounded-md">
                                <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="px-4 py-2 border-b">
                                            #
                                        </th>
                                        <th className="px-4 py-2 border-b">
                                            Tên khóa học
                                        </th>
                                        <th className="px-4 py-2 border-b">
                                            Ngày đăng ký
                                        </th>
                                        <th className="px-4 py-2 border-b">
                                            Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((enrollment, index) => (
                                        <tr key={enrollment.id}>
                                            <td className="px-4 py-2 border-b">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {enrollment.course?.title ||
                                                    "Không có dữ liệu"}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {new Date(
                                                    enrollment.enrolled_at
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-sm font-medium 
                                                ${
                                                    enrollment.status ===
                                                    "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}
                                                >
                                                    {enrollment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {enrollments.last_page > 1 &&
                                renderPagination(enrollments)}
                        </>
                    ) : (
                        <p className="text-gray-600">
                            Học viên chưa đăng ký khóa học nào.
                        </p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ShowStudent;
