import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import "../../../public/css/style_admin.css";
import "../../../public/js/script.js";

const AdminLayout = ({ children }) => {
  const { auth } = usePage().props;

  const [showCourses, setShowCourses] = useState(false);
  const [showInstructors, setShowInstructors] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const isRoute = (name) => route().current(name);

  return (
    <>
      <main>
        {/* Sidebar START */}
        <nav className="navbar sidebar navbar-expand-xl navbar-dark bg-dark">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand" href="/">
              <img className="navbar-brand-item" src="/assets/images/logo-light.svg" alt="Logo" />
            </Link>
          </div>

          <div className="offcanvas offcanvas-start flex-row custom-scrollbar h-100" id="offcanvasSidebar">
            <div className="offcanvas-body sidebar-content d-flex flex-column bg-dark">
              <ul className="navbar-nav flex-column" id="navbar-sidebar">
                {/* Thống kê */}
                <li className="nav-item">
                  <Link href={route('admin.dashboard')} className={`nav-link ${isRoute('admin.dashboard') ? 'active' : ''}`}>
                    <i className="bi bi-house fa-fw me-2"></i> Thống Kê
                  </Link>
                </li>

                <li className="nav-item ms-2 my-2">Trang</li>

                {/* Khóa học */}
                <li className="nav-item">
                  <a
                    className="nav-link d-flex justify-content-between align-items-center"
                    onClick={() => setShowCourses(!showCourses)}
                    role="button"
                  >
                    <span><i className="bi bi-basket fa-fw me-2"></i>Khóa Học</span>
                    <i className={`bi ms-2 ${showCourses ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </a>
                  {(showCourses || isRoute('admin.admin-course') || isRoute('admin.admin-course-category')) && (
                    <ul className="nav flex-column ms-3">
                      <li className="nav-item">
                        <Link className={`nav-link ${isRoute('admin.admin-course') ? 'active' : ''}`} href={route('admin.admin-course')}>
                          Tất cả khóa học
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${isRoute('admin.admin-course-category') ? 'active' : ''}`} href={route('admin.admin-course-category')}>
                          Danh mục khóa học
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Học viên */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isRoute('admin.students') ? 'active' : ''}`}
                    href={route('admin.students')}
                  >
                    <i className="fas fa-user-graduate fa-fw me-2"></i>Học Viên
                  </Link>
                </li>

                {/* Giảng viên */}
                <li className="nav-item">
                  <a
                    className="nav-link d-flex justify-content-between align-items-center"
                    onClick={() => setShowInstructors(!showInstructors)}
                    role="button"
                  >
                    <span><i className="fas fa-user-tie fa-fw me-2"></i>Giảng Viên</span>
                    <i className={`bi ms-2 ${showInstructors ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </a>
                  {(showInstructors || window.location.pathname.startsWith('/admin-instructor')) && (
                    <ul className="nav flex-column ms-3">
                      <li className="nav-item">
                        <Link className={`nav-link ${window.location.pathname === '/admin-instructor-list' ? 'active' : ''}`} href="/admin-instructor-list">
                          Danh sách giảng viên
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${window.location.pathname === '/admin-instructor-detail' ? 'active' : ''}`} href="/admin-instructor-detail">
                          Chi tiết giảng viên
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${window.location.pathname === '/admin-instructor-request' ? 'active' : ''}`} href="/admin-instructor-request">
                          Yêu cầu của giảng viên
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Báo cáo */}
                <li className="nav-item">
                  <Link className={`nav-link ${window.location.pathname === '/admin-earning' ? 'active' : ''}`} href="/admin-earning">
                    <i className="far fa-chart-bar fa-fw me-2"></i>Báo Cáo
                  </Link>
                </li>

                {/* Cài đặt */}
                <li className="nav-item">
                  <Link className={`nav-link ${window.location.pathname === '/admin-setting' ? 'active' : ''}`} href="/admin-setting">
                    <i className="fas fa-user-cog fa-fw me-2"></i>Cài Đặt
                  </Link>
                </li>

                {/* Xác thực */}
                <li className="nav-item">
                  <a
                    className="nav-link d-flex justify-content-between align-items-center"
                    onClick={() => setShowAuth(!showAuth)}
                    role="button"
                  >
                    <span><i className="bi bi-lock fa-fw me-2"></i>Xác Thực</span>
                    <i className={`bi ms-2 ${showAuth ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </a>
                  {showAuth && (
                    <ul className="nav flex-column ms-3">
                      <li className="nav-item"><Link className="nav-link" href="/sign-up">Sign Up</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/sign-in">Sign In</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/forgot-password">Forgot Password</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/admin-error-404">Error 404</Link></li>
                    </ul>
                  )}
                </li>
              </ul>

              <div className="px-3 mt-auto pt-3">
                <div className="d-flex align-items-center justify-content-between text-primary-hover">
                  <Link className="h5 mb-0 text-body" href="/admin-setting"><i className="bi bi-gear-fill"></i></Link>
                  <Link className="h5 mb-0 text-body" href="/"><i className="bi bi-globe"></i></Link>
                  <Link className="h5 mb-0 text-body" href="/sign-in"><i className="bi bi-power"></i></Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {/* Sidebar END */}

        {/* Page Content START */}
        <div className="page-content">
          {/* Top Bar */}
          <nav className="navbar top-bar navbar-light border-bottom py-2 shadow-sm">
            <div className="container-fluid d-flex justify-content-between align-items-center">
              <form className="d-flex align-items-center" role="search">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                  <input type="text" className="form-control border-0 bg-light" placeholder="Search..." aria-label="Search" style={{ minWidth: '200px' }} />
                </div>
              </form>

              <div className="dropdown">
                <a className="d-flex align-items-center text-decoration-none" href="#" id="profileDropdown" data-bs-toggle="dropdown" role="button">
                  <img src="/assets/images/avatar/01.jpg" alt="avatar" className="avatar-img rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }} />
                  <span className="ms-2 d-none d-sm-inline fw-semibold text-dark">{auth.user.name}</span>
                  <i className="bi bi-chevron-down ms-1 text-muted d-none d-sm-inline"></i>
                </a>

                <ul className="dropdown-menu dropdown-menu-end shadow mt-2" aria-labelledby="profileDropdown" style={{ minWidth: '250px' }}>
                  <li className="px-3 pt-2 pb-1 border-bottom">
                    <div className="d-flex align-items-center">
                      <img src="/assets/images/avatar/01.jpg" alt="avatar" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
                      <div>
                        <h6 className="mb-0">{auth.user.name}</h6>
                        <small className="text-muted">{auth.user.email}</small><br />
                        <small className="text-muted">Role: {auth.user.role === 1 ? 'Admin' : 'Unknown'}</small>
                      </div>
                    </div>
                  </li>
                  <li><Link className="dropdown-item" href="#"><i className="bi bi-person fa-fw me-2"></i>Edit Profile</Link></li>
                  <li><Link className="dropdown-item" href="#"><i className="bi bi-gear fa-fw me-2"></i>Account Settings</Link></li>
                  <li><Link className="dropdown-item" href="#"><i className="bi bi-info-circle fa-fw me-2"></i>Help</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item text-danger" href="#"><i className="bi bi-power fa-fw me-2"></i>Sign Out</Link></li>
                </ul>
              </div>
            </div>
          </nav>
          {children}
        </div>
        {/* Page Content END */}
      </main>

      <div className="back-top">
        <i className="bi bi-arrow-up-short position-absolute top-50 start-50 translate-middle"></i>
      </div>
    </>
  );
};

export default AdminLayout;
