import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheckIcon,
    ComputerDesktopIcon,
    DocumentArrowDownIcon,
    PlayCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import UserLayout from '../../Components/Layouts/UserLayout';

const SEBRequired = () => {
    return (
        <UserLayout>
            <>
                <Head title="Yêu cầu Safe Exam Browser - K-EDU" />

                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                    {/* Header Section */}
                    <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                        </div>
                        <div className="relative max-w-3xl mx-auto px-4 py-12">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold mb-3">
                                    Yêu cầu Safe Exam Browser
                                </h1>
                                <p className="text-lg text-orange-100 mb-4 max-w-2xl mx-auto">
                                    Để đảm bảo tính bảo mật, bạn cần cài đặt Safe Exam Browser
                                </p>
                                <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                    Bắt buộc để truy cập bài học
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        {/* Important Notice */}
                        <div className="mb-6">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <ExclamationTriangleIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-bold mb-1">Thông báo quan trọng</h3>
                                        <p className="text-orange-100 text-sm">
                                            Bạn không thể truy cập bài học mà không sử dụng Safe Exam Browser.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What is SEB - Simplified */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                                <h2 className="text-lg font-bold text-white">Safe Exam Browser là gì?</h2>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 text-sm mb-3">
                                    Ứng dụng duyệt web bảo mật, ngăn chặn truy cập các ứng dụng khác trong quá trình học.
                                </p>
                                <div className="grid md:grid-cols-3 gap-3">
                                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                                        <ShieldCheckIcon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                                        <h4 className="font-semibold text-gray-900 text-sm">Bảo mật cao</h4>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg text-center">
                                        <ComputerDesktopIcon className="w-6 h-6 text-green-600 mx-auto mb-1" />
                                        <h4 className="font-semibold text-gray-900 text-sm">Kiểm soát</h4>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                                        <CheckCircleIcon className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                                        <h4 className="font-semibold text-gray-900 text-sm">Dễ sử dụng</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download and Setup */}
                        <div className="grid lg:grid-cols-2 gap-6 mb-8">
                            {/* Download Section */}
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                                    <div className="flex items-center text-white">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                                            <DocumentArrowDownIcon className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-lg font-bold">Tải xuống và cài đặt</h2>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-1 text-sm">Bước 1: Tải phần mềm</h4>
                                            <p className="text-xs text-gray-600 mb-2">
                                                Tải Safe Exam Browser cho hệ điều hành của bạn
                                            </p>
                                            <a
                                                href="https://safeexambrowser.org/download_en.html"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                                            >
                                                <DocumentArrowDownIcon className="w-3 h-3 mr-1" />
                                                Tải SEB
                                            </a>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-1 text-sm">Bước 2: File cấu hình</h4>
                                            <p className="text-xs text-gray-600 mb-2">
                                                Tải file cấu hình K-EDU
                                            </p>
                                            <a
                                                href="https://drive.google.com/file/d/19G3KVITY8N0xIbtzQBuKL9_rIT7sKIC5/view?usp=sharing"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                                            >
                                                <DocumentArrowDownIcon className="w-3 h-3 mr-1" />
                                                Tải cấu hình
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guide Section */}
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                                    <div className="flex items-center text-white">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                                            <PlayCircleIcon className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-lg font-bold">Hướng dẫn</h2>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-1 text-sm">Video hướng dẫn</h4>
                                            <p className="text-xs text-gray-600 mb-2">
                                                Xem video cài đặt từng bước
                                            </p>
                                            <a
                                                href="https://drive.google.com/drive/u/0/folders/1wrKdUk8DZNdPR4qDiA3ssBWKCVNWDol3"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium"
                                            >
                                                <PlayCircleIcon className="w-3 h-3 mr-1" />
                                                Xem hướng dẫn
                                            </a>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-1 text-sm">Lưu ý quan trọng</h4>
                                            <ul className="text-xs text-gray-600 space-y-0.5">
                                                <li>• Tắt antivirus tạm thời</li>
                                                <li>• Chạy với quyền Administrator</li>
                                                <li>• Không dùng máy ảo</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step by Step Guide - Simplified */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
                            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4">
                                <h2 className="text-lg font-bold text-white">3 bước đơn giản</h2>
                            </div>
                            <div className="p-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-lg font-bold text-blue-600">1</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">Tải và cài đặt</h3>
                                        <p className="text-xs text-gray-600">Tải SEB từ trang chính thức</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-lg font-bold text-green-600">2</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">Import cấu hình</h3>
                                        <p className="text-xs text-gray-600">Tải và import file cấu hình K-EDU</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-lg font-bold text-purple-600">3</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">Bắt đầu học</h3>
                                        <p className="text-xs text-gray-600">Khởi động SEB và truy cập K-EDU</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Section - Simplified */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg mb-6">
                            <div className="text-center">
                                <h2 className="text-xl font-bold mb-2">Cần hỗ trợ?</h2>
                                <p className="text-blue-100 mb-4 text-sm">
                                    Liên hệ với chúng tôi nếu gặp khó khăn
                                </p>
                                <div className="grid md:grid-cols-2 gap-3 text-center">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                        <p className="font-semibold text-sm">Email</p>
                                        <p className="text-blue-100 text-sm">support@k-edu.vn</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                        <p className="font-semibold text-sm">Hotline</p>
                                        <p className="text-blue-100 text-sm">1900-xxx-xxx</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Return Button */}
                        <div className="text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Quay về trang chủ
                            </Link>
                        </div>
                    </div>


                </div>
            </>
        </UserLayout>
    );
};

export default SEBRequired;
