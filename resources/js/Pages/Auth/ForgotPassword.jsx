import React from 'react';

const ForgotPassword = () => {
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
                        <div className="col-12 col-lg-6 d-flex justify-content-center">
                            <div className="row my-5">
                                <div className="col-sm-10 col-xl-12 m-auto">
                                    <span className="mb-0 fs-1">🤔</span>
                                    <h1 className="fs-2">Quên Mật Khẩu?</h1>
                                    <h5 className="fw-light mb-4">
                                        Để nhận mật khẩu mới, hãy nhập địa chỉ email của bạn bên dưới.
                                    </h5>
                                    <form>
                                        <div className="mb-4">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email address *</label>
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
                                        <div className="align-items-center">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="button">
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

export default ForgotPassword;