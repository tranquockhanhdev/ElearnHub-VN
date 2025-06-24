import React, { useState, useEffect } from 'react';
import InstructorLayout from '../../Components/Layouts/InstructorLayout';
import InfoIntructor from '../../Components/InfoIntructor';
import { Link, usePage } from '@inertiajs/react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const { auth, stats, revenue_chart, latest_enrollments, popular_courses, revenue_by_course } = usePage().props;
    const [chartPeriod, setChartPeriod] = useState('month');
    const [revenueData, setRevenueData] = useState(revenue_chart);
    const [openMenu, setOpenMenu] = useState(null);
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount || 0);
    };
    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu)
    }
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Fetch revenue chart data when period changes
    const fetchRevenueData = async (period) => {
        try {
            const response = await fetch(`/instructor/dashboard/revenue-chart?period=${period}`);
            const data = await response.json();
            setRevenueData(data);
            setChartPeriod(period);
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    };

    // Prepare chart data
    const chartData = {
        labels: revenueData?.map(item => {
            if (chartPeriod === 'day') return item.date;
            if (chartPeriod === 'week') return `Tuần ${item.week}`;
            if (chartPeriod === 'quarter') return `Q${item.quarter}/${item.year}`;
            return `${item.month}/${item.year}`;
        }) || [],
        datasets: [
            {
                label: 'Doanh thu',
                data: revenueData?.map(item => item.revenue) || [],
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ doanh thu theo thời gian',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };

    // Doughnut chart for revenue by course
    const doughnutData = {
        labels: revenue_by_course?.slice(0, 5).map(course => course.title) || [],
        datasets: [
            {
                data: revenue_by_course?.slice(0, 5).map(course => course.total_revenue || 0) || [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
            },
        ],
    };

    return (
        <InstructorLayout>
            <main>
                <InfoIntructor />
                {/* Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <nav className="navbar navbar-light navbar-expand-xl mx-0">

                                    {/* Mobile: Offcanvas */}
                                    <div className="offcanvas offcanvas-end d-xl-none" tabIndex="-1" id="offcanvasNavbar">
                                        <div className="offcanvas-header bg-light">
                                            <h5 className="offcanvas-title">Hồ sơ của tôi</h5>
                                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
                                        </div>
                                        <div className="offcanvas-body p-3">
                                            <div className="bg-dark border rounded-3 p-3 w-100">
                                                <div className="list-group list-group-dark list-group-borderless">

                                                    <Link className="list-group-item" href="/instructor/dashboard" preserveScroll>
                                                        <i className="bi bi-grid fa-fw me-2"></i>Tổng quan
                                                    </Link>

                                                    {/* Quản lý khóa học */}
                                                    <button onClick={() => toggleMenu('courses')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-journal-text fa-fw me-2"></i>Quản lý khóa học</span>
                                                        <i className={`bi ms-auto ${openMenu === 'courses' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'courses' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/courses" className="list-group-item" preserveScroll>Khóa học của tôi</Link>
                                                        </div>
                                                    )}

                                                    {/* Học viên */}
                                                    <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'students' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/students" className="list-group-item" preserveScroll>Danh sách học viên</Link>
                                                        </div>
                                                    )}

                                                    {/* Doanh thu & Thanh toán */}
                                                    <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                        <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'revenue' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/revenue" className="list-group-item" preserveScroll>Doanh Thu Khoá Học</Link>
                                                        </div>
                                                    )}

                                                    {/* Tài khoản giảng viên */}
                                                    <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                        <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                        <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                    </button>
                                                    {openMenu === 'profile' && (
                                                        <div className="ps-4">
                                                            <Link href="/instructor/profile" className="list-group-item" preserveScroll>Chỉnh sửa thông tin</Link>
                                                        </div>
                                                    )}

                                                    {/* Đăng xuất */}
                                                    <Link href="/logout" as="button" method="post" className="list-group-item text-danger bg-danger-soft-hover" preserveScroll>
                                                        <i className="bi bi-box-arrow-right fa-fw me-2"></i>Đăng xuất
                                                    </Link>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: static sidebar */}
                                    <div className="d-none d-xl-block w-100">
                                        <div className="bg-dark border rounded-3 p-3 w-100">
                                            <div className="list-group list-group-dark list-group-borderless">

                                                <Link className="list-group-item" href="/instructor/dashboard" preserveScroll>
                                                    <i className="bi bi-grid fa-fw me-2"></i>Tổng quan
                                                </Link>

                                                {/* Quản lý khóa học */}
                                                <button onClick={() => toggleMenu('courses')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-journal-text fa-fw me-2"></i>Quản lý khóa học</span>
                                                    <i className={`bi ms-auto ${openMenu === 'courses' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'courses' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/courses" className="list-group-item" preserveScroll>Khóa học của tôi</Link>
                                                    </div>
                                                )}

                                                {/* Học viên */}
                                                <button onClick={() => toggleMenu('students')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-people fa-fw me-2"></i>Học viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'students' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'students' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/students" className="list-group-item" preserveScroll>Danh sách học viên</Link>
                                                    </div>
                                                )}

                                                {/* Doanh thu & Thanh toán */}
                                                <button onClick={() => toggleMenu('revenue')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-cash-stack fa-fw me-2"></i>Doanh thu & Thanh toán</span>
                                                    <i className={`bi ms-auto ${openMenu === 'revenue' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'revenue' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/revenue" className="list-group-item" preserveScroll>Doanh Thu Khoá Học</Link>
                                                    </div>
                                                )}

                                                {/* Tài khoản giảng viên */}
                                                <button onClick={() => toggleMenu('profile')} className="list-group-item d-flex justify-between align-items-center w-full text-start">
                                                    <span><i className="bi bi-person-circle fa-fw me-2"></i>Tài khoản giảng viên</span>
                                                    <i className={`bi ms-auto ${openMenu === 'profile' ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                                </button>
                                                {openMenu === 'profile' && (
                                                    <div className="ps-4">
                                                        <Link href="/instructor/profile" className="list-group-item" preserveScroll>Chỉnh sửa thông tin</Link>

                                                    </div>
                                                )}

                                                {/* Đăng xuất */}
                                                <Link href="/logout" as="button" method="post" className="list-group-item text-danger bg-danger-soft-hover" preserveScroll>
                                                    <i className="bi bi-box-arrow-right fa-fw me-2"></i>Đăng xuất
                                                </Link>

                                            </div>
                                        </div>
                                    </div>

                                </nav>
                            </div>


                            {/* **************** MAIN CONTENT START **************** */}
                            <div className="col-xl-9">
                                {/* Title */}
                                <div className="row">
                                    <div className="col-12">
                                        <h1 className="h3 mb-2 mb-sm-0">Dashboard</h1>
                                        <p className="text-black">Chào mừng trở lại, {auth.user?.name}!</p>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="row g-4 mb-5">
                                    {/* Total Courses */}
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-warning bg-opacity-15 border border-warning border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-2 text-warning">{stats?.total_courses || 0}</h4>
                                                    <h6 className="mb-0">Tổng khóa học</h6>
                                                </div>
                                                <div className="icon-lg bg-warning text-white rounded-circle">
                                                    <i className="bi bi-book"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Students */}
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-purple bg-opacity-10 border border-purple border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-2 text-white">{stats?.total_students || 0}</h4>
                                                    <h6 className="mb-0 text-white">Tổng học viên</h6>
                                                </div>
                                                <div className="icon-lg bg-purple text-white rounded-circle">
                                                    <i className="bi bi-people"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Revenue */}
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-success bg-opacity-10 border border-success border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-2 text-success">{formatCurrency(stats?.total_revenue)}</h4>
                                                    <h6 className="mb-0">Tổng thu nhập</h6>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Monthly Enrollments */}
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body bg-info bg-opacity-10 border border-info border-opacity-25 p-4 h-100">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-2 text-info">{stats?.monthly_enrollments || 0}</h4>
                                                    <h6 className="mb-0">Đăng ký tháng này</h6>
                                                </div>
                                                <div className="icon-lg bg-info text-white rounded-circle">
                                                    <i className="bi bi-graph-up"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Row */}
                                <div className="row g-4 mb-4">
                                    {/* Revenue Chart */}
                                    <div className="col-lg-8">
                                        <div className="card border h-100">
                                            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                                                <h5 className="card-header-title">Biểu đồ doanh thu</h5>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-sm btn-light dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        {chartPeriod === 'day' && 'Theo ngày'}
                                                        {chartPeriod === 'week' && 'Theo tuần'}
                                                        {chartPeriod === 'month' && 'Theo tháng'}
                                                        {chartPeriod === 'quarter' && 'Theo quý'}
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => fetchRevenueData('day')}
                                                            >
                                                                Theo ngày
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => fetchRevenueData('week')}
                                                            >
                                                                Theo tuần
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => fetchRevenueData('month')}
                                                            >
                                                                Theo tháng
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => fetchRevenueData('quarter')}
                                                            >
                                                                Theo quý
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <Line data={chartData} options={chartOptions} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Revenue by Course */}
                                    <div className="col-lg-4">
                                        <div className="card border h-100">
                                            <div className="card-header border-bottom">
                                                <h5 className="card-header-title">Doanh thu theo khóa học</h5>
                                            </div>
                                            <div className="card-body">
                                                {revenue_by_course?.length > 0 ? (
                                                    <Doughnut data={doughnutData} />
                                                ) : (
                                                    <div className="text-center text-muted py-4">
                                                        <i className="bi bi-pie-chart display-4"></i>
                                                        <p className="mt-2">Chưa có dữ liệu doanh thu</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tables Row */}
                                <div className="row g-4">
                                    {/* Latest Enrollments */}
                                    <div className="col-lg-7">
                                        <div className="card border">
                                            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                                                <h5 className="card-header-title">Đăng ký mới nhất</h5>
                                                <a href="/instructor/enrollments" className="btn btn-sm btn-primary-soft">
                                                    Xem tất cả
                                                </a>
                                            </div>
                                            <div className="card-body">
                                                {latest_enrollments?.length > 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table table-hover align-middle">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Học viên</th>
                                                                    <th>Khóa học</th>
                                                                    <th>Ngày đăng ký</th>
                                                                    <th>Trạng thái</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {latest_enrollments.map((enrollment) => (
                                                                    <tr key={enrollment.id}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="avatar avatar-xs me-2">
                                                                                    <img
                                                                                        src={enrollment.student?.avatar || '/assets/images/avatar/default.jpg'}
                                                                                        className="rounded-circle"
                                                                                        alt={enrollment.student?.name}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                                                                                        {enrollment.student?.name}
                                                                                    </h6>
                                                                                    <small className="text-muted">
                                                                                        {enrollment.student?.email}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <span className="text-truncate d-block" style={{ maxWidth: '200px' }}>
                                                                                {enrollment.course?.title}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <small>{formatDate(enrollment.created_at)}</small>
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-success">
                                                                                Đã đăng ký
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-muted py-4">
                                                        <i className="bi bi-person-plus display-4"></i>
                                                        <p className="mt-2">Chưa có đăng ký mới</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Popular Courses */}
                                    <div className="col-lg-5">
                                        <div className="card border">
                                            <div className="card-header border-bottom">
                                                <h5 className="card-header-title">Khóa học phổ biến</h5>
                                            </div>
                                            <div className="card-body">
                                                {popular_courses?.length > 0 ? (
                                                    <div className="list-group list-group-flush">
                                                        {popular_courses.map((course, index) => (
                                                            <div key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="badge bg-primary rounded-pill me-2">
                                                                        {index + 1}
                                                                    </span>
                                                                    <div>
                                                                        <h6 className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                                                            {course.title}
                                                                        </h6>
                                                                        <small className="text-muted">
                                                                            {course.enrollments_count} học viên
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                                <span className="badge bg-light text-dark">
                                                                    {formatCurrency(course.price)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-muted py-4">
                                                        <i className="bi bi-star display-4"></i>
                                                        <p className="mt-2">Chưa có khóa học nào</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* **************** MAIN CONTENT END **************** */}
                        </div>
                    </div>
                </section>
                <style jsx>{`
                    .text-purple {
                        color: #6f42c1 !important;
                    }
                    .bg-purple {
                        background-color: #6f42c1 !important;
                    }
                    .border-purple {
                        border-color: #6f42c1 !important;
                    }
                    .icon-lg {
                        width: 50px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                    }
                    .card {
                        transition: transform 0.2s ease-in-out;
                    }
                    .card:hover {
                        transform: translateY(-2px);
                    }
                `}</style>
            </main>
        </InstructorLayout>
    );
};

export default Dashboard;