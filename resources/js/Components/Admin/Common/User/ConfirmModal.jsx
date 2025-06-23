import React from "react";

const ConfirmModal = ({
    show = false,
    type = "danger", // 'danger' | 'warning' | 'success' | 'info'
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    onConfirm,
    onCancel,
    isProcessing = false,
}) => {
    if (!show) return null;

    // Icon theo type
    const getIcon = () => {
        switch (type) {
            case "warning":
                return "bi-exclamation-circle-fill text-warning";
            case "success":
                return "bi-check-circle-fill text-success";
            case "info":
                return "bi-info-circle-fill text-info";
            default:
                return "bi-exclamation-triangle-fill text-danger";
        }
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={onCancel} // ✅ click nền để đóng
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()} // ✅ tránh đóng nếu click bên trong modal
            >
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className={`modal-title text-${type}`}>{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                        ></button>
                    </div>

                    <div className="modal-body d-flex align-items-start gap-2">
                        <i className={`bi ${getIcon()} fs-4`}></i>
                        <p className="mb-0">{message}</p>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isProcessing}
                        >
                            {cancelText}
                        </button>
                        <button
                            className={`btn btn-${type}`}
                            onClick={onConfirm}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Đang xử lý..." : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
