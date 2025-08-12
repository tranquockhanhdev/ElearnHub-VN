import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from "@/Components/Layouts/AdminLayout";
import {
    MagnifyingGlassIcon,
    EyeIcon,
    ClockIcon,
    DocumentTextIcon,
    VideoCameraIcon,
    AcademicCapIcon,
    UserIcon,
    CalendarDaysIcon,
    ChevronUpDownIcon,
    FunnelIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const CourseApprovalIndex = () => {
    const { courses, instructors, filters, stats } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [instructor, setInstructor] = useState(filters.instructor || '');
    const [changeType, setChangeType] = useState(filters.change_type || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Load saved filter preferences
    useEffect(() => {
        const savedFilters = localStorage.getItem('courseApprovalFilters');
        if (savedFilters) {
            const parsed = JSON.parse(savedFilters);
            setShowAdvancedFilters(parsed.showAdvancedFilters || false);
        }
    }, []);

    // Save filter preferences
    useEffect(() => {
        const filterPreferences = {
            showAdvancedFilters,
        };
        localStorage.setItem('courseApprovalFilters', JSON.stringify(filterPreferences));
    }, [showAdvancedFilters]);

    const getCourseImageUrl = (imgUrl) => {
        if (!imgUrl) return 'https://placehold.co/600x400/EEE/31343C';
        if (imgUrl.startsWith('http')) return imgUrl;
        return `/storage/${imgUrl}`;
    };
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.course-approvals.index'), {
            search,
            instructor,
            change_type: changeType,
            date_from: dateFrom,
            date_to: dateTo,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSort = (field) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(newOrder);

        router.get(route('admin.course-approvals.index'), {
            search,
            instructor,
            change_type: changeType,
            date_from: dateFrom,
            date_to: dateTo,
            sort_by: field,
            sort_order: newOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setInstructor('');
        setChangeType('');
        setDateFrom('');
        setDateTo('');
        setSortBy('created_at');
        setSortOrder('desc');

        router.get(route('admin.course-approvals.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />;
        return sortOrder === 'asc' ?
            <ChevronUpDownIcon className="w-4 h-4 text-blue-600 transform rotate-180" /> :
            <ChevronUpDownIcon className="w-4 h-4 text-blue-600" />;
    };

    const getStatusBadge = (count, type) => {
        if (count === 0) return null;

        const config = {
            content: {
                bg: 'bg-amber-100',
                text: 'text-amber-800',
                icon: DocumentTextIcon,
                label: 'thay đổi nội dung'
            },
            resource: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                icon: VideoCameraIcon,
                label: 'tài nguyên chờ duyệt'
            }
        };

        const { bg, text, icon: Icon } = config[type];

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
                <Icon className="w-4 h-4 mr-1.5" />
                {count}
            </span>
        );
    };

    // Component để hiển thị filter tags
    const getActiveFilters = () => {
        const filters = [];
        if (search) filters.push({ key: 'search', label: `Tìm kiếm: "${search}"`, value: search });
        if (instructor) {
            const instructorName = instructors?.find(i => i.id == instructor)?.name;
            filters.push({ key: 'instructor', label: `Giảng viên: ${instructorName}`, value: instructor });
        }
        if (changeType) {
            const typeLabels = {
                content: 'Thay đổi nội dung',
                resource: 'Tài nguyên'
            };
            filters.push({ key: 'changeType', label: `Loại: ${typeLabels[changeType]}`, value: changeType });
        }
        if (dateFrom) filters.push({ key: 'dateFrom', label: `Từ: ${dateFrom}`, value: dateFrom });
        if (dateTo) filters.push({ key: 'dateTo', label: `Đến: ${dateTo}`, value: dateTo });
        return filters;
    };

    const removeFilter = (filterKey) => {
        const updates = { [filterKey]: '' };
        if (filterKey === 'search') setSearch('');
        if (filterKey === 'instructor') setInstructor('');
        if (filterKey === 'changeType') setChangeType('');
        if (filterKey === 'dateFrom') setDateFrom('');
        if (filterKey === 'dateTo') setDateTo('');

        router.get(route('admin.course-approvals.index'), {
            search: filterKey === 'search' ? '' : search,
            instructor: filterKey === 'instructor' ? '' : instructor,
            change_type: filterKey === 'changeType' ? '' : changeType,
            date_from: filterKey === 'dateFrom' ? '' : dateFrom,
            date_to: filterKey === 'dateTo' ? '' : dateTo,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Auto-submit when filters change
    const handleFilterChange = (key, value) => {
        const updatedFilters = {
            search,
            instructor,
            change_type: changeType,
            date_from: dateFrom,
            date_to: dateTo,
            sort_by: sortBy,
            sort_order: sortOrder,
            [key]: value
        };

        router.get(route('admin.course-approvals.index'), updatedFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Phê duyệt cập nhật khóa họct" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <AcademicCapIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                                        Phê duyệt cập nhật khóa học
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Quản lý các yêu cầu chỉnh sửa khóa học từ giảng viên
                                    </p>
                                </div>
                                <div className="hidden sm:flex items-center space-x-4">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-600">{stats?.total || 0}</div>
                                        <div className="text-xs text-gray-500">Tổng yêu cầu</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-amber-600">{stats?.content_changes || 0}</div>
                                        <div className="text-xs text-gray-500">Thay đổi nội dung</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-600">{stats?.resource_changes || 0}</div>
                                        <div className="text-xs text-gray-500">Tài nguyên</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white rounded-xl shadow-sm border mb-4">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <FunnelIcon className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Tìm kiếm & Lọc</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                    <span>Bộ lọc nâng cao</span>
                                    {showAdvancedFilters ?
                                        <ChevronUpIcon className="w-4 h-4" /> :
                                        <ChevronDownIcon className="w-4 h-4" />
                                    }
                                </button>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-4">
                                {/* Basic Search */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm theo tên khóa học, giảng viên..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-9 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                                        >
                                            Tìm kiếm
                                        </button>
                                        {(search || instructor || changeType || dateFrom || dateTo) && (
                                            <button
                                                type="button"
                                                onClick={handleClearFilters}
                                                className="px-3 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Advanced Filters */}
                                {showAdvancedFilters && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                                        {/* Instructor Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Giảng viên
                                            </label>
                                            <select
                                                value={instructor}
                                                onChange={(e) => {
                                                    setInstructor(e.target.value);
                                                    handleFilterChange('instructor', e.target.value);
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Tất cả giảng viên</option>
                                                {instructors?.map((inst) => (
                                                    <option key={inst.id} value={inst.id}>
                                                        {inst.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Change Type Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Loại thay đổi
                                            </label>
                                            <select
                                                value={changeType}
                                                onChange={(e) => {
                                                    setChangeType(e.target.value);
                                                    handleFilterChange('change_type', e.target.value);
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Tất cả</option>
                                                <option value="content">Chỉ thay đổi nội dung</option>
                                                <option value="resource">Chỉ tài nguyên</option>
                                            </select>
                                        </div>

                                        {/* Date From */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Từ ngày
                                            </label>
                                            <input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => {
                                                    setDateFrom(e.target.value);
                                                    handleFilterChange('date_from', e.target.value);
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Date To */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Đến ngày
                                            </label>
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => {
                                                    setDateTo(e.target.value);
                                                    handleFilterChange('date_to', e.target.value);
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>

                            {/* Active Filters - New Component */}
                            <div className="mt-4">
                                {getActiveFilters().length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {getActiveFilters().map((filter) => (
                                            <div key={filter.key} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
                                                <span>{filter.label}</span>
                                                <button
                                                    onClick={() => removeFilter(filter.key)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="bg-white rounded-xl shadow-sm border mb-4">
                        <div className="p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-sm font-medium text-gray-700">Lọc nhanh:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        setChangeType('content');
                                        router.get(route('admin.course-approvals.index'), {
                                            ...filters,
                                            change_type: 'content',
                                        }, {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true
                                        });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${changeType === 'content'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    <DocumentTextIcon className="w-4 h-4 inline mr-1.5" />
                                    Thay đổi nội dung ({stats?.content_changes || 0})
                                </button>
                                <button
                                    onClick={() => {
                                        setChangeType('resource');
                                        router.get(route('admin.course-approvals.index'), {
                                            ...filters,
                                            change_type: 'resource',
                                        }, {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true
                                        });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${changeType === 'resource'
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    <VideoCameraIcon className="w-4 h-4 inline mr-1.5" />
                                    Tài nguyên mới ({stats?.resource_changes || 0})
                                </button>
                                <button
                                    onClick={() => {
                                        setDateFrom(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
                                        router.get(route('admin.course-approvals.index'), {
                                            ...filters,
                                            date_from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
                                        }, {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true
                                        });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateFrom === new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    <CalendarDaysIcon className="w-4 h-4 inline mr-1.5" />
                                    7 ngày qua
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {getActiveFilters().length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border mb-4">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Xóa tất cả
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getActiveFilters().map((filter) => (
                                        <span
                                            key={filter.key}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {filter.label}
                                            <button
                                                onClick={() => removeFilter(filter.key)}
                                                className="ml-1.5 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="bg-white rounded-xl shadow-sm border mb-4">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-600">
                                        Hiển thị <span className="font-medium text-gray-900">{courses.from || 0}</span> -
                                        <span className="font-medium text-gray-900">{courses.to || 0}</span>
                                        trong tổng số <span className="font-medium text-gray-900">{courses.total || 0}</span> kết quả
                                    </div>
                                    {getActiveFilters().length > 0 && (
                                        <div className="text-sm text-blue-600">
                                            ({getActiveFilters().length} bộ lọc đang áp dụng)
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                                    <select
                                        value={`${sortBy}-${sortOrder}`}
                                        onChange={(e) => {
                                            const [field, order] = e.target.value.split('-');
                                            setSortBy(field);
                                            setSortOrder(order);

                                            router.get(route('admin.course-approvals.index'), {
                                                search,
                                                instructor,
                                                change_type: changeType,
                                                date_from: dateFrom,
                                                date_to: dateTo,
                                                sort_by: field,
                                                sort_order: order,
                                            }, {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            });
                                        }}
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="created_at-desc">Mới nhất</option>
                                        <option value="created_at-asc">Cũ nhất</option>
                                        <option value="title-asc">Tên A-Z</option>
                                        <option value="title-desc">Tên Z-A</option>
                                        <option value="instructor.name-asc">Giảng viên A-Z</option>
                                        <option value="instructor.name-desc">Giảng viên Z-A</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Cards */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {courses.data.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                    <ClockIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Không có khóa học nào chờ phê duyệt
                                </h3>
                                <p className="text-gray-500">
                                    Tất cả các yêu cầu đã được xử lý hoặc chưa có yêu cầu mới.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header - Hidden on mobile */}
                                <div className="hidden lg:block bg-gray-50 border-b">
                                    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div
                                            className="col-span-4 flex items-center cursor-pointer hover:text-gray-700 transition-colors"
                                            onClick={() => handleSort('title')}
                                        >
                                            <span>Khóa học</span>
                                            <span className="ml-2">{getSortIcon('title')}</span>
                                        </div>
                                        <div
                                            className="col-span-2 flex items-center cursor-pointer hover:text-gray-700 transition-colors"
                                            onClick={() => handleSort('instructor.name')}
                                        >
                                            <span>Giảng viên</span>
                                            <span className="ml-2">{getSortIcon('instructor.name')}</span>
                                        </div>
                                        <div className="col-span-2 text-center">Thay đổi</div>
                                        <div className="col-span-2 text-center">Tài nguyên</div>
                                        <div
                                            className="col-span-1 flex items-center cursor-pointer hover:text-gray-700 transition-colors"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            <span>Ngày gửi</span>
                                            <span className="ml-1">{getSortIcon('created_at')}</span>
                                        </div>
                                        <div className="col-span-1 text-center">Hành động</div>
                                    </div>
                                </div>

                                {/* Course List */}
                                <div className="divide-y divide-gray-200">
                                    {courses.data.map((course) => (
                                        <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            {/* Mobile Layout */}
                                            <div className="lg:hidden">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0">
                                                        {course.img_url ? (
                                                            <img
                                                                className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                                                src={getCourseImageUrl(course.img_url)}
                                                                alt={course.title}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-sm">
                                                                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                            {course.title}
                                                        </h3>
                                                        <div className="flex items-center text-sm text-gray-600 mb-1">
                                                            <UserIcon className="w-4 h-4 mr-1" />
                                                            {course.instructor?.name}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                                            <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                                            {course.latest_edit_date ? formatDate(course.latest_edit_date) : 'Chưa có thay đổi'}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {getStatusBadge(course.pending_content_changes, 'content')}
                                                            {getStatusBadge(course.pending_resource_changes, 'resource')}
                                                        </div>
                                                        <Link
                                                            href={route('admin.course-approvals.show', course.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                                                        >
                                                            <EyeIcon className="w-4 h-4 mr-1.5" />
                                                            Xem chi tiết
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop Layout */}
                                            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                                                <div className="col-span-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            {course.img_url ? (
                                                                <img
                                                                    className="w-10 h-10 rounded-lg object-cover shadow-sm"
                                                                    src={getCourseImageUrl(course.img_url)}
                                                                    alt={course.title}
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-sm">
                                                                    <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                                {course.title}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">
                                                                ID: {course.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-sm text-gray-900">{course.instructor?.name}</div>
                                                    <div className="text-xs text-gray-500">ID: {course.instructor?.id}</div>
                                                </div>
                                                <div className="col-span-2 text-center">
                                                    {getStatusBadge(course.pending_content_changes, 'content')}
                                                </div>
                                                <div className="col-span-2 text-center">
                                                    {getStatusBadge(course.pending_resource_changes, 'resource')}
                                                </div>
                                                <div className="col-span-1 text-sm text-gray-500">
                                                    {course.latest_edit_date ? formatDate(course.latest_edit_date) : 'N/A'}
                                                </div>
                                                <div className="col-span-1 text-center">
                                                    <Link
                                                        href={route('admin.course-approvals.show', course.id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                                                    >
                                                        <EyeIcon className="w-3 h-3 mr-1" />
                                                        Xem
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        {courses.links && courses.links.length > 3 && (
                            <div className="bg-gray-50 px-4 py-3 border-t">
                                <nav className="flex items-center justify-between">
                                    <div className="flex justify-between flex-1 sm:hidden">
                                        {courses.prev_page_url && (
                                            <Link
                                                href={courses.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                Trước
                                            </Link>
                                        )}
                                        {courses.next_page_url && (
                                            <Link
                                                href={courses.next_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                Sau
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Hiển thị{' '}
                                                <span className="font-medium">{courses.from}</span>
                                                {' '}đến{' '}
                                                <span className="font-medium">{courses.to}</span>
                                                {' '}trong{' '}
                                                <span className="font-medium">{courses.total}</span>
                                                {' '}kết quả
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                                                {courses.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            } ${index === 0 ? 'rounded-l-lg' : ''
                                                            } ${index === courses.links.length - 1 ? 'rounded-r-lg' : ''
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CourseApprovalIndex;
