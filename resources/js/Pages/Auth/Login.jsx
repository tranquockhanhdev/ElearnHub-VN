import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
const Login = () => {
    const { errors, flash_success, flash_error } = usePage().props

    const [values, setValues] = useState({
        email: '',
        password: '',
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
        router.post(route('login.store'), values);
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
                            <div className="p-3 p-lg-5 text-center">
                                <h2 className="fw-bold mb-3">
                                    Chào mừng đến với <span className="text-primary">K-Edu</span> – cộng đồng tri thức!
                                </h2>
                                <p className="h6 fw-light mb-4">
                                    Từ thời tối cổ cũng muốn học lập trình. Còn bạn thì sao?
                                </p>

                                <div className="d-flex justify-content-center">
                                    <img
                                        src="https://i.ibb.co/tTQcZh01/Chat-GPT-Image-14-08-47-19-thg-6-2025.png"
                                        alt="Người tối cổ học lập trình"
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxWidth: '400px' }}
                                    />
                                </div>
                            </div>

                        </div>
                        {/* Right */}
                        <div className="col-12 col-lg-6 m-auto">
                            <div className="row my-5">
                                <div className="col-sm-10 col-xl-8 m-auto">
                                    <span className="mb-0 fs-1">👋</span>
                                    <h1 className="fs-2">ĐĂNG NHẬP!</h1>
                                    <p className="lead mb-4">Rất vui được gặp bạn! Vui lòng đăng nhập bằng tài khoản của bạn.</p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="form-label">Email *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                                    <i className="bi bi-envelope-fill"></i>
                                                </span>
                                                <input
                                                    type="email"
                                                    className="form-control border-0 bg-light rounded-end ps-1"
                                                    placeholder="E-mail"
                                                    name="email"
                                                    id="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    autocomplete="email"
                                                />
                                            </div>
                                            {errors.email && <div className='text-red-600'>{errors.email}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="inputPassword5" className="form-label">Mật khẩu *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className="form-control border-0 bg-light rounded-end ps-1"
                                                    placeholder="password"
                                                    id="password"
                                                    name="password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    autocomplete="current-password"
                                                />
                                            </div>
                                            {errors.password && <div className='text-red-600'>{errors.password}</div>}
                                            <div id="passwordHelpBlock" className="form-text">
                                                Mật khẩu của bạn phải có ít nhất 8 ký tự
                                            </div>
                                        </div>
                                        <div className="mb-4 d-flex justify-content-between">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                                <label className="form-check-label" htmlFor="exampleCheck1">
                                                    Ghi nhớ đăng nhập
                                                </label>
                                            </div>
                                            <div className="text-primary-hover">
                                                <Link href={route('forgot-password')} className="text-secondary">
                                                    <u>Quên mật khẩu?</u>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="align-items-center mt-0">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="submit">
                                                    Đăng Nhập
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="mt-4 text-center">
                                        <span>
                                            Bạn chưa có tài khoản? <Link href={route('register')}>Đăng ký tại đây</Link>
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

export default Login;