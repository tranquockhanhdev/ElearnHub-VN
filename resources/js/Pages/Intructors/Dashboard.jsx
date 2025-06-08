import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const dashboard = () => {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Intructor Dashboard</h1>
            {auth.user ? (
                <div className="text-lg">
                    <p><strong>ID:</strong> {auth.user.id}</p>
                    <p><strong>Name:</strong> {auth.user.name}</p>
                    <p><strong>Email:</strong> {auth.user.email}</p>
                    <p><strong>Role:</strong> {auth.user.role === 2 ? 'Intructor' : 'Unknown'}</p>
                </div>
            ) : (
                <p className="text-red-500">No user information available.</p>
            )}
        </div>
    );
}
export default dashboard;