import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../Components/Layouts/AdminLayout';
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
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const dashboard = () => {
  const {
    auth,
    stats,
    revenue_by_7days,
    revenue_by_12months,
    revenue_by_5years,
    users_by_month,
    course_enrollments,
    least_enrolled_courses,
    best_selling_courses,
    recent_payments
  } = usePage().props;

  const [chartPeriod, setChartPeriod] = useState('7days');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Prepare revenue chart data based on selected period
  const getRevenueChartData = () => {
    let data, labels;

    switch (chartPeriod) {
      case '7days':
        data = revenue_by_7days || [];
        labels = data.map(item => new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }));
        break;
      case '12months':
        data = revenue_by_12months || [];
        labels = data.map(item => `${item.month}/${item.year}`);
        break;
      case '5years':
        data = revenue_by_5years || [];
        labels = data.map(item => item.year.toString());
        break;
      default:
        data = [];
        labels = [];
    }

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: data.map(item => item.revenue),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Users registration chart data
  const usersChartData = {
    labels: users_by_month?.map(item => `${item.month}/${item.year}`) || [],
    datasets: [
      {
        label: 'Thành viên mới',
        data: users_by_month?.map(item => item.count) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  // Course enrollments chart data
  const courseEnrollmentsData = {
    labels: course_enrollments?.slice(0, 10).map(course => course.title) || [],
    datasets: [
      {
        label: 'Số học viên',
        data: course_enrollments?.slice(0, 10).map(course => course.enrollments_count) || [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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

  return (
    <AdminLayout>
      <div className="page-content-wrapper border">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-3">
            <h1 className="h3 mb-2 mb-sm-0">Dashboard Quản trị</h1>
          </div>
        </div>

        {/* 📦 Counter boxes START - Các chỉ số tổng quan nhanh */}
        <div className="row g-4 mb-4">
          {/* Tổng doanh thu */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-success bg-opacity-15 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0 fw-bold">{formatCurrency(stats?.total_revenue || 0)}</h2>
                  <span className="mb-0 h6 fw-light">Tổng doanh thu</span>
                </div>

              </div>
            </div>
          </div>

          {/* Tổng số khóa học */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-warning bg-opacity-15 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0 fw-bold">{stats?.total_courses || 0}</h2>
                  <span className="mb-0 h6 fw-light">Tổng số khóa học</span>
                </div>
                <div className="icon-lg rounded-circle bg-warning text-white mb-0">
                  <i className="fas fa-book fa-fw"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Thành viên mới hôm nay */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-primary bg-opacity-10 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0 fw-bold">{stats?.new_users_today || 0}</h2>
                  <span className="mb-0 h6 fw-light">Thành viên mới hôm nay</span>
                </div>
                <div className="icon-lg rounded-circle bg-primary text-white mb-0">
                  <i className="fas fa-user-plus fa-fw"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Tổng giao dịch */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-purple bg-opacity-10 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0 fw-bold">{stats?.total_payments || 0}</h2>
                  <span className="mb-0 h6 fw-light">Tổng giao dịch</span>
                </div>
                <div className="icon-lg rounded-circle bg-purple text-white mb-0">
                  <i className="fas fa-credit-card fa-fw"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Counter boxes END */}

        {/* 📊 Revenue Chart and User Stats START */}
        <div className="row g-4 mb-4">
          {/* Revenue Chart */}
          <div className="col-xxl-8">
            <div className="card shadow h-100">
              <div className="card-header p-4 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-header-title">📊 Biểu đồ doanh thu</h5>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${chartPeriod === '7days' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setChartPeriod('7days')}
                  >
                    7 ngày
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${chartPeriod === '12months' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setChartPeriod('12months')}
                  >
                    12 tháng
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${chartPeriod === '5years' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setChartPeriod('5years')}
                  >
                    5 năm
                  </button>
                </div>
              </div>
              <div className="card-body">
                <Line data={getRevenueChartData()} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="col-xxl-4">
            <div className="card shadow h-100">
              <div className="card-header border-bottom d-flex justify-content-between align-items-center p-4">
                <h5 className="card-header-title">💳 Giao dịch gần đây</h5>
                <Link href={route('admin.payments.index')} className="btn btn-link p-0 mb-0">Xem tất cả</Link>
              </div>
              <div className="card-body p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {recent_payments?.map((payment, index) => (
                  <div key={payment.id} className={`d-flex justify-content-between position-relative ${index < recent_payments.length - 1 ? 'mb-3' : ''}`}>
                    <div className="d-sm-flex">
                      <div className="avatar avatar-md flex-shrink-0">
                        <div className="avatar-img rounded-circle bg-success bg-opacity-10">
                          <span className="text-success position-absolute top-50 start-50 translate-middle fw-bold">
                            {payment.student?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ms-2">
                        <h6 className="mb-0">
                          <span className="stretched-link">{payment.student?.name || 'Unknown'}</span>
                        </h6>
                        <p className="mb-0 small">{payment.course?.title}</p>
                        <div className="d-flex justify-content-between">
                          <span className="small text-muted">{formatDate(payment.created_at)}</span>
                          <span className="small fw-bold text-success">{formatCurrency(payment.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!recent_payments || recent_payments.length === 0) && (
                  <p className="text-muted text-center">Chưa có giao dịch nào</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Revenue Chart and User Stats END */}

        {/* 👥 User Registration Chart and 📚 Course Stats START */}
        <div className="row g-4 mb-4">
          {/* User Registration Chart */}
          <div className="col-xxl-6">
            <div className="card shadow h-100">
              <div className="card-header p-4 border-bottom">
                <h5 className="card-header-title">👥 Thành viên đăng ký theo tháng</h5>
              </div>
              <div className="card-body">
                <Bar data={usersChartData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Course Enrollments Chart */}
          <div className="col-xxl-6">
            <div className="card shadow h-100">
              <div className="card-header p-4 border-bottom">
                <h5 className="card-header-title">📚 Top 10 khóa học theo số học viên</h5>
              </div>
              <div className="card-body">
                <Doughnut data={courseEnrollmentsData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }} />
              </div>
            </div>
          </div>
        </div>
        {/* User Registration Chart and Course Stats END */}

        {/* Course Performance Tables START */}
        <div className="row g-4 mb-4">
          {/* Best Selling Courses */}
          <div className="col-xxl-6">
            <div className="card shadow h-100">
              <div className="card-header p-4 border-bottom">
                <h5 className="card-header-title">🏆 Top 5 khóa học bán chạy nhất</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Khóa học</th>
                        <th>Doanh thu</th>
                        <th>Số bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {best_selling_courses?.map((course, index) => (
                        <tr key={course.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-primary me-2">{index + 1}</span>
                              <span className="fw-bold">{course.title}</span>
                            </div>
                          </td>
                          <td className="text-success fw-bold">{formatCurrency(course.total_revenue)}</td>
                          <td>{course.total_sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Least Enrolled Courses */}
          <div className="col-xxl-6">
            <div className="card shadow h-100">
              <div className="card-header p-4 border-bottom">
                <h5 className="card-header-title">⚠️ Top 5 khóa học có ít học viên nhất</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Khóa học</th>
                        <th>Số học viên</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {least_enrolled_courses?.map((course, index) => (
                        <tr key={course.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-warning me-2">{index + 1}</span>
                              <span className="fw-bold">{course.title}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{course.enrollments_count}</span>
                          </td>
                          <td className="text-primary fw-bold">{formatCurrency(course.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Course Performance Tables END */}

        {/* Summary Stats */}
        <div className="row g-4">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header p-4 border-bottom">
                <h5 className="card-header-title">📈 Tổng quan hệ thống</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="border-end">
                      <h4 className="text-primary">{stats?.total_users || 0}</h4>
                      <p className="mb-0">Tổng thành viên</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h4 className="text-success">{formatCurrency(stats?.total_revenue || 0)}</h4>
                      <p className="mb-0">Tổng doanh thu</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h4 className="text-warning">{stats?.total_courses || 0}</h4>
                      <p className="mb-0">Tổng khóa học</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-info">{stats?.total_payments || 0}</h4>
                    <p className="mb-0">Tổng giao dịch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </AdminLayout>

  );
}
export default dashboard;