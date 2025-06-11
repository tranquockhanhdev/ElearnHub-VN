import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Components/Layouts/AdminLayout';
const AdminCourseList = ({ courses }) => {
  return (
    <AdminLayout>
      <div className="page-content-wrapper border">
        {/* Title */}
        <div className="row mb-3">
          <div className="col-12 d-sm-flex justify-content-between align-items-center">
            <h1 className="h3 mb-2 mb-sm-0">
              Course List{' '}
              <span className="badge bg-orange bg-opacity-10 text-orange">{courses.length}</span>
            </h1>
            <Link href="/admin-course-create" className="btn btn-sm btn-primary mb-0">
              Create a Course
            </Link>
          </div>
        </div>

        {/* Filter/Search Row */}
        <div className="row mb-4">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Search by title..." />
          </div>
          <div className="col-md-4">
            <select className="form-select">
              <option value="">All Categories</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select">
              <option value="">Sort by</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Card List */}
        <div className="card bg-transparent">
          <div className="tab-content pt-4">
            <div className="tab-pane fade show active" id="nav-preview-tab-1">
              <div className="row g-4">
                {courses.map((course) => (
                  <div className="col-md-6 col-xxl-4" key={course.id}>
                    <div className="card bg-transparent border h-100">
                      <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                        <div>
                          <h5 className="mb-0">
                            <a href="#">{course.title}</a>
                          </h5>
                          <p className="mb-0 small">
                            {course.categories?.map((c) => c.name).join(', ') || 'N/A'}
                          </p>
                        </div>
                        <div className="dropdown">
                          <a
                            href="#"
                            className="btn btn-sm btn-light btn-round"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots fa-fw"></i>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end shadow rounded">
                            <li>
                              <Link
                                className="dropdown-item"
                                href={`/admin-course/${course.id}/edit`}
                              >
                                <i className="bi bi-pencil-square me-2"></i>Edit
                              </Link>
                            </li>
                            <li>
                              <button className="dropdown-item">
                                <i className="bi bi-trash me-2"></i>Remove
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="card-body">
                        {/* Thumbnail */}
                        {course.thumbnail && (
                          <div className="mb-3 text-center">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="img-fluid rounded"
                              style={{ maxHeight: '180px', objectFit: 'cover', width: '100%' }}
                            />
                          </div>
                        )}

                        {/* Description */}
                        <div className="mb-2">
                          <p className="text-muted small">
                            {course.description?.slice(0, 100) || 'No description available...'}...
                          </p>
                        </div>

                        {/* Instructor */}
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="mb-0 fw-light">Instructor</h6>
                          <span className="fw-bold">{course.instructor?.name || 'N/A'}</span>
                        </div>

                        {/* Price */}
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-0 fw-light">Price</h6>
                          <span className="fw-bold">${course.price}</span>
                        </div>
                      </div>

                      <div className="card-footer bg-transparent border-top d-flex justify-content-between align-items-center">
                        <span className="text-muted small">ID: {course.id}</span>
                        <a href="#" className="btn btn-link text-body p-0" title="View">
                          <i className="bi bi-eye-fill"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {courses.length === 0 && (
                  <div className="text-center w-100">No courses found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourseList;