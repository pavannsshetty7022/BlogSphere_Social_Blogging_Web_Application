import React, { useEffect, useState } from "react";
import { fetchAdminStats } from "../services/adminApi";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

const Dashboard = () => {
    usePageTitle("Dashboard");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            try {
                const { data } = await fetchAdminStats();
                setStats(data);
            } catch (err) {
                setError("Failed to load dashboard statistics");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                    setShowSkeleton(false);
                }, 1000);
            }
        };
        getStats();
    }, []);

    if (showSkeleton) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="placeholder-glow">
                        <span className="placeholder col-4 placeholder-lg" style={{ height: "32px" }}></span>
                    </div>
                    <div className="placeholder-glow mt-2">
                        <span className="placeholder col-3" style={{ height: "16px" }}></span>
                    </div>
                </div>

                <div className="dashboard-stats-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="stat-card">
                            <div className="stat-card-header">
                                <div className="placeholder-glow">
                                    <span className="placeholder rounded" style={{ width: "56px", height: "56px" }}></span>
                                </div>
                            </div>
                            <div className="stat-card-body">
                                <div className="placeholder-glow mb-2">
                                    <span className="placeholder col-8" style={{ height: "12px" }}></span>
                                </div>
                                <div className="placeholder-glow">
                                    <span className="placeholder col-6" style={{ height: "32px" }}></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-welcome-card">
                    <div className="placeholder-glow mb-3">
                        <span className="placeholder rounded-circle" style={{ width: "64px", height: "64px", margin: "0 auto", display: "block" }}></span>
                    </div>
                    <div className="placeholder-glow mb-2">
                        <span className="placeholder col-4" style={{ height: "24px", margin: "0 auto", display: "block" }}></span>
                    </div>
                    <div className="placeholder-glow">
                        <span className="placeholder col-8" style={{ height: "16px", margin: "0 auto", display: "block" }}></span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard Summary</h1>
                <p className="dashboard-subtitle">Overview of your platform statistics</p>
            </div>

            {error && (
                <div className="dashboard-alert">
                    <i className="bi bi-exclamation-octagon-fill"></i>
                    <span>{error}</span>
                </div>
            )}

            <div className="dashboard-stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon stat-icon-primary">
                            <i className="bi bi-people-fill"></i>
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{stats?.totalUsers || 0}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon stat-icon-success">
                            <i className="bi bi-file-earmark-richtext-fill"></i>
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-label">Total Posts</div>
                        <div className="stat-value">{stats?.totalPosts || 0}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon stat-icon-danger">
                            <i className="bi bi-heart-fill"></i>
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-label">Most Liked Post</div>
                        <div className="stat-value-small text-truncate" title={stats?.mostLikedPost?.title}>
                            {stats?.mostLikedPost ? `"${stats.mostLikedPost.title}"` : "N/A"}
                        </div>
                        <div className="stat-meta mb-1">
                            {stats?.mostLikedPost?.author ? `by ${stats.mostLikedPost.author.name}` : ""}
                        </div>
                        <div className="stat-meta text-danger">
                            <i className="bi bi-heart-fill me-1"></i>
                            {stats?.mostLikedPost?.likeCount || 0} Likes
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon stat-icon-primary" style={{ background: 'rgba(13, 202, 240, 0.1)', color: '#0dcaf0' }}>
                            <i className="bi bi-chat-dots-fill"></i>
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <div className="stat-label">Most Commented Post</div>
                        <div className="stat-value-small text-truncate" title={stats?.mostCommentedPost?.title}>
                            {stats?.mostCommentedPost ? `"${stats.mostCommentedPost.title}"` : "N/A"}
                        </div>
                        <div className="stat-meta mb-1">
                            {stats?.mostCommentedPost?.author ? `by ${stats.mostCommentedPost.author.name}` : ""}
                        </div>
                        <div className="stat-meta text-info">
                            <i className="bi bi-chat-fill me-1"></i>
                            {stats?.mostCommentedPost?.commentCount || 0} Comments
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-welcome-card">
                <div className="welcome-icon">
                    <i className="bi bi-star-fill"></i>
                </div>
                <h3 className="welcome-title">Admin Spotlight</h3>
                <p className="welcome-text">Welcome to the central command center of BlogApp. Monitor engagement, manage users, and curate content with ease.</p>
            </div>
        </div>
    );
};

export default Dashboard;
