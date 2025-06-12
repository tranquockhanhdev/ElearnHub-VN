import React, { useState, useMemo } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import { Link, usePage } from '@inertiajs/react';

const CourseList = () => {
	const { auth, flash_success, flash_error, courses, categories } = usePage().props;

	// State for filters
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [sortBy, setSortBy] = useState('');

	const categoryOptions = useMemo(() => {
		if (categories && categories.length > 0) {
			return ['All', ...categories.map(cat => cat.name)];
		}
		return ['All'];
	}, [categories]);

	// Filter and sort courses
	const filteredCourses = useMemo(() => {
		let filtered = courses || [];

		// Chỉ hiển thị khóa học active
		filtered = filtered.filter(course => course.status === 'active');

		// Search by course title or instructor name
		if (searchTerm) {
			filtered = filtered.filter(course => {
				const titleMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase());

				let instructorMatch = false;
				if (course.instructor) {
					// Nếu instructor là object, lấy name
					if (typeof course.instructor === 'object' && course.instructor.name) {
						instructorMatch = course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
					}
					// Nếu instructor là string
					else if (typeof course.instructor === 'string') {
						instructorMatch = course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
					}
				}

				return titleMatch || instructorMatch;
			});
		}

		// Filter by category
		if (selectedCategory && selectedCategory !== 'All') {
			filtered = filtered.filter(course => {
				// Nếu course có categories (many-to-many relationship)
				if (course.categories && Array.isArray(course.categories)) {
					return course.categories.some(cat => cat.name === selectedCategory);
				}
				return false;
			});
		}

		// Sort courses
		switch (sortBy) {
			case 'price-lowest-highest':
				filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
				break;
			case 'price-highest-lowest':
				filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
				break;
			default:
				break;
		}

		return filtered;
	}, [courses, searchTerm, selectedCategory, sortBy]);

	// Format price
	const formatPrice = (price) => {
		return new Intl.NumberFormat('vi-VN').format(price) + '₫';
	};

	// Get course image URL
	const getCourseImageUrl = (imgUrl) => {
		if (!imgUrl) return 'https://placehold.co/600x400/EEE/31343C';
		// Nếu img_url đã có đường dẫn đầy đủ
		if (imgUrl.startsWith('http')) return imgUrl;
		// Nếu chỉ có tên file, thêm đường dẫn storage
		return `/storage/${imgUrl}`;
	};

	// Get course status badge
	const getStatusBadge = (status) => {
		switch (status) {
			case 'active':
				return <span className="badge bg-success position-absolute top-0 start-0 m-2">Đang hoạt động</span>;
			case 'inactive':
				return <span className="badge bg-warning position-absolute top-0 start-0 m-2">Tạm dừng</span>;
			default:
				return null;
		}
	};

	return (
		<UserLayout>
			<>
				{/* **************** MAIN CONTENT START **************** */}
				<main>
					{/* =======================
Page Banner START */}
					<section
						className="bg-dark align-items-center d-flex"
						style={{
							background:
								"url(/assets/images/pattern/04.png) no-repeat center center",
							backgroundSize: "cover"
						}}
					>
						{/* Main banner background image */}
						<div className="container">
							<div className="row">
								<div className="col-12">
									{/* Title */}
									<h1 className="text-white">Danh Sách Khóa Học</h1>
									{/* Breadcrumb */}
									<div className="d-flex">
										<nav aria-label="breadcrumb">
											<ol className="breadcrumb breadcrumb-dark breadcrumb-dots mb-0">
												<li className="breadcrumb-item">
													<Link href="/">Trang Chủ</Link>
												</li>
												<li className="breadcrumb-item active" aria-current="page">
													Khóa Học
												</li>
											</ol>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</section>
					{/* =======================
Page Banner END */}
					{/* =======================
Page content START */}
					<section className="pt-5">
						<div className="container">
							{/* Search option START */}
							<div className="row mb-4 align-items-center">
								{/* Search bar */}
								<div className="col-sm-6 col-xl-4">
									<form className="bg-body shadow rounded p-2" onSubmit={(e) => e.preventDefault()}>
										<div className="input-group input-borderless">
											<input
												className="form-control me-1"
												type="search"
												placeholder="Tìm kiếm khóa học hoặc giảng viên"
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
											/>
											<button type="button" className="btn btn-primary mb-0 rounded">
												<i className="fas fa-search" />
											</button>
										</div>
									</form>
								</div>
								{/* Select option */}
								<div className="col-sm-6 col-xl-3 mt-3 mt-lg-0">
									<form className="bg-body shadow rounded p-2 input-borderless">
										<select
											className="form-select form-select-sm js-choice"
											aria-label=".form-select-sm"
											value={selectedCategory}
											onChange={(e) => setSelectedCategory(e.target.value)}
										>
											<option value="">Danh Mục</option>
											{categoryOptions.map((category) => (
												<option key={category} value={category}>
													{category}
												</option>
											))}
										</select>
									</form>
								</div>
								{/* Select option */}
								<div className="col-sm-6 col-xl-3 mt-3 mt-xl-0">
									<form className="bg-body shadow rounded p-2 input-borderless">
										<select
											className="form-select form-select-sm js-choice"
											aria-label=".form-select-sm"
											value={sortBy}
											onChange={(e) => setSortBy(e.target.value)}
										>
											<option value="">Sắp Xếp Theo</option>
											<option value="price-lowest-highest">Giá thấp đến cao</option>
											<option value="price-highest-lowest">Giá Cao Đến Thấp</option>
										</select>
									</form>
								</div>
								{/* Button */}
								<div className="col-sm-6 col-xl-2 mt-3 mt-xl-0 d-grid">
									<button
										className="btn btn-lg btn-primary mb-0"
										onClick={() => {
											setSearchTerm('');
											setSelectedCategory('');
											setSortBy('');
										}}
									>
										Xóa Bộ Lọc
									</button>
								</div>
							</div>
							{/* Search option END */}

							{/* Results count */}
							<div className="row mb-3">
								<div className="col-12">
									<p className="text-muted">
										Tìm thấy {filteredCourses.length} khóa học
									</p>
								</div>
							</div>

							{/* Course list START */}
							<div className="row g-4">
								{filteredCourses.length > 0 ? (
									filteredCourses.map((course) => (
										<div key={course.id} className="col-lg-3 col-md-6">
											<div className="card h-100 shadow">
												{/* Image */}
												<div className="position-relative">
													<img
														src={getCourseImageUrl(course.img_url)}
														alt={course.title}
														className="card-img-top"
														style={{ height: '200px', objectFit: 'cover' }}
													/>
													{/* Status badge */}
													{getStatusBadge(course.status)}
												</div>

												{/* Card body */}
												<div className="card-body d-flex flex-column">
													{/* Categories - hiển thị nhiều category */}
													<div className="mb-2">
														{course.categories && course.categories.length > 0 ? (
															course.categories.map((category, index) => (
																<span key={index} className="badge bg-light text-dark small me-1">
																	{category.name}
																</span>
															))
														) : (
															<span className="badge bg-light text-dark small">
																Chưa phân loại
															</span>
														)}
													</div>

													{/* Title */}
													<h6 className="card-title mb-2">
														<Link
															href={`/courses/${course.slug}`}
															className="text-decoration-none"
														>
															{course.title}
														</Link>
													</h6>

													{/* Instructor */}
													<p className="text-black small mb-3">
														{course.instructor ? course.instructor.name || course.instructor : 'Chưa có giảng viên'}
													</p>

													{/* Price */}
													<div className="mt-auto">
														<div className="d-flex align-items-center justify-content-between">
															<span className="h4 text-success mb-0 fw-bold">
																{formatPrice(course.price)}
															</span>
															<Link
																href={`/courses/${course.slug}`}
																className="btn btn-primary btn-sm"
															>
																Xem chi tiết
															</Link>
														</div>
													</div>
												</div>
											</div>
										</div>
									))
								) : (
									<div className="col-12">
										<div className="text-center py-5">
											<i className="fas fa-search fa-3x text-muted mb-3"></i>
											<h4>Không tìm thấy khóa học nào</h4>
											<p className="text-muted">
												Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
											</p>
										</div>
									</div>
								)}
							</div>
							{/* Course list END */}

							{/* Pagination START */}
							{filteredCourses.length > 0 && (
								<div className="col-12">
									<nav
										className="mt-4 d-flex justify-content-center"
										aria-label="phân trang"
									>
										<ul className="pagination pagination-primary-soft rounded mb-0">
											<li className="page-item mb-0">
												<a className="page-link" href="#" tabIndex={-1} title="Trang đầu">
													<i className="fas fa-angle-double-left" />
												</a>
											</li>
											<li className="page-item mb-0">
												<a className="page-link" href="#" title="Trang 1">
													1
												</a>
											</li>
											<li className="page-item mb-0 active">
												<a className="page-link" href="#" title="Trang hiện tại">
													2
												</a>
											</li>
											<li className="page-item mb-0">
												<a className="page-link" href="#" title="Trang tiếp theo">
													..
												</a>
											</li>
											<li className="page-item mb-0">
												<a className="page-link" href="#" title="Trang 6">
													6
												</a>
											</li>
											<li className="page-item mb-0">
												<a className="page-link" href="#" title="Trang cuối">
													<i className="fas fa-angle-double-right" />
												</a>
											</li>
										</ul>
									</nav>
								</div>
							)}
							{/* Pagination END */}
						</div>
					</section>
					{/* =======================
Page content END */}

				</main>
				{/* **************** MAIN CONTENT END **************** */}
			</>
		</UserLayout>
	);
};

export default CourseList;