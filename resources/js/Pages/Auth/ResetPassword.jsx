import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const ResetPassword = () => {
    const { errors, flash_success, flash_error } = usePage().props;

    // Lấy token và email từ URL
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromUrl = queryParams.get('email');
    const tokenFromUrl = window.location.pathname.split('/').pop();

    const [values, setValues] = useState({
        email: emailFromUrl || '',
        password: '',
        password_confirmation: '',
        token: tokenFromUrl || '',
    });

    function handleChange(e) {
        const { id, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        router.post(route('password.update'), values);
    }

    return (
        <main>
            {flash_error && <div className="alert alert-danger">{flash_error}</div>}
            {flash_success && <div className="alert alert-success">{flash_success}</div>}

            <section className="p-0 d-flex align-items-center position-relative overflow-hidden">
                <div className="container-fluid">
                    <div className="row">
                        {/* Left */}
                        <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
                            <div className="p-3 p-lg-5">
                                <div className="text-center">
                                    <h2 className="fw-bold">Đặt lại mật khẩu</h2>
                                    <p className="mb-0 h6 fw-light">Nhập thông tin bên dưới để đặt lại mật khẩu của bạn.</p>
                                </div>
                                <img src="/assets/images/element/02.svg" className="mt-5" alt="" />
                            </div>
                        </div>
                        {/* Right */}
                        <div className="col-12 col-lg-6 d-flex justify-content-center">
                            <div className="row my-5">
                                <div className="col-sm-10 col-xl-12 m-auto">
                                    <h1 className="fs-2">Đặt lại mật khẩu</h1>
                                    <form onSubmit={handleSubmit}>
                                        {/* Email */}
                                        <div className="mb-4">
                                            <label htmlFor="email" className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                placeholder="Nhập email của bạn"
                                                autoComplete="email"
                                                readOnly // Email không thể chỉnh sửa
                                            />
                                            {errors.email && <div className="text-red-600">{errors.email}</div>}
                                        </div>

                                        {/* Password */}
                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label">Mật khẩu mới *</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                placeholder="Nhập mật khẩu mới"
                                                autoComplete="new-password"
                                            />
                                            {errors.password && <div className="text-red-600">{errors.password}</div>}
                                        </div>

                                        {/* Password Confirmation */}
                                        <div className="mb-4">
                                            <label htmlFor="password_confirmation" className="form-label">Xác nhận mật khẩu *</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                value={values.password_confirmation}
                                                onChange={handleChange}
                                                placeholder="Nhập lại mật khẩu"
                                                autoComplete="new-password"
                                            />
                                            {errors.password_confirmation && (
                                                <div className="text-red-600">{errors.password_confirmation}</div>
                                            )}
                                        </div>

                                        {/* Hidden Token */}
                                        <input
                                            type="hidden"
                                            id="token"
                                            name="token"
                                            value={values.token}
                                            onChange={handleChange}
                                        />

                                        {/* Submit Button */}
                                        <div className="align-items-center">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="submit">
                                                    Đặt lại mật khẩu
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ResetPassword;