import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

const Register = () => {
    return (
        <main>
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
                        <div className="col-12 col-lg-6 m-auto">
                            <div className="row my-5">
                                <div className="col-sm-10 col-xl-8 m-auto">
                                    <img src="/assets/images/element/03.svg" className="h-40px mb-2" alt="" />
                                    <h2>Đăng ký tài khoản của bạn!</h2>
                                    <p className="lead mb-4">Rất vui được gặp bạn! Vui lòng đăng ký bằng tài khoản của bạn.</p>
                                    <form>
                                        <div className="mb-4">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                                    <i className="bi bi-envelope-fill"></i>
                                                </span>
                                                <input
                                                    type="email"
                                                    className="form-control border-0 bg-light rounded-end ps-1"
                                                    placeholder="E-mail"
                                                    id="exampleInputEmail1"
                                                />
                                            </div>
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
                                                    placeholder="*********"
                                                    id="inputPassword5"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="inputPassword6" className="form-label">Xác nhận mật khẩu *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className="form-control border-0 bg-light rounded-end ps-1"
                                                    placeholder="*********"
                                                    id="inputPassword6"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="checkbox-1" />
                                                <label className="form-check-label" htmlFor="checkbox-1">
                                                    Bằng cách đăng ký, bạn đồng ý với các <a href="#">điều khoản dịch vụ</a>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="align-items-center mt-0">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="button">
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