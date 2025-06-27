import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ links, className = '' }) => {
    if (!links || links.length <= 3) return null;

    return (
        <nav className={`d-flex justify-content-center ${className}`}>
            <ul className="pagination pagination-sm mb-0">
                {links.map((link, index) => (
                    <li 
                        key={index} 
                        className={`page-item ${!link.url ? 'disabled' : ''} ${link.active ? 'active' : ''}`}
                    >
                        {link.url ? (
                            <Link
                                href={link.url}
                                className="page-link"
                                preserveState
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span 
                                className="page-link" 
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;