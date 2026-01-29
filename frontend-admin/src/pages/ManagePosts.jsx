import React, { useEffect, useState } from "react";
import { fetchAllPosts, updatePostStatus, deletePost, fetchPostDetails } from "../services/adminApi";
import { format } from "date-fns";
import usePageTitle from "../hooks/usePageTitle";

const ManagePosts = () => {
    usePageTitle("Manage Posts");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSkeleton, setShowSkeleton] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);


    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const { data } = await fetchAllPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setShowSkeleton(false);
            }, 1000);
        }
    };

    const showSuccessToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleToggleStatus = async (postId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "disabled" : "active";
        try {
            await updatePostStatus(postId, newStatus);
            setPosts(posts.map(p => p._id === postId ? { ...p, status: newStatus } : p));
            showSuccessToast(`Post ${newStatus === 'disabled' ? 'disabled' : 'enabled'} successfully`);
        } catch (error) {
            alert("Failed to update post status");
        }
    };

    const confirmDelete = (post) => {
        setPostToDelete(post);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            await deletePost(postToDelete._id);
            setPosts(posts.filter(p => p._id !== postToDelete._id));
            setShowDeleteModal(false);
            setPostToDelete(null);
            showSuccessToast("Post deleted successfully");
        } catch (error) {
            alert("Failed to delete post");
        }
    };

    const handleViewPost = async (postId) => {
        setLoadingDetails(true);
        setShowViewModal(true);
        try {
            const { data } = await fetchPostDetails(postId);
            setCurrentPost(data);
        } catch (error) {
            console.error("Failed to fetch post details", error);
            showSuccessToast("Failed to load post details");
            setShowViewModal(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
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
                        <div className="col-md-12">
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
                                    <th style={{ width: "40%" }}>Post Title</th>
                                    <th>Author</th>
                                    <th>Stats</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="placeholder-glow mb-1">
                                                <span className="placeholder col-8"></span>
                                            </div>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-10"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="placeholder-glow mb-1">
                                                <span className="placeholder col-6"></span>
                                            </div>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-5"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-3">
                                                <span className="placeholder col-3"></span>
                                                <span className="placeholder col-3"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-5 rounded-pill"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-6"></span>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="placeholder-glow d-inline-block" style={{ width: "130px" }}>
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
                    <h1 className="page-title">Post Management</h1>
                </div>
                <div className="page-meta">Total: {posts.length} Posts</div>
            </div>

            <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
                <div id="actionToast" className={`toast align-items-center text-white bg-success border-0 ${showToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            {toastMessage}
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)} aria-label="Close"></button>
                    </div>
                </div>
            </div>

            <div className="filter-card">
                <div className="row g-3">
                    <div className="col-12">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by post title or author name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: "40%" }}>Post Title</th>
                                <th>Author</th>
                                <th>Stats</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post._id}>
                                    <td>
                                        <div className="fw-bold text-truncate" style={{ maxWidth: "300px", fontSize: "0.9375rem", marginBottom: "4px" }}>{post.title}</div>
                                        <div className="text-muted text-truncate" style={{ maxWidth: "300px", fontSize: "0.8125rem" }}>{post.content?.substring(0, 60)}...</div>
                                    </td>
                                    <td>
                                        <div className="fw-medium" style={{ fontSize: "0.9375rem" }}>{post.author?.name}</div>
                                        <div className="text-muted" style={{ fontSize: "0.8125rem" }}>@{post.author?.username}</div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-3" style={{ fontSize: "0.875rem" }}>
                                            <span className="text-danger"><i className="bi bi-heart-fill me-1"></i>{post.likeCount || 0}</span>
                                            <span className="text-primary"><i className="bi bi-chat-fill me-1"></i>{post.commentCount || 0}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${post.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                                            {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        <div className="btn-group gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleViewPost(post._id)}
                                                title="View Details"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button
                                                className={`btn btn-sm ${post.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => handleToggleStatus(post._id, post.status)}
                                            >
                                                {post.status === 'active' ? 'Disable' : 'Enable'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => confirmDelete(post)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredPosts.length === 0 && (
                    <div className="empty-state">
                        <i className="bi bi-file-earmark-text"></i>
                        <div className="empty-state-text">No posts found matching your criteria</div>
                    </div>
                )}
            </div>


            {showViewModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Post Details</h5>
                                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {loadingDetails ? (
                                    <div className="d-flex justify-content-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : currentPost ? (
                                    <div>
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <img
                                                    src={currentPost.author?.profileImage || "/default-avatar.png"}
                                                    alt={currentPost.author?.name}
                                                    className="rounded-circle me-2"
                                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                />

                                                <div>
                                                    <div className="fw-bold">{currentPost.author?.name}</div>
                                                    <div className="text-muted small">@{currentPost.author?.username}</div>
                                                </div>

                                                <div className="ms-auto text-muted small">
                                                    {format(new Date(currentPost.createdAt), 'MMM dd, yyyy h:mm a')}
                                                </div>
                                            </div>


                                            <h4 className="fw-bold mb-3">{currentPost.title}</h4>

                                            {currentPost.uploadImage && (
                                                <img
                                                    src={currentPost.uploadImage}
                                                    alt="Post"
                                                    className="img-fluid rounded mb-3 w-100"
                                                    style={{ alignItems: "center", maxHeight: "300px", maxWidth: "300px", objectFit: "cover" }}
                                                />
                                            )}

                                            <p className="text-muted" style={{ whiteSpace: "pre-wrap" }}>{currentPost.content}</p>
                                        </div>

                                        <div className="d-flex gap-4 mb-4 border-top border-bottom py-3">
                                            <div className="text-danger fw-bold">
                                                <i className="bi bi-heart-fill me-2"></i> {currentPost.likeCount} Likes
                                            </div>
                                            <div className="text-secondary fw-bold">
                                                <i className="bi bi-hand-thumbs-down-fill me-2"></i> {currentPost.dislikeCount} Dislikes
                                            </div>
                                            <div className="text-primary fw-bold">
                                                <i className="bi bi-chat-fill me-2"></i> {currentPost.comments?.length || 0} Comments
                                            </div>
                                        </div>

                                        <div>
                                            <h6 className="fw-bold mb-3">Comments</h6>
                                            {currentPost.comments && currentPost.comments.length > 0 ? (
                                                <div className="d-flex flex-column gap-3">
                                                    {currentPost.comments.map(comment => (
                                                        <div key={comment._id} className="d-flex gap-2">
                                                            <img
                                                                src={comment.userId?.profileImage || "/default-avatar.png"}
                                                                alt={comment.userId?.name}
                                                                className="rounded-circle"
                                                                style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                                            />
                                                            <div className="bg-light p-3 rounded flex-grow-1">
                                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                                    <span className="fw-bold small">{comment.userId?.name}</span>
                                                                    <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                                                        {format(new Date(comment.createdAt), 'MMM dd, h:mm a')}
                                                                    </span>
                                                                </div>
                                                                <p className="mb-0 small">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted small">No comments yet.</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">Failed to load details</div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {
                showDeleteModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title text-danger">Delete Post?</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="mb-2">Are you sure you want to delete <strong>{postToDelete?.title}</strong>?</p>
                                    <p className="text-muted small mb-0">This action is permanent and cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ManagePosts;
