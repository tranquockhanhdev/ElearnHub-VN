import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DocumentModal = ({ isOpen, onClose, document }) => {
    if (!isOpen || !document) return null;

    const renderDocumentContent = () => {
        const fileType = document.file_type?.toLowerCase();

        // Xử lý đường dẫn file đúng
        let fileUrl = document.file_url;

        // Nếu là đường dẫn local storage
        if (fileUrl.startsWith('storage/')) {
            fileUrl = `${window.location.origin}/${fileUrl}`;
        }
        // Nếu không phải URL đầy đủ
        else if (!fileUrl.startsWith('http')) {
            fileUrl = `${window.location.origin}/storage/${fileUrl}`;
        }

        switch (fileType) {
            case 'pdf':
                return (
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="p-3 border-b">
                            <h3 className="text-base font-medium text-gray-900">{document.title}</h3>
                            <div className="flex space-x-2 mt-2">
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                >
                                    Mở tab mới
                                </a>
                                <a
                                    href={fileUrl}
                                    download
                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                >
                                    Tải xuống
                                </a>
                            </div>
                        </div>

                        {/* PDF Viewer using iframe - Điều chỉnh cho laptop */}
                        <div className="p-2">
                            <iframe
                                src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1&page=1&view=FitH&zoom=85`}
                                width="100%"
                                height="450px"
                                style={{ border: 'none' }}
                                title={document.title}
                                onError={(e) => {
                                    console.error('Iframe load error:', e);
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />

                            {/* Fallback nếu iframe không load được */}
                            <div style={{ display: 'none' }} className="text-center py-6">
                                <p className="text-gray-600 mb-3 text-sm">
                                    Không thể hiển thị PDF trong trình duyệt này.
                                </p>
                                <div className="space-y-2">
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                    >
                                        Mở trong tab mới
                                    </a>
                                    <br />
                                    <a
                                        href={fileUrl}
                                        download
                                        className="inline-block px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                    >
                                        Tải xuống
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'doc':
            case 'docx':
                return (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h3 className="text-base font-medium text-gray-900 mb-3">{document.title}</h3>
                        <div className="text-center">
                            <p className="text-gray-600 mb-3 text-sm">
                                File Word không thể xem trực tiếp trên trình duyệt.
                            </p>
                            <div className="space-y-2">
                                <a
                                    href={fileUrl}
                                    download
                                    className="inline-block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    Tải xuống để xem
                                </a>
                                <div className="text-xs text-gray-500">
                                    <p>Hoặc sử dụng Office Online:</p>
                                    <a
                                        href={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Xem online với Office
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h3 className="text-base font-medium text-gray-900 mb-3">{document.title}</h3>
                        <div className="text-center">
                            <p className="text-gray-600 mb-3 text-sm">
                                Loại file này không được hỗ trợ xem trực tiếp.
                            </p>
                            <a
                                href={fileUrl}
                                download
                                className="inline-block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                                Tải xuống
                            </a>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-2 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal - Điều chỉnh kích thước cho laptop */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh]">
                    {/* Header - Thu gọn */}
                    <div className="bg-white px-3 pt-3 pb-2 sm:p-4 sm:pb-2">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Xem tài liệu
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content - Điều chỉnh chiều cao */}
                        <div className="max-h-[75vh] overflow-y-auto">
                            {renderDocumentContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentModal;