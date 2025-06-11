import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Components/Layouts/AdminLayout';

const AdminCourseCategory = () => {
  const { categories } = usePage().props;

  return (
    <AdminLayout>
      <div className="page-content-wrapper border">
        {/* Title */}
        <div className="row mb-3">
          <div className="col-12 d-sm-flex justify-content-between align-items-center">
            <h1 className="h3 mb-2 mb-sm-0">
              Course Categories <span className="badge bg-orange bg-opacity-10 text-orange">{categories.length}</span>
            </h1>
            <a href="#" className="btn btn-sm btn-primary mb-0">Create a Category</a>
          </div>
        </div>

        {/* Card */}
        <div className="card bg-transparent border">
          <div className="card-header bg-light border-bottom">
            <div className="row g-3 align-items-center justify-content-between">
              {/* Search */}
              <div className="col-md-8">
                <form className="rounded position-relative">
                  <input className="form-control bg-body" type="search" placeholder="Search" />
                  <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0" type="submit">
                    <i className="fas fa-search fs-6 "></i>
                  </button>
                </form>
              </div>
              {/* Sort */}
              <div className="col-md-3">
                <select className="form-select border-0">
                  <option value="">Sort by</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id}>
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td>{new Date(category.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-success me-1">Edit</button>
                        <button className="btn btn-sm btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourseCategory;