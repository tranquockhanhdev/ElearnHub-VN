import React from 'react';

const Login = () => {
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
                                    <p className="mb-0 h6 fw-light">Hãy cùng học điều gì đó mới mẻ ngay hôm nay!</p>
                                </div>
                                <img src="/assets/images/element/02.svg" className="mt-5" alt="" />
                            </div>
                        </div>
                        {/* Right */}
                        <div className="col-12 col-lg-6 m-auto">
                            <div className="row my-5">
                                <div className="col-sm-10 col-xl-8 m-auto">
                                    <span className="mb-0 fs-1">👋</span>
                                    <h1 className="fs-2">ĐĂNG NHẬP!</h1>
                                    <p className="lead mb-4">Rất vui được gặp bạn! Vui lòng đăng nhập bằng tài khoản của bạn.</p>
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
                                                    placeholder="password"
                                                    id="inputPassword5"
                                                />
                                            </div>
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
                                                <a href="/forgot-password" className="text-secondary">
                                                    <u>Quên mật khẩu?</u>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="align-items-center mt-0">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="button">
                                                    Đăng Nhập
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="mt-4 text-center">
                                        <span>
                                            Bạn chưa có tài khoản? <a href="/sign-up">Đăng ký tại đây</a>
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