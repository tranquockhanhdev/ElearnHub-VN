import React, { useState } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import Pagination from '../../Components/Pagination';
import { Link, usePage, router } from '@inertiajs/react';

const CourseList = () => {
	const { enrolledCourses, filters, auth } = usePage().props;
	const [searchTerm, setSearchTerm] = useState(filters.search || '');
	const [sortBy, setSortBy] = useState(filters.sort || '');

	// Xử lý tìm kiếm
	const handleSearch = (e) => {
		e.preventDefault();
		router.get(route('student.courselist'), {
			search: searchTerm,
			sort: sortBy
		}, {
			preserveState: true,
			preserveScroll: true
		});
	};

	// Xử lý sắp xếp
	const handleSort = (value) => {
		setSortBy(value);
		router.get(route('student.courselist'), {
			search: searchTerm,
			sort: value
		}, {
			preserveState: true,
			preserveScroll: true
		});
	};
	// Get course image URL
	const getCourseImageUrl = (imgUrl) => {
		if (!imgUrl) return 'https://placehold.co/600x400/EEE/31343C';
		if (imgUrl.startsWith('http')) return imgUrl;
		return `/storage/${imgUrl}`;
	};
	// Xử lý hành động khóa học
	const getCourseAction = (course) => {
		if (course.is_completed) {
			return (
				<div>
					<button className="btn btn-sm btn-success me-1 mb-1 mb-md-0 disabled">
						<i className="bi bi-check me-1"></i>Đã hoàn thành
					</button>
					<Link
						href={route('student.course.learn', course.id)}
						className="btn btn-sm btn-light me-1"
					>
						<i className="bi bi-arrow-repeat me-1"></i>Xem lại
					</Link>
				</div>
			);
		} else {
			return (
				<Link
					href={route('student.course.learn', course.id)}
					className="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
				>
					<i className="bi bi-play-circle me-1"></i>Tiếp tục học
				</Link>
			);
		}
	};

	return (
		<UserLayout>
			{/* **************** MAIN CONTENT START **************** */}
			<main>

				{/* =======================
                Page Banner START */}
				<InfoStudent />
				{/* =======================
                Page Banner END */}

				{/* =======================
                Page content START */}
				<section className="pt-0">
					<div className="container">
						<div className="row">
							{/* Right sidebar START */}
							<div className="col-xl-3">
								{/* Responsive offcanvas body START */}
								<nav className="navbar navbar-light navbar-expand-xl mx-0">
									<div
										className="offcanvas offcanvas-end"
										tabIndex="-1"
										id="offcanvasNavbar"
										aria-labelledby="offcanvasNavbarLabel"
									>
										{/* Offcanvas header */}
										<div className="offcanvas-header bg-light">
											<h5 className="offcanvas-title" id="offcanvasNavbarLabel">
												Hồ sơ của tôi
											</h5>
											<button
												type="button"
												className="btn-close text-reset"
												data-bs-dismiss="offcanvas"
												aria-label="Close"
											></button>
										</div>
										{/* Offcanvas body */}
										<div className="offcanvas-body p-3 p-xl-0">
											<div className="bg-dark border rounded-3 pb-0 p-3 w-100">
												{/* Dashboard menu */}
												<div className="list-group list-group-dark list-group-borderless">
													<Link className="list-group-item" href={route('student.dashboard')} preserveScroll preserveState>
														<i className="bi bi-ui-checks-grid fa-fw me-2"></i>Bảng điều khiển
													</Link>
													<Link className="list-group-item active" href={route('student.courselist')} preserveScroll>
														<i className="bi bi-basket fa-fw me-2"></i>Khóa học của tôi
													</Link>
													<Link className="list-group-item" href="/student/payments" preserveScroll preserveState>
														<i className="bi bi-credit-card-2-front fa-fw me-2"></i>Lịch Sử thanh toán
													</Link>
													<Link className="list-group-item" href="/student/profile" preserveScroll preserveState>
														<i className="bi bi-pencil-square fa-fw me-2"></i>Chỉnh sửa hồ sơ
													</Link>
													<Link
														className="list-group-item text-danger bg-danger-soft-hover"
														href={route('logout')}
														method="post"
														as="button"
													>
														<i className="fas fa-sign-out-alt fa-fw me-2"></i>Đăng xuất
													</Link>
												</div>
											</div>
										</div>
									</div>
								</nav>
								{/* Responsive offcanvas body END */}
							</div>
							{/* Right sidebar END */}

							{/* Main content START */}
							<div className="col-xl-9">
								<div className="card border rounded-3">
									{/* Card header START */}
									<div className="card-header border-bottom">
										<h3 className="mb-0">Danh sách khóa học của tôi</h3>
									</div>
									{/* Card header END */}

									{/* Card body START */}
									<div className="card-body">
										{/* Search and select START */}
										<div className="row g-3 align-items-center justify-content-between mb-4">
											{/* Search */}
											<div className="col-md-8">
												<form className="rounded position-relative" onSubmit={handleSearch}>
													<input
														className="form-control pe-5 bg-transparent"
														type="search"
														placeholder="Tìm kiếm khóa học..."
														aria-label="Search"
														value={searchTerm}
														onChange={(e) => setSearchTerm(e.target.value)}
													/>
													<button
														className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
														type="submit"
													>
														<i className="fas fa-search fs-6"></i>
													</button>
												</form>
											</div>
											{/* Select option */}
											<div className="col-md-3">
												<select
													className="form-select border-0 z-index-9 bg-transparent"
													value={sortBy}
													onChange={(e) => handleSort(e.target.value)}
												>
													<option value="">Sắp xếp theo</option>
													<option value="newest">Mới nhất</option>
													<option value="oldest">Cũ nhất</option>
													<option value="title">Tên khóa học</option>
												</select>
											</div>
										</div>
										{/* Search and select END */}

										{/* Course list table START */}
										<div className="table-responsive border-0">
											{enrolledCourses.data.length > 0 ? (
												<table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
													{/* Table head */}
													<thead>
														<tr>
															<th scope="col" className="border-0 rounded-start">
																Tên khóa học
															</th>
															<th scope="col" className="border-0">Tổng số video</th>
															<th scope="col" className="border-0">Đã hoàn thành</th>
															<th scope="col" className="border-0 rounded-end">Hành động</th>
														</tr>
													</thead>
													{/* Table body */}
													<tbody>
														{enrolledCourses.data.map((course) => (
															<tr key={course.id}>
																<td>
																	<div className="d-flex align-items-center">
																		<div className="w-100px">
																			<img
																				src={getCourseImageUrl(course.img_url)}
																				className="rounded"
																				alt={course.title}
																				style={{ width: '80px', height: '60px', objectFit: 'cover' }}
																			/>
																		</div>
																		<div className="mb-0 ms-2">
																			<h6>
																				<Link href={route('student.course.learn', course.id)}>
																					{course.title}
																				</Link>
																			</h6>
																			<p className="mb-1 small text-muted">
																				Giảng viên: {course.instructor_name}
																			</p>
																			{course.categories.length > 0 && (
																				<div className="mb-2">
																					{course.categories.map((category, index) => (
																						<span key={index} className="badge bg-light text-dark me-1 small">
																							{category}
																						</span>
																					))}
																				</div>
																			)}
																			<div className="overflow-hidden">
																				<h6 className="mb-0 text-end">{course.progress}%</h6>
																				<div className="progress progress-sm bg-primary bg-opacity-10">
																					<div
																						className="progress-bar bg-primary"
																						role="progressbar"
																						style={{ width: `${course.progress}%` }}
																						aria-valuenow={course.progress}
																						aria-valuemin="0"
																						aria-valuemax="100"
																					></div>
																				</div>
																			</div>
																		</div>
																	</div>
																</td>
																<td>
																	<span className="badge bg-light text-dark">
																		{course.total_videos}
																	</span>
																</td>
																<td>
																	<span className="badge bg-success">
																		{course.completed_lessons}
																	</span>
																</td>
																<td>
																	{getCourseAction(course)}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											) : (
												<div className="text-center py-5">
													<i className="bi bi-book fs-1 text-muted mb-3 d-block"></i>
													<h5 className="text-muted">Chưa có khóa học nào</h5>
													<p className="text-muted mb-3">Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học mới!</p>
													<Link
														href="/courses"
														className="btn btn-primary"
													>
														<i className="bi bi-search me-2"></i>Khám phá khóa học
													</Link>
												</div>
											)}
										</div>
										{/* Course list table END */}

										{/* Pagination START */}
										{enrolledCourses.data.length > 0 && (
											<div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
												{/* Content */}
												<p className="mb-0 text-center text-sm-start">
													Hiển thị {enrolledCourses.from} đến {enrolledCourses.to} trong tổng số {enrolledCourses.total} khóa học
												</p>
												{/* Pagination */}
												<Pagination
													links={enrolledCourses.links}
													className="mb-0"
												/>
											</div>
										)}
										{/* Pagination END */}
									</div>
									{/* Card body END */}
								</div>
							</div>
							{/* Main content END */}
						</div>
					</div>
				</section>
				{/* =======================
                Page content END */}
			</main>
			{/* **************** MAIN CONTENT END **************** */}
		</UserLayout>
	);
};

export default CourseList;