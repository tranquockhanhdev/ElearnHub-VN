import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../Components/Layouts/AdminLayout';

const dashboard = () => {
    const { auth } = usePage().props;

    return (
        <AdminLayout>
            <div className="container">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                {auth.user ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p><strong>ID:</strong> {auth.user.id}</p>
                        <p><strong>Name:</strong> {auth.user.name}</p>
                        <p><strong>Email:</strong> {auth.user.email}</p>
                        <p><strong>Role:</strong> {auth.user.role === 1 ? 'Admin' : 'Unknown'}</p>
                    </div>
                ) : (
                    <p className="text-red-500">No user information available.</p>
                )}
            </div>
        </AdminLayout>
        
    );
}
export default dashboard;