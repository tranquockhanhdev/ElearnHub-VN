import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const ForgotPassword = () => {
    const { errors, flash_success, flash_error } = usePage().props;

    const [values, setValues] = useState({
        email: '',
    });

    const [countdown, setCountdown] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    function handleChange(e) {
        const { id, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        router.post(route('forgot-password.store'), values);
        setCountdown(30);
        setIsDisabled(true);
    }

    function handleResend() {
        router.post(route('forgot-password.store'), values);
        setCountdown(30);
        setIsDisabled(true);
    }

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [countdown]);

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
                                    Quên thì sao? <span className="text-primary">Lấy lại mật khẩu</span> ngay!
                                </h2>
                                <p className="mb-4 h6 fw-light">
                                    Không sao cả – ai rồi cũng có lúc quên. Chúng tôi sẽ giúp bạn khôi phục nhanh chóng.
                                </p>

                                <div className="d-flex justify-content-center border-r-amber-300">
                                    <img
                                        src="https://i.ibb.co/nsfN5Hbk/Chat-GPT-Image-14-16-00-19-thg-6-2025.png"
                                        alt="Quên mật khẩu - quyết tâm khôi phục"
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxWidth: '420px' }}
                                    />
                                </div>
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
                                    <form onSubmit={handleSubmit}>
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
                                                    name="email"
                                                    id="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    autoComplete="email"
                                                    required
                                                />
                                            </div>
                                            {errors.email && <div className="text-red-600">{errors.email}</div>}
                                            {countdown > 0 && (
                                                <div className="text-red-500 mt-2">
                                                    Vui lòng chờ {countdown} giây...
                                                </div>
                                            )}
                                        </div>
                                        <div className="align-items-center">
                                            <div className="d-grid">
                                                <button
                                                    className="btn btn-primary mb-0"
                                                    type="submit"
                                                    disabled={isDisabled}
                                                >
                                                    Đặt lại mật khẩu
                                                </button>
                                            </div>
                                            {countdown === 0 && (
                                                <div className="mt-3 text-center">
                                                    <button
                                                        className="btn btn-link text-primary p-0"
                                                        type="button"
                                                        onClick={handleResend}
                                                    >
                                                        Không thấy mã? Nhấn gửi lại
                                                    </button>
                                                </div>
                                            )}
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