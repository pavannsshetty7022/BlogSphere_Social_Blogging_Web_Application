import API from "./api";


export const fetchAdminStats = () => API.get("/api/admin/stats");
export const fetchActiveUsers = () => API.get("/api/admin/active-users");

export const fetchAllUsers = () => API.get("/api/admin/users");
export const updateUserStatus = (userId, status) => API.put(`/api/admin/users/${userId}/status`, { status });

export const fetchAllPosts = () => API.get("/api/admin/posts");
export const fetchPostDetails = (postId) => API.get(`/api/admin/posts/${postId}`);
export const updatePostStatus = (postId, status) => API.put(`/api/admin/posts/${postId}/status`, { status });
export const deletePost = (postId) => API.delete(`/api/admin/posts/${postId}`);
