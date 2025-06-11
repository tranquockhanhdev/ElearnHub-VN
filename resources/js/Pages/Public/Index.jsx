import React, { useEffect } from 'react';
import UserLayout from '../../Components/Layouts/UserLayout';
import { Link, usePage } from '@inertiajs/react';
import { tns } from 'tiny-slider';
import 'tiny-slider/dist/tiny-slider.css';
const Home = () => {
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
Main Banner START */}
					<section className="position-relative overflow-hidden pb-0 pb-sm-5">
						{/* SVG decoration */}
						<figure className="ms-5 position-absolute top-0 start-0">
							<svg width="29px" height="29px">
								<path
									className="fill-orange opacity-4"
									d="M29.004,14.502 C29.004,22.512 22.511,29.004 14.502,29.004 C6.492,29.004 -0.001,22.512 -0.001,14.502 C-0.001,6.492 6.492,-0.001 14.502,-0.001 C22.511,-0.001 29.004,6.492 29.004,14.502 Z"
								></path>
							</svg>
						</figure>
						{/* Content START */}
						<div className="container">
							<div className="row align-items-center justify-content-xl-between g-4 g-md-5">
								{/* Left content START */}
								<div className="col-lg-7 col-xl-5 position-relative z-index-1 text-center text-lg-start mb-2 mb-md-9 mb-xl-0">
									{/* Badge */}
									<h6 className="mb-3 font-base bg-primary bg-opacity-10 text-primary py-2 px-4 rounded-2 d-inline-block">
										Get started with Eduport
									</h6>
									{/* Title */}
									<h1 className="mb-4 display-5">
										Develop the skillset &amp; your
										<span className="position-relative d-inline-block">
											Bright Future
											{/* SVG decoration */}
											<span className="position-absolute top-50 start-50 translate-middle z-index-n1 d-none d-sm-block">
												<svg width="387.7px" height="119.7px">
													<path
														className="fill-warning"
														d="M382.7,51.4c-0.2-1-0.4-2-0.7-3c-0.2-0.6-0.5-1.2-0.9-1.7c-0.6-0.9-1.5-1.7-2.9-2.2l0.1-0.1l-0.1,0.1 c0.2-0.9-0.4-1.2-1.2-1.3c-0.1,0-0.2,0-0.4-0.1c-0.2-0.2-0.5-0.5-0.7-0.7c0-0.7-0.1-1.3-0.6-1.7c-0.3-0.2-0.7-0.4-1.3-0.5 c0-0.7-0.2-1.1-0.6-1.4c-0.3-0.2-0.7-0.4-1.2-0.5c-0.2,0-0.3-0.1-0.5-0.1c-1.1-0.9-2.2-1.8-3.4-2.7c0-0.1,0-0.2-0.1-0.3 c-0.1-0.2-0.3-0.4-0.7-0.4c-2.1-1.2-4.2-2.3-6.2-3.5c-14.1-8.5-31.1-10.2-46.8-14.7c-9.6-2.7-19.8-3.4-29.8-4.7 c-13.3-1.8-26.7-1.5-40-2.5c-5.4-0.4-10.8-0.7-16.1-0.7c-2.8,0-5.7-0.6-8.3-0.2c-5.8,0.9-11.6,1.5-17.4,1.8c-2,0.1-3.9,0.2-5.9,0.2 c-0.2,0-0.3,0-0.5,0.1c-0.2,0-0.3,0-0.5,0.1c-2.1,0-4.3,0.1-6.4,0.2c-2.1,0.1-4.3,0.1-6.4-0.1c-13-0.8-25.3,1.7-37.8,3.5 c-6,0.9-11.9,2.2-17.9,3.5c-6.5,1.4-13.3,1.7-19.8,3.3c-9.6,2.3-19.3,4.4-29.1,6c-9.5,1.6-18.9,3.9-28.2,6.4 c-8.5,2.3-16.2,5.9-23.8,9.7c-4.4,2.2-9,4.1-12.4,7.6c-4.1,4.3-6.6,9.4-10,14.1C1.9,68,2.5,70.8,4.6,74c4.7,7.3,12.9,10.3,21.3,13.4 c4.1,1.5,8.6,2.4,12.5,4.3c5.5,2.6,10.9,5.4,16.7,7.6c12.3,4.6,25.1,8,38.1,10.5c7.1,1.4,14.5,2.1,21.8,2.6 c11.2,0.8,22.5,2.5,33.8,1.9c0.8,0.7,1.5,0.7,2.1-0.1c1.6-0.7,3.4,0.2,5.1-0.1c8.8-1.5,17.8-0.8,26.8-0.6c5,0.1,10.1,0.8,15.1,0.6 c9.4-0.4,18.8-1,28.2-1.9c12.9-1.2,25.7-2.4,38.2-5.3c0.3,0.4,0.5,0.3,0.6-0.1c1.1-0.2,2.3-0.4,3.4-0.6c0.3,0.3,0.5,0.2,0.7-0.1 c1.2-0.3,2.4-0.6,3.7-0.8c7.9-0.8,15.8-1.4,23.6-2.4c4.9-0.6,9.7-1.8,14.5-2.8c0.4,0.2,0.8,0.3,1.1,0.2c0.2,0,0.3-0.1,0.4-0.2 c0.1-0.1,0.1-0.1,0.2-0.2s0.1-0.2,0.2-0.2c0.5-0.1,1-0.3,1.5-0.4c0.1,0,0.2,0.1,0.3,0.1c0.3,0,0.5-0.1,0.6-0.4c0,0,0,0,0,0l0,0 c0,0,0,0,0,0c0.4-0.1,0.8-0.2,1.3-0.3c0,0,0,0,0.1,0c0.2,0,0.3,0,0.5,0c0.4,0,0.7-0.2,0.8-0.7c1.1-0.4,2.2-0.8,3.3-1.3 c0.2,0.1,0.4,0.1,0.6,0c0.1,0,0.2-0.1,0.2-0.1c0.1-0.1,0.1-0.1,0.2-0.2c0-0.1,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2,0 c0.6,0.2,1,0.2,1.4,0c0.2-0.1,0.3-0.2,0.5-0.4c0.1-0.2,0.2-0.4,0.3-0.6c1.2-0.5,2.4-1,3.7-1.6c3.7-1.6,7.3-3.3,11.1-4.4 c11.2-3.4,21.5-7.9,30.2-14.9c1.8-0.4,2.9-1.2,3.7-2.4c0.5-0.7,0.8-1.4,1.1-2.2c1.1-0.1,1.7-0.6,2.1-1.1c0.4-0.6,0.6-1.3,0.7-2 c0-0.1,0.1-0.2,0.2-0.3c1.1,0.1,1.4-0.7,1.8-1.3C382.2,61.1,383.8,56.5,382.7,51.4z M9.5,72.3c-0.4-0.9-0.8-2-0.2-2.9 c4.3-6.9,8-14.3,15.9-19c6.6-3.9,13.9-6.9,21.1-10c10.1-4.3,21.1-6,32-8.1c0,0.2,0,0.4,0.1,0.6l0,0c-2.5,0.9-5.1,1.7-7.7,2.6 c-7.7,2.5-15.4,5-22.9,7.9c-10,3.9-18.1,9.9-23.8,17.8c-1.2,1.6-2.5,3.1-3.7,4.6c-5.1,6.3-2.3,11,2.9,16.4c0.3,0.3,0.7,0.7,0.9,1.1 C17.6,81.2,12,78.2,9.5,72.3z M372.5,60.6c-4,6.6-9.6,11.9-16.6,16.1c-4.8,2.9-10.5,5-16.2,6.8c-7.8,2.5-15.1,5.6-22.5,8.6 c-9.3,3.8-19,5.9-29.3,6.8c-14.1,1.2-27.8,3.6-41.6,5.9c-11.4,2-23.2,2.4-34.8,3.6c-13.2,1.4-26.4,0.4-39.6,0.2 c-7.4-0.1-14.8,0.8-22.1,1.2c-6.1,0.4-12.2,0.3-18.3-0.2c-9.2-0.7-18.5-1.3-27.7-2.2c-6.5-0.6-13.1-1.7-19.4-3.4 c-7.5-2-14.9-4-22.4-6c-1.2-0.3-2.3-0.6-3.2-1.3c-0.5-0.2-0.9-0.4-1.5-0.6c0.1,0,0.2-0.1,0.3-0.1c0.7-0.2,1.2,0,1.8,0.2c0,0,0,0,0,0 c8.1,1.1,16.2,2.8,24.4,3.2c1.2,0.1,2.4,0.1,3.5,0.1c1.1,0,3,0.5,3.1-0.6c0.1-1.4-1.8-2-3.3-2c-5,0-9.9-0.5-14.8-1.2 c-10.8-1.6-21.5-3.4-31.6-7.2c-6.9-2.5-12.7-6.4-16.2-12.3c-1.1-1.9-1.2-3.7-0.2-5.7c7.6-14.6,21.3-23.3,38.6-28.9 c15.7-5.1,31.3-10.6,47.6-14.2c11.7-2.6,23.7-4.3,35.3-6.9c20-4.5,40.6-5.7,61.3-6.4c8.5-0.3,16.8-2,25.4-1.3 c19.7,1.6,39.4,2.8,59.1,5.5c10.6,1.5,21.4,2.9,32.1,4c8.4,0.8,16.8,3.3,24.8,6.5c7.4,3,14.1,6.8,20,11.7 C374.7,46.2,376.4,54.2,372.5,60.6z"
													></path>
												</svg>
											</span>
										</span>
									</h1>
									{/* Content */}
									<p className="mb-3">
										The most reliable online courses and certifications in marketing,
										information technology, programming, and data science.
									</p>
									{/* Search bar */}
									<form className="bg-body shadow rounded p-2 mb-4">
										<div className="input-group">
											<input
												className="form-control border-0 me-1"
												type="search"
												placeholder="Find your course"
											/>
											<button type="button" className="btn btn-primary mb-0 rounded">
												<i className="fas fa-search" />
											</button>
										</div>
									</form>
									{/* Counter START */}
									<div className="row g-3 mb-3 mb-lg-0">
										{/* Item */}
										<div className="col-sm-6">
											<div className="d-flex align-items-center">
												{/* Icon */}
												<div className="icon-lg fs-4 text-orange bg-orange bg-opacity-10 rounded">

													<i className="bi bi-book-half" />
												</div>
												{/* Info */}
												<div className="ms-3">
													<div className="d-flex">
														<h4
															className="purecounter fw-bold mb-0"
															data-purecounter-start={0}
															data-purecounter-end={600}
															data-purecounter-delay={100}
														>
															0
														</h4>
														<span className="h4 mb-0">+</span>
													</div>
													<div>Online Courses</div>
												</div>
											</div>
										</div>
										{/* Item */}
										<div className="col-sm-6">
											<div className="d-flex align-items-center">
												{/* Icon */}
												<div className="icon-lg fs-4 text-info bg-info bg-opacity-10 rounded">

													<i className="fas fa-university" />
												</div>
												{/* Info */}
												<div className="ms-3">
													<div className="d-flex">
														<h4
															className="purecounter fw-bold mb-0"
															data-purecounter-start={0}
															data-purecounter-end={400}
															data-purecounter-delay={100}
														>
															0
														</h4>
														<span className="h4 mb-0">+</span>
													</div>
													<div>Universities</div>
												</div>
											</div>
										</div>
									</div>
									{/* Counter END */}
								</div>
								{/* Left content END */}
								{/* Right content START */}
								<div className="col-lg-5 col-xl-6 text-center position-relative">
									{/* SVG decoration */}
									<figure className="position-absolute top-100 start-0 translate-middle mt-n6 ms-5 ps-5 d-none d-md-block">
										<svg width="297.5px" height="295.9px">
											<path
												stroke="#F99D2B"
												fill="none"
												strokeWidth={13}
												d="M286.2,165.5c-9.8,74.9-78.8,128.9-153.9,120.4c-76-8.6-131.4-78.2-122.8-154.2C18.2,55.8,87.8,0.3,163.7,9"
											></path>
										</svg>
									</figure>
									{/* Bell icon */}
									<div className="icon-lg bg-primary text-white rounded-4 shadow position-absolute top-0 start-100 translate-middle z-index-9 ms-n4 d-none d-md-block">
										<i className="fas fa-bell" />
									</div>
									<div className=" position-relative">
										{/* Yellow background */}
										<div className="bg-warning rounded-4 border-white border-5 h-200px h-sm-300px shadow" />
										{/* Image */}
										<img
											src="/assets/images/element/06.png"
											className="position-absolute bottom-0 start-50 translate-middle-x"
											alt=""
										/>
									</div>
								</div>
								{/* Right content END */}
							</div>
						</div>
						{/* Content END */}
					</section>
					{/* =======================
Main Banner END */}
					{/* =======================
Trending course START */}
					<section className="pt-0 pt-lg-5">
						<div className="container">
							{/* Title */}
							<div className="row mb-4">
								<div className="col-12">
									<h2 className="fs-1 fw-bold">
										<span className="position-relative z-index-9">Trending</span>
										<span className="position-relative z-index-1">
											Courses
											{/* SVG START */}
											<span className="position-absolute top-50 start-50 translate-middle z-index-n1">
												<svg width="163.9px" height="48.6px">
													<path
														className="fill-warning"
														d="M162.5,19.9c-0.1-0.4-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-0.5-0.4-0.7c-0.3-0.4-0.7-0.7-1.2-0.9l0.1,0l-0.1,0 c0.1-0.4-0.2-0.5-0.5-0.6c0,0-0.1,0-0.1,0c-0.1-0.1-0.2-0.2-0.3-0.3c0-0.3,0-0.6-0.2-0.7c-0.1-0.1-0.3-0.2-0.6-0.2 c0-0.3-0.1-0.5-0.3-0.6c-0.1-0.1-0.3-0.2-0.5-0.2c-0.1,0-0.1,0-0.2,0c-0.5-0.4-1-0.8-1.4-1.1c0,0,0-0.1,0-0.1c0-0.1-0.1-0.1-0.3-0.2 c-0.9-0.5-1.8-1-2.6-1.5c-6-3.6-13.2-4.3-19.8-6.2c-4.1-1.2-8.4-1.4-12.6-2c-5.6-0.8-11.3-0.6-16.9-1.1c-2.3-0.2-4.6-0.3-6.8-0.3 c-1.2,0-2.4-0.2-3.5-0.1c-2.4,0.4-4.9,0.6-7.4,0.7c-0.8,0-1.7,0.1-2.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0 c-0.9,0-1.8,0.1-2.7,0.1c-0.9,0-1.8,0-2.7,0c-5.5-0.3-10.7,0.7-16,1.5c-2.5,0.4-5.1,1-7.6,1.5c-2.8,0.6-5.6,0.7-8.4,1.4 c-4.1,1-8.2,1.9-12.3,2.6c-4,0.7-8,1.6-11.9,2.7c-3.6,1-6.9,2.5-10.1,4.1c-1.9,0.9-3.8,1.7-5.2,3.2c-1.7,1.8-2.8,4-4.2,6 c-1,1.3-0.7,2.5,0.2,3.9c2,3.1,5.5,4.4,9,5.7c1.8,0.7,3.6,1,5.3,1.8c2.3,1.1,4.6,2.3,7.1,3.2c5.2,2,10.6,3.4,16.2,4.4 c3,0.6,6.2,0.9,9.2,1.1c4.8,0.3,9.5,1.1,14.3,0.8c0.3,0.3,0.6,0.3,0.9-0.1c0.7-0.3,1.4,0.1,2.1-0.1c3.7-0.6,7.6-0.3,11.3-0.3 c2.1,0,4.3,0.3,6.4,0.2c4-0.2,8-0.4,11.9-0.8c5.4-0.5,10.9-1,16.2-2.2c0.1,0.2,0.2,0.1,0.2,0c0.5-0.1,1-0.2,1.4-0.3 c0.1,0.1,0.2,0.1,0.3,0c0.5-0.1,1-0.3,1.6-0.3c3.3-0.3,6.7-0.6,10-1c2.1-0.3,4.1-0.8,6.2-1.2c0.2,0.1,0.3,0.1,0.4,0.1 c0.1,0,0.1,0,0.2-0.1c0,0,0.1,0,0.1-0.1c0,0,0-0.1,0.1-0.1c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0.1,0,0.2-0.1,0.3-0.2 c0,0,0,0,0,0l0,0c0,0,0,0,0,0c0.2,0,0.4-0.1,0.5-0.1c0,0,0,0,0,0c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.3-0.3c0.5-0.2,0.9-0.4,1.4-0.5 c0.1,0,0.2,0,0.2,0c0,0,0.1,0,0.1,0c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1,0c0,0,0.1,0,0.1,0c0.2,0.1,0.4,0.1,0.6,0 c0.1,0,0.1-0.1,0.2-0.2c0.1-0.1,0.1-0.2,0.1-0.3c0.5-0.2,1-0.4,1.6-0.7c1.5-0.7,3.1-1.4,4.7-1.9c4.8-1.5,9.1-3.4,12.8-6.3 c0.8-0.2,1.2-0.5,1.6-1c0.2-0.3,0.4-0.6,0.5-0.9c0.5-0.1,0.7-0.2,0.9-0.5c0.2-0.2,0.2-0.5,0.3-0.9c0-0.1,0-0.1,0.1-0.1 c0.5,0,0.6-0.3,0.8-0.5C162.3,24,163,22,162.5,19.9z M4.4,28.7c-0.2-0.4-0.3-0.9-0.1-1.2c1.8-2.9,3.4-6,6.8-8 c2.8-1.7,5.9-2.9,8.9-4.2c4.3-1.8,9-2.5,13.6-3.4c0,0.1,0,0.2,0,0.2l0,0c-1.1,0.4-2.2,0.7-3.2,1.1c-3.3,1.1-6.5,2.1-9.7,3.4 c-4.2,1.6-7.6,4.2-10.1,7.5c-0.5,0.7-1,1.3-1.6,2c-2.2,2.7-1,4.7,1.2,6.9c0.1,0.1,0.3,0.3,0.4,0.5C7.8,32.5,5.5,31.2,4.4,28.7z  M158.2,23.8c-1.7,2.8-4.1,5.1-7,6.8c-2,1.2-4.5,2.1-6.9,2.9c-3.3,1-6.4,2.4-9.5,3.7c-3.9,1.6-8.1,2.5-12.4,2.9 c-6,0.5-11.8,1.5-17.6,2.5c-4.8,0.8-9.8,1-14.7,1.5c-5.6,0.6-11.2,0.2-16.8,0.1c-3.1-0.1-6.3,0.3-9.4,0.5c-2.6,0.2-5.2,0.1-7.8-0.1 c-3.9-0.3-7.8-0.5-11.7-0.9c-2.8-0.3-5.5-0.7-8.2-1.4c-3.2-0.8-6.3-1.7-9.5-2.5c-0.5-0.1-1-0.3-1.4-0.5c-0.2-0.1-0.4-0.1-0.6-0.2 c0,0,0.1,0,0.1,0c0.3-0.1,0.5,0,0.7,0.1c0,0,0,0,0,0c3.4,0.5,6.9,1.2,10.3,1.4c0.5,0,1,0,1.5,0c0.5,0,1.3,0.2,1.3-0.3 c0-0.6-0.7-0.9-1.4-0.9c-2.1,0-4.2-0.2-6.3-0.5c-4.6-0.7-9.1-1.5-13.4-3c-2.9-1.1-5.4-2.7-6.9-5.2c-0.5-0.8-0.5-1.6-0.1-2.4 c3.2-6.2,9-9.8,16.3-12.2c6.7-2.2,13.2-4.5,20.2-6c5-1.1,10-1.8,15-2.9c8.5-1.9,17.2-2.4,26-2.7c3.6-0.1,7.1-0.8,10.8-0.6 c8.4,0.7,16.7,1.2,25,2.3c4.5,0.6,9,1.2,13.6,1.7c3.6,0.4,7.1,1.4,10.5,2.8c3.1,1.3,6,2.9,8.5,5C159.1,17.7,159.8,21.1,158.2,23.8z"
													></path>
												</svg>
											</span>
											{/* SVG END */}
										</span>
									</h2>
									<p className="mb-0">
										Find courses that are best for your profession
									</p>
								</div>
							</div>
							<div className="row g-4">
								{/* Card START */}
								<div className="col-md-6 col-xl-4">
									<div className="card shadow-hover overflow-hidden">
										<div className="position-relative">
											{/* Image */}
											<img
												className="card-img-top"
												src="/assets/images/courses/4by3/16.jpg"
												alt="Card image"
											/>
											{/* Overlay */}
											<div className="bg-overlay bg-dark opacity-4" />
											<div className="card-img-overlay d-flex align-items-start flex-column">
												{/* Card overlay bottom */}
												<div className="w-100 mt-auto d-inline-flex">
													<div className="d-flex align-items-center bg-white p-2 rounded-2 dark-mode-box">
														{/* Avatar */}
														<div className="avatar avatar-sm me-2">
															<img
																className="avatar-img rounded-1"
																src="/assets/images/avatar/10.jpg"
																alt="avatar"
															/>
														</div>
														{/* Avatar info */}
														<div>
															<h6 className="mb-0">
																<a href="#" className="text-dark">
																	Larry Lawson
																</a>
															</h6>
															<span className="small">Tutor</span>
														</div>
													</div>
												</div>
											</div>
										</div>
										{/* Card body */}
										<div className="card-body">
											{/* Badge and icon */}
											<div className="d-flex justify-content-between mb-3">
												<div className="hstack gap-2">
													<a
														href="#"
														className="badge bg-orange bg-opacity-10 text-orange"
													>
														All level
													</a>
													<a href="#" className="badge bg-dark text-white">
														6 month
													</a>
												</div>
											</div>
											{/* Title */}
											<h5 className="card-title">
												<a href="#" className="stretched-link">
													The Complete Digital Marketing Course - 12 Courses in 1
												</a>
											</h5>
											{/* Divider */}
											<hr />
											{/* Time */}
											<div className="d-flex justify-content-between align-items-center mb-2">
												<h4 className="text-success mb-0">$125</h4>
												<span className="h6 fw-light mb-0 me-3">
													<i className="far fa-clock text-danger me-2" />
													6h 56m
												</span>
											</div>
										</div>
									</div>
								</div>
								{/* Card END */}
								{/* Card START */}
								<div className="col-md-6 col-xl-4">
									<div className="card shadow-hover overflow-hidden">
										<div className="position-relative">
											{/* Image */}
											<img
												className="card-img-top"
												src="/assets/images/courses/4by3/14.jpg"
												alt="Card image"
											/>
											{/* Overlay */}
											<div className="bg-overlay bg-dark opacity-4" />
											<div className="card-img-overlay d-flex align-items-start flex-column">
												{/* Card overlay bottom */}
												<div className="w-100 mt-auto d-inline-flex">
													<div className="d-flex align-items-center bg-white p-2 rounded-2 dark-mode-box">
														{/* Avatar */}
														<div className="avatar avatar-sm me-2">
															<img
																className="avatar-img rounded-1"
																src="/assets/images/avatar/08.jpg"
																alt="avatar"
															/>
														</div>
														{/* Avatar info */}
														<div>
															<h6 className="mb-0">
																<a href="#" className="text-dark">
																	Billy Vasquez
																</a>
															</h6>
															<span className="small">Developer</span>
														</div>
													</div>
												</div>
											</div>
										</div>
										{/* Card body */}
										<div className="card-body">
											{/* Badge and icon */}
											<div className="d-flex justify-content-between mb-3">
												<div className="hstack gap-2">
													<a
														href="#"
														className="badge bg-info bg-opacity-10 text-info"
													>
														Beginner
													</a>
													<a href="#" className="badge bg-dark text-white">
														8 month
													</a>
												</div>
											</div>
											{/* Title */}
											<h5 className="card-title">
												<a href="#" className="stretched-link">
													Angular – The Complete Guide (2021 Edition)
												</a>
											</h5>
											{/* Divider */}
											<hr />
											{/* Time */}
											<div className="d-flex justify-content-between align-items-center mb-2">
												<h4 className="text-success mb-0">$355</h4>
												<span className="h6 fw-light mb-0 me-3">
													<i className="far fa-clock text-danger me-2" />
													12h 56m
												</span>
											</div>
										</div>
									</div>
								</div>
								{/* Card END */}
								{/* Card START */}
								<div className="col-md-6 col-xl-4">
									<div className="card shadow-hover overflow-hidden">
										<div className="position-relative">
											{/* Image */}
											<img
												className="card-img-top"
												src="/assets/images/courses/4by3/21.jpg"
												alt="Card image"
											/>
											{/* Overlay */}
											<div className="bg-overlay bg-dark opacity-4" />
											<div className="card-img-overlay d-flex align-items-start flex-column">
												{/* Card overlay bottom */}
												<div className="w-100 mt-auto d-inline-flex">
													<div className="d-flex align-items-center bg-white p-2 rounded-2 dark-mode-box">
														{/* Avatar */}
														<div className="avatar avatar-sm me-2">
															<img
																className="avatar-img rounded-1"
																src="/assets/images/avatar/05.jpg"
																alt="avatar"
															/>
														</div>
														{/* Avatar info */}
														<div>
															<h6 className="mb-0">
																<a href="#" className="text-dark">
																	Lori Stevens
																</a>
															</h6>
															<span className="small">psychiatrist</span>
														</div>
													</div>
												</div>
											</div>
										</div>
										{/* Card body */}
										<div className="card-body">
											{/* Badge and icon */}
											<div className="d-flex justify-content-between mb-3">
												<div className="hstack gap-2">
													<a
														href="#"
														className="badge bg-info bg-opacity-10 text-info"
													>
														Beginner
													</a>
													<a href="#" className="badge bg-dark text-white">
														12 month
													</a>
												</div>
											</div>
											{/* Title */}
											<h5 className="card-title">
												<a href="#" className="stretched-link">
													Time Management Mastery: Do More, Stress Less
												</a>
											</h5>
											{/* Divider */}
											<hr />
											{/* Time */}
											<div className="d-flex justify-content-between align-items-center mb-2">
												<h4 className="text-success mb-0">$280</h4>
												<span className="h6 fw-light mb-0 me-3">
													<i className="far fa-clock text-danger me-2" />
													5h 40m
												</span>
											</div>
										</div>
									</div>
								</div>
								{/* Card END */}
							</div>
						</div>
					</section>
					{/* =======================
Trending course END */}
					{/* =======================
Popular course START */}
					<section className="bg-light position-relative overflow-hidden">
						{/* SVG decoration */}
						<figure className="position-absolute bottom-0 end-0 mb-n5">
							<svg width="822.2px" height="301.9px" viewBox="0 0 822.2 301.9">
								<path
									className="fill-warning"
									d="M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z"
								></path>
							</svg>
						</figure>
						{/* SVG decoration */}
						<figure className="position-absolute top-0 start-0 mt-n8 me-5 d-none d-lg-block">
							<svg width="822.2px" height="301.9px" viewBox="0 0 822.2 301.9">
								<path
									className="fill-purple opacity-3"
									d="M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z"
								></path>
							</svg>
						</figure>
						<div className="container position-relative">
							{/* Title */}
							<div className="row mb-4">
								<div className="col-12">
									<h2 className="fs-1 fw-bold">
										<span className="position-relative z-index-9">Most Popular</span>
										<span className="position-relative z-index-1">
											Courses
											{/* SVG START */}
											<span className="position-absolute top-50 start-50 translate-middle z-index-n1">
												<svg width="163.9px" height="48.6px">
													<path
														className="fill-warning"
														d="M162.5,19.9c-0.1-0.4-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-0.5-0.4-0.7c-0.3-0.4-0.7-0.7-1.2-0.9l0.1,0l-0.1,0 c0.1-0.4-0.2-0.5-0.5-0.6c0,0-0.1,0-0.1,0c-0.1-0.1-0.2-0.2-0.3-0.3c0-0.3,0-0.6-0.2-0.7c-0.1-0.1-0.3-0.2-0.6-0.2 c0-0.3-0.1-0.5-0.3-0.6c-0.1-0.1-0.3-0.2-0.5-0.2c-0.1,0-0.1,0-0.2,0c-0.5-0.4-1-0.8-1.4-1.1c0,0,0-0.1,0-0.1c0-0.1-0.1-0.1-0.3-0.2 c-0.9-0.5-1.8-1-2.6-1.5c-6-3.6-13.2-4.3-19.8-6.2c-4.1-1.2-8.4-1.4-12.6-2c-5.6-0.8-11.3-0.6-16.9-1.1c-2.3-0.2-4.6-0.3-6.8-0.3 c-1.2,0-2.4-0.2-3.5-0.1c-2.4,0.4-4.9,0.6-7.4,0.7c-0.8,0-1.7,0.1-2.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0 c-0.9,0-1.8,0.1-2.7,0.1c-0.9,0-1.8,0-2.7,0c-5.5-0.3-10.7,0.7-16,1.5c-2.5,0.4-5.1,1-7.6,1.5c-2.8,0.6-5.6,0.7-8.4,1.4 c-4.1,1-8.2,1.9-12.3,2.6c-4,0.7-8,1.6-11.9,2.7c-3.6,1-6.9,2.5-10.1,4.1c-1.9,0.9-3.8,1.7-5.2,3.2c-1.7,1.8-2.8,4-4.2,6 c-1,1.3-0.7,2.5,0.2,3.9c2,3.1,5.5,4.4,9,5.7c1.8,0.7,3.6,1,5.3,1.8c2.3,1.1,4.6,2.3,7.1,3.2c5.2,2,10.6,3.4,16.2,4.4 c3,0.6,6.2,0.9,9.2,1.1c4.8,0.3,9.5,1.1,14.3,0.8c0.3,0.3,0.6,0.3,0.9-0.1c0.7-0.3,1.4,0.1,2.1-0.1c3.7-0.6,7.6-0.3,11.3-0.3 c2.1,0,4.3,0.3,6.4,0.2c4-0.2,8-0.4,11.9-0.8c5.4-0.5,10.9-1,16.2-2.2c0.1,0.2,0.2,0.1,0.2,0c0.5-0.1,1-0.2,1.4-0.3 c0.1,0.1,0.2,0.1,0.3,0c0.5-0.1,1-0.3,1.6-0.3c3.3-0.3,6.7-0.6,10-1c2.1-0.3,4.1-0.8,6.2-1.2c0.2,0.1,0.3,0.1,0.4,0.1 c0.1,0,0.1,0,0.2-0.1c0,0,0.1,0,0.1-0.1c0,0,0-0.1,0.1-0.1c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0.1,0,0.2-0.1,0.3-0.2 c0,0,0,0,0,0l0,0c0,0,0,0,0,0c0.2,0,0.4-0.1,0.5-0.1c0,0,0,0,0,0c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.3-0.3c0.5-0.2,0.9-0.4,1.4-0.5 c0.1,0,0.2,0,0.2,0c0,0,0.1,0,0.1,0c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1,0c0,0,0.1,0,0.1,0c0.2,0.1,0.4,0.1,0.6,0 c0.1,0,0.1-0.1,0.2-0.2c0.1-0.1,0.1-0.2,0.1-0.3c0.5-0.2,1-0.4,1.6-0.7c1.5-0.7,3.1-1.4,4.7-1.9c4.8-1.5,9.1-3.4,12.8-6.3 c0.8-0.2,1.2-0.5,1.6-1c0.2-0.3,0.4-0.6,0.5-0.9c0.5-0.1,0.7-0.2,0.9-0.5c0.2-0.2,0.2-0.5,0.3-0.9c0-0.1,0-0.1,0.1-0.1 c0.5,0,0.6-0.3,0.8-0.5C162.3,24,163,22,162.5,19.9z M4.4,28.7c-0.2-0.4-0.3-0.9-0.1-1.2c1.8-2.9,3.4-6,6.8-8 c2.8-1.7,5.9-2.9,8.9-4.2c4.3-1.8,9-2.5,13.6-3.4c0,0.1,0,0.2,0,0.2l0,0c-1.1,0.4-2.2,0.7-3.2,1.1c-3.3,1.1-6.5,2.1-9.7,3.4 c-4.2,1.6-7.6,4.2-10.1,7.5c-0.5,0.7-1,1.3-1.6,2c-2.2,2.7-1,4.7,1.2,6.9c0.1,0.1,0.3,0.3,0.4,0.5C7.8,32.5,5.5,31.2,4.4,28.7z  M158.2,23.8c-1.7,2.8-4.1,5.1-7,6.8c-2,1.2-4.5,2.1-6.9,2.9c-3.3,1-6.4,2.4-9.5,3.7c-3.9,1.6-8.1,2.5-12.4,2.9 c-6,0.5-11.8,1.5-17.6,2.5c-4.8,0.8-9.8,1-14.7,1.5c-5.6,0.6-11.2,0.2-16.8,0.1c-3.1-0.1-6.3,0.3-9.4,0.5c-2.6,0.2-5.2,0.1-7.8-0.1 c-3.9-0.3-7.8-0.5-11.7-0.9c-2.8-0.3-5.5-0.7-8.2-1.4c-3.2-0.8-6.3-1.7-9.5-2.5c-0.5-0.1-1-0.3-1.4-0.5c-0.2-0.1-0.4-0.1-0.6-0.2 c0,0,0.1,0,0.1,0c0.3-0.1,0.5,0,0.7,0.1c0,0,0,0,0,0c3.4,0.5,6.9,1.2,10.3,1.4c0.5,0,1,0,1.5,0c0.5,0,1.3,0.2,1.3-0.3 c0-0.6-0.7-0.9-1.4-0.9c-2.1,0-4.2-0.2-6.3-0.5c-4.6-0.7-9.1-1.5-13.4-3c-2.9-1.1-5.4-2.7-6.9-5.2c-0.5-0.8-0.5-1.6-0.1-2.4 c3.2-6.2,9-9.8,16.3-12.2c6.7-2.2,13.2-4.5,20.2-6c5-1.1,10-1.8,15-2.9c8.5-1.9,17.2-2.4,26-2.7c3.6-0.1,7.1-0.8,10.8-0.6 c8.4,0.7,16.7,1.2,25,2.3c4.5,0.6,9,1.2,13.6,1.7c3.6,0.4,7.1,1.4,10.5,2.8c3.1,1.3,6,2.9,8.5,5C159.1,17.7,159.8,21.1,158.2,23.8z"
													></path>
												</svg>
											</span>
											{/* SVG END */}
										</span>
									</h2>
									<p className="mb-0">
										See what course other students and experts in your domain are
										learning on.
									</p>
								</div>
							</div>
							{/* Outer tabs START */}
							<ul
								className="nav nav-pills nav-pill-soft mb-3"
								id="course-pills-tab"
								role="tablist"
							>
								{/* Tab item */}
								<li className="nav-item me-2 me-sm-5" role="presentation">
									<button
										className="nav-link active"
										id="course-pills-tab-1"
										data-bs-toggle="pill"
										data-bs-target="#course-pills-tab1"
										type="button"
										role="tab"
										aria-controls="course-pills-tab1"
										aria-selected="true"
									>
										Art &amp; Design
									</button>
								</li>
								{/* Tab item */}
								<li className="nav-item me-2 me-sm-5" role="presentation">
									<button
										className="nav-link"
										id="course-pills-tab-2"
										data-bs-toggle="pill"
										data-bs-target="#course-pills-tab2"
										type="button"
										role="tab"
										aria-controls="course-pills-tab2"
										aria-selected="false"
									>
										Development
									</button>
								</li>
								{/* Tab item */}
								<li className="nav-item me-2 me-sm-5" role="presentation">
									<button
										className="nav-link"
										id="course-pills-tab-3"
										data-bs-toggle="pill"
										data-bs-target="#course-pills-tab3"
										type="button"
										role="tab"
										aria-controls="course-pills-tab3"
										aria-selected="false"
									>
										Data Science
									</button>
								</li>
								{/* Tab item */}
								<li className="nav-item me-2 me-sm-5" role="presentation">
									<button
										className="nav-link"
										id="course-pills-tab-4"
										data-bs-toggle="pill"
										data-bs-target="#course-pills-tab4"
										type="button"
										role="tab"
										aria-controls="course-pills-tab4"
										aria-selected="false"
									>
										Marketing
									</button>
								</li>
								{/* Tab item */}
								<li className="nav-item me-2 me-sm-5" role="presentation">
									<button
										className="nav-link"
										id="course-pills-tab-5"
										data-bs-toggle="pill"
										data-bs-target="#course-pills-tab5"
										type="button"
										role="tab"
										aria-controls="course-pills-tab5"
										aria-selected="false"
									>
										Finance
									</button>
								</li>
							</ul>
							{/* Outer tabs END */}
							{/* Outer tabs contents START */}
							<div className="tab-content mb-0" id="course-pills-tabContent">
								{/* Outer content START */}
								<div
									className="tab-pane fade show active"
									id="course-pills-tab1"
									role="tabpanel"
									aria-labelledby="course-pills-tab-1"
								>
									<div className="row">
										<div className="col-12">
											<div className="row justify-content-between">
												{/* Left content START */}
												<div className="col-lg-6">
													{/* Title */}
													<h3>Art &amp; Design</h3>
													<p className="mb-3">
														Perceived end knowledge certainly day sweetness why
														cordially. Ask a quick six seven offer see among. Handsome
														met debating sir dwelling age material. As style lived he
														worse dried. Offered related so visitors we private
														removed.
													</p>
												</div>
												{/* Left content END */}
												{/* Right content START */}
												<div className="col-lg-6 position-relative">
													{/* SVG decoration */}
													<figure className="position-absolute top-0 start-100 translate-middle z-index-1 mt-5 pt-5 ms-3 d-none d-md-block">
														<svg>
															<path
																className="fill-primary"
																d="m105.32 16.607c-3.262 5.822-12.294 0.748-9.037-5.064 3.262-5.821 12.294-0.747 9.037 5.064zm-6.865 21.74c-5.481 9.779-20.654 1.255-15.182-8.509 5.48-9.779 20.653-1.255 15.182 8.509zm-36.466-11.481c6.134-10.943 23.113-1.404 16.99 9.522-6.133 10.943-23.113 1.404-16.99-9.522zm5.08-24.019c3.002-5.355 11.311-0.687 8.314 4.66-3.001 5.355-11.31 0.687-8.314-4.66zm-4.357 58.171c6.507-0.155 10.785 7.113 7.628 12.746-3.156 5.634-11.589 5.779-14.853 0.148-0.108-0.186-0.215-0.371-0.322-0.556-3.091-5.332 0.744-12.175 6.905-12.322 0.214-5e-3 0.428-0.011 0.642-0.016zm-14.997-8.34c-2.57 0.843-5.367 0.264-7.715-0.917-2.262-1.137-4.134-3.706-4.81-6.102-0.706-2.505-0.358-5.443 0.914-7.712 1.344-2.399 3.54-3.965 6.101-4.806 2.571-0.843 5.368-0.263 7.715 0.917 2.262 1.138 4.134 3.706 4.81 6.102 0.706 2.506 0.358 5.444-0.913 7.713-1.345 2.398-3.541 3.965-6.102 4.805zm-4.824-41.632c3.915-6.985 14.753-0.896 10.845 6.078-3.915 6.985-14.753 0.896-10.845-6.078zm-11.502 89.749c-1.138 1.37-3.658 2.357-5.408 2.314-1.387-0.035-2.719-0.374-3.958-0.997-1.529-0.769-2.655-2.243-3.307-3.773-0.615-1.445-0.989-3.345-0.459-4.903 0.039-0.113 0.077-0.227 0.116-0.341 0.929-2.724 2.63-4.878 5.509-5.688 1.943-0.547 4.222-0.276 5.984 0.711 1.861 1.043 3.077 2.746 3.729 4.732 0.922 2.805-0.2 5.531-1.976 7.668-0.077 0.093-0.153 0.185-0.23 0.277zm-7.657-31.402c2.806-5.006 10.573-0.642 7.772 4.356-2.806 5.006-10.573 0.642-7.772-4.356zm-3.281-18.47c3.262-5.821 12.294-0.747 9.037 5.065-3.262 5.821-12.294 0.747-9.037-5.065zm-4.63-25.623c3.849-6.869 14.506-0.881 10.663 5.976-3.849 6.869-14.507 0.882-10.663-5.976zm-0.416 16.398c-3.785 6.753-14.261 0.867-10.483-5.874 3.784-6.753 14.261-0.867 10.483 5.874zm-6.41 13.04c-2.871 5.122-10.819 0.657-7.953-4.457 2.871-5.123 10.819-0.658 7.953 4.457zm3.665 16.114c2.701 1.359 3.576 5.061 2.147 7.612-1.533 2.735-4.903 3.506-7.613 2.143-2.702-1.359-3.577-5.061-2.147-7.612 1.532-2.735 4.903-3.506 7.613-2.143zm6.319 39.375c-2.936 5.239-11.064 0.673-8.133-4.558 2.936-5.239 11.064-0.672 8.133 4.558zm30.789-17.287c-3.98 7.101-14.998 0.911-11.025-6.179 3.98-7.102 14.998-0.912 11.025 6.179zm7.01 23.118c-5.807 10.362-21.883 1.33-16.086-9.015 5.807-10.361 21.884-1.329 16.086 9.015z"
																fill="#f00"
																fillRule="evenodd"
															/>
														</svg>
													</figure>
													{/* Inner tab content START */}
													<div
														className="tab-content mb-0 pb-0"
														id="course-pills-tabContent1"
													>
														{/* Inner content item START */}
														<div
															className="tab-pane fade show active"
															id="course-pills-tab01"
															role="tabpanel"
															aria-labelledby="course-pills-tab-01"
														>
															{/* Card START */}
															<div className="card p-2 pb-0 shadow">
																<div className="overflow-hidden h-xl-200px">
																	<img
																		src="/assets/images/about/13.jpg"
																		className="card-img-top"
																		alt="course image"
																	/>
																	<div className="card-img-overlay d-flex p-3">
																		{/* Video button and link */}
																		<div className="m-auto">
																			<a
																				href="https://www.youtube.com/embed/tXHviS-4ygo"
																				className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
																				data-glightbox=""
																				data-gallery="course-video"
																			>
																				<i className="fas fa-play" />
																			</a>
																		</div>
																	</div>
																</div>
																{/* Card body */}
																<div className="card-body">
																	{/* Price and cart */}
																	<div className="row g-3">
																		{/* Item */}
																		<div className="col-sm-4 col-lg-6 col-xl-4">
																			<div className="d-flex align-items-center">
																				<a
																					href="#"
																					className="btn btn-orange rounded-2 me-3 mb-0"
																				>
																					<i className="bi bi-cart3 fs-5" />
																				</a>
																				<div>
																					{/* Badge */}
																					<span className="badge bg-info text-white mb-1">
																						6 months
																					</span>
																					<h5 className="mb-0">$134</h5>
																				</div>
																			</div>
																		</div>
																		{/* Item */}
																		<div className="col-sm-4 col-lg-6 col-xl-4">
																			<div className="d-flex align-items-center">
																				<a
																					href="#"
																					className="btn btn-orange rounded-2 me-3 mb-0"
																				>
																					<i className="bi bi-cart3 fs-5" />
																				</a>
																				<div>
																					{/* Badge */}
																					<span className="badge bg-info text-white mb-1">
																						12 months
																					</span>
																					<h5 className="mb-0">$355</h5>
																				</div>
																			</div>
																		</div>
																		{/* Item */}
																		<div className="col-sm-4 col-lg-6 col-xl-4">
																			<div className="d-flex align-items-center">
																				<a
																					href="#"
																					className="btn btn-orange rounded-2 me-3 mb-0"
																				>
																					<i className="bi bi-cart3 fs-5" />
																				</a>
																				<div>
																					{/* Badge */}
																					<span className="badge bg-info text-white mb-1">
																						18 months
																					</span>
																					<h5 className="mb-0">$654</h5>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
															{/* Card END */}
														</div>
														{/* Inner content item END */}
														{/* Inner content item START */}
														<div
															className="tab-pane fade"
															id="course-pills-tab02"
															role="tabpanel"
															aria-labelledby="course-pills-tab-02"
														>
															{/* Card START */}
															<div className="card p-2 pb-0 shadow">
																<div className="overflow-hidden h-xl-200px">
																	<img
																		src="/assets/images/about/11.jpg"
																		className="card-img-top"
																		alt="course image"
																	/>
																	<div className="card-img-overlay d-flex p-3">
																		{/* Video button and link */}
																		<div className="m-auto">
																			<a
																				href="https://www.youtube.com/embed/tXHviS-4ygo"
																				className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
																				data-glightbox=""
																				data-gallery="course-video"
																			>
																				<i className="fas fa-play" />
																			</a>
																		</div>
																	</div>
																</div>
																{/* Card body */}
																<div className="card-body">
																	{/* Price and cart */}
																	<div className="row g-3">
																		{/* Item */}
																		<div className="col-sm-4 col-lg-6 col-xl-4">
																			<div className="d-flex align-items-center">
																				<a
																					href="#"
																					className="btn btn-orange rounded-2 me-3 mb-0"
																				>
																					<i className="bi bi-cart3 fs-5" />
																				</a>
																				<div>
																					{/* Badge */}
																					<span className="badge bg-info text-white mb-1">
																						6 month
																					</span>
																					<h5 className="mb-0">$150</h5>
																				</div>
																			</div>
																		</div>
																		{/* Item */}
																		<div className="col-sm-4 col-lg-6 col-xl-4">
																			<div className="d-flex align-items-center">
																				<a
																					href="#"
																					className="btn btn-orange rounded-2 me-3 mb-0"
																				>
																					<i className="bi bi-cart3 fs-5" />
																				</a>
																				<div>
																					{/* Badge */}
																					<span className="badge bg-info text-white mb-1">
																						12 month
																					</span>
																					<h5 className="mb-0">$385</h5>
																				</div>
																			</div>
																		</div>
																		{/* Item */}
																		<div className="col-sm-4 col-lg-6 col-xl-4">
																			<div className="d-flex align-items-center">
																				<a
																					href="#"
																					className="btn btn-orange rounded-2 me-3 mb-0"
																				>
																					<i className="bi bi-cart3 fs-5" />
																				</a>
																				<div>
																					{/* Badge */}
																					<span className="badge bg-info text-white mb-1">
																						18 month
																					</span>
																					<h5 className="mb-0">$800</h5>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
															{/* Card END */}
														</div>
														{/* Inner content item END */}
														{/* Inner content item START */}
														<div
															className="tab-pane fade"
															id="course-pills-tab03"
															role="tabpanel"
															aria-labelledby="course-pills-tab-03"
														>
															{/* Card START */}
															<div className="card p-2 shadow">
																<div className="overflow-hidden h-xl-200px">
																	<img
																		src="/assets/images/about/14.jpg"
																		className="card-img-top"
																		alt="course image"
																	/>
																	<div className="card-img-overlay d-flex p-3">
																		{/* Video button and link */}
																		<div className="m-auto">
																			<a
																				href="https://www.youtube.com/embed/tXHviS-4ygo"
																				className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
																				data-glightbox=""
																				data-gallery="course-video"
																			>
																				<i className="fas fa-play" />
																			</a>
																		</div>
																	</div>
																</div>
																{/* Card body */}
																<div className="card-body px-2">
																	<p className="mb-0">
																		<span className="h6 mb-0 fw-bold me-1">
																			Note:
																		</span>
																		Before you learning this video you need to first
																		learn Beginner course
																	</p>
																</div>
															</div>
														</div>
														{/* Inner content item END */}
													</div>
													{/* Inner tab content END */}
												</div>
												{/* Right content END */}
											</div>
										</div>
									</div>
									{/* Row END */}
								</div>
								{/* Outer content END */}
								{/* Outer content START */}
								<div
									className="tab-pane fade"
									id="course-pills-tab2"
									role="tabpanel"
									aria-labelledby="course-pills-tab-2"
								>
									<div className="row">
										{/* Left content START */}
										<div className="col-lg-6">
											{/* Title */}
											<h3>Development</h3>
											<p className="mb-3">
												Ask a quick six seven offer see among. Handsome met debating
												sir dwelling age material. As style lived he worse dried.
												Offered related so visitors we private removed.
											</p>
											<h6 className="mt-4">What you’ll learn</h6>
											<ul className="list-group list-group-borderless mb-3">
												<li className="list-group-item h6 fw-light d-flex mb-0">
													<i className="bi bi-patch-check-fill text-success me-2" />
													Create responsive, accessible, and beautiful layouts
												</li>
												<li className="list-group-item h6 fw-light d-flex mb-0">
													<i className="bi bi-patch-check-fill text-success me-2" />
													Course Videos &amp; Readings
												</li>
												<li className="list-group-item h6 fw-light d-flex mb-0">
													<i className="bi bi-patch-check-fill text-success me-2" />
													Manipulate the DOM with vanilla JS
												</li>
												<li className="list-group-item h6 fw-light d-flex mb-0">
													<i className="bi bi-patch-check-fill text-success me-2" />
													Master the command line interface
												</li>
												<li className="list-group-item h6 fw-light d-flex mb-0">
													<i className="bi bi-patch-check-fill text-success me-2" />
													Create your own Node modules
												</li>
											</ul>
										</div>
										{/* Left content END */}
										{/* Right content START */}
										<div className="col-lg-6">
											{/* Card START */}
											<div className="card p-2 pb-0 shadow">
												<div className="overflow-hidden h-xl-200px">
													<img
														src="/assets/images/about/14.jpg"
														className="card-img-top"
														alt="course image"
													/>
													<div className="card-img-overlay d-flex p-3">
														{/* Video button and link */}
														<div className="m-auto">
															<a
																href="https://www.youtube.com/embed/tXHviS-4ygo"
																className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
																data-glightbox=""
																data-gallery="course-video"
															>
																<i className="fas fa-play" />
															</a>
														</div>
													</div>
												</div>
												{/* Card body */}
												<div className="card-body">
													{/* Price and cart */}
													<div className="row g-3">
														{/* Item */}
														<div className="col-sm-4 col-lg-6 col-xl-4">
															<div className="d-flex align-items-center">
																<a
																	href="#"
																	className="btn btn-orange rounded-2 me-3 mb-0"
																>
																	<i className="bi bi-cart3 fs-5" />
																</a>
																<div>
																	{/* Badge */}
																	<span className="badge bg-info text-white mb-1">
																		6 month
																	</span>
																	<h5 className="mb-0">$134</h5>
																</div>
															</div>
														</div>
														{/* Item */}
														<div className="col-sm-4 col-lg-6 col-xl-4">
															<div className="d-flex align-items-center">
																<a
																	href="#"
																	className="btn btn-orange rounded-2 me-3 mb-0"
																>
																	<i className="bi bi-cart3 fs-5" />
																</a>
																<div>
																	{/* Badge */}
																	<span className="badge bg-info text-white mb-1">
																		12 month
																	</span>
																	<h5 className="mb-0">$355</h5>
																</div>
															</div>
														</div>
														{/* Item */}
														<div className="col-sm-4 col-lg-6 col-xl-4">
															<div className="d-flex align-items-center">
																<a
																	href="#"
																	className="btn btn-orange rounded-2 me-3 mb-0"
																>
																	<i className="bi bi-cart3 fs-5" />
																</a>
																<div>
																	{/* Badge */}
																	<span className="badge bg-info text-white mb-1">
																		18 month
																	</span>
																	<h5 className="mb-0">$654</h5>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											{/* Card END */}
										</div>
										{/* Right content END */}
									</div>
									{/* Row END */}
								</div>
								{/* Outer content END */}
								{/* Outer content START */}
								<div
									className="tab-pane fade"
									id="course-pills-tab3"
									role="tabpanel"
									aria-labelledby="course-pills-tab-3"
								>
									<div className="row g-4">
										{/* Left content START */}
										<div className="col-lg-6">
											{/* Title */}
											<h3>Data Science</h3>
											<p className="mb-3">
												Handsome met debating sir dwelling age material. As style
												lived he worse dried. Offered related so visitors we private
												removed.
											</p>
											{/* Buttons */}
											<div className="mt-3">
												<a href="#" className="btn btn-success">
													Free trial
												</a>
												<a href="#" className="btn btn-danger">
													Buy course
												</a>
											</div>
										</div>
										{/* Left content END */}
										{/* Right content START */}
										<div className="col-lg-6">
											{/* Card START */}
											<div className="card p-2 shadow">
												<div className="overflow-hidden rounded-3 h-xl-200px">
													<img
														src="/assets/images/about/15.jpg"
														className="card-img rounded-3"
														alt="course image"
													/>
													<div className="card-img-overlay d-flex p-3">
														{/* Video button and link */}
														<div className="m-auto">
															<a
																href="https://www.youtube.com/embed/tXHviS-4ygo"
																className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
																data-glightbox=""
																data-gallery="course-video"
															>
																<i className="fas fa-play" />
															</a>
														</div>
													</div>
												</div>
											</div>
											{/* Card END */}
										</div>
										{/* Right content END */}
									</div>
								</div>
								{/* Outer content END */}
								{/* Outer content START */}
								<div
									className="tab-pane fade"
									id="course-pills-tab4"
									role="tabpanel"
									aria-labelledby="course-pills-tab-4"
								>
									<div className="row g-4">
										{/* Left content START */}
										<div className="col-lg-6">
											{/* Title */}
											<h3>Marketing</h3>
											<p className="mb-3">
												Handsome met debating sir dwelling age material. As style
												lived he worse dried. Offered related so visitors we private
												removed.
											</p>
											{/* Buttons */}
											<div className="mt-3">
												<a href="#" className="btn btn-success">
													Free trial
												</a>
												<a href="#" className="btn btn-danger">
													Buy course
												</a>
											</div>
										</div>
										{/* Left content END */}
										{/* Right content START */}
										<div className="col-lg-6">
											{/* Card START */}
											<div className="card p-2 shadow">
												<div className="overflow-hidden rounded-3 h-xl-200px">
													<img
														src="/assets/images/about/12.jpg"
														className="card-img rounded-3"
														alt="course image"
													/>
													<div className="card-img-overlay d-flex p-3">
														{/* Video button and link */}
														<div className="m-auto">
															<a
																href="https://www.youtube.com/embed/tXHviS-4ygo"
																className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
																data-glightbox=""
																data-gallery="course-video"
															>
																<i className="fas fa-play" />
															</a>
														</div>
													</div>
												</div>
											</div>
											{/* Card END */}
										</div>
										{/* Right content END */}
									</div>
								</div>
								{/* Outer content END */}
								{/* Outer content START */}
								<div
									className="tab-pane fade"
									id="course-pills-tab5"
									role="tabpanel"
									aria-labelledby="course-pills-tab-5"
								>
									<div className="row g-4">
										{/* Left content START */}
										<div className="col-lg-6">
											{/* Title */}
											<h3>Finance</h3>
											<p className="mb-3">
												Handsome met debating sir dwelling age material. As style
												lived he worse dried. Offered related so visitors we private
												removed.
											</p>
											{/* Buttons */}
											<div className="mt-3">
												<a href="#" className="btn btn-success">
													Free trial
												</a>
												<a href="#" className="btn btn-danger">
													Buy course
												</a>
											</div>
										</div>
										{/* Left content END */}
										{/* Right content START */}
										<div className="col-lg-6">
											{/* Card START */}
											<div className="card p-2 shadow">
												<div className="overflow-hidden rounded-3 h-xl-200px">
													<img
														src="/assets/images/about/11.jpg"
														className="card-img rounded-3"
														alt="course image"
													/>
													<div className="card-img-overlay d-flex p-3">
														{/* Video button and link */}
														<div className="m-auto">
															<a
																href="https://www.youtube.com/embed/tXHviS-4ygo"
																className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
																data-glightbox=""
																data-gallery="course-video"
															>
																<i className="fas fa-play" />
															</a>
														</div>
													</div>
												</div>
											</div>
											{/* Card END */}
										</div>
										{/* Right content END */}
									</div>
								</div>
								{/* Outer content END */}
							</div>
							{/* Outer tabs contents END */}
						</div>
					</section>
					{/* =======================
Popular course END */}
					{/* =======================
Instructor START */}
					<section>
						<div className="container">
							{/* Title */}
							<div className="row mb-4">
								<div className="col-12">
									<h2 className="fs-1 fw-bold">
										<span className="position-relative z-index-9">Our Best</span>
										<span className="position-relative z-index-1">
											Instructors
											{/* SVG START */}
											<span className="position-absolute top-50 start-50 translate-middle z-index-n1">
												<svg width="205.3px" height="63.3px">
													<path
														className="fill-warning"
														d="M204,26.9c-0.1-0.5-0.2-1.1-0.4-1.6c-0.1-0.3-0.3-0.6-0.5-0.9c-0.3-0.5-0.8-0.9-1.6-1.2l0.1-0.1l-0.1,0.1 c0.1-0.5-0.2-0.6-0.6-0.7c-0.1,0-0.1,0-0.2,0c-0.1-0.1-0.3-0.2-0.4-0.4c0-0.4,0-0.7-0.3-0.9c-0.1-0.1-0.4-0.2-0.7-0.2 c0-0.3-0.1-0.6-0.3-0.7c-0.2-0.1-0.4-0.2-0.6-0.2c-0.1,0-0.2,0-0.3,0c-0.6-0.5-1.2-1-1.8-1.4c0-0.1,0-0.1,0-0.1 c-0.1-0.1-0.2-0.2-0.4-0.2c-1.1-0.6-2.2-1.2-3.3-1.9c-7.6-4.5-16.6-5.5-25-7.9c-5.1-1.5-10.6-1.8-15.9-2.5 c-7.1-0.9-14.3-0.8-21.4-1.3c-2.9-0.2-5.8-0.4-8.6-0.4c-1.5,0-3-0.3-4.5-0.1c-3.1,0.5-6.2,0.8-9.3,0.9c-1,0.1-2.1,0.1-3.1,0.1 c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.3,0c-1.1,0-2.3,0.1-3.4,0.1c-1.1,0-2.3,0-3.4,0c-6.9-0.4-13.6,0.9-20.2,1.9 c-3.2,0.5-6.4,1.2-9.6,1.9c-3.5,0.8-7.1,0.9-10.6,1.7c-5.1,1.2-10.3,2.3-15.6,3.2c-5.1,0.9-10.1,2.1-15.1,3.4 c-4.6,1.2-8.7,3.2-12.7,5.2c-2.4,1.2-4.8,2.2-6.6,4.1c-2.2,2.3-3.5,5-5.4,7.5c-1.2,1.7-0.9,3.2,0.2,4.9c2.5,3.9,6.9,5.5,11.4,7.2 c2.2,0.8,4.6,1.3,6.7,2.3c2.9,1.4,5.8,2.9,8.9,4.1c6.6,2.5,13.4,4.3,20.4,5.6c3.8,0.7,7.8,1.1,11.7,1.4c6,0.4,12,1.3,18.1,1 c0.4,0.4,0.8,0.4,1.1-0.1c0.9-0.4,1.8,0.1,2.7-0.1c4.7-0.8,9.5-0.4,14.3-0.3c2.7,0,5.4,0.4,8.1,0.3c5-0.2,10.1-0.6,15.1-1 c6.9-0.6,13.8-1.3,20.4-2.8c0.2,0.2,0.3,0.1,0.3-0.1c0.6-0.1,1.2-0.2,1.8-0.3c0.1,0.2,0.3,0.1,0.3,0c0.7-0.1,1.3-0.3,2-0.4 c4.2-0.4,8.4-0.7,12.6-1.3c2.6-0.3,5.2-1,7.8-1.5c0.2,0.1,0.4,0.2,0.6,0.1c0.1,0,0.2-0.1,0.2-0.1c0,0,0.1-0.1,0.1-0.1 c0,0,0.1-0.1,0.1-0.1c0.3-0.1,0.5-0.2,0.8-0.2c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.3-0.2c0,0,0,0,0,0l0,0c0,0,0,0,0,0 c0.2,0,0.5-0.1,0.7-0.1c0,0,0,0,0,0c0.1,0,0.2,0,0.3,0c0.2,0,0.4-0.1,0.4-0.4c0.6-0.2,1.2-0.4,1.7-0.7c0.1,0,0.2,0,0.3,0 c0,0,0.1,0,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0,0,0.1,0,0.1-0.1c0,0,0.1,0,0.1,0c0.3,0.1,0.6,0.1,0.7,0c0.1,0,0.2-0.1,0.2-0.2 c0.1-0.1,0.1-0.2,0.2-0.3c0.7-0.3,1.3-0.6,2-0.8c2-0.9,3.9-1.7,6-2.4c6-1.8,11.5-4.2,16.1-8c1-0.2,1.6-0.7,2-1.3 c0.3-0.4,0.4-0.8,0.6-1.2c0.6-0.1,0.9-0.3,1.1-0.6c0.2-0.3,0.3-0.7,0.4-1.1c0-0.1,0-0.1,0.1-0.2c0.6,0,0.7-0.4,1-0.7 C203.7,32.1,204.6,29.6,204,26.9z M4.4,38.1C4.2,37.6,4,37,4.3,36.5c2.3-3.7,4.3-7.6,8.5-10.2c3.5-2.1,7.4-3.7,11.3-5.3 c5.4-2.3,11.3-3.2,17.1-4.4c0,0.1,0,0.2,0,0.3l0,0c-1.4,0.5-2.7,0.9-4.1,1.4c-4.1,1.4-8.2,2.7-12.2,4.2c-5.4,2.1-9.7,5.3-12.8,9.5 c-0.6,0.8-1.3,1.7-2,2.5c-2.7,3.4-1.2,5.9,1.5,8.8c0.2,0.2,0.4,0.4,0.5,0.6C8.7,42.8,5.7,41.2,4.4,38.1z M198.5,31.8 c-2.1,3.5-5.2,6.4-8.9,8.6c-2.6,1.6-5.6,2.7-8.7,3.7c-4.1,1.3-8.1,3-12,4.6c-5,2-10.2,3.2-15.7,3.6c-7.5,0.6-14.9,1.9-22.2,3.2 c-6.1,1.1-12.4,1.3-18.6,1.9c-7,0.7-14.1,0.2-21.2,0.1c-4-0.1-7.9,0.4-11.8,0.6c-3.3,0.2-6.5,0.2-9.8-0.1c-4.9-0.4-9.9-0.7-14.8-1.2 c-3.5-0.3-7-0.9-10.4-1.8c-4-1.1-8-2.1-12-3.2c-0.6-0.2-1.2-0.3-1.7-0.7c-0.2-0.1-0.5-0.2-0.8-0.3c0.1,0,0.1,0,0.2-0.1 c0.3-0.1,0.6,0,0.9,0.1c0,0,0,0,0,0c4.3,0.6,8.7,1.5,13.1,1.7c0.6,0,1.3,0,1.9,0c0.6,0,1.6,0.3,1.6-0.3c0-0.7-0.9-1.1-1.8-1.1 c-2.7,0-5.3-0.3-7.9-0.7c-5.8-0.9-11.5-1.8-16.9-3.8c-3.7-1.4-6.8-3.4-8.7-6.6c-0.6-1-0.6-2-0.1-3c4-7.8,11.4-12.4,20.6-15.4 c8.4-2.7,16.7-5.6,25.5-7.6c6.3-1.4,12.7-2.3,18.9-3.7C88,8.1,99,7.5,110.1,7.1c4.5-0.2,9-1.1,13.6-0.7c10.5,0.8,21.1,1.5,31.6,3 c5.7,0.8,11.4,1.5,17.2,2.1c4.5,0.5,9,1.8,13.2,3.5c4,1.6,7.5,3.6,10.7,6.3C199.7,24.1,200.6,28.4,198.5,31.8z"
													></path>
												</svg>
											</span>
											{/* SVG END */}
										</span>
									</h2>
									<p className="mb-0">
										Boost up your knowledge with industries experts
									</p>
								</div>
							</div>
							<div className="row">
								{/* Slider START */}
								<div className="tiny-slider arrow-round arrow-creative arrow-blur">
									<div
										className="tiny-slider-inner"
										data-autoplay="true"
										data-arrow="true"
										data-dots="false"
										data-items={4}
										data-items-lg={3}
										data-items-md={2}
										data-items-xs={1}
									>
										{/* Card item START */}
										<div className="card">
											<div className="position-relative">
												{/* Image */}
												<img
													src="/assets/images/instructor/02.jpg"
													className="card-img"
													alt="course image"
												/>
												{/* Overlay */}
												<div className="card-img-overlay d-flex flex-column p-3">
													<div className="w-100 mt-auto text-end">
														{/* Card category */}
														<a
															href="#"
															className="badge text-white bg-info rounded-1"
														>
															<i className="fas fa-user-graduate me-2" />
															25
														</a>
														<a
															href="#"
															className="badge text-white bg-orange rounded-1"
														>
															<i className="fas fa-clipboard-list me-2" />
															15
														</a>
													</div>
												</div>
											</div>
											{/* Card body */}
											<div className="card-body text-center">
												{/* Title */}
												<h5 className="card-title">
													<a href="#">Jacqueline Miller</a>
												</h5>
												<p className="mb-2">Computer Teacher</p>
											</div>
										</div>
										{/* Card item END */}
										{/* Card item START */}
										<div className="card">
											<div className="position-relative">
												{/* Image */}
												<img
													src="/assets/images/instructor/01.jpg"
													className="card-img"
													alt="course image"
												/>
												{/* Overlay */}
												<div className="card-img-overlay d-flex flex-column p-3">
													<div className="w-100 mt-auto text-end">
														{/* Card category */}
														<a
															href="#"
															className="badge text-white bg-info rounded-1"
														>
															<i className="fas fa-user-graduate me-2" />
															118
														</a>
														<a
															href="#"
															className="badge text-white bg-orange rounded-1"
														>
															<i className="fas fa-clipboard-list me-2" />
															09
														</a>
													</div>
												</div>
											</div>
											{/* Card body */}
											<div className="card-body text-center">
												{/* Title */}
												<h5 className="card-title">
													<a href="#">Samuel Bishop</a>
												</h5>
												<p className="mb-2">Marketing Teacher</p>
											</div>
										</div>
										{/* Card item END */}
										{/* Card item START */}
										<div className="card">
											<div className="position-relative">
												{/* Image */}
												<img
													src="/assets/images/instructor/08.jpg"
													className="card-img"
													alt="course image"
												/>
												{/* Overlay */}
												<div className="card-img-overlay d-flex flex-column p-3">
													<div className="w-100 mt-auto text-end">
														{/* Card category */}
														<a
															href="#"
															className="badge text-white bg-info rounded-1"
														>
															<i className="fas fa-user-graduate me-2" />
															92
														</a>
														<a
															href="#"
															className="badge text-white bg-orange rounded-1"
														>
															<i className="fas fa-clipboard-list me-2" />
															38
														</a>
													</div>
												</div>
											</div>
											{/* Card body */}
											<div className="card-body text-center">
												{/* Title */}
												<h5 className="card-title">
													<a href="#">Dennis Barrett</a>
												</h5>
												<p className="mb-2">Science Teacher</p>
											</div>
										</div>
										{/* Card item END */}
										{/* Card item START */}
										<div className="card">
											<div className="position-relative">
												{/* Image */}
												<img
													src="/assets/images/instructor/04.jpg"
													className="card-img"
													alt="course image"
												/>
												{/* Overlay */}
												<div className="card-img-overlay d-flex flex-column p-3">
													<div className="w-100 mt-auto text-end">
														{/* Card category */}
														<a
															href="#"
															className="badge text-white bg-info rounded-1"
														>
															<i className="fas fa-user-graduate me-2" />
															82
														</a>
														<a
															href="#"
															className="badge text-white bg-orange rounded-1"
														>
															<i className="fas fa-clipboard-list me-2" />
															05
														</a>
													</div>
												</div>
											</div>
											{/* Card body */}
											<div className="card-body text-center">
												{/* Title */}
												<h5 className="card-title">
													<a href="#">Carolyn Ortiz</a>
												</h5>
												<p className="mb-2">Economy Teacher</p>
											</div>
										</div>
										{/* Card item END */}
										{/* Card item START */}
										<div className="card">
											<div className="position-relative">
												{/* Image */}
												<img
													src="/assets/images/instructor/03.jpg"
													className="card-img"
													alt="course image"
												/>
												{/* Overlay */}
												<div className="card-img-overlay d-flex flex-column p-3">
													<div className="w-100 mt-auto text-end">
														{/* Card category */}
														<a
															href="#"
															className="badge text-white bg-info rounded-1"
														>
															<i className="fas fa-user-graduate me-2" />
															50
														</a>
														<a
															href="#"
															className="badge text-white bg-orange rounded-1"
														>
															<i className="fas fa-clipboard-list me-2" />
															10
														</a>
													</div>
												</div>
											</div>
											{/* Card body */}
											<div className="card-body text-center">
												{/* Title */}
												<h5 className="card-title">
													<a href="#">Billy Vasquez</a>
												</h5>
												<p className="mb-2">Computer Teacher</p>
											</div>
										</div>
										{/* Card item END */}
									</div>
								</div>
							</div>

						</div>
					</section>
					{/* =======================
Instructor END */}
					{/* =======================
Action box START */}
					<section className="py-0 pt-lg-5">
						<div className="container">
							<div className="row">
								<div className="col-12 position-relative z-index-1">
									{/* Image */}
									<div className="d-none d-lg-block position-absolute bottom-0 start-0 ms-3 ms-xl-5">
										<img src="/assets/images/element/01.png" alt="" />
									</div>
									{/* Pencil and cap SVG */}
									<div className="position-absolute top-0 end-0 mt-n4 me-5">
										<img src="/assets/images/client/pencil.svg" alt="" />
									</div>
									<div className="position-absolute bottom-0 start-50 mb-n4">
										<img
											src="/assets/images/client/graduated.svg"
											className="rotate-74"
											alt=""
										/>
									</div>
									<div className="bg-grad-pink p-4 p-sm-5 rounded position-relative z-index-n1 overflow-hidden">
										{/* SVG decoration */}
										<figure className="position-absolute top-0 start-0 mt-3 ms-n3 opacity-5">
											<svg width="818.6px" height="235.1px" viewBox="0 0 818.6 235.1">
												<path
													className="fill-white"
													d="M735,226.3c-5.7,0.6-11.5,1.1-17.2,1.7c-66.2,6.8-134.7,13.7-192.6-16.6c-34.6-18.1-61.4-47.9-87.3-76.7 c-21.4-23.8-43.6-48.5-70.2-66.7c-53.2-36.4-121.6-44.8-175.1-48c-13.6-0.8-27.5-1.4-40.9-1.9c-46.9-1.9-95.4-3.9-141.2-16.5 C8.3,1.2,6.2,0.6,4.2,0H0c3.3,1,6.6,2,10,3c46,12.5,94.5,14.6,141.5,16.5c13.4,0.6,27.3,1.1,40.8,1.9 c53.4,3.2,121.5,11.5,174.5,47.7c26.5,18.1,48.6,42.7,70,66.5c26,28.9,52.9,58.8,87.7,76.9c58.3,30.5,127,23.5,193.3,16.7 c5.8-0.6,11.5-1.2,17.2-1.7c26.2-2.6,55-4.2,83.5-2.2v-1.2C790,222,761.2,223.7,735,226.3z"
												></path>
											</svg>
										</figure>
										{/* SVG decoration */}
										<figure className="position-absolute top-50 start-0 translate-middle-y ms-5">
											<svg width="473px" height="234px">
												<path
													fillRule="evenodd"
													opacity="0.051"
													fill="rgb(255, 255, 255)"
													d="M0.004,222.303 L364.497,-0.004 L472.998,32.563 L100.551,233.991 L0.004,222.303 Z"
												></path>
											</svg>
										</figure>
										{/* SVG decoration */}
										<figure className="position-absolute top-50 end-0 translate-middle-y">
											<svg width="355.6px" height="396.1px">
												<path
													className="fill-danger rotate-10"
													d="M32.8,364.1c16.1-14.7,36-21.5,56.8-26.7c20-5.1,40.5-9.7,57.8-21.4c35.7-24.3,51.1-68.5,57.2-109.4 c6.8-45.7,4.6-93.7,21.6-137.5c8.3-21.4,22.3-41.4,43.3-51.9c17.4-8.7,36.2-7.9,54.2-1.5c10.2,3.6,19.8,8.5,29.4,13.5l2.5-4.3 c-2.7-1.4-5.4-2.8-8.2-4.2c-15.8-8-32.9-15.3-50.9-15.2C276,5.6,256.9,16,243.3,31c-16.6,18.3-25.3,42.2-30.5,66 c-5,22.9-6.8,46.3-8.8,69.6c-3.9,44.4-9.7,92.8-40.1,128c-7.1,8.2-15.4,15.4-24.9,20.8c-9.3,5.4-19.5,8.9-29.8,11.8 c-20.2,5.7-41.3,9.1-59.9,19.2c-19.3,10.4-35.1,27.2-44.2,47.1c0,0,0,0.1,0,0.1l4.4,2.6C15,384,22.9,373.1,32.8,364.1z"
												></path>
											</svg>
										</figure>
										<div className="row g-3 align-items-center justify-content-lg-end position-relative py-4">
											{/* Title */}
											<div className="col-md-6">
												<h2 className="text-white">Become an Instructor!</h2>
												<p className="text-white mb-0">
													Teach thousands of students and earn money with ease!
												</p>
											</div>
											{/* Button */}
											<div className="col-md-6 col-lg-3 text-md-end">
												<a href="#" className="btn btn-white mb-0">
													Get Started Now!
												</a>
											</div>
										</div>
										{/* Row END */}
									</div>
								</div>
							</div>
						</div>
					</section>
					{/* =======================
Action box END */}
					{/* =======================
Client START */}

					<section className="py-5">
						<div className="container">
							<div className="row justify-content-center my-4">
								<div className="col-12">
									{/* Slider START */}
									<div className="tiny-slider arrow-round">
										<div
											className="tiny-slider-inner"
											data-autoplay="true"
											data-arrow="true"
											data-dots="false"
											data-items={4}
											data-items-lg={3}
											data-items-md={2}
											data-items-xs={1}
										>
											{/* Slide item START */}
											<div className="item">
												<img src="/assets/images/client/coca-cola.svg" alt="" />
											</div>
											<div className="item">

												<img src="/assets/images/client/android.svg" alt="" />
											</div>
											<div className="item">

												<img src="/assets/images/client/envato.svg" alt="" />
											</div>
											<div className="item">
												<img src="/assets/images/client/microsoft.svg" alt="" />
											</div>
											<div className="item">

												<img src="/assets/images/client/netflix.svg" alt="" />
											</div>
											<div className="item">

												<img src="/assets/images/client/google.svg" alt="" />
											</div>
											<div className="item">

												<img src="/assets/images/client/linkedin.svg" alt="" />
											</div>
											{/* Slide item END */}
										</div>
									</div>
									{/* Slider END */}
								</div>
							</div>
						</div>
					</section>
					{/* =======================
Client END */}
				</main>
				{/* **************** MAIN CONTENT END **************** */}
			</>

		</UserLayout>
	);
};

export default Home;