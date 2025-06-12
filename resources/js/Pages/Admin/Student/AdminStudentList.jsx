import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layouts/AdminLayout';

const AdminStudentList = ({ students }) => {
  const [activeTab, setActiveTab] = useState('grid');

  const formatDate = (isoDate) => {
    if (!isoDate) return '---';
    const date = new Date(isoDate);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <AdminLayout>
      <div className="page-content-wrapper border">
        {/* Title */}
        <div className="row">
          <div className="col-12">
            <h1 className="h3 mb-2 mb-sm-0">Students</h1>
          </div>
        </div>

        <div className="card bg-transparent">
          {/* Header */}
          <div className="card-header bg-transparent border-bottom px-0">
            <div className="row g-3 align-items-center justify-content-between">
              <div className="col-md-8">
                <form className="rounded position-relative">
                  <input className="form-control bg-transparent" type="search" placeholder="Search" aria-label="Search" />
                  <button
                    className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                    type="submit"
                  >
                    <i className="fas fa-search fs-6"></i>
                  </button>
                </form>
              </div>

              <div className="col-md-3">
                <ul className="list-inline mb-0 nav nav-pills nav-pill-dark-soft border-0 justify-content-end">
                  <li className="nav-item">
                    <button
                      className={`nav-link mb-0 me-2 ${activeTab === 'grid' ? 'active' : ''}`}
                      onClick={() => setActiveTab('grid')}
                    >
                      <i className="fas fa-fw fa-th-large"></i>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link mb-0 ${activeTab === 'list' ? 'active' : ''}`}
                      onClick={() => setActiveTab('list')}
                    >
                      <i className="fas fa-fw fa-list-ul"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="card-body px-0 pt-4">
            <div className={activeTab === 'grid' ? 'row g-4' : ''}>
              {students.data.length === 0 ? (
                <div className="col-12">
                  <div className="alert alert-warning">No students found.</div>
                </div>
              ) : (
                students.data.map((student) =>
                  activeTab === 'grid' ? (
                    <div className="col-md-6 col-xxl-4" key={student.id}>
                      <div className="card bg-transparent border h-100">
                        <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                          <div>
                            <h5 className="mb-0">{student.name}</h5>
                            <span className="text-body small">
                              <i className="fas fa-envelope fa-fw me-1"></i> {student.email}
                            </span>
                          </div>
                          <div className="dropdown text-end">
                            <button className="btn btn-sm btn-light btn-round small mb-0" data-bs-toggle="dropdown">
                              <i className="bi bi-three-dots fa-fw"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow rounded">
                              <li><a className="dropdown-item" href="#"><i className="bi bi-pencil-square me-2"></i>Edit</a></li>
                              <li><a className="dropdown-item" href="#"><i className="bi bi-trash me-2"></i>Remove</a></li>
                            </ul>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                              <div className="icon-md bg-info bg-opacity-10 text-info rounded-circle">
                                <i className="bi bi-telephone-fill"></i>
                              </div>
                              <h6 className="mb-0 ms-2 fw-light">Phone</h6>
                            </div>
                            <span className="mb-0 fw-bold">{student.phone || 'N/A'}</span>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                              <div className="icon-md bg-warning bg-opacity-10 text-warning rounded-circle">
                                <i className="bi bi-person-check-fill"></i>
                              </div>
                              <h6 className="mb-0 ms-2 fw-light">Status</h6>
                            </div>
                            <span className="mb-0 fw-bold">{student.status === 1 ? 'Active' : 'Inactive'}</span>
                          </div>
                        </div>

                        <div className="card-footer bg-transparent border-top">
                          <div className="d-sm-flex justify-content-between align-items-center">
                            <h6 className="mb-2 mb-sm-0">
                              <i className="bi bi-calendar fa-fw text-orange me-2"></i>
                              <span className="text-body">Join at:</span> {formatDate(student.email_verified_at)}
                            </h6>
                            <div>
                              <button className="btn btn-sm btn-outline-secondary me-2">
                                <i className="bi bi-eye-fill"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="fas fa-ban"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card mb-3" key={student.id}>
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{student.name}</h5>
                          <p className="mb-1 text-muted">{student.email}</p>
                          <small>Join at: {formatDate(student.email_verified_at)}</small>
                        </div>
                        <div>
                          <button className="btn btn-sm btn-outline-secondary me-2">
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-ban"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* Pagination */}
            {students.links.length > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {students.links.map((link, index) => (
                    <li
                      key={index}
                      className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                    >
                      {link.url ? (
                        <Link
                          href={link.url}
                          className="page-link"
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ) : (
                        <span
                          className="page-link"
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStudentList;
