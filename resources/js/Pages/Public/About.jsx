import React, { useEffect } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import { Link, usePage } from '@inertiajs/react';
import { tns } from 'tiny-slider';
import 'tiny-slider/dist/tiny-slider.css';

const About = () => {
	const { auth, flash_success, flash_error } = usePage().props;

	useEffect(() => {
		const sliders = [];

		document.querySelectorAll('.tiny-slider-inner').forEach((el) => {
			const instance = tns({
				container: el,
				items: 1,
				slideBy: 'page',
				controlsText: ['←', '→'],
				controls: true,
				nav: true,
				responsive: {
					640: {
						items: 2,
					},
					768: {
						items: 3,
					},
					1024: {
						items: 4,
					},
				},
			});
			sliders.push(instance);
		});

		return () => {
			sliders.forEach((slider) => {
				if (slider && typeof slider.destroy === 'function') {
					slider.destroy();
				}
			});
		};
	}, []);

	return (
		<UserLayout>
			<>
				{/* **************** MAIN CONTENT START **************** */}
				<main>
					{/* =======================
                    Page Banner START */}
					<section className="py-5">
						<div className="container">
							<div className="row g-4">
								{/* Title and Content START */}
								<div className="col-10 text-center mx-auto position-relative">
									{/* SVG decoration */}
									<figure className="position-absolute top-0 start-0 ms-n9">
										<svg width="22px" height="22px" viewBox="0 0 22 22">
											<polygon
												className="fill-primary"
												points="22,8.3 13.7,8.3 13.7,0 8.3,0 8.3,8.3 0,8.3 0,13.7 8.3,13.7 8.3,22 13.7,22 13.7,13.7 22,13.7 "
											></polygon>
										</svg>
									</figure>

									{/* SVG decoration */}
									<figure className="position-absolute top-100 start-100 translate-middle ms-5 d-none d-md-block">
										<svg width="21.5px" height="21.5px" viewBox="0 0 21.5 21.5">
											<polygon
												className="fill-warning"
												points="21.5,14.3 14.4,9.9 18.9,2.8 14.3,0 9.9,7.1 2.8,2.6 0,7.2 7.1,11.6 2.6,18.7 7.2,21.5 11.6,14.4 18.7,18.9 "
											></polygon>
										</svg>
									</figure>

									{/* Title */}
									<h1 className="display-4 mb-4 ">
										<span className="text-primary">K-Edu</span> - Nền tảng học tập
										<br className="d-none d-lg-block" />
										<span className="text-gradient">Công nghệ thông tin</span> hàng đầu
									</h1>
									<p className="lead mb-0 text-gray-700">
										Chuyên cung cấp các khóa học IT, lập trình và thiết kế UI/UX chất lượng cao,
										giúp sinh viên và lập trình viên phát triển kỹ năng chuyên môn.
									</p>
								</div>
								{/* Title and Content END */}
							</div>

							{/* Feature Cards START */}
							<div className="row g-4 mt-5">
								{/* Feature 1 */}
								<div className="col-md-4">
									<div className="card border-0 text-center h-100">
										<div className="card-body p-4">
											<div className="icon-xl bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
												<i className="bi bi-code-slash text-primary display-6"></i>
											</div>
											<h5>Lập trình Web</h5>
											<p className="text-gray-700">
												Các khóa học từ cơ bản đến nâng cao về HTML, CSS, JavaScript,
												React, Node.js và các framework hiện đại.
											</p>
										</div>
									</div>
								</div>

								{/* Feature 2 */}
								<div className="col-md-4">
									<div className="card border-0 text-center h-100">
										<div className="card-body p-4">
											<div className="icon-xl bg-success bg-opacity-10 rounded-circle mx-auto mb-3">
												<i className="bi bi-palette text-success display-6"></i>
											</div>
											<h5>Thiết kế UI/UX</h5>
											<p className="text-gray-700">
												Học thiết kế giao diện người dùng chuyên nghiệp với
												Figma, Adobe XD và các công cụ thiết kế hàng đầu.
											</p>
										</div>
									</div>
								</div>

								{/* Feature 3 */}
								<div className="col-md-4">
									<div className="card border-0 text-center h-100">
										<div className="card-body p-4">
											<div className="icon-xl bg-warning bg-opacity-10 rounded-circle mx-auto mb-3">
												<i className="bi bi-mortarboard text-warning display-6"></i>
											</div>
											<h5>Hỗ trợ đồ án</h5>
											<p className="text-gray-700">
												Hướng dẫn chi tiết thực hiện đồ án tốt nghiệp,
												từ ý tưởng đến triển khai hoàn chỉnh.
											</p>
										</div>
									</div>
								</div>
							</div>
							{/* Feature Cards END */}
						</div>
					</section>
					{/* =======================
                    Page Banner END */}

					{/* =======================
                    About K-Edu START */}
					<section className="py-5 bg-light">
						<div className="container">
							<div className="row align-items-center">
								<div className="col-lg-6 mb-4 mb-lg-0">
									<div className="position-relative">
										<img
											src="https://i.ibb.co/LhJ3RbkY/Chat-GPT-Image-12-59-20-19-thg-6-2025.png"
											className="rounded-4 shadow"
											alt="K-Edu Platform"
											style={{ width: '70%', height: 'auto' }}
										/>
										{/* Stats overlay */}
										<div className="position-absolute bottom-0 start-0  p-4">
											<div className="bg-white rounded-3 p-3 shadow">
												<div className="row g-2">
													<div className="col-6 text-center">
														<h4 className="text-primary mb-1">500+</h4>
														<small>Khóa học</small>
													</div>
													<div className="col-6 text-center">
														<h4 className="text-success mb-1">10K+</h4>
														<small>Học viên</small>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="col-lg-6">
									<h2 className="mb-4">Tại sao chọn K-Edu?</h2>
									<p className="text-gray-700 mb-4">
										K-Edu được xây dựng với mục tiêu trở thành nền tảng học tập trực tuyến
										hàng đầu trong lĩnh vực công nghệ thông tin tại Việt Nam,
										cung cấp kiến thức thực tế và cập nhật nhất.
									</p>

									{/* Features list */}
									<div className="row g-3 mb-4">
										<div className="col-12">
											<div className="d-flex">
												<div className="icon-md bg-primary bg-opacity-10 rounded-circle flex-shrink-0 me-3">
													<i className="bi bi-check2 text-primary"></i>
												</div>
												<div>
													<h6 className="mb-1">Nội dung cập nhật liên tục</h6>
													<small className="text-gray-700">Theo kịp xu hướng công nghệ mới nhất</small>
												</div>
											</div>
										</div>

										<div className="col-12">
											<div className="d-flex">
												<div className="icon-md bg-success bg-opacity-10 rounded-circle flex-shrink-0 me-3">
													<i className="bi bi-people text-success"></i>
												</div>
												<div>
													<h6 className="mb-1">Giảng viên chuyên nghiệp</h6>
													<small className="text-gray-700">Đội ngũ có kinh nghiệm thực tế trong ngành</small>
												</div>
											</div>
										</div>

										<div className="col-12">
											<div className="d-flex">
												<div className="icon-md bg-warning bg-opacity-10 rounded-circle flex-shrink-0 me-3">
													<i className="bi bi-laptop text-warning"></i>
												</div>
												<div>
													<h6 className="mb-1">Thực hành thực tế</h6>
													<small className="text-gray-700">Dự án thực tế để xây dựng portfolio</small>
												</div>
											</div>
										</div>

										<div className="col-12">
											<div className="d-flex">
												<div className="icon-md bg-info bg-opacity-10 rounded-circle flex-shrink-0 me-3">
													<i className="bi bi-headset text-info"></i>
												</div>
												<div>
													<h6 className="mb-1">Hỗ trợ 24/7</h6>
													<small className="text-gray-700">Giải đáp thắc mắc mọi lúc mọi nơi</small>
												</div>
											</div>
										</div>
									</div>

									<Link href="/courses" className="btn btn-primary btn-lg">
										Khám phá khóa học
										<i className="bi bi-arrow-right ms-2"></i>
									</Link>
								</div>
							</div>
						</div>
					</section>
					{/* =======================
                    About K-Edu END */}

					{/* =======================
                    Technology Stack START */}
					<section className="py-5">
						<div className="container">
							<h2 className="text-center mb-5">Công nghệ chúng tôi giảng dạy</h2>

							<div className="row g-4">
								{/* Frontend */}
								<div className="col-lg-4">
									<div className="text-center">
										<div className="icon-xl bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
											<i className="bi bi-display text-primary display-6"></i>
										</div>
										<h5 className="mb-3">Frontend Development</h5>
										<div className="d-flex flex-wrap justify-content-center gap-2">
											<span className="badge bg-light text-dark">HTML5</span>
											<span className="badge bg-light text-dark">CSS3</span>
											<span className="badge bg-light text-dark">JavaScript</span>
											<span className="badge bg-light text-dark">React</span>
											<span className="badge bg-light text-dark">Vue.js</span>
											<span className="badge bg-light text-dark">Angular</span>
										</div>
									</div>
								</div>

								{/* Backend */}
								<div className="col-lg-4">
									<div className="text-center">
										<div className="icon-xl bg-success bg-opacity-10 rounded-circle mx-auto mb-3">
											<i className="bi bi-server text-success display-6"></i>
										</div>
										<h5 className="mb-3">Backend Development</h5>
										<div className="d-flex flex-wrap justify-content-center gap-2">
											<span className="badge bg-light text-dark">Node.js</span>
											<span className="badge bg-light text-dark">PHP</span>
											<span className="badge bg-light text-dark">Laravel</span>
											<span className="badge bg-light text-dark">Python</span>
											<span className="badge bg-light text-dark">Java</span>
											<span className="badge bg-light text-dark">MySQL</span>
										</div>
									</div>
								</div>

								{/* Design */}
								<div className="col-lg-4">
									<div className="text-center">
										<div className="icon-xl bg-warning bg-opacity-10 rounded-circle mx-auto mb-3">
											<i className="bi bi-brush text-warning display-6"></i>
										</div>
										<h5 className="mb-3">UI/UX Design</h5>
										<div className="d-flex flex-wrap justify-content-center gap-2">
											<span className="badge bg-light text-dark">Figma</span>
											<span className="badge bg-light text-dark">Adobe XD</span>
											<span className="badge bg-light text-dark">Sketch</span>
											<span className="badge bg-light text-dark">Photoshop</span>
											<span className="badge bg-light text-dark">Illustrator</span>
											<span className="badge bg-light text-dark">Canva</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					{/* =======================
                    Technology Stack END */}

					{/* =======================
                    Statistics START */}
					<section className="py-5 bg-primary">
						<div className="container">
							<div className="row g-4 text-center text-white">
								<div className="col-sm-6 col-lg-3">
									<div className="d-flex justify-content-center">
										<div>
											<h2 className="mb-0 fw-bold">500+</h2>
											<span className="small">Khóa học chất lượng</span>
										</div>
									</div>
								</div>

								<div className="col-sm-6 col-lg-3">
									<div className="d-flex justify-content-center">
										<div>
											<h2 className="mb-0 fw-bold">10K+</h2>
											<span className="small">Học viên tin tựa</span>
										</div>
									</div>
								</div>

								<div className="col-sm-6 col-lg-3">
									<div className="d-flex justify-content-center">
										<div>
											<h2 className="mb-0 fw-bold">50+</h2>
											<span className="small">Giảng viên chuyên nghiệp</span>
										</div>
									</div>
								</div>

								<div className="col-sm-6 col-lg-3">
									<div className="d-flex justify-content-center">
										<div>
											<h2 className="mb-0 fw-bold">95%</h2>
											<span className="small">Học viên hài lòng</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					{/* =======================
                    Statistics END */}

					{/* =======================
                    CTA Section START */}
					<section className="py-5">
						<div className="container">
							<div className="row">
								<div className="col-lg-8 mx-auto text-center">
									<h2 className="mb-4">Sẵn sàng bắt đầu hành trình học tập?</h2>
									<p className="lead text-gray-700 mb-4">
										Tham gia cùng hàng nghìn học viên đã thành công với K-Edu.
										Đăng ký ngay hôm nay để nhận được ưu đãi đặc biệt!
									</p>
									<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
										<Link href="/courses" className="btn btn-primary btn-lg">
											Xem tất cả khóa học
										</Link>
										<Link href="/contact" className="btn btn-outline-primary btn-lg">
											Liên hệ tư vấn
										</Link>
									</div>
								</div>
							</div>
						</div>
					</section>
					{/* =======================
                    CTA Section END */}
				</main>
				{/* **************** MAIN CONTENT END **************** */}
			</>
		</UserLayout>
	);
};

export default About;