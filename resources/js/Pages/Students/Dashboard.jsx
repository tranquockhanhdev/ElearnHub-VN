import React, { useState, useEffect } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import Pagination from '../../Components/Pagination';
import { Link, usePage, router } from '@inertiajs/react';

const StudentDashboard = () => {
	const { auth, stats, enrolledCourses, filters } = usePage().props;
	const [searchTerm, setSearchTerm] = useState(filters?.search || '');
	const [sortBy, setSortBy] = useState(filters?.sort || '');
	const [perPage, setPerPage] = useState(filters?.per_page || 6);

	// Debounce search
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchTerm !== (filters?.search || '')) {
				handleFilter();
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	// Handle filter changes
	const handleFilter = () => {
		router.get('/student/dashboard', {
			search: searchTerm,
			sort: sortBy,
			per_page: perPage,
		}, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	// Handle sort change
	const handleSortChange = (value) => {
		setSortBy(value);
		router.get('/student/dashboard', {
			search: searchTerm,
			sort: value,
			per_page: perPage,
		}, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	// Handle per page change
	const handlePerPageChange = (value) => {
		setPerPage(value);
		router.get('/student/dashboard', {
			search: searchTerm,
			sort: sortBy,
			per_page: value,
		}, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	const getProgressColor = (progress) => {
		if (progress === 100) return 'bg-success';
		if (progress >= 75) return 'bg-info';
		if (progress >= 50) return 'bg-warning';
		return 'bg-primary';
	};

	const getProgressText = (progress) => {
		if (progress === 100) return 'Đã hoàn thành';
		if (progress >= 75) return 'Sắp hoàn thành';
		if (progress >= 50) return 'Đang học';
		return 'Mới bắt đầu';
	};

	const statsData = [
		{
			icon: 'fas fa-book-open',
			count: stats?.total_courses || 0,
			label: 'Tổng số khóa học',
			color: 'primary',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
		},
		{
			icon: 'fas fa-tasks',
			count: stats?.completed_lessons || 0,
			label: 'Bài học đã hoàn thành',
			color: 'success',
			gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
		},
		{
			icon: 'fas fa-trophy',
			count: stats?.completed_courses || 0,
			label: 'Khóa học đã hoàn thành',
			color: 'warning',
			gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
		},
		{
			icon: 'fas fa-clock',
			count: stats?.in_progress_courses || 0,
			label: 'Đang tiến hành',
			color: 'info',
			gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
		}
	];

	return (
		<UserLayout>
			<main>
				{/* Page Banner START */}
				<InfoStudent />
				{/* Page Banner END */}

				{/* Page content START */}
				<section className="pt-0">
					<div className="container">
						<div className="row">
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
													<Link className="list-group-item active" href="/student/dashboard">
														<i className="bi bi-ui-checks-grid fa-fw me-2"></i>Bảng điều khiển
													</Link>
													<Link className="list-group-item" href="/student/courselist">
														<i className="bi bi-basket fa-fw me-2"></i>Khóa học của tôi
													</Link>
													<Link className="list-group-item" href="/student/payments">
														<i className="bi bi-credit-card-2-front fa-fw me-2"></i>Thông tin thanh toán
													</Link>
													<Link className="list-group-item" href="/student/profile">
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

							{/* Main content */}
							<div className="col-xl-9">
								{/* Counter boxes - Redesigned */}
								<div className="row g-4 mb-4">
									{statsData.map((stat, index) => (
										<div key={index} className="col-sm-6 col-lg-3">
											<div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
												{/* Gradient background */}
												<div
													className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
													style={{ background: stat.gradient }}
												></div>

												<div className="card-body text-center position-relative">
													{/* Icon */}
													<div className="mb-3">
														<div
															className="d-inline-flex align-items-center justify-content-center rounded-circle"
															style={{
																width: '60px',
																height: '60px',
																background: stat.gradient,
																boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
															}}
														>
															<i className={`${stat.icon} text-white fs-4`}></i>
														</div>
													</div>

													{/* Count */}
													<h3 className="mb-1 fw-bold text-dark">{stat.count}</h3>

													{/* Label */}
													<p className="mb-0 text-black small fw-medium">{stat.label}</p>

													{/* Decorative element */}
													<div className="mt-2">
														<div
															className="mx-auto rounded-pill"
															style={{
																width: '30px',
																height: '3px',
																background: stat.gradient
															}}
														></div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Quick Actions */}
								<div className="row g-3 mb-4">
									<div className="col-md-4">
										<Link href="/student/courselist" className="text-decoration-none">
											<div className="card border-0 bg-light h-100 card-hover">
												<div className="card-body text-center py-3">
													<i className="fas fa-play-circle text-primary mb-2 fs-5"></i>
													<h6 className="mb-0">Tiếp tục học</h6>
												</div>
											</div>
										</Link>
									</div>
									<div className="col-md-4">
										<Link href="/courses" className="text-decoration-none">
											<div className="card border-0 bg-light h-100 card-hover">
												<div className="card-body text-center py-3">
													<i className="fas fa-search text-success mb-2 fs-5"></i>
													<h6 className="mb-0">Tìm khóa học</h6>
												</div>
											</div>
										</Link>
									</div>
									<div className="col-md-4">
										<Link href="/student/payments" className="text-decoration-none">
											<div className="card border-0 bg-light h-100 card-hover">
												<div className="card-body text-center py-3">
													<i className="fas fa-history text-info mb-2 fs-5"></i>
													<h6 className="mb-0">Lịch sử thanh toán</h6>
												</div>
											</div>
										</Link>
									</div>
								</div>

								{/* Course list card */}
								<div className="card border-0 shadow-sm">
									<div className="card-header bg-white border-bottom">
										<div className="d-flex align-items-center justify-content-between">
											<h4 className="mb-0 fw-semibold">
												<i className="fas fa-graduation-cap text-primary me-2"></i>
												Hành trình học tập của tôi
											</h4>
											<span className="badge bg-primary-soft text-primary">
												{enrolledCourses?.total || 0} khóa học
											</span>
										</div>
									</div>

									<div className="card-body">
										{/* Search and filter */}
										<div className="row g-3 align-items-center justify-content-between mb-4">
											<div className="col-md-6">
												<div className="position-relative">
													<input
														className="form-control pe-5 border-0 bg-light"
														type="search"
														placeholder="Tìm kiếm khóa học của bạn..."
														value={searchTerm}
														onChange={(e) => setSearchTerm(e.target.value)}
													/>
													<i className="fas fa-search position-absolute top-50 end-0 translate-middle-y pe-3 text-black"></i>
												</div>
											</div>
											<div className="col-md-3">
												<select
													className="form-select border-0 bg-light"
													value={sortBy}
													onChange={(e) => handleSortChange(e.target.value)}
												>
													<option value="">Sắp xếp theo</option>
													<option value="newest">Mới nhất</option>
													<option value="oldest">Cũ nhất</option>
													<option value="title">Tên khóa học</option>
												</select>
											</div>
											<div className="col-md-3">
												<select
													className="form-select border-0 bg-light"
													value={perPage}
													onChange={(e) => handlePerPageChange(e.target.value)}
												>
													<option value="6">6 khóa học</option>
													<option value="12">12 khóa học</option>
													<option value="24">24 khóa học</option>
													<option value="50">50 khóa học</option>
												</select>
											</div>
										</div>

										{/* Courses table */}
										{enrolledCourses?.data?.length > 0 ? (
											<>
												<div className="table-responsive">
													<table className="table table-hover align-middle">
														<thead className="table-light">
															<tr>
																<th className="border-0 rounded-start fw-semibold">Khóa học</th>
																<th className="border-0 fw-semibold">Bài học</th>
																<th className="border-0 fw-semibold">Tiến độ</th>
																<th className="border-0 rounded-end fw-semibold">Hành động</th>
															</tr>
														</thead>
														<tbody>
															{enrolledCourses.data.map((course) => (
																<tr key={course.id}>
																	<td>
																		<div className="d-flex align-items-center">
																			<div className="flex-shrink-0">
																				<img
																					src={course.img_url ? `/storage/${course.img_url}` : '/assets/images/courses/4by3/default.jpg'}
																					className="rounded shadow-sm"
																					alt={course.title}
																					style={{ width: '70px', height: '50px', objectFit: 'cover' }}
																				/>
																			</div>
																			<div className="flex-grow-1 ms-3">
																				<h6 className="mb-1 fw-semibold">
																					<Link href={`/student/course/${course.id}`} className="text-decoration-none text-dark">
																						{course.title}
																					</Link>
																				</h6>
																				<div className="small text-black">
																					<i className="fas fa-user-tie me-1"></i>
																					Giảng viên: {course.instructor_name}
																				</div>
																				<div className="small text-black">
																					<i className="fas fa-calendar me-1"></i>
																					Đăng ký: {course.enrollment_date}
																				</div>
																			</div>
																		</div>
																	</td>
																	<td>
																		<div className="text-center">
																			<div className="fw-semibold">{course.completed_lessons}/{course.total_lessons}</div>
																			<small className="text-black">đã hoàn thành</small>
																		</div>
																	</td>
																	<td>
																		<div className="d-flex align-items-center">
																			<div className="progress flex-fill me-2" style={{ height: '8px' }}>
																				<div
																					className={`progress-bar ${getProgressColor(course.progress)}`}
																					style={{ width: `${course.progress}%` }}
																				></div>
																			</div>
																			<span className="small fw-bold">{course.progress}%</span>
																		</div>
																		<small className={`text-${course.progress === 100 ? 'success' : 'primary'} fw-medium`}>
																			{getProgressText(course.progress)}
																		</small>
																	</td>
																	<td>
																		{course.progress === 100 ? (
																			<div className="d-flex gap-1">
																				<span className="badge bg-success">
																					<i className="fas fa-check me-1"></i>Hoàn thành
																				</span>
																				<Link
																					href={`/student/course/${course.id}`}
																					className="btn btn-sm btn-outline-primary"
																				>
																					<i className="fas fa-eye me-1"></i>Xem lại
																				</Link>
																			</div>
																		) : (
																			<Link
																				href={`/student/course/${course.id}`}
																				className="btn btn-sm btn-primary"
																			>
																				<i className="fas fa-play me-1"></i>Tiếp tục
																			</Link>
																		)}
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>

												{/* Pagination */}
												<div className="d-flex justify-content-between align-items-center mt-4">
													<div className="text-muted small">
														Hiển thị {enrolledCourses.from} - {enrolledCourses.to} trong tổng số {enrolledCourses.total} khóa học
													</div>
													<Pagination links={enrolledCourses.links} />
												</div>
											</>
										) : (
											<div className="text-center py-5">
												<div className="mb-4">
													<i className="fas fa-graduation-cap text-black" style={{ fontSize: '4rem' }}></i>
												</div>
												<h5 className="text-black mb-3">
													{searchTerm ? 'Không tìm thấy khóa học' : 'Bắt đầu hành trình học tập'}
												</h5>
												<p className="text-black mb-4">
													{searchTerm
														? 'Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.'
														: 'Bạn chưa đăng ký khóa học nào. Khám phá danh mục khóa học để bắt đầu!'
													}
												</p>
												{!searchTerm && (
													<Link href="/courses" className="btn btn-primary">
														<i className="fas fa-plus me-2"></i>Khám phá khóa học
													</Link>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Page content END */}
			</main>

			{/* Custom CSS */}
			<style jsx>{`
                .card-hover:hover {
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }
                
                .bg-primary-soft {
                    background-color: rgba(13, 110, 253, 0.1) !important;
                }
                
                .text-primary {
                    color: #0d6efd !important;
                }
                
                .shadow-sm {
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
                }
                
                .pagination .page-link {
                    color: #0d6efd;
                    border-color: #dee2e6;
                }
                
                .pagination .page-item.active .page-link {
                    background-color: #0d6efd;
                    border-color: #0d6efd;
                }
                
                .pagination .page-link:hover {
                    color: #0a58ca;
                    background-color: #e9ecef;
                    border-color: #dee2e6;
                }
            `}</style>
		</UserLayout>
	);
};

export default StudentDashboard;
