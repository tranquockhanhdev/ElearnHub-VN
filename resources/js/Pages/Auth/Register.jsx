import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const Register = () => {
    const { errors, flash_success, flash_error } = usePage().props

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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
        router.post(route('register.store'), values);
    }

    return (
        <main>
            {flash_success && <div className="alert alert-success">{flash_success}</div>}
            {flash_error && <div className="alert alert-danger">{flash_error}</div>}
            <section className="p-0 d-flex align-items-center position-relative overflow-hidden">
                <div className="container-fluid">
                    <div className="row">
                        {/* Left */}
                        <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
                            <div className="p-3 p-lg-5">
                                <div className="text-center">
                                    <h2 className="fw-bold">Chào mừng đến với cộng đồng lớn nhất của chúng tôi</h2>
                                    <p className="mb-0 h6 fw-light">Chỉ vài bước để mở khóa kho tàng kiến thức!</p>
                                </div>
                                <img src="/assets/images/element/02.svg" className="mt-5" alt="" />
                            </div>
                        </div>
                        {/* Right */}
                        <div className="col-12 col-lg-6 m-auto " >
                            <div className="row my-5" >
                                <div className="col-sm-10 col-xl-8 m-auto" >
                                    <img src="/assets/images/element/03.svg" className="h-40px mb-2" alt="" />
                                    <h2>Đăng ký tài khoản của bạn!</h2>
                                    <p className="lead mb-4">Rất vui được gặp bạn! Vui lòng đăng ký bằng tài khoản của bạn.</p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="name" className="form-label">Họ và tên *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                autoComplete="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                placeholder="Nhập họ và tên của bạn"
                                            />
                                            {errors.name && <div className='text-red-600'>{errors.name}</div>}
                                        </div>
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
                                            />
                                            {errors.email && <div className='text-red-600'>{errors.email}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label">Mật khẩu *</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                placeholder="Nhập mật khẩu"
                                                autoComplete="new-password"
                                            />
                                            {errors.password && <div className='text-red-600'>{errors.password}</div>}
                                        </div>
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
                                            {errors.password_confirmation && <div className='text-red-600'>{errors.password_confirmation}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="checkbox-1" required />
                                                <label className="form-check-label" htmlFor="checkbox-1">
                                                    Bằng cách đăng ký, bạn đồng ý với các <a href="#">điều khoản dịch vụ</a>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="align-items-center mt-0">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="submit">
                                                    Đăng Ký
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="mt-4 text-center">
                                        <span>
                                            Đã có tài khoản?<Link href={route('login')}> Đăng nhập tại đây</Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Register;