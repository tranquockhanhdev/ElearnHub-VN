import React from 'react';
import { Head } from '@inertiajs/react';
import {
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    BookOpenIcon,
    CreditCardIcon,
    UserGroupIcon,
    LockClosedIcon,
    ClockIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import UserLayout from '../../Components/Layouts/UserLayout';

const Terms = () => {
    const currentDate = new Date().toLocaleDateString('vi-VN');

    return (
        <UserLayout>
            <>
                <Head title="Điều khoản sử dụng - K-EDU" />

                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                    {/* Header Section */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                        </div>
                        <div className="relative max-w-4xl mx-auto px-4 py-16">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                                    <DocumentTextIcon className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                    Điều khoản sử dụng
                                </h1>
                                <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                                    Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ K-EDU
                                </p>
                                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                    <ClockIcon className="w-4 h-4 mr-2" />
                                    Cập nhật: {currentDate}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-4xl mx-auto px-4 py-12">
                        {/* Important Notice */}
                        <div className="mb-8">
                            <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <ExclamationTriangleIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-bold mb-2">
                                            🚨 Chính sách không hoàn tiền
                                        </h3>
                                        <p className="text-red-100">
                                            Tất cả khóa học <strong>KHÔNG hỗ trợ hoàn tiền</strong> sau khi thanh toán thành công.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="grid gap-6">
                            {/* Section 1: Acceptance */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                                    <div className="flex items-center text-white">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                                            <span className="font-bold">1</span>
                                        </div>
                                        <h2 className="text-xl font-bold">Chấp nhận điều khoản</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 leading-relaxed">
                                        Khi sử dụng K-EDU, bạn đồng ý tuân thủ các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.
                                    </p>
                                </div>
                            </div>

                            {/* Section 2: Course Purchase Policy */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4">
                                    <div className="flex items-center text-white">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                                            <span className="font-bold">2</span>
                                        </div>
                                        <h2 className="text-xl font-bold">Chính sách mua khóa học</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                                        <ul className="space-y-2 text-sm text-red-800">
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Tất cả giao dịch đều <strong>CUỐI CÙNG</strong> và không thể hoàn tác
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Không hoàn tiền dưới bất kỳ hình thức nào
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Thanh toán = đồng ý chính sách này
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>💡 Lưu ý:</strong> Xem kỹ thông tin khóa học, thử nghiệm demo trước khi mua.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Course Access */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                                    <div className="flex items-center text-white">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                                            <span className="font-bold">3</span>
                                        </div>
                                        <h2 className="text-xl font-bold">Quyền truy cập</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid gap-3">
                                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                <span className="text-green-600">✓</span>
                                            </div>
                                            <span className="text-gray-700">Truy cập trọn đời sau khi thanh toán</span>
                                        </div>
                                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                <span className="text-green-600">✓</span>
                                            </div>
                                            <span className="text-gray-700">Không chia sẻ tài khoản hoặc nội dung</span>
                                        </div>
                                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                <span className="text-green-600">✓</span>
                                            </div>
                                            <span className="text-gray-700">Chỉ sử dụng cho mục đích học tập cá nhân</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 & 5: Combined */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Section 4: User Responsibilities */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                                        <div className="flex items-center text-white">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                                                <span className="font-bold">4</span>
                                            </div>
                                            <h2 className="text-lg font-bold">Trách nhiệm</h2>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Cung cấp thông tin chính xác
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Bảo mật tài khoản cá nhân
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Sử dụng văn minh, tôn trọng
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Tuân thủ pháp luật
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section 5: Privacy */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                                        <div className="flex items-center text-white">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                                                <span className="font-bold">5</span>
                                            </div>
                                            <h2 className="text-lg font-bold">Bảo mật</h2>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            K-EDU cam kết bảo vệ thông tin cá nhân theo quy định pháp luật và không chia sẻ cho bên thứ ba.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ?</h2>
                                    <p className="text-indigo-100 mb-6">
                                        Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 text-center">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                            <p className="font-semibold">Email</p>
                                            <p className="text-indigo-100">support@k-edu.vn</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                            <p className="font-semibold">Hotline</p>
                                            <p className="text-indigo-100">1900-xxx-xxx</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </>
        </UserLayout>
    );
};


export default Terms;
