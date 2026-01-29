import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();

    return (
        <div className={`admin-sidebar ${isOpen ? 'show' : ''}`}>
            <div className="sidebar-header">
                <div className="d-flex align-items-center gap-2">
                    <img src="/blog.png" alt="Blog Vector" className="sidebar-logo" />
                    <span className="sidebar-brand">BlogSphere Admin</span>
                </div>
                <button
                    className="btn btn-link text-primary p-0 d-lg-none ms-auto"
                    onClick={toggleSidebar}
                    style={{ fontSize: '1.5rem', textDecoration: 'none' }}
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => window.innerWidth < 992 && toggleSidebar()}
                >
                    <i className="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => window.innerWidth < 992 && toggleSidebar()}
                >
                    <i className="bi bi-people"></i>
                    <span>Manage Users</span>
                </NavLink>
                <NavLink
                    to="/posts"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => window.innerWidth < 992 && toggleSidebar()}
                >
                    <i className="bi bi-file-earmark-text"></i>
                    <span>Manage Posts</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout-btn" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
