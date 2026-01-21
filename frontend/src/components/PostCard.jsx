import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reactPost } from "../services/api";

const PostCard = ({ post }) => {
    const { user } = useAuth();

    const getInitialReaction = () => {
        if (post.likes?.some(l => l.username === user?.username)) return "like";
        if (post.dislikes?.some(l => l.username === user?.username)) return "dislike";
        return null;
    };

    const [reaction, setReaction] = useState(getInitialReaction());
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [dislikesCount, setDislikesCount] = useState(post.dislikes?.length || 0);

    const handleReact = async (type) => {
        if (!user) return;

        const oldReaction = reaction;
        const newReaction = oldReaction === type ? null : type;

        setReaction(newReaction);

        let newLikes = likesCount;
        let newDislikes = dislikesCount;

        if (oldReaction === "like") newLikes--;
        if (oldReaction === "dislike") newDislikes--;

        if (newReaction === "like") newLikes++;
        if (newReaction === "dislike") newDislikes++;

        setLikesCount(newLikes);
        setDislikesCount(newDislikes);

        try {
            const { data } = await reactPost(post._id, newReaction);
            setLikesCount(data.likesCount);
            setDislikesCount(data.dislikesCount);
            setReaction(data.userReaction);
        } catch (err) {
            console.error("Reaction failed", err);
            setReaction(oldReaction);
            setLikesCount(likesCount);
            setDislikesCount(dislikesCount);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="card h-100 border-0 shadow-sm animate-fade-in">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge badge-highlight rounded-pill px-3 py-2">Blog Post</span>
                    <small className="text-muted">{formatDate(post.createdAt)}</small>
                </div>
                <h4 className="card-title mb-3">
                    <Link to={`/post/${post._id}`} className="text-decoration-none" style={{ color: "var(--headings-color)" }}>
                        {post.title}
                    </Link>
                </h4>
                <p className="card-text text-secondary mb-4" style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}>
                    {post.content}
                </p>
                <div className="d-flex align-items-center mb-4">
                    <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "32px", height: "32px" }}>
                        <i className="bi bi-person text-primary"></i>
                    </div>
                    <span className="fw-semibold small">{post.author}</span>
                </div>
                <hr className="my-3 opacity-10" />
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-4">
                        <button
                            className={`btn btn-link p-0 d-flex align-items-center text-decoration-none transition-all ${reaction === 'like' ? 'text-dark' : 'text-muted text-opacity-50'}`}
                            onClick={() => handleReact('like')}
                            style={{ transition: '0.2s transform' }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(1.2)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className={`bi bi-hand-thumbs-up${reaction === 'like' ? '-fill' : ''} fs-5 me-1`}></i>
                            <span className="fw-bold small">{likesCount}</span>
                        </button>
                        <button
                            className={`btn btn-link p-0 d-flex align-items-center text-decoration-none transition-all ${reaction === 'dislike' ? 'text-dark' : 'text-muted text-opacity-50'}`}
                            onClick={() => handleReact('dislike')}
                            style={{ transition: '0.2s transform' }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(1.2)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className={`bi bi-hand-thumbs-down${reaction === 'dislike' ? '-fill' : ''} fs-5 me-1`}></i>
                            <span className="fw-bold small">{dislikesCount}</span>
                        </button>
                    </div>
                    <Link to={`/post/${post._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        Read More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
