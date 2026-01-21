import React from "react";

const LikesDropdown = ({ likes = [], reaction, currentUser }) => {
    const others = likes.filter(l => l.username !== currentUser?.username);
    const youLiked = reaction === 'like';

    if (!youLiked && others.length === 0) return null;

    const renderDropdown = (remainingLikers) => {
        if (remainingLikers.length === 0) return null;

        return (
            <>
                {" & "}
                <span
                    className="text-decoration-underline cursor-pointer dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer" }}
                >
                    {remainingLikers.length} others
                </span>
                <ul className="dropdown-menu border-0 shadow-sm" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {remainingLikers.map((liker, index) => (
                        <li key={index}>
                            <span className="dropdown-item small py-1 bg-transparent">
                                <i className="bi bi-person-fill me-2 text-secondary"></i>
                                {liker.username}
                            </span>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    return (
        <div className="dropdown d-inline small text-muted">
            <i className="bi bi-people-fill me-2"></i>
            {youLiked ? (
                <span>
                    Liked by <strong>You</strong>
                    {others.length > 0 && (
                        <>
                            {others.length === 1 ? (
                                <>{" and "}<strong>{others[0].username}</strong></>
                            ) : (
                                <>
                                    {", "}
                                    <strong>{others[0].username}</strong>
                                    {renderDropdown(others.slice(1))}
                                </>
                            )}
                        </>
                    )}
                </span>
            ) : (
                <span>
                    Liked by <strong>{others[0]?.username}</strong>
                    {others.length > 1 && renderDropdown(others.slice(1))}
                </span>
            )}
        </div>
    );
};

export default LikesDropdown;
