import React from "react";
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};
const PaymentStats = ({ stats }) => {
    return (
        <div className="row g-4 mb-4">
            <div className="col-md-4">
                <div
                    className="p-4 rounded text-center h-100"
                    style={{
                        backgroundColor: "#eef4ff",
                        border: "1px solid #3f83f8",
                        color: "#3f83f8",
                    }}
                >
                    <h6 className="fw-bold mb-1 text-black">
                        Doanh Thu Tháng Này
                    </h6>
                    <h2 className="fw-bold m-0">
                        {formatCurrency(stats.monthly)}
                    </h2>
                </div>
            </div>

            <div className="col-md-4">
                <div
                    className="p-4 rounded text-center h-100"
                    style={{
                        backgroundColor: "#f2edfc",
                        border: "1px solid #7e57c2",
                        color: "#7e57c2",
                    }}
                >
                    <h6 className="fw-bold mb-1 text-black">
                        Chờ Thanh Toán <i className="bi bi-info-circle"></i>
                    </h6>
                    <h2 className="fw-bold m-0">
                        {formatCurrency(stats.pending)}
                    </h2>
                </div>
            </div>

            <div className="col-md-4">
                <div
                    className="p-4 rounded text-center h-100"
                    style={{
                        backgroundColor: "#fff4e6",
                        border: "1px solid #fb8c00",
                        color: "#fb8c00",
                    }}
                >
                    <h6 className="fw-bold mb-1 text-black">Tổng Thu Nhập</h6>
                    <h2 className="fw-bold m-0">
                        {formatCurrency(stats.lifetime)}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default PaymentStats;
