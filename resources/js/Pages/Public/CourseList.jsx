import React, { useState, useEffect } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import { Link, usePage, router } from '@inertiajs/react';

const CourseList = () => {
	const { auth, flash_success, flash_error, courses, categories, filters } = usePage().props;

	// State for filters - khởi tạo từ backend
	const [searchTerm, setSearchTerm] = useState(filters?.search || '');
	const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
	const [sortBy, setSortBy] = useState(filters?.sort || '');

	// Submit filters to backend
	const handleFilterSubmit = () => {
		const params = {};
		if (searchTerm) params.search = searchTerm;
		if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
		if (sortBy) params.sort = sortBy;

		router.get('/courses', params, {
			preserveState: true,
			preserveScroll: true
		});
	};

	// Clear all filters
	const handleClearFilters = () => {
		setSearchTerm('');
		setSelectedCategory('');
		setSortBy('');

		router.get('/courses', {}, {
			preserveState: true,
			preserveScroll: true
		});
	};

	// Handle pagination
	const handlePageChange = (url) => {
		if (url) {
			router.get(url, {}, {
				preserveState: true,
				preserveScroll: true
			});
		}
	};

	// Handle search on Enter key
	const handleSearchKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleFilterSubmit();
		}
	};

	// Auto submit when filters change (optional - có thể bỏ nếu không muốn)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchTerm !== (filters?.search || '')) {
				handleFilterSubmit();
			}
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	const categoryOptions = React.useMemo(() => {
		if (categories && categories.length > 0) {
			return ['All', ...categories.map(cat => cat.name)];
		}
		return ['All'];
	}, [categories]);

	// Format price
	const formatPrice = (price) => {
		return new Intl.NumberFormat('vi-VN').format(price) + '₫';
	};

	// Get course image URL
	const getCourseImageUrl = (imgUrl) => {
		if (!imgUrl) return 'https://placehold.co/600x400/EEE/31343C';
		if (imgUrl.startsWith('http')) return imgUrl;
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

	// Render pagination
	const renderPagination = () => {
		if (!courses.links || courses.links.length <= 3) return null;

		return (
			<nav className="mt-4 d-flex justify-content-center" aria-label="phân trang">
				<ul className="pagination pagination-primary-soft rounded mb-0">
					{courses.links.map((link, index) => {
						if (link.label.includes('Previous')) {
							return (
								<li key={index} className={`page-item mb-0 ${!link.url ? 'disabled' : ''}`}>
									<button
										className="page-link"
										onClick={() => handlePageChange(link.url)}
										disabled={!link.url}
										title="Trang trước"
									>
										<i className="fas fa-angle-left" />
									</button>
								</li>
							);
						}

						if (link.label.includes('Next')) {
							return (
								<li key={index} className={`page-item mb-0 ${!link.url ? 'disabled' : ''}`}>
									<button
										className="page-link"
										onClick={() => handlePageChange(link.url)}
										disabled={!link.url}
										title="Trang sau"
									>
										<i className="fas fa-angle-right" />
									</button>
								</li>
							);
						}

						return (
							<li key={index} className={`page-item mb-0 ${link.active ? 'active' : ''}`}>
								<button
									className="page-link"
									onClick={() => handlePageChange(link.url)}
									disabled={link.active}
								>
									{link.label}
								</button>
							</li>
						);
					})}
				</ul>
			</nav>
		);
	};

	return (
		<UserLayout>
			<>
				<main>
					{/* Page Banner */}
					<section
						className="bg-dark align-items-center d-flex"
						style={{
							background: "url(/assets/images/pattern/04.png) no-repeat center center",
							backgroundSize: "cover"
						}}
					>
						<div className="container">
							<div className="row">
								<div className="col-12">
									<h1 className="text-white">Danh Sách Khóa Học</h1>
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

					{/* Page content */}
					<section className="pt-5">
						<div className="container">
							{/* Search and Filter Options */}
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
												onKeyPress={handleSearchKeyPress}
											/>
											<button
												type="button"
												className="btn btn-primary mb-0 rounded"
												onClick={handleFilterSubmit}
											>
												<i className="fas fa-search" />
											</button>
										</div>
									</form>
								</div>

								{/* Category filter */}
								<div className="col-sm-6 col-xl-3 mt-3 mt-lg-0">
									<form className="bg-body shadow rounded p-2 input-borderless">
										<select
											className="form-select form-select-sm js-choice"
											value={selectedCategory}
											onChange={(e) => {
												setSelectedCategory(e.target.value);
												// Auto submit on change
												setTimeout(() => {
													const params = {};
													if (searchTerm) params.search = searchTerm;
													if (e.target.value && e.target.value !== 'All') params.category = e.target.value;
													if (sortBy) params.sort = sortBy;
													router.get('/courses', params, { preserveState: true, preserveScroll: true });
												}, 100);
											}}
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

								{/* Sort filter */}
								<div className="col-sm-6 col-xl-3 mt-3 mt-xl-0">
									<form className="bg-body shadow rounded p-2 input-borderless">
										<select
											className="form-select form-select-sm js-choice"
											value={sortBy}
											onChange={(e) => {
												setSortBy(e.target.value);
												// Auto submit on change
												setTimeout(() => {
													const params = {};
													if (searchTerm) params.search = searchTerm;
													if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
													if (e.target.value) params.sort = e.target.value;
													router.get('/courses', params, { preserveState: true, preserveScroll: true });
												}, 100);
											}}
										>
											<option value="">Sắp Xếp Theo</option>
											<option value="price-lowest-highest">Giá thấp đến cao</option>
											<option value="price-highest-lowest">Giá cao đến thấp</option>
										</select>
									</form>
								</div>

								{/* Clear filters button */}
								<div className="col-sm-6 col-xl-2 mt-3 mt-xl-0 d-grid">
									<button
										className="btn btn-lg btn-primary mb-0"
										onClick={handleClearFilters}
									>
										Xóa Bộ Lọc
									</button>
								</div>
							</div>

							{/* Results count */}
							<div className="row mb-3">
								<div className="col-12">
									<p className="text-muted">
										Tìm thấy {courses.total} khóa học
										{courses.current_page > 1 && ` - Trang ${courses.current_page} / ${courses.last_page}`}
									</p>
								</div>
							</div>

							{/* Course list */}
							<div className="row g-4">
								{courses.data && courses.data.length > 0 ? (
									courses.data.map((course) => (
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
													{getStatusBadge(course.status)}
												</div>

												{/* Card body */}
												<div className="card-body d-flex flex-column">
													{/* Categories */}
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
														{course.instructor ?
															(course.instructor.name || course.instructor) :
															'Chưa có giảng viên'
														}
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

							{/* Pagination */}
							{courses.data && courses.data.length > 0 && renderPagination()}
						</div>
					</section>
				</main>
			</>
		</UserLayout>
	);
};

export default CourseList;