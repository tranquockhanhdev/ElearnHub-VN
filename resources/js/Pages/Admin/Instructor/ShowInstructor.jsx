import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Components/Layouts/AdminLayout';

export default function InstructorDetail({ instructor, courses }) {
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === 'active').length;
  const pendingCourses = courses.filter((c) => c.status === 'pending').length;
  const inactiveCourses = courses.filter((c) => c.status === 'inactive').length;

  return (
    <AdminLayout>
      <Head title={`Instructor - ${instructor.full_name}`} />

      <div className="page-content-wrapper border p-4">
        {/* Title */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h3 mb-0 text-dark">Instructor Detail</h1>
          </div>
        </div>

        <div className="row g-4">
          {/* Personal Info - Left Side */}
          <div className="col-xxl-6 col-lg-8">
            <div className="card border rounded-3 shadow-sm h-100">
              <div className="card-header bg-light border-bottom">
                <h5 className="card-header-title mb-0 text-dark">Personal Information</h5>
              </div>
              <div className="card-body">
                <h5 className="mb-3 text-dark">{instructor.full_name}</h5>
                <ul className="list-group list-group-borderless">
                  <li className="list-group-item">
                    <strong>Name:</strong> <span className="text-dark">{instructor.name}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Mobile:</strong>{' '}
                    <span className="text-dark">{instructor.phone}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> <span className="text-dark">{instructor.email}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Joining Date:</strong>{' '}
                    <span className="text-dark">{instructor.created_at}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

         {/* Stats - Right Side - Redesigned */}
<div className="col-xxl-6 col-lg-4">
  <div className="card border rounded-3 shadow-sm h-100">
    <div className="card-header bg-light border-bottom">
      <h5 className="card-header-title mb-0 text-dark">Course Statistics</h5>
    </div>
    <div className="card-body">
      <div className="d-flex flex-column gap-3">
        {/* Total Courses */}
        <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 rounded border">
          <div>
            <h6 className="mb-1 text-primary">Total Courses</h6>
            <span className="fw-bold fs-5 text-dark">{totalCourses}</span>
          </div>
          <i className="bi bi-collection-play fs-3 text-primary"></i>
        </div>

        {/* Active Courses */}
        <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded border">
          <div>
            <h6 className="mb-1 text-success">Active</h6>
            <span className="fw-bold fs-5 text-dark">{activeCourses}</span>
          </div>
          <i className="bi bi-check-circle fs-3 text-success"></i>
        </div>

        {/* Pending Courses */}
        <div className="d-flex justify-content-between align-items-center p-3 bg-warning bg-opacity-10 rounded border">
          <div>
            <h6 className="mb-1 text-warning">Pending</h6>
            <span className="fw-bold fs-5 text-dark">{pendingCourses}</span>
          </div>
          <i className="bi bi-clock-history fs-3 text-warning"></i>
        </div>

        {/* Inactive Courses */}
        <div className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded border">
          <div>
            <h6 className="mb-1 text-danger">Inactive</h6>
            <span className="fw-bold fs-5 text-dark">{inactiveCourses}</span>
          </div>
          <i className="bi bi-x-circle fs-3 text-danger"></i>
        </div>
      </div>
    </div>
  </div>
</div>


          {/* Course List */}
          <div className="col-12">
            <div className="card border rounded-3 shadow-sm">
              <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-dark">Courses List</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="text-dark">Course Name</th>
                        <th className="text-dark">Categories</th>
                        <th className="text-dark">Status</th>
                        <th className="text-dark">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td className="text-dark">
                            <a
                              href={`/courses/${course.id}`}
                              className="fw-semibold text-primary text-decoration-none"
                            >
                              {course.title}
                            </a>
                          </td>
                          <td>
                            {course.categories && course.categories.length > 0 ? (
                              course.categories.map((category) => (
                                <span
                                  key={category.id}
                                  className="badge bg-info-subtle text-info rounded-pill me-1"
                                >
                                  {category.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">No Categories</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${
                                course.status === 'active'
                                  ? 'bg-success text-white'
                                  : course.status === 'pending'
                                  ? 'bg-warning text-dark'
                                  : 'bg-danger text-white'
                              }`}
                            >
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <a
                              href={`/courses/${course.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                      {courses.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No courses available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="card-footer bg-transparent">Pagination here</div> */}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
