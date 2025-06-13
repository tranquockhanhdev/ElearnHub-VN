import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Components/Layouts/AdminLayout';

export default function Settings({ setting, admin, admins }) {
  return (
    <>
      <AdminLayout>
        <Head title="Admin Settings" />
        <div className="page-content-wrapper border">
          <div className="row">
            <div className="col-12 mb-3">
              <h1 className="h3 mb-2 mb-sm-0">Admin Settings</h1>
            </div>
          </div>
          <div className="row g-4">
            {/* Left menu */}
            <div className="col-xl-3">
              <ul className="nav nav-pills nav-tabs-bg-dark flex-column">
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="tab" href="#tab-1">
                    <i className="fas fa-globe fa-fw me-2"></i>
                    Website Settings
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#tab-4">
                    <i className="fas fa-user-circle fa-fw me-2"></i>
                    Account Settings
                  </a>
                </li>
              </ul>
            </div>

            {/* Right content */}
            <div className="col-xl-9">
              <div className="tab-content">
                {/* Tab 1: Website Settings */}
                <div className="tab-pane show active" id="tab-1">
                  <div className="card shadow">
                    <div className="card-header border-bottom">
                      <h5 className="card-header-title">Website Settings</h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <label className="form-label">Site Name</label>
                          <input type="text" className="form-control" value={setting?.site_name ?? ''} readOnly />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">Contact Email</label>
                          <input type="email" className="form-control" value={setting?.contact_email ?? ''} readOnly />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">Support Phone</label>
                          <input type="text" className="form-control" value={setting?.support_phone ?? ''} readOnly />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">Facebook URL</label>
                          <input type="text" className="form-control" value={setting?.facebook_url ?? ''} readOnly />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Footer Text</label>
                          <textarea className="form-control" value={setting?.footer_text ?? ''} rows="2" readOnly></textarea>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Maintenance Mode</label>
                          <input
                            type="text"
                            className="form-control"
                            value={setting?.maintenance_mode ? 'Enabled' : 'Disabled'}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab 2: Admin Account */}
                <div className="tab-pane" id="tab-4">
                  <div className="card shadow">
                    <div className="card-header border-bottom">
                      <h5 className="card-header-title">Admin Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <label className="form-label">Admin Name</label>
                          <input type="text" className="form-control" value={admin?.name ?? ''} readOnly />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" value={admin?.email ?? ''} readOnly />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">Phone</label>
                          <input type="text" className="form-control" value={admin?.phone ?? ''} readOnly />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label">Role</label>
                          <input type="text" className="form-control" value="Admin" readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5>Admin Accounts</h5>
    <button className="btn btn-primary">
      <i className="fas fa-plus me-1"></i> Add Admin
    </button>
  </div>

  <div className="table-responsive">
    <table className="table table-bordered">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {admins.length > 0 ? (
          admins.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone ?? '-'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-sm btn-danger">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">No admin accounts found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
