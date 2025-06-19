import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '../../Components/Layouts/UserLayout';

const Cancel = () => {
    const { course, payment } = usePage().props;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <UserLayout>
            <Head title="Thanh toán bị hủy" />

            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Cancel Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Thanh toán bị hủy
                        </h1>
                        <p className="text-lg text-gray-600">
                            Giao dịch của bạn đã bị hủy. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Course Information */}
                        {course && (
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-white">
                                        Thông tin khóa học
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {course?.thumbnail && (
                                        <div className="mb-4">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {course.description}
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Giá khóa học:</span>
                                            <span className="font-semibold text-red-600">
                                                {formatPrice(course.price)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thời lượng:</span>
                                            <span className="font-medium">
                                                {course.duration} giờ
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Số bài học:</span>
                                            <span className="font-medium">
                                                {course.lessons_count || 0} bài
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transaction Information */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Thông tin giao dịch
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {payment && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Mã giao dịch:</span>
                                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {payment.transaction_id || payment.id}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Số tiền:</span>
                                                <span className="font-semibold text-lg text-red-600">
                                                    {formatPrice(payment.amount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Thời gian hủy:</span>
                                                <span className="font-medium">
                                                    {formatDate(payment.cancelled_at || payment.updated_at)}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Đã hủy
                                        </span>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2">Lý do hủy:</h4>
                                    <p className="text-gray-600 text-sm">
                                        Giao dịch bị hủy bởi người dùng hoặc do lỗi trong quá trình thanh toán.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Bạn có thể làm gì tiếp theo?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Thử lại</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Quay lại trang thanh toán và thử lại
                                </p>
                                {course && (
                                    <Link
                                        href={route('student.checkout.show', course.id)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                                    >
                                        Thanh toán lại
                                    </Link>
                                )}
                            </div>

                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Khóa học khác</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Khám phá các khóa học khác phù hợp
                                </p>
                                <Link
                                    href={route('courses.index')}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-200"
                                >
                                    Xem khóa học
                                </Link>
                            </div>

                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V5a2 2 0 012-2h6a2 2 0 012 2v2"></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Dashboard</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Quay về trang chủ của bạn
                                </p>
                                <Link
                                    href={route('student.dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition duration-200"
                                >
                                    Về Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Support Contact */}
                    <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Cần hỗ trợ?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Nếu bạn gặp vấn đề trong quá trình thanh toán, hãy liên hệ với chúng tôi để được hỗ trợ.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:support@k-edu.vn"
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                Gửi email hỗ trợ
                            </a>
                            <a
                                href="tel:+84123456789"
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                Gọi hotline
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default Cancel;