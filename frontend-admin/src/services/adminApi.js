import API from "./api";


export const fetchAdminStats = () => API.get("/admin/stats");
export const fetchActiveUsers = () => API.get("/admin/active-users");

export const fetchAllUsers = () => API.get("/admin/users");
export const updateUserStatus = (userId, status) => API.put(`/admin/users/${userId}/status`, { status });

export const fetchAllPosts = () => API.get("/admin/posts");
export const fetchPostDetails = (postId) => API.get(`/admin/posts/${postId}`);
export const updatePostStatus = (postId, status) => API.put(`/admin/posts/${postId}/status`, { status });
export const deletePost = (postId) => API.delete(`/admin/posts/${postId}`);
