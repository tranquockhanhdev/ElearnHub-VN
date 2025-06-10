import React from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import { Link, usePage } from '@inertiajs/react';

const StudentDashboard = () => {
	const { auth, flash_success, flash_error } = usePage().props;

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
												My profile
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
													<Link className="list-group-item active" href="/student/dashboard" preserveScroll preserveState>
														<i className="bi bi-ui-checks-grid fa-fw me-2"></i>Dashboard
													</Link>
													<Link className="list-group-item " href="/student/courselist" preserveScroll >
														<i className="bi bi-basket fa-fw me-2"></i>My Courses
													</Link>
													<Link className="list-group-item" href="/student/payment-info" preserveScroll>
														<i className="bi bi-credit-card-2-front fa-fw me-2"></i>Payment info
													</Link>
													<Link className="list-group-item" href="/profile/edit" preserveScroll>
														<i className="bi bi-pencil-square fa-fw me-2"></i>Edit Profile
													</Link>
													<Link className="list-group-item" href="/settings" preserveScroll >
														<i className="bi bi-gear fa-fw me-2"></i>Settings
													</Link>
													<Link
														className="list-group-item text-danger bg-danger-soft-hover"
														href="#"
														onClick={(e) => {
															e.preventDefault();
															Inertia.post('/logout');
														}}
													>
														<i className="fas fa-sign-out-alt fa-fw me-2"></i>Sign Out
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
								{/* Counter boxes START */}
								<div className="row mb-4">
									{/* Counter item */}
									<div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
										<div className="d-flex justify-content-center align-items-center p-4 bg-orange bg-opacity-15 rounded-3">
											<span className="display-6 lh-1 text-orange mb-0">
												<i className="fas fa-tv fa-fw"></i>
											</span>
											<div className="ms-4">
												<div className="d-flex">
													<h5
														className="purecounter mb-0 fw-bold"
														data-purecounter-start="0"
														data-purecounter-end="9"
														data-purecounter-delay="200"
													>
														0
													</h5>
												</div>
												<p className="mb-0 h6 fw-light">Total Courses</p>
											</div>
										</div>
									</div>
									{/* Counter item */}
									<div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
										<div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-15 rounded-3">
											<span className="display-6 lh-1 text-purple mb-0">
												<i className="fas fa-clipboard-check fa-fw"></i>
											</span>
											<div className="ms-4">
												<div className="d-flex">
													<h5
														className="purecounter mb-0 fw-bold"
														data-purecounter-start="0"
														data-purecounter-end="52"
														data-purecounter-delay="200"
													>
														0
													</h5>
												</div>
												<p className="mb-0 h6 fw-light">Complete lessons</p>
											</div>
										</div>
									</div>
									{/* Counter item */}
									<div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
										<div className="d-flex justify-content-center align-items-center p-4 bg-success bg-opacity-10 rounded-3">
											<span className="display-6 lh-1 text-success mb-0">
												<i className="fas fa-medal fa-fw"></i>
											</span>
											<div className="ms-4">
												<div className="d-flex">
													<h5
														className="purecounter mb-0 fw-bold"
														data-purecounter-start="0"
														data-purecounter-end="8"
														data-purecounter-delay="300"
													>
														0
													</h5>
												</div>
												<p className="mb-0 h6 fw-light">Achieved Certificates</p>
											</div>
										</div>
									</div>
								</div>
								{/* Counter boxes END */}

								<div className="card border rounded-3">
									{/* Card header START */}
									<div className="card-header border-bottom">
										<h3 className="mb-0">My Courses List</h3>
									</div>
									{/* Card header END */}

									{/* Card body START */}
									<div className="card-body">
										{/* Search and select START */}
										<div className="row g-3 align-items-center justify-content-between mb-4">
											{/* Content */}
											<div className="col-md-8">
												<form className="rounded position-relative">
													<input
														className="form-control pe-5 bg-transparent"
														type="search"
														placeholder="Search"
														aria-label="Search"
													/>
													<button
														className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
														type="submit"
													>
														<i className="fas fa-search fs-6 "></i>
													</button>
												</form>
											</div>

											{/* Select option */}
											<div className="col-md-3">
												{/* Short by filter */}
												<form>
													<select
														className="form-select js-choice border-0 z-index-9 bg-transparent"
														aria-label=".form-select-sm"
													>
														<option value="">Sort by</option>
														<option>Free</option>
														<option>Newest</option>
														<option>Most popular</option>
														<option>Most Viewed</option>
													</select>
												</form>
											</div>
										</div>
										{/* Search and select END */}

										{/* Course list table START */}
										<div className="table-responsive border-0">
											<table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
												{/* Table head */}
												<thead>
													<tr>
														<th scope="col" className="border-0 rounded-start">
															Course Title
														</th>
														<th scope="col" className="border-0">
															Total Lectures
														</th>
														<th scope="col" className="border-0">
															Completed Lecture
														</th>
														<th scope="col" className="border-0 rounded-end">
															Action
														</th>
													</tr>
												</thead>

												{/* Table body START */}
												<tbody>
													{/* Table item */}
													<tr>
														{/* Table data */}
														<td>
															<div className="d-flex align-items-center">
																{/* Image */}
																<div className="w-100px">
																	<img
																		src="assets/images/courses/4by3/08.jpg"
																		className="rounded"
																		alt=""
																	/>
																</div>
																<div className="mb-0 ms-2">
																	{/* Title */}
																	<h6>
																		<a href="#">Building Scalable APIs with GraphQL</a>
																	</h6>
																	{/* Info */}
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">85%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
																				data-aos="slide-right"
																				data-aos-delay="200"
																				data-aos-duration="1000"
																				data-aos-easing="ease-in-out"
																				style={{ width: '85%' }}
																				aria-valuenow="85"
																				aria-valuemin="0"
																				aria-valuemax="100"
																			></div>
																		</div>
																	</div>
																</div>
															</div>
														</td>

														{/* Table data */}
														<td>56</td>

														{/* Table data */}
														<td>40</td>

														{/* Table data */}
														<td>
															<a
																href="#"
																className="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
															>
																<i className="bi bi-play-circle me-1"></i>Continue
															</a>
														</td>
													</tr>

													{/* Table item */}
													<tr>
														{/* Table data */}
														<td>
															<div className="d-flex align-items-center">
																{/* Image */}
																<div className="w-100px">
																	<img
																		src="assets/images/courses/4by3/03.jpg"
																		className="rounded"
																		alt=""
																	/>
																</div>
																<div className="mb-0 ms-2">
																	{/* Title */}
																	<h6>
																		<a href="#">Create a Design System in Figma</a>
																	</h6>
																	{/* Info */}
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">100%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
																				data-aos="slide-right"
																				data-aos-delay="200"
																				data-aos-duration="1000"
																				data-aos-easing="ease-in-out"
																				style={{ width: '100%' }}
																				aria-valuenow="100"
																				aria-valuemin="0"
																				aria-valuemax="100"
																			></div>
																		</div>
																	</div>
																</div>
															</div>
														</td>

														{/* Table data */}
														<td>42</td>

														{/* Table data */}
														<td>42</td>

														{/* Table data */}
														<td>
															<button
																className="btn btn-sm btn-success me-1 mb-1 mb-x;-0 disabled"
															>
																<i className="bi bi-check me-1"></i>Complete
															</button>
															<a href="#" className="btn btn-sm btn-light me-1">
																<i className="bi bi-arrow-repeat me-1"></i>Restart
															</a>
														</td>
													</tr>

													{/* Table item */}
													<tr>
														{/* Table data */}
														<td>
															<div className="d-flex align-items-center">
																{/* Image */}
																<div className="w-100px">
																	<img
																		src="assets/images/courses/4by3/05.jpg"
																		className="rounded"
																		alt=""
																	/>
																</div>
																<div className="mb-0 ms-2">
																	{/* Title */}
																	<h6>
																		<a href="#">The Complete Web Development in python</a>
																	</h6>
																	{/* Info */}
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">60%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
																				data-aos="slide-right"
																				data-aos-delay="200"
																				data-aos-duration="1000"
																				data-aos-easing="ease-in-out"
																				style={{ width: '60%' }}
																				aria-valuenow="60"
																				aria-valuemin="0"
																				aria-valuemax="100"
																			></div>
																		</div>
																	</div>
																</div>
															</div>
														</td>

														{/* Table data */}
														<td>28</td>

														{/* Table data */}
														<td>12</td>

														{/* Table data */}
														<td>
															<a
																href="#"
																className="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
															>
																<i className="bi bi-play-circle me-1"></i>Continue
															</a>
														</td>
													</tr>

													{/* Table item */}
													<tr>
														{/* Table data */}
														<td>
															<div className="d-flex align-items-center">
																{/* Image */}
																<div className="w-100px">
																	<img
																		src="assets/images/courses/4by3/01.jpg"
																		className="rounded"
																		alt=""
																	/>
																</div>
																<div className="mb-0 ms-2">
																	{/* Title */}
																	<h6>
																		<a href="#">Digital Marketing Masterclass</a>
																	</h6>
																	{/* Info */}
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">40%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
																				data-aos="slide-right"
																				data-aos-delay="200"
																				data-aos-duration="1000"
																				data-aos-easing="ease-in-out"
																				style={{ width: '40%' }}
																				aria-valuenow="40"
																				aria-valuemin="0"
																				aria-valuemax="100"
																			></div>
																		</div>
																	</div>
																</div>
															</div>
														</td>
														{/* Table data */}
														<td>32</td>

														{/* Table data */}
														<td>18</td>

														{/* Table data */}
														<td>
															<a
																href="#"
																className="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
															>
																<i className="bi bi-play-circle me-1"></i>Continue
															</a>
														</td>
													</tr>

													{/* Table item */}
													<tr>
														{/* Table data */}
														<td>
															<div className="d-flex align-items-center">
																{/* Image */}
																<div className="w-100px">
																	<img
																		src="assets/images/courses/4by3/02.jpg"
																		className="rounded"
																		alt=""
																	/>
																</div>
																<div className="mb-0 ms-2">
																	{/* Title */}
																	<h6>
																		<a href="#">Graphic Design Masterclass</a>
																	</h6>
																	{/* Info */}
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">90%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
																				data-aos="slide-right"
																				data-aos-delay="200"
																				data-aos-duration="1000"
																				data-aos-easing="ease-in-out"
																				style={{ width: '90%' }}
																				aria-valuenow="90"
																				aria-valuemin="0"
																				aria-valuemax="100"
																			></div>
																		</div>
																	</div>
																</div>
															</div>
														</td>
														{/* Table data */}
														<td>16</td>

														{/* Table data */}
														<td>14</td>

														{/* Table data */}
														<td>
															<a
																href="#"
																className="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
															>
																<i className="bi bi-play-circle me-1"></i>Continue
															</a>
														</td>
													</tr>
												</tbody>
												{/* Table body END */}
											</table>
										</div>
										{/* Course list table END */}

										{/* Pagination START */}
										<div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
											{/* Content */}
											<p className="mb-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
											{/* Pagination */}
											<nav className="d-flex justify-content-center mb-0" aria-label="navigation">
												<ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0">
													<li className="page-item mb-0">
														<a className="page-link" href="#" tabIndex="-1">
															<i className="fas fa-angle-left"></i>
														</a>
													</li>
													<li className="page-item mb-0">
														<a className="page-link" href="#">
															1
														</a>
													</li>
													<li className="page-item mb-0 active">
														<a className="page-link" href="#">
															2
														</a>
													</li>
													<li className="page-item mb-0">
														<a className="page-link" href="#">
															3
														</a>
													</li>
													<li className="page-item mb-0">
														<a className="page-link" href="#">
															<i className="fas fa-angle-right"></i>
														</a>
													</li>
												</ul>
											</nav>
										</div>
										{/* Pagination END */}
									</div>
									{/* Card body START */}
								</div>
								{/* Main content END */}
							</div>
							{/* Row END */}
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

export default StudentDashboard;
