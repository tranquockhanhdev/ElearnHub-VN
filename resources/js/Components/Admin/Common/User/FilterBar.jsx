import React from "react";

const FilterBar = ({ filters, onChange, onSearch, onClear }) => {
    return (
        <form onSubmit={onSearch} className="row gy-3 gx-3">
            <div className="col-lg-3">
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Tên học viên"
                    value={filters.name}
                    onChange={onChange}
                />
            </div>
            <div className="col-lg-3">
                <input
                    type="text"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={filters.email}
                    onChange={onChange}
                />
            </div>
            <div className="col-lg-2">
                <select
                    name="status"
                    className="form-select"
                    value={filters.status}
                    onChange={onChange}
                >
                    <option value="">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Vô hiệu</option>
                    <option value="suspended">Tạm khóa</option>
                </select>
            </div>
            <div className="col-lg-2">
                <select
                    name="sort"
                    className="form-select"
                    value={filters.sort}
                    onChange={onChange}
                >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="az">Tên A-Z</option>
                    <option value="za">Tên Z-A</option>
                </select>
            </div>
            <div className="col-lg-2 d-flex gap-2">
                <button
                    className="btn btn-primary w-100"
                    type="submit"
                    title="Tìm kiếm"
                >
                    <i className="fas fa-search"></i>
                </button>
                <button
                    className="btn btn-outline-secondary w-100"
                    type="button"
                    onClick={onClear}
                    title="Đặt lại bộ lọc"
                >
                    <i className="fas fa-sync-alt"></i>
                </button>
            </div>
        </form>
    );
};

export default FilterBar;
