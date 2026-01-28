import React from "react";

const LikesDropdown = ({
    totalLikeCount,
    likedByCurrentUser,
    otherLikeCount,
    likedUsers = [],
    currentUser,
}) => {
    if (totalLikeCount === 0) return null;

    const otherUsers = likedUsers.filter(
        (liker) => liker.userId !== currentUser?.userId
    );

    const renderLikesLink = (label, usersToShow, totalCount) => {
        return (
            <span className="dropdown position-relative">
                <span
                    className="text-decoration-underline dropdown-toggle fw-bold"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer" }}
                >
                    {label}
                </span>

                <ul
                    className="dropdown-menu border-0 shadow-lg p-2"
                    style={{
                        maxHeight: "200px",
                        minWidth: "180px",
                        overflowY: "auto",
                        zIndex: 1070,
                    }}
                >
                    <h6 className="dropdown-header px-2 py-1 text-primary small fw-bold">
                        Liked by
                    </h6>

                    {usersToShow.map((liker) => (
                        <li key={liker.userId}>
                            <span className="dropdown-item small py-1 px-2 d-flex align-items-center">
                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-circle me-2 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {liker.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <span className="fw-medium">{liker.name}</span>
                            </span>
                        </li>
                    ))}

                    {totalCount > usersToShow.length && (
                        <>
                            <li>
                                <hr className="dropdown-divider my-1 opacity-50" />
                            </li>
                            <li>
                                <span className="dropdown-item-text small text-muted">
                                    And {totalCount - usersToShow.length} more...
                                </span>
                            </li>
                        </>
                    )}
                </ul>
            </span>
        );
    };

    return (
        <div className="small text-muted d-flex align-items-center gap-1 py-1">
            <i
                className="bi bi-heart-fill text-danger opacity-75"
                style={{ fontSize: "0.8rem" }}
            ></i>

            <span style={{ fontSize: "0.85rem" }}>
                {likedByCurrentUser ? (
                    <>
                        Liked by <strong>You</strong>
                        {otherLikeCount > 0 && <> and {renderLikesLink(`${otherLikeCount} ${otherLikeCount === 1 ? 'other' : 'others'}`, otherUsers, totalLikeCount)}</>}
                    </>
                ) : (
                    <>
                        Liked by {totalLikeCount === 1 ? (
                            renderLikesLink(otherUsers[0]?.name || "1 user", otherUsers, totalLikeCount)
                        ) : (
                            renderLikesLink(`${totalLikeCount} users`, otherUsers, totalLikeCount)
                        )}
                    </>
                )}
            </span>
        </div>
    );
};

export default LikesDropdown;
