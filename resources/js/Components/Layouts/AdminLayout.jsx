import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import "../../../public/css/style_admin.css";
import "../../../public/js/script.js";

const AdminLayout = ({ children }) => {
	const { auth } = usePage().props;

	// Dropdown state
	const [showCourses, setShowCourses] = useState(false);
	const [showInstructors, setShowInstructors] = useState(false);
	const [showAuth, setShowAuth] = useState(false);

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
								<li className="nav-item">
									<Link href={route('admin.dashboard')} className="nav-link active">
										<i className="bi bi-house fa-fw me-2"></i> Dashboard
									</Link>
								</li>

								<li className="nav-item ms-2 my-2">Pages</li>

								{/* Courses Dropdown */}
								<li className="nav-item">
									<a className="nav-link d-flex justify-content-between align-items-center" onClick={() => setShowCourses(!showCourses)} role="button">
										<span><i className="bi bi-basket fa-fw me-2"></i> Courses</span>
										<i className={`bi ms-2 ${showCourses ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
									</a>
									{showCourses && (
										<ul className="nav flex-column ms-3">
											<li className="nav-item"><Link className="nav-link" href="/admin-course-list">All Courses</Link></li>
											<li className="nav-item"><Link className="nav-link" href={route('admin.admin-course-category')}>Course Category</Link></li>
										</ul>
									)}
								</li>

								<li className="nav-item">
									<Link className="nav-link" href="/admin-student-list">
										<i className="fas fa-user-graduate fa-fw me-2"></i> Students
									</Link>
								</li>

								{/* Instructors Dropdown */}
								<li className="nav-item">
									<a className="nav-link d-flex justify-content-between align-items-center" onClick={() => setShowInstructors(!showInstructors)} role="button">
										<span><i className="fas fa-user-tie fa-fw me-2"></i> Instructors</span>
										<i className={`bi ms-2 ${showInstructors ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
									</a>
									{showInstructors && (
										<ul className="nav flex-column ms-3">
											<li className="nav-item"><Link className="nav-link" href="/admin-instructor-list">Instructors</Link></li>
											<li className="nav-item">
												<Link className="nav-link" href="/admin-instructor-request">
													Instructor requests
												</Link>
											</li>
										</ul>
									)}
								</li>

								<li className="nav-item">
									<Link className="nav-link" href="/admin-earning">
										<i className="far fa-chart-bar fa-fw me-2"></i> Earnings
									</Link>
								</li>

								<li className="nav-item">
									<Link className="nav-link" href="/admin-setting">
										<i className="fas fa-user-cog fa-fw me-2"></i> Admin Settings
									</Link>
								</li>

								{/* Authentication Dropdown */}
								<li className="nav-item">
									<a className="nav-link d-flex justify-content-between align-items-center" onClick={() => setShowAuth(!showAuth)} role="button">
										<span><i className="bi bi-lock fa-fw me-2"></i> Authentication</span>
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

							{/* Search Bar */}
							<form className="d-flex align-items-center" role="search">
								<div className="input-group input-group-sm">
									<span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
									<input
										type="text"
										className="form-control border-0 bg-light"
										placeholder="Search..."
										aria-label="Search"
										style={{ minWidth: '200px' }}
									/>
								</div>
							</form>

							{/* User Avatar Dropdown */}
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
					{/* Dynamic page content */}
					{children}
				</div>
				{/* Page Content END */}
			</main>

			{/* Back to Top */}
			<div className="back-top">
				<i className="bi bi-arrow-up-short position-absolute top-50 start-50 translate-middle"></i>
			</div>
		</>
	);
};

export default AdminLayout;
