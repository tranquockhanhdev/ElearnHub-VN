import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SEBAlert = ({ onClose, onOpenApp }) => {
    const handleOpenSEB = () => {
        try {
            // Thử mở SEB bằng protocol handler
            const sebLink = 'seb://';
            const link = document.createElement('a');
            link.href = sebLink;
            link.click();

            // Thông báo cho user
            setTimeout(() => {
                const followUpAlert = document.createElement('div');
                followUpAlert.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                followUpAlert.innerHTML = `
                    <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                        <div class="text-center">
                            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">Hướng dẫn</h3>
                            <p class="text-sm text-gray-500 mb-4">
                                Nếu SEB đã được cài đặt, ứng dụng sẽ tự động mở.<br/>
                                Nếu chưa cài đặt, vui lòng tải xuống từ các liên kết bên dưới.
                            </p>
                            <button id="closeFollowUpBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(followUpAlert);

                document.getElementById('closeFollowUpBtn').onclick = () => {
                    document.body.removeChild(followUpAlert);
                };

                followUpAlert.onclick = (e) => {
                    if (e.target === followUpAlert) {
                        document.body.removeChild(followUpAlert);
                    }
                };
            }, 1500);

        } catch (error) {
            console.error('Error opening SEB:', error);
            alert('Không thể mở SEB. Vui lòng tải xuống và cài đặt từ liên kết bên dưới.');
        }

        if (onOpenApp) onOpenApp();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl transform animate-scaleIn">
                <div className="text-center">
                    {/* Icon Warning */}
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                        <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Yêu cầu Safe Exam Browser
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-600 mb-6">
                        Vui lòng mở ứng dụng SEB để tiếp tục
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleOpenSEB}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Open App
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Đóng
                        </button>
                    </div>

                    {/* Additional info */}
                    <p className="text-xs text-gray-400 mt-4">
                        Chưa cài đặt SEB? Xem hướng dẫn bên dưới
                    </p>
                </div>
            </div>

            {/* Custom styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default SEBAlert;
