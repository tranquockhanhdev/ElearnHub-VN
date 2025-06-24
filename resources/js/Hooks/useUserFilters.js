// hooks/useUserFilters.js
import { useState } from "react";

export default function useUserFilters() {
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        status: "",
        sort: "",
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            name: "",
            email: "",
            status: "",
            sort: "",
        });
    };

    return { filters, setFilters, handleChange, clearFilters };
}
