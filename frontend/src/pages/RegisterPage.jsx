import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

const RegisterPage = () => {
    usePageTitle("Register");
    const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await registerApi(formData);
            navigate("/login", { state: { message: "Registration successful! Please login." } });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-large">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Join BlogApp</h2>
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="John Doe"
                                    required
                                    autoComplete="off"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="name@example.com"
                                    required
                                    autoComplete="off"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="johndoe123"
                                    required
                                    autoComplete="off"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control"
                                        placeholder="Choose a strong password"
                                        required
                                        autoComplete="new-password"
                                        onChange={handleChange}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi bi-eye${showPassword ? "" : "-slash"}`}></i>
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : null}
                                Register
                            </button>
                        </form>
                        <p className="text-center mb-0 mt-3">
                            Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
