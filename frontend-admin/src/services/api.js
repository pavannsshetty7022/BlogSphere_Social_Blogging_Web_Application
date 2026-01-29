import axios from "axios";

const API = axios.create({
    baseURL: "https://blog-fullstack-application.onrender.com",
});

API.interceptors.request.use((req) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (formData) => API.post("/api/auth/login", formData);
export const register = (formData) => API.post("/api/auth/register", formData);
export const logout = () => API.post("/api/auth/logout");
export const updateProfile = (formData) => API.put("/api/auth/profile", formData);

export const fetchPosts = () => API.get("/api/posts");
export const fetchPostById = (id) => API.get(`/api/posts/${id}`);
export const createPost = (newPost) => API.post("/api/posts", newPost);
export const updatePost = (id, updatedPost) => API.put(`/api/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/api/posts/${id}`);
export const reactPost = (id, reaction) => API.post(`/api/posts/${id}/react`, { reaction });
export const addComment = (id, commentData) => API.post(`/api/posts/${id}/comments`, commentData);
export const deleteComment = (id, commentId) => API.delete(`/api/posts/${id}/comments/${commentId}`);

export default API;
