import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../Components/Layouts/AdminLayout';

const dashboard = () => {
    const { auth } = usePage().props;

    return (
        <AdminLayout>
         <div className="page-content-wrapper border">
  {/* Title */}
  <div className="row">
    <div className="col-12 mb-3">
      <h1 className="h3 mb-2 mb-sm-0">Dashboard</h1>
    </div>
  </div>

  {/* Counter boxes START */}
  <div className="row g-4 mb-4">
    {/* Counter item */}
    <div className="col-md-6 col-xxl-3">
      <div className="card card-body bg-warning bg-opacity-15 p-4 h-100">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="purecounter mb-0 fw-bold" data-purecounter-start="0" data-purecounter-end="1958" data-purecounter-delay="200">0</h2>
            <span className="mb-0 h6 fw-light">Completed Courses</span>
          </div>
          <div className="icon-lg rounded-circle bg-warning text-white mb-0">
            <i className="fas fa-tv fa-fw"></i>
          </div>
        </div>
      </div>
    </div>

    {/* Counter item */}
    <div className="col-md-6 col-xxl-3">
      <div className="card card-body bg-purple bg-opacity-10 p-4 h-100">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="purecounter mb-0 fw-bold" data-purecounter-start="0" data-purecounter-end="1600" data-purecounter-delay="200">0</h2>
            <span className="mb-0 h6 fw-light">Enrolled Courses</span>
          </div>
          <div className="icon-lg rounded-circle bg-purple text-white mb-0">
            <i className="fas fa-user-tie fa-fw"></i>
          </div>
        </div>
      </div>
    </div>

    {/* Counter item */}
    <div className="col-md-6 col-xxl-3">
      <div className="card card-body bg-primary bg-opacity-10 p-4 h-100">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="purecounter mb-0 fw-bold" data-purecounter-start="0" data-purecounter-end="1235" data-purecounter-delay="200">0</h2>
            <span className="mb-0 h6 fw-light">Course In Progress</span>
          </div>
          <div className="icon-lg rounded-circle bg-primary text-white mb-0">
            <i className="fas fa-user-graduate fa-fw"></i>
          </div>
        </div>
      </div>
    </div>

    {/* Counter item */}
    <div className="col-md-6 col-xxl-3">
      <div className="card card-body bg-success bg-opacity-10 p-4 h-100">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex">
              <h2 className="purecounter mb-0 fw-bold" data-purecounter-start="0" data-purecounter-end="845" data-purecounter-delay="200">0</h2>
              <span className="mb-0 h2 ms-1">hrs</span>
            </div>
            <span className="mb-0 h6 fw-light">Total Watch Time</span>
          </div>
          <div className="icon-lg rounded-circle bg-success text-white mb-0">
            <i className="bi bi-stopwatch-fill fa-fw"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Counter boxes END */}

  {/* Chart and Ticket START */}
  <div className="row g-4 mb-4">
    {/* Chart START */}
    <div className="col-xxl-8">
      <div className="card shadow h-100">
        <div className="card-header p-4 border-bottom">
          <h5 className="card-header-title">Earnings</h5>
        </div>
        <div className="card-body">
          <div id="ChartPayout"></div>
        </div>
      </div>
    </div>

    {/* Ticket START */}
    <div className="col-xxl-4">
      <div className="card shadow h-100">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center p-4">
          <h5 className="card-header-title">Support Requests</h5>
          <a href="#" className="btn btn-link p-0 mb-0">View all</a>
        </div>
        <div className="card-body p-4">
          {/* Ticket item */}
          <div className="d-flex justify-content-between position-relative mb-3">
            <div className="d-sm-flex">
              <div className="avatar avatar-md flex-shrink-0">
                <img className="avatar-img rounded-circle" src="images/09.jpg" alt="avatar" />
              </div>
              <div className="ms-2">
                <h6 className="mb-0"><a href="#" className="stretched-link">Lori Stevens</a></h6>
                <p className="mb-0">New ticket #759 from Lori Stevens for General Enquiry</p>
                <span className="small">8 hour ago</span>
              </div>
            </div>
          </div>

          <hr />

          {/* Ticket item */}
          <div className="d-flex justify-content-between position-relative mb-3">
            <div className="d-sm-flex">
              <div className="avatar avatar-md flex-shrink-0">
                <div className="avatar-img rounded-circle bg-purple bg-opacity-10">
                  <span className="text-purple position-absolute top-50 start-50 translate-middle fw-bold">DB</span>
                </div>
              </div>
              <div className="ms-2">
                <h6 className="mb-0"><a href="#" className="stretched-link">Dennis Barrett</a></h6>
                <p className="mb-0">Comment from Billy Vasquez on ticket #659</p>
                <span className="small">8 hour ago</span>
              </div>
            </div>
          </div>

          <hr />

          {/* Ticket item */}
          <div className="d-flex justify-content-between position-relative">
            <div className="d-sm-flex">
              <div className="avatar avatar-md flex-shrink-0">
                <div className="avatar-img rounded-circle bg-orange bg-opacity-10">
                  <span className="text-orange position-absolute top-50 start-50 translate-middle fw-bold">WB</span>
                </div>
              </div>
              <div className="ms-2">
                <h6 className="mb-0"><a href="#" className="stretched-link">Dennis Barrett</a></h6>
                <p className="mb-0"><b>Webestica</b> assign you a new ticket for <b>Eduport theme</b></p>
                <span className="small">5 hour ago</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    {/* Ticket END */}
  </div>
  {/* Chart and Ticket END */}
</div>

        </AdminLayout>
        
    );
}
export default dashboard;