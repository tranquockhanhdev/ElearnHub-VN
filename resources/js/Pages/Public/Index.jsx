import React from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import { Link, usePage } from '@inertiajs/react';

const Home = () => {
	const {
		auth,
		flash_success,
		flash_error,
		featured_courses,
		latest_courses,
		best_selling_courses,
		popular_categories,
		stats
	} = usePage().props;

	// Format currency
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	};

	const getCourseImage = (course) => {
		console.log('Course Image:', course);

		if (!course.img_url) {
			return '/assets/images/courses/4by3/default.jpg';
		}

		if (course.img_url.startsWith('bannercourse/')) {
			return `/storage/${course.img_url}`;
		}

		return course.img_url;
	};



	return (
		<UserLayout>
			<main>
				{/* Hero Section */}
				<section className="bg-primary position-relative overflow-hidden">
					<div className="container position-relative z-index-2">
						<div className="row align-items-center min-vh-75 py-5">
							<div className="col-lg-6">
								<h1 className="display-4 text-white fw-bold mb-4">
									Nền tảng học tập
									<span className="text-warning d-block">K-Edu</span>
									cho sinh viên IT
								</h1>
								<p className="text-white fs-5 mb-4 opacity-90">
									Khóa học chất lượng cao về lập trình, thiết kế UI/UX và công nghệ thông tin.
									Hỗ trợ đồ án tốt nghiệp với giá cả phù hợp sinh viên.
								</p>
								<div className="d-flex flex-column flex-sm-row gap-3 mb-4">
									<Link href="/courses" className="btn btn-warning btn-lg px-4 py-3">
										<i className="bi bi-play-circle me-2"></i>
										Khám phá khóa học
									</Link>
									<Link href="/about" className="btn btn-outline-light btn-lg px-4 py-3">
										Tìm hiểu thêm
									</Link>
								</div>
								{/* Stats */}
								<div className="row g-4 mt-4">
									<div className="col-sm-3">
										<div className="text-center text-sm-start">
											<h4 className="text-warning fw-bold mb-1">{stats?.total_courses || 100}+</h4>
											<p className="text-white-50 mb-0">Khóa học</p>
										</div>
									</div>
									<div className="col-sm-3">
										<div className="text-center text-sm-start">
											<h4 className="text-warning fw-bold mb-1">{stats?.total_students || 0}+</h4>
											<p className="text-white-50 mb-0">Học viên</p>
										</div>
									</div>
									<div className="col-sm-3">
										<div className="text-center text-sm-start">
											<h4 className="text-warning fw-bold mb-1">{stats?.total_instructors || 0}+</h4>
											<p className="text-white-50 mb-0">Giảng viên</p>
										</div>
									</div>
									<div className="col-sm-3">
										<div className="text-center text-sm-start">
											<h4 className="text-warning fw-bold mb-1">{stats?.satisfaction_rate || 95}%</h4>
											<p className="text-white-50 mb-0">Hài lòng</p>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-6 text-center">
								<div className="position-relative">
									<img
										src="https://i.ibb.co/tprfj3WF/Chat-GPT-Image-13-39-09-19-thg-6-2025.png"
										className="img-fluid"
										alt="K-Edu Learning Platform"
										style={{
											maxHeight: '400px',
											borderRadius: '12px', // bo tròn
											border: '3px solid #007bff' // viền màu xanh dương
										}}
									/>
								</div>
							</div>

						</div>
					</div>
					{/* Background decoration */}
					<div className="position-absolute top-0 end-0 opacity-1">
						<svg width="400" height="400" viewBox="0 0 400 400">
							<circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
							<circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
							<circle cx="200" cy="200" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
						</svg>
					</div>
				</section>

				{/* Categories Section */}
				<section className="py-5 bg-light">
					<div className="container">
						<div className="row mb-5">
							<div className="col-12 text-center">
								<h2 className="fw-bold mb-3">Danh mục khóa học phổ biến</h2>
								<p className="text-muted mb-0">Chọn lĩnh vực bạn muốn phát triển</p>
							</div>
						</div>
						<div className="row g-4">
							{popular_categories?.map((category, index) => (
								<div key={category.id} className="col-md-6 col-lg-3">
									<Link href={`/courses?category=${category.slug}`} className="text-decoration-none">
										<div className="card border-0 shadow-sm h-100 card-hover">
											<div className="card-body text-center p-4">
												<div className={`icon-xl bg-${['primary', 'success', 'warning', 'info'][index % 4]} bg-opacity-10 rounded-circle mx-auto mb-3`}>
													<i className={`bi ${['bi-code-slash', 'bi-palette', 'bi-phone', 'bi-graph-up'][index % 4]} text-${['primary', 'success', 'warning', 'info'][index % 4]} display-6`}></i>
												</div>
												<h5 className="card-title text-dark">{category.name}</h5>
												<p className="text-muted small mb-3">
													{category.description || 'Khóa học chất lượng cao'}
												</p>
												<div className="d-flex justify-content-between text-muted small">
													<span>{category.courses_count}+ khóa học</span>
													<span>từ 299K</span>
												</div>
											</div>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Best Selling Courses */}
				<section className="py-5">
					<div className="container">
						<div className="row mb-4">
							<div className="col-12">
								<div className="d-flex justify-content-between align-items-center">
									<div>
										<h2 className="fw-bold mb-2">Khóa học bán chạy</h2>
										<p className="text-muted mb-0">Những khóa học được yêu thích nhất</p>
									</div>
									<Link href="/courses" className="btn btn-outline-primary">
										Xem tất cả
										<i className="bi bi-arrow-right ms-1"></i>
									</Link>
								</div>
							</div>
						</div>

						<div className="row g-4">
							{best_selling_courses?.slice(0, 3).map((course) => (
								<div key={course.id} className="col-lg-4 col-md-6">
									<div className="card border-0 shadow-sm h-100">
										<div className="position-relative overflow-hidden">
											<img
												src={getCourseImage(course)}
												className="card-img-top"
												alt={course.title}
												style={{ height: '200px', objectFit: 'cover' }}
											/>
											<div className="position-absolute top-0 start-0 p-3">
												<span className="badge bg-danger">Bán chạy</span>
											</div>
											<div className="position-absolute top-0 end-0 p-3">
												<button className="btn btn-sm btn-light rounded-circle">
													<i className="bi bi-heart"></i>
												</button>
											</div>
										</div>
										<div className="card-body p-4">
											<div className="d-flex justify-content-between align-items-center mb-2">
												<span className="badge bg-primary bg-opacity-10 text-primary">
													{course.category?.name || 'Khóa học'}
												</span>
												<div className="d-flex align-items-center text-warning">
													<i className="bi bi-star-fill small me-1"></i>
													<span className="small fw-semibold">{course.rating || '4.8'}</span>
													<span className="small text-muted ms-1">({course.reviews_count || 0})</span>
												</div>
											</div>
											<h5 className="card-title mb-3">
												<Link href={`/course/${course.slug}`} className="text-decoration-none text-dark">
													{course.title}
												</Link>
											</h5>
											<div className="d-flex align-items-center mb-3">
												<img
													src={course.instructor?.avatar || '/assets/images/avatar/default.jpg'}
													className="avatar avatar-xs rounded-circle me-2"
													alt="Instructor"
												/>
												<small className="text-muted">{course.instructor?.name}</small>
											</div>
											<div className="d-flex justify-content-between align-items-center">
												<div>
													<span className="h5 text-success mb-0">{formatCurrency(course.price)}</span>
													{course.original_price && (
														<span className="text-muted text-decoration-line-through ms-2">
															{formatCurrency(course.original_price)}
														</span>
													)}
												</div>
												<div className="text-muted small">
													<i className="bi bi-clock me-1"></i>
													{course.duration || '12h 30m'}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Latest Courses */}
				<section className="py-5 bg-light">
					<div className="container">
						<div className="row mb-4">
							<div className="col-12">
								<div className="d-flex justify-content-between align-items-center">
									<div>
										<h2 className="fw-bold mb-2">Khóa học mới cập nhật</h2>
										<p className="text-muted mb-0">Nội dung được cập nhật theo xu hướng mới nhất</p>
									</div>
									<Link href="/courses?filter=latest" className="btn btn-outline-primary">
										Xem tất cả
										<i className="bi bi-arrow-right ms-1"></i>
									</Link>
								</div>
							</div>
						</div>

						<div className="row g-4">
							{latest_courses?.slice(0, 4).map((course) => (
								<div key={course.id} className="col-lg-6">
									<div className="card border-0 shadow-sm">
										<div className="row g-0">
											<div className="col-md-4">
												<img
													src={getCourseImage(course)}
													className="img-fluid h-100 object-cover rounded-start"
													alt={course.title}
												/>
											</div>
											<div className="col-md-8">
												<div className="card-body p-3">
													<div className="d-flex justify-content-between align-items-center mb-2">
														<span className="badge bg-info bg-opacity-10 text-info small">
															{course.category?.name || 'Khóa học'}
														</span>
														<span className="badge bg-success">Mới</span>
													</div>
													<h6 className="card-title mb-2">
														<Link href={`/course/${course.slug}`} className="text-decoration-none text-dark">
															{course.title}
														</Link>
													</h6>
													<div className="d-flex align-items-center mb-2">
														<div className="d-flex align-items-center text-warning me-3">
															<i className="bi bi-star-fill small me-1"></i>
															<span className="small">{course.rating || '4.8'}</span>
														</div>
														<small className="text-muted">{course.duration || '6h 30m'}</small>
													</div>
													<div className="d-flex justify-content-between align-items-center">
														<span className="h6 text-success mb-0">{formatCurrency(course.price)}</span>
														<small className="text-muted">
															Cập nhật: {new Date(course.updated_at).toLocaleDateString('vi-VN')}
														</small>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Featured Courses */}
				<section className="py-5">
					<div className="container">
						<div className="row mb-4">
							<div className="col-12">
								<div className="d-flex justify-content-between align-items-center">
									<div>
										<h2 className="fw-bold mb-2">Khóa học nổi bật</h2>
										<p className="text-muted mb-0">Được chọn lọc bởi đội ngũ chuyên gia</p>
									</div>
									<Link href="/courses?filter=featured" className="btn btn-outline-primary">
										Xem tất cả
										<i className="bi bi-arrow-right ms-1"></i>
									</Link>
								</div>
							</div>
						</div>

						<div className="row g-4">
							{featured_courses?.slice(0, 3).map((course) => (
								<div key={course.id} className="col-lg-4 col-md-6">
									<div className="card border-0 shadow-sm h-100">
										<div className="position-relative overflow-hidden">
											<img
												src={getCourseImage(course)}
												className="card-img-top"
												alt={course.title}
												style={{ height: '200px', objectFit: 'cover' }}
											/>
											<div className="position-absolute top-0 start-0 p-3">
												<span className="badge bg-warning text-dark">Nổi bật</span>
											</div>
										</div>
										<div className="card-body p-4">
											<div className="d-flex justify-content-between align-items-center mb-2">
												<span className="badge bg-success bg-opacity-10 text-success">
													{course.category?.name || 'Khóa học'}
												</span>
												<div className="d-flex align-items-center text-warning">
													<i className="bi bi-star-fill small me-1"></i>
													<span className="small fw-semibold">{course.rating || '4.8'}</span>
												</div>
											</div>
											<h5 className="card-title mb-3">
												<Link href={`/course/${course.slug}`} className="text-decoration-none text-dark">
													{course.title}
												</Link>
											</h5>
											<div className="d-flex align-items-center mb-3">
												<small className="text-muted">{course.instructor?.name}</small>
											</div>
											<div className="d-flex justify-content-between align-items-center">
												<span className="h5 text-success mb-0">{formatCurrency(course.price)}</span>
												<div className="text-muted small">
													<i className="bi bi-clock me-1"></i>
													{course.duration || '8h 45m'}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
				{/* Why Choose K-Edu */}
				<section className="py-5 bg-light">
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-6 mb-4 mb-lg-0">
								<div className="position-relative">
									<img
										src="https://i.ibb.co/hxnf4Dhs/Chat-GPT-Image-13-46-49-19-thg-6-2025.png"
										className="img-fluid rounded-3 shadow"
										alt="Why Choose K-Edu"
										style={{
											border: '3px solid #007bff', // viền màu xanh
											borderRadius: '12px' // bo tròn lại nếu muốn
										}}
									/>
								</div>
							</div>

							<div className="col-lg-6">
								<h2 className="fw-bold mb-4">Tại sao chọn K-Edu?</h2>
								<p className="text-muted mb-4">
									Nền tảng học tập trực tuyến hàng đầu dành riêng cho sinh viên IT,
									với giá cả phù hợp và chất lượng đảm bảo.
								</p>

								<div className="row g-4">
									<div className="col-sm-6">
										<div className="d-flex">
											<div className="icon-md bg-primary bg-opacity-10 rounded-circle flex-shrink-0 me-3">
												<i className="bi bi-mortarboard text-primary"></i>
											</div>
											<div>
												<h6 className="mb-2">Hỗ trợ đồ án</h6>
												<p className="text-muted small mb-0">
													Hướng dẫn chi tiết làm đồ án tốt nghiệp
												</p>
											</div>
										</div>
									</div>

									<div className="col-sm-6">
										<div className="d-flex">
											<div className="icon-md bg-success bg-opacity-10 rounded-circle flex-shrink-0 me-3">
												<i className="bi bi-currency-dollar text-success"></i>
											</div>
											<div>
												<h6 className="mb-2">Giá sinh viên</h6>
												<p className="text-muted small mb-0">
													Mức giá phù hợp với túi tiền sinh viên
												</p>
											</div>
										</div>
									</div>

									<div className="col-sm-6">
										<div className="d-flex">
											<div className="icon-md bg-warning bg-opacity-10 rounded-circle flex-shrink-0 me-3">
												<i className="bi bi-clock text-warning"></i>
											</div>
											<div>
												<h6 className="mb-2">Học linh hoạt</h6>
												<p className="text-muted small mb-0">
													Học mọi lúc mọi nơi, phù hợp lịch học
												</p>
											</div>
										</div>
									</div>

									<div className="col-sm-6">
										<div className="d-flex">
											<div className="icon-md bg-info bg-opacity-10 rounded-circle flex-shrink-0 me-3">
												<i className="bi bi-headset text-info"></i>
											</div>
											<div>
												<h6 className="mb-2">Hỗ trợ 24/7</h6>
												<p className="text-muted small mb-0">
													Giải đáp thắc mắc mọi lúc mọi nơi
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-4">
									<Link href="/about" className="btn btn-primary me-3">
										Tìm hiểu thêm
									</Link>
									<Link href="/contact" className="btn btn-outline-primary">
										Liên hệ tư vấn
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-primary py-5">
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-8">
								<h2 className="text-white fw-bold mb-3">
									Sẵn sàng bắt đầu hành trình học tập?
								</h2>
								<p className="text-white opacity-90 mb-4 mb-lg-0">
									Tham gia cùng hàng nghìn sinh viên đã thành công với K-Edu.
									Đăng ký ngay để nhận ưu đãi đặc biệt!
								</p>
							</div>
							<div className="col-lg-4 text-lg-end">
								<Link href="/register" className="btn btn-warning btn-lg px-4 py-3">
									<i className="bi bi-rocket-takeoff me-2"></i>
									Đăng ký ngay
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Custom Styles */}
			<style jsx>{`
                .card-hover {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
                }
                .object-cover {
                    object-fit: cover;
                }
                .min-vh-75 {
                    min-height: 75vh;
                }
                .icon-md {
                    width: 40px;
                    height: 40px;
                }
                .icon-xl {
                    width: 80px;
                    height: 80px;
                }
            `}</style>
		</UserLayout>
	);
};

export default Home;