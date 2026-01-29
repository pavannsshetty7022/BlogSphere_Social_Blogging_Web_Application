import React, { useEffect, useState } from "react";
import { fetchAllUsers, updateUserStatus } from "../services/adminApi";
import { formatDistanceToNow } from "date-fns";
import usePageTitle from "../hooks/usePageTitle";

const ManageUsers = () => {
    usePageTitle("Manage Users");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data } = await fetchAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setShowSkeleton(false);
            }, 1000);
        }
    };

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);

    const handleToggleStatus = (userId, currentStatus) => {
        const user = users.find(u => u._id === userId);
        if (user) {
            setUserToToggle(user);
            setShowBlockModal(true);
        }
    };

    const confirmToggleStatus = async () => {
        if (!userToToggle) return;

        const newStatus = userToToggle.status === "active" ? "blocked" : "active";

        try {
            await updateUserStatus(userToToggle._id, newStatus);
            setUsers(users.map(u => u._id === userToToggle._id ? { ...u, status: newStatus } : u));
            setShowBlockModal(false);
            setUserToToggle(null);
        } catch (error) {
            alert("Failed to update user status");
        }
    };

    const filteredUsers = users.filter(user => {
        const userName = (user.name || "").toLowerCase();
        const userEmail = (user.email || "").toLowerCase();
        const userUsername = (user.username || "").toLowerCase();
        const term = (searchTerm || "").toLowerCase();

        const matchesSearch =
            userName.includes(term) ||
            userEmail.includes(term) ||
            userUsername.includes(term);

        const matchesFilter = filterStatus === "all" || user.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    if (showSkeleton) {
        return (
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="placeholder-glow w-50">
                        <span className="placeholder col-4 placeholder-lg"></span>
                    </div>
                    <div className="placeholder-glow w-25">
                        <span className="placeholder col-6"></span>
                    </div>
                </div>

                <div className="card border-0 shadow-sm p-3 mb-4 glass">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <div className="placeholder-glow">
                                <span className="placeholder col-12" style={{ height: "38px" }}></span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="placeholder-glow">
                                <span className="placeholder col-12" style={{ height: "38px" }}></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-container shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle me-3 placeholder-glow"
                                                    style={{ width: "40px", height: "40px" }}
                                                >
                                                    <span className="placeholder rounded-circle w-100 h-100"></span>
                                                </div>
                                                <div className="w-75">
                                                    <div className="placeholder-glow mb-1">
                                                        <span className="placeholder col-8"></span>
                                                    </div>
                                                    <div className="placeholder-glow">
                                                        <span className="placeholder col-5"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-7"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-4 rounded-pill"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-6"></span>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="placeholder-glow d-inline-block" style={{ width: "90px" }}>
                                                <span className="placeholder col-12" style={{ height: "30px" }}></span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                </div>
                <div className="page-meta">Total: {users.length} Users</div>
            </div>

            <div className="filter-card">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, email, or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="bg-primary bg-opacity-10 text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold"
                                                style={{ width: "40px", height: "40px", fontSize: "0.9rem", flexShrink: 0 }}
                                            >
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt="" className="w-100 h-100 rounded-circle object-fit-cover" />
                                                ) : (
                                                    user.name?.charAt(0)?.toUpperCase() || 'U'
                                                )}
                                            </div>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: "0.9375rem" }}>{user.name}</div>
                                                <div className="text-muted" style={{ fontSize: "0.8125rem" }}>@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-muted" style={{ fontSize: "0.875rem" }}>{user.email}</div>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${user.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                            onClick={() => handleToggleStatus(user._id, user.status)}
                                        >
                                            <i className={`bi ${user.status === 'active' ? 'bi-person-x-fill' : 'bi-person-check-fill'}`}></i>
                                            {user.status === 'active' ? 'Block' : 'Unblock'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <i className="bi bi-people"></i>
                        <div className="empty-state-text">No users found matching your criteria</div>
                    </div>
                )}
            </div>

            {
                showBlockModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className={`modal-title ${userToToggle?.status === 'active' ? 'text-danger' : 'text-success'}`}>
                                        {userToToggle?.status === 'active' ? 'Block User?' : 'Unblock User?'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowBlockModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="mb-2">
                                        Are you sure you want to {userToToggle?.status === 'active' ? 'block' : 'unblock'} <strong>{userToToggle?.name}</strong>?
                                    </p>
                                    {userToToggle?.status === 'active' && (
                                        <p className="text-muted small mb-0">Blocked users will not be able to log in or interact with the platform.</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowBlockModal(false)}>Cancel</button>
                                    <button
                                        type="button"
                                        className={`btn ${userToToggle?.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                                        onClick={confirmToggleStatus}
                                    >
                                        {userToToggle?.status === 'active' ? 'Block User' : 'Unblock User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ManageUsers;
