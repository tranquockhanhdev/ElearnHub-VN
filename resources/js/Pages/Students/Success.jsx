import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '../../Components/Layouts/UserLayout';

const Success = () => {
    const { course, payment, enrollment } = usePage().props;

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
            <Head title="Thanh toán thành công" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Thanh toán thành công!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Cảm ơn bạn đã đăng ký khóa học. Chúc bạn học tập hiệu quả!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Course Information */}
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
                                    {course?.title}
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giá khóa học:</span>
                                        <span className="font-semibold text-green-600">
                                            {formatPrice(course?.price)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số bài học:</span>
                                        <span className="font-medium">
                                            {course?.lessons_count || 0} bài
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Thông tin thanh toán
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Mã giao dịch:</span>
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                            {payment?.transaction_id || payment?.id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số tiền:</span>
                                        <span className="font-semibold text-lg text-green-600">
                                            {formatPrice(payment?.amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Thành công
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thời gian:</span>
                                        <span className="font-medium">
                                            {formatDate(payment?.created_at)}
                                        </span>
                                    </div>
                                    {enrollment && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày bắt đầu:</span>
                                            <span className="font-medium">
                                                {formatDate(enrollment.enrolled_at)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Receipt Download */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <a
                                        href={route('student.invoice.download', payment?.id)}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                                        target="_blank"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        Tải hóa đơn PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Bước tiếp theo
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Bắt đầu học</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Truy cập khóa học và bắt đầu hành trình học tập
                                </p>
                                <Link
                                    href={route('student.course.show', course?.id)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Vào học ngay
                                </Link>
                            </div>

                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Khóa học của tôi</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Xem tất cả các khóa học đã đăng ký
                                </p>
                                <Link
                                    href={route('student.courselist')}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-200"
                                >
                                    Danh sách khóa học
                                </Link>
                            </div>

                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Hồ sơ cá nhân</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Cập nhật thông tin và theo dõi tiến độ
                                </p>
                                <Link
                                    href={route('student.dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition duration-200"
                                >
                                    Xem hồ sơ
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
                            Nếu bạn có bất kỳ câu hỏi nào về khóa học hoặc thanh toán, đừng ngần ngại liên hệ với chúng tôi.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:support@ehub.vn"
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                Gửi email
                            </a>
                            <a
                                href="tel:+84123456789"
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                Gọi điện
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default Success;