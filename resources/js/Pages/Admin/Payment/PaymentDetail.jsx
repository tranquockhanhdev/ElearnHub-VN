import React from "react";
import AdminLayout from "@/Components/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

const PaymentDetail = ({ payment }) => {
    return (
        <AdminLayout>
            <div className="page-content-wrapper border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h4 mb-0">Chi tiết thanh toán</h1>
                    <Link
                        href={route("admin.payments.index")}
                        className="btn btn-secondary"
                    >
                        <i className="bi bi-arrow-left me-1"></i> Quay lại
                    </Link>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="mb-4 text-primary fw-bold">
                            Thông tin thanh toán
                        </h5>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Học viên:</strong>{" "}
                                {payment.student?.name}
                            </div>
                            <div className="col-md-6">
                                <strong>Email:</strong> {payment.student?.email}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Khóa học:</strong>{" "}
                                {payment.course?.title}
                            </div>
                            <div className="col-md-6">
                                <strong>Phương thức:</strong>{" "}
                                {payment.method?.name}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Số tiền:</strong>{" "}
                                {payment.amount.toLocaleString()} đ
                            </div>
                            <div className="col-md-6">
                                <strong>Trạng thái:</strong>{" "}
                                <span
                                    className={`badge bg-${
                                        payment.status === "completed"
                                            ? "success"
                                            : payment.status === "pending"
                                            ? "warning"
                                            : "danger"
                                    }`}
                                >
                                    {payment.status}
                                </span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Thời gian thanh toán:</strong>{" "}
                                {new Date(payment.payment_time).toLocaleString(
                                    "vi-VN"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PaymentDetail;
