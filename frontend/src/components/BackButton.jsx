import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === "/") {
        return null;
    }

    return (
        <button
            className="btn btn-link text-decoration-none p-0 mb-3 d-inline-flex align-items-center"
            onClick={() => navigate(-1)}
            style={{ color: "var(--text-color)" }}
        >
            <i className="bi bi-arrow-left fs-5 me-2"></i>
            <span className="fw-semibold">Back</span>
        </button>
    );
};

export default BackButton;
