import React from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import InfoStudent from '../../Components/InfoStudent';
import { Link, usePage } from '@inertiajs/react';

const CourseList = () => {
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
													<Link className="list-group-item" href="/student/dashboard" preserveScroll preserveState>
														<i className="bi bi-ui-checks-grid fa-fw me-2"></i>Dashboard
													</Link>
													<Link className="list-group-item" href="/student/subscriptions" preserveScroll>
														<i className="bi bi-card-checklist fa-fw me-2"></i>My Subscriptions
													</Link>
													<Link className="list-group-item active" href="/student/courselist" preserveScroll>
														<i className="bi bi-basket fa-fw me-2"></i>My Courses
													</Link>
													<Link className="list-group-item" href="/student/payment-info" preserveScroll preserveState>
														<i className="bi bi-credit-card-2-front fa-fw me-2"></i>Payment info
													</Link>
													<Link className="list-group-item" href="/profile/edit" preserveScroll>
														<i className="bi bi-pencil-square fa-fw me-2"></i>Edit Profile
													</Link>
													<Link className="list-group-item" href="/settings" preserveScroll>
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
											{/* Search */}
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
														<i className="fas fa-search fs-6"></i>
													</button>
												</form>
											</div>
											{/* Select option */}
											<div className="col-md-3">
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
														<th scope="col" className="border-0">Total Lectures</th>
														<th scope="col" className="border-0">Completed Lecture</th>
														<th scope="col" className="border-0 rounded-end">Action</th>
													</tr>
												</thead>
												{/* Table body */}
												<tbody>
													{/* Table item */}
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="w-100px">
																	<img
																		src="/assets/images/courses/4by3/08.jpg"
																		className="rounded"
																		alt="Course Thumbnail"
																	/>
																</div>
																<div className="mb-0 ms-2">
																	<h6>
																		<a href="#">Building Scalable APIs with GraphQL</a>
																	</h6>
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">85%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
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
														<td>56</td>
														<td>40</td>
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
														<td>
															<div className="d-flex align-items-center">
																<div className="w-100px">
																	<img
																		src="/assets/images/courses/4by3/03.jpg"
																		className="rounded"
																		alt="Course Thumbnail"
																	/>
																</div>
																<div className="mb-0 ms-2">
																	<h6>
																		<a href="#">Create a Design System in Figma</a>
																	</h6>
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">100%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
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
														<td>42</td>
														<td>42</td>
														<td>
															<button className="btn btn-sm btn-success me-1 mb-1 mb-x;-0 disabled">
																<i className="bi bi-check me-1"></i>Complete
															</button>
															<a href="#" className="btn btn-sm btn-light me-1">
																<i className="bi bi-arrow-repeat me-1"></i>Restart
															</a>
														</td>
													</tr>

													{/* Table item */}
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="w-100px">
																	<img
																		src="/assets/images/courses/4by3/05.jpg"
																		className="rounded"
																		alt="Course Thumbnail"
																	/>
																</div>
																<div className="mb-0 ms-2">
																	<h6>
																		<a href="#">The Complete Web Development in python</a>
																	</h6>
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">60%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
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
														<td>28</td>
														<td>12</td>
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
														<td>
															<div className="d-flex align-items-center">
																<div className="w-100px">
																	<img
																		src="/assets/images/courses/4by3/01.jpg"
																		className="rounded"
																		alt="Course Thumbnail"
																	/>
																</div>
																<div className="mb-0 ms-2">
																	<h6>
																		<a href="#">Digital Marketing Masterclass</a>
																	</h6>
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">40%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
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
														<td>32</td>
														<td>18</td>
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
														<td>
															<div className="d-flex align-items-center">
																<div className="w-100px">
																	<img
																		src="/assets/images/courses/4by3/02.jpg"
																		className="rounded"
																		alt="Course Thumbnail"
																	/>
																</div>
																<div className="mb-0 ms-2">
																	<h6>
																		<a href="#">Graphic Design Masterclass</a>
																	</h6>
																	<div className="overflow-hidden">
																		<h6 className="mb-0 text-end">90%</h6>
																		<div className="progress progress-sm bg-primary bg-opacity-10">
																			<div
																				className="progress-bar bg-primary aos"
																				role="progressbar"
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
														<td>16</td>
														<td>14</td>
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