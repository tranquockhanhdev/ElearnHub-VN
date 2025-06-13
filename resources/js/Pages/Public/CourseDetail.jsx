import React, { useState } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import { Link, usePage } from '@inertiajs/react';

const CourseDetail = () => {
	const { auth, flash_success, flash_error, course } = usePage().props;
	const [isExpanded, setIsExpanded] = useState(false);
	const [isCurriculumExpanded, setIsCurriculumExpanded] = useState(false);

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

	// Get instructor info
	const getInstructorInfo = () => {
		if (!course.instructor) return { name: 'Chưa có giảng viên', avatar: '/assets/images/avatar/default.jpg' };
		if (typeof course.instructor === 'object') {
			return {
				name: course.instructor.name || 'Chưa có tên',
				avatar: course.instructor.avatar || '/assets/images/avatar/01.jpg',
				bio: course.instructor.bio || 'Giảng viên tại k-edu'
			};
		}
		return { name: course.instructor, avatar: '/assets/images/avatar/01.jpg' };
	};

	const instructor = getInstructorInfo();

	// Render categories
	const renderCategories = () => {
		if (!course.categories || course.categories.length === 0) {
			return <span className="badge bg-light text-dark small">Chưa phân loại</span>;
		}
		return course.categories.map((category, index) => (
			<span key={index} className="badge bg-primary text-white small me-1">
				{category.name}
			</span>
		));
	};

	// Render description with HTML
	const renderDescription = () => {
		if (!course.description) return 'Chưa có mô tả cho khóa học này.';
		return { __html: course.description };
	};

	return (
		<UserLayout>
			<>
				{/* **************** MAIN CONTENT START **************** */}
				<main>
					{/* =======================
Page content START */}
					<section className="pt-3 pt-xl-5">
						<div className="container" data-sticky-container="">
							<div className="row g-4">
								{/* Main content START */}
								<div className="col-xl-8">
									<div className="row g-4">
										{/* Title START */}
										<div className="col-12">
											{/* Categories */}
											<div className="mb-2">
												{renderCategories()}
											</div>

											{/* Title */}
											<h2>{course.title || 'Tên khóa học'}</h2>

											{/* Short description */}
											<p>
												{course.short_description ||
													'Khóa học này sẽ cung cấp cho bạn những kiến thức và kỹ năng cần thiết để thành công trong lĩnh vực của mình.'
												}
											</p>

											{/* Course stats */}
											<ul className="list-inline mb-0">

												<li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
													<i className="fas fa-user-graduate me-2" />
													12k Đã tham gia
												</li>
												<li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
													<i className="fas fa-signal me-2" />
													Tất cả cấp độ
												</li>
												<li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0">
													<i className="bi bi-patch-exclamation-fill me-2" />
													Cập nhật {new Date(course.updated_at).toLocaleDateString('vi-VN')}
												</li>
												<li className="list-inline-item fw-light h6">
													<i className="fas fa-globe me-2" />
													Tiếng Việt
												</li>
											</ul>
										</div>
										{/* Title END */}

										{/* Course Image */}
										<div className="col-12 position-relative">
											<div className="rounded-3 overflow-hidden">
												<img
													src={getCourseImageUrl(course.img_url)}
													alt={course.title}
													className="img-fluid w-100"
													style={{ height: '400px', objectFit: 'cover' }}
												/>
											</div>
										</div>

										{/* About course START */}
										<div className="col-12">
											<div className="card border">
												{/* Card header START */}
												<div className="card-header border-bottom">
													<h3 className="mb-0">Mô tả khóa học</h3>
												</div>
												{/* Card header END */}

												{/* Card body START */}
												<div className="card-body">
													<div dangerouslySetInnerHTML={renderDescription()} />

													{/* Collapse body */}
													{isExpanded && (
														<div id="collapseContent" className="mt-3">
															<p>
																Khóa học này được thiết kế để cung cấp cho bạn những kiến thức
																thực tế và ứng dụng cao. Bạn sẽ được học từ những chuyên gia
																hàng đầu trong lĩnh vực với nhiều năm kinh nghiệm.
															</p>
															<p className="mb-0">
																Với phương pháp giảng dạy hiện đại và tương tác, bạn sẽ nhanh chóng
																nắm bắt được những kỹ năng cần thiết để áp dụng vào thực tế công việc.
															</p>
														</div>
													)}

													{/* Collapse button */}
													<button
														className="btn btn-link p-0 mb-0 mt-2 btn-more d-flex align-items-center"
														onClick={() => setIsExpanded(!isExpanded)}
													>
														Xem <span className="see-more ms-1">{isExpanded ? 'ít hơn' : 'thêm'}</span>
														<i className={`fas fa-angle-${isExpanded ? 'up' : 'down'} ms-2`} />
													</button>

													{/* What you'll learn */}
													<h5 className="mt-4">Bạn sẽ học được gì</h5>
													<div className="row mb-3">
														<div className="col-md-6">
															<ul className="list-group list-group-borderless">
																<li className="list-group-item h6 fw-light d-flex mb-0">
																	<i className="fas fa-check-circle text-success me-2" />
																	Nắm vững kiến thức cơ bản
																</li>
																<li className="list-group-item h6 fw-light d-flex mb-0">
																	<i className="fas fa-check-circle text-success me-2" />
																	Ứng dụng vào thực tế
																</li>
																<li className="list-group-item h6 fw-light d-flex mb-0">
																	<i className="fas fa-check-circle text-success me-2" />
																	Phát triển kỹ năng chuyên môn
																</li>
																<li className="list-group-item h6 fw-light d-flex mb-0">
																	<i className="fas fa-check-circle text-success me-2" />
																	Làm việc với dự án thực tế
																</li>
															</ul>
														</div>
														<div className="col-md-6">
															<ul className="list-group list-group-borderless">
																<li className="list-group-item h6 fw-light d-flex mb-0">
																	<i className="fas fa-check-circle text-success me-2" />
																	Tư duy giải quyết vấn đề
																</li>
																<li className="list-group-item h6 fw-light d-flex mb-0">
																	<i className="fas fa-check-circle text-success me-2" />
																	Kỹ năng làm việc nhóm
																</li>
																<li className="list-group-item h6 fw-light d-flex mb-0">
																	<i className="fas fa-check-circle text-success me-2" />
																	Cập nhật xu hướng mới
																</li>
															</ul>
														</div>
													</div>
												</div>
												{/* Card body END */}
											</div>
										</div>
										{/* About course END */}

										{/* Curriculum START */}
										<div className="col-12">
											<div className="card border rounded-3">
												{/* Card header START */}
												<div className="card-header border-bottom">
													<h3 className="mb-0">Nội dung khóa học</h3>
												</div>
												{/* Card header END */}

												{/* Card body START */}
												<div className="card-body">
													<div className="row g-5">
														{/* Sample curriculum - bạn có thể thay thế bằng dữ liệu thực từ backend */}
														<div className="col-12">
															<h5 className="mb-4">Chương 1: Giới thiệu (3 bài học)</h5>

															<div className="d-sm-flex justify-content-sm-between align-items-center">
																<div className="d-flex">
																	<button className="btn btn-danger-soft btn-round mb-0">
																		<i className="fas fa-play" />
																	</button>
																	<div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
																		<h6 className="mb-0">Giới thiệu khóa học</h6>
																		<p className="mb-2 mb-sm-0 small">10 phút 56 giây</p>
																	</div>
																</div>
																<button className="btn btn-sm btn-success mb-0">
																	Xem
																</button>
															</div>

															<hr />

															<div className="d-sm-flex justify-content-sm-between align-items-center">
																<div className="d-flex">
																	<button className="btn btn-danger-soft btn-round mb-0 flex-shrink-0">
																		<i className="fas fa-play" />
																	</button>
																	<div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
																		<h6 className="mb-0">Kiến thức cơ bản</h6>
																		<p className="mb-2 mb-sm-0 small">18 phút 30 giây</p>
																	</div>
																</div>
																<button className="btn btn-sm btn-success mb-0">
																	Xem
																</button>
															</div>

															<hr />

															<div className="d-sm-flex justify-content-sm-between align-items-center">
																<div className="d-flex">
																	<button className="btn btn-light btn-round mb-0 flex-shrink-0">
																		<i className="bi bi-lock-fill" />
																	</button>
																	<div className="ms-2 ms-sm-3 mt-1 mt-sm-0">
																		<h6 className="mb-0">Thực hành đầu tiên</h6>
																		<p className="mb-2 mb-sm-0 small">22 phút 26 giây</p>
																	</div>
																</div>
																<button className="btn btn-sm btn-orange mb-0">
																	Premium
																</button>
															</div>
														</div>

														{/* More curriculum content when expanded */}
														{isCurriculumExpanded && (
															<div className="col-12 mt-5">
																<h5 className="mb-4">Chương 2: Nâng cao (5 bài học)</h5>
																{/* Add more curriculum items here */}
																<div className="text-center py-3">
																	<p className="text-muted">Nội dung chi tiết sẽ được hiển thị sau khi đăng ký khóa học</p>
																</div>
															</div>
														)}

														{/* Collapse button */}
														<div className="col-12">
															<button
																className="btn btn-link mb-0 mt-4 btn-more d-flex align-items-center justify-content-center"
																onClick={() => setIsCurriculumExpanded(!isCurriculumExpanded)}
															>
																Xem <span className="see-more ms-1">{isCurriculumExpanded ? 'ít hơn' : 'thêm nội dung'}</span>
																<i className={`fas fa-angle-${isCurriculumExpanded ? 'up' : 'down'} ms-2`} />
															</button>
														</div>
													</div>
												</div>
												{/* Card body END */}
											</div>
										</div>
										{/* Curriculum END */}
									</div>
								</div>
								{/* Main content END */}

								{/* Right sidebar START */}
								<div className="col-xl-4">
									<div data-sticky="" data-margin-top={80} data-sticky-for={768}>
										<div className="row g-4">
											<div className="col-md-6 col-xl-12">
												{/* Course info START */}
												<div className="card card-body border p-4">
													{/* Price and share button */}
													<div className="d-flex justify-content-between align-items-center">
														{/* Price */}
														<h3 className="fw-bold mb-0 me-2 text-success">
															{formatPrice(course.price)}
														</h3>
														{/* Share button with dropdown */}
														<div className="dropdown">
															<button
																className="btn btn-sm btn-light rounded mb-0 small"
																type="button"
																id="dropdownShare"
																data-bs-toggle="dropdown"
																aria-expanded="false"
															>
																<i className="fas fa-fw fa-share-alt" />
															</button>
															{/* dropdown menu */}
															<ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded">
																<li>
																	<a className="dropdown-item" href="#">
																		<i className="fab fa-twitter-square me-2" />
																		Twitter
																	</a>
																</li>
																<li>
																	<a className="dropdown-item" href="#">
																		<i className="fab fa-facebook-square me-2" />
																		Facebook
																	</a>
																</li>
																<li>
																	<a className="dropdown-item" href="#">
																		<i className="fab fa-linkedin me-2" />
																		LinkedIn
																	</a>
																</li>
																<li>
																	<a className="dropdown-item" href="#">
																		<i className="fas fa-copy me-2" />
																		Sao chép link
																	</a>
																</li>
															</ul>
														</div>
													</div>

													{/* Buttons */}
													<div className="mt-3 d-grid">
														{auth?.user ? (
															<Link
																href={`/student/checkout/${course.id}`}
																className="btn btn-success"
															>
																Mua ngay
															</Link>
														) : (
															<Link href="/login" className="btn btn-success">
																Đăng nhập để mua
															</Link>
														)}
													</div>

													{/* Divider */}
													<hr />

													{/* Course includes */}
													<h5 className="mb-3">Khóa học bao gồm</h5>
													<ul className="list-group list-group-borderless border-0">
														<li className="list-group-item px-0 d-flex justify-content-between">
															<span className="h6 fw-light mb-0">
																<i className="fas fa-fw fa-book-open text-primary" />
																Bài học
															</span>
															<span>30+</span>
														</li>
														<li className="list-group-item px-0 d-flex justify-content-between">
															<span className="h6 fw-light mb-0">
																<i className="fas fa-fw fa-clock text-primary" />
																Thời lượng
															</span>
															<span>50+ giờ</span>
														</li>
														<li className="list-group-item px-0 d-flex justify-content-between">
															<span className="h6 fw-light mb-0">
																<i className="fas fa-fw fa-signal text-primary" />
																Cấp độ
															</span>
															<span>Tất cả</span>
														</li>
														<li className="list-group-item px-0 d-flex justify-content-between">
															<span className="h6 fw-light mb-0">
																<i className="fas fa-fw fa-globe text-primary" />
																Ngôn ngữ
															</span>
															<span>Tiếng Việt</span>
														</li>
														<li className="list-group-item px-0 d-flex justify-content-between">
															<span className="h6 fw-light mb-0">
																<i className="fas fa-fw fa-user-clock text-primary" />
																Truy cập
															</span>
															<span>Trọn đời</span>
														</li>

													</ul>

													{/* Divider */}
													<hr />

													{/* Instructor info */}
													<div className="d-sm-flex align-items-center">
														{/* Avatar image */}
														<div className="avatar avatar-xl">
															<img
																className="avatar-img rounded-circle"
																src={instructor.avatar}
																alt={instructor.name}
															/>
														</div>
														<div className="ms-sm-3 mt-2 mt-sm-0">
															<h5 className="mb-0">
																<a href="#">{instructor.name}</a>
															</h5>
															<p className="mb-0 small">{instructor.bio}</p>
														</div>
													</div>


												</div>
												{/* Course info END */}
											</div>
										</div>
										{/* Row End */}
									</div>
								</div>
								{/* Right sidebar END */}
							</div>
							{/* Row END */}
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

export default CourseDetail;