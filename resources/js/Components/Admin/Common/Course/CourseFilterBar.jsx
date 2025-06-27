import React from "react";
import { route } from "ziggy-js";
import { router } from "@inertiajs/react";

const CourseFilterBar = ({
    filters,
    setFilters,
    onSearch,
    categories,
    instructors,
    activeTab,
}) => {
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleClear = () => {
        const cleared = {
            search: "",
            category: "",
            status: "",
            instructor: "",
            sort_by: "created_at",
            sort_order: "desc",
            tab: activeTab,
            page: 1,
        };
        setFilters(cleared);

        router.get(route("admin.admin-course"), cleared, {
            preserveState: false,
        });
    };

    return (
        <form onSubmit={onSearch} className="row g-3 mb-4">
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tiêu đề"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                />
            </div>

            <div className="col-md-2">
                <select
                    name="category"
                    className="form-select"
                    value={filters.category}
                    onChange={handleChange}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-2">
                <select
                    name="instructor"
                    className="form-select"
                    value={filters.instructor}
                    onChange={handleChange}
                >
                    <option value="">Tất cả giảng viên</option>
                    {instructors.map((ins) => (
                        <option key={ins.id} value={ins.id}>
                            {ins.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-2">
                <select
                    name="status"
                    className="form-select"
                    value={filters.status}
                    onChange={handleChange}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="inactive">Ngưng hoạt động</option>
                </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100">
                    <i className="bi bi-search"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={handleClear}
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <div className="col-md-2">
                <select
                    name="sort_by"
                    className="form-select"
                    value={filters.sort_by}
                    onChange={handleChange}
                >
                    <option value="created_at">Ngày tạo</option>
                    <option value="title">Tiêu đề</option>
                </select>
            </div>

            <div className="col-md-2">
                <select
                    name="sort_order"
                    className="form-select"
                    value={filters.sort_order}
                    onChange={handleChange}
                >
                    <option value="desc">Giảm dần</option>
                    <option value="asc">Tăng dần</option>
                </select>
            </div>
        </form>
    );
};

export default CourseFilterBar;
