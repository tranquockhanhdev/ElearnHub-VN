import React, { useState, useEffect } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import Pagination from '../../Components/Pagination';
import { Link, usePage, router } from '@inertiajs/react';
import { useDebounce } from '../../Hooks/useDebounce';

const Payments = () => {
    const { auth, flash, payments, filters, counts } = usePage().props;
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    // Debounce search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Effect for handling search
    useEffect(() => {
        if (debouncedSearchTerm !== (filters?.search || '')) {
            handleFilter('search', debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    // Handle tab change
    const handleTabChange = (status) => {
        setActiveTab(status);
        const filterStatus = status === 'all' ? '' : status;
        handleFilter('status', filterStatus);
    };

    // Handle filter
    const handleFilter = (key, value) => {
        const currentFilters = { ...filters };
        if (value) {
            currentFilters[key] = value;
        } else {
            delete currentFilters[key];
        }

        router.get(route('student.payments'), currentFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            'completed': { class: 'bg-green-100 text-green-800', text: 'Đã thanh toán' },
            'pending': { class: 'bg-yellow-100 text-yellow-800', text: 'Chờ thanh toán' },
            'failed': { class: 'bg-red-100 text-red-800', text: 'Thất bại' },
        };

        const config = statusConfig[status] || { class: 'bg-gray-100 text-gray-800', text: 'Không xác định' };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
                {config.text}
            </span>
        );
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Tab configurations
    const tabs = [
        { key: 'all', label: 'Tất cả', count: counts?.all || 0 },
        { key: 'completed', label: 'Đã thanh toán', count: counts?.completed || 0 },
        { key: 'pending', label: 'Chờ thanh toán', count: counts?.pending || 0 },
        { key: 'failed', label: 'Đã hủy', count: counts?.failed || 0 },
    ];


    return (
        <UserLayout>
            <main className="bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b">
                    <InfoStudent />
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-4 mt-4">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="mx-4 mt-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="container mx-auto py-6 px-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="col-xl-3">
                            <nav className="navbar navbar-light navbar-expand-xl mx-0">
                                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar">
                                    <div className="offcanvas-header bg-light">
                                        <h5 className="offcanvas-title">Hồ sơ của tôi</h5>
                                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
                                    </div>
                                    <div className="offcanvas-body p-3 p-xl-0">
                                        <div className="bg-dark border rounded-3 pb-0 p-3 w-100">
                                            <div className="list-group list-group-dark list-group-borderless">
                                                <Link className="list-group-item " href="/student/dashboard" preserveScroll>
                                                    <i className="bi bi-ui-checks-grid fa-fw me-2"></i>Bảng điều khiển
                                                </Link>
                                                <Link className="list-group-item" href="/student/courselist" preserveScroll>
                                                    <i className="bi bi-basket fa-fw me-2"></i>Khóa học của tôi
                                                </Link>
                                                <Link className="list-group-item active" href="/student/payments" preserveScroll>
                                                    <i className="bi bi-credit-card-2-front fa-fw me-2"></i>Lịch Sử thanh toán
                                                </Link>
                                                <Link className="list-group-item" href="/student/profile" preserveScroll>
                                                    <i className="bi bi-pencil-square fa-fw me-2"></i>Chỉnh sửa hồ sơ
                                                </Link>
                                                <Link className="list-group-item text-danger bg-danger-soft-hover" href="/logout" method="post" as="button">
                                                    <i className="fas fa-sign-out-alt fa-fw me-2"></i>Đăng xuất
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:w-3/4">
                            <div className="bg-white rounded-lg shadow-sm">
                                {/* Header */}
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-2xl font-semibold text-gray-900">
                                            <i className="bi bi-credit-card-2-front text-blue-600 mr-2"></i>
                                            Lịch sử thanh toán
                                        </h1>
                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                            {payments?.total || 0} giao dịch
                                        </span>
                                    </div>
                                </div>

                                {/* Tabs with improved spacing */}
                                <div className="border-b border-gray-200 bg-gray-50">
                                    <div className="px-6 py-2">
                                        <nav className="flex space-x-6" aria-label="Tabs">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => handleTabChange(tab.key)}
                                                    className={`relative py-3 px-4 font-medium text-sm whitespace-nowrap rounded-t-lg transition-all duration-200 ${activeTab === tab.key
                                                        ? 'bg-white text-blue-600 border-l border-r border-t border-gray-200 -mb-px'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 mx-1'
                                                        }`}
                                                >
                                                    <span className="flex items-center space-x-2">
                                                        <span>{tab.label}</span>
                                                        {tab.key !== 'all' && (
                                                            <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${activeTab === tab.key
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : 'bg-gray-200 text-gray-600'
                                                                }`}>
                                                                {tab.count}
                                                            </span>
                                                        )}
                                                        {tab.key === 'all' && (
                                                            <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${activeTab === tab.key
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : 'bg-gray-200 text-gray-600'
                                                                }`}>
                                                                {tab.count}
                                                            </span>
                                                        )}
                                                    </span>

                                                    {/* Active tab indicator */}
                                                    {activeTab === tab.key && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="bi bi-search text-gray-400"></i>
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khóa học..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Table - Compact Version */}
                                <div className="overflow-hidden">
                                    {payments?.data?.length > 0 ? (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Mã đơn hàng
                                                            </th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Khóa học
                                                            </th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Ngày tạo
                                                            </th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Số tiền
                                                            </th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Phương thức
                                                            </th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Trạng thái
                                                            </th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Hành động
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {payments.data.map((payment) => (
                                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                                <td className="px-3 py-3 whitespace-nowrap">
                                                                    <div className="text-xs font-medium text-gray-900">
                                                                        #{payment.id}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-3 max-w-[200px]">
                                                                    <div className="text-xs text-gray-900 truncate" title={payment.course?.title}>
                                                                        {payment.course?.title || 'N/A'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-3 whitespace-nowrap">
                                                                    <div className="text-xs text-gray-900">
                                                                        {formatDate(payment.created_at)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-3 whitespace-nowrap">
                                                                    <div className="text-xs font-semibold text-gray-900">
                                                                        {formatCurrency(payment.amount)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-3 whitespace-nowrap">
                                                                    <div className="text-xs text-gray-900">
                                                                        {payment.payment_method?.name || 'N/A'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-3 whitespace-nowrap">
                                                                    {getStatusBadge(payment.status)}
                                                                </td>
                                                                <td className="px-3 py-3 whitespace-nowrap text-xs font-medium">
                                                                    <div className="flex flex-col space-y-1">
                                                                        {payment.status === 'completed' && (
                                                                            <a
                                                                                href={route('student.invoice.download', payment.id)}
                                                                                className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-2 rounded text-xs transition duration-200"
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                                                </svg>
                                                                                Tải HĐ
                                                                            </a>
                                                                        )}
                                                                        {payment.status === 'pending' && (
                                                                            <>
                                                                                {payment.redirect_url ? (
                                                                                    <a
                                                                                        href={payment.redirect_url}
                                                                                        className="inline-flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 font-medium py-1.5 px-2 rounded text-xs transition duration-200"
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                    >
                                                                                        <i className="bi bi-credit-card mr-1 text-xs"></i>
                                                                                        Thanh toán
                                                                                    </a>
                                                                                ) : (
                                                                                    <Link
                                                                                        href={`/student/checkout/${payment.course_id}`}
                                                                                        className="inline-flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 font-medium py-1.5 px-2 rounded text-xs transition duration-200"
                                                                                    >
                                                                                        <i className="bi bi-credit-card mr-1 text-xs"></i>
                                                                                        Thanh toán
                                                                                    </Link>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                        {payment.status === 'failed' && (
                                                                            <Link
                                                                                href={`/student/checkout/${payment.course_id}`}
                                                                                className="inline-flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1.5 px-2 rounded text-xs transition duration-200"
                                                                            >
                                                                                <i className="bi bi-arrow-repeat mr-1 text-xs"></i>
                                                                                Thử lại
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination - Compact */}
                                            <div className="bg-white px-3 py-2 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-700">
                                                        Hiển thị {payments.from} - {payments.to} trong tổng số {payments.total} giao dịch
                                                    </div>
                                                    <Pagination links={payments.links} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="mx-auto h-16 w-16 text-gray-400 mb-3">
                                                <i className="bi bi-receipt text-4xl"></i>
                                            </div>
                                            <h3 className="text-base font-medium text-gray-900 mb-2">
                                                {searchTerm ? 'Không tìm thấy giao dịch' : 'Chưa có giao dịch nào'}
                                            </h3>
                                            <p className="text-gray-500 mb-4 text-sm">
                                                {searchTerm
                                                    ? 'Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.'
                                                    : 'Bạn chưa thực hiện giao dịch thanh toán nào.'
                                                }
                                            </p>
                                            {!searchTerm && (
                                                <Link
                                                    href="/courses"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <i className="bi bi-plus-circle mr-2"></i>
                                                    Khám phá khóa học
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </UserLayout>
    );
};

export default Payments;