import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/api";
import usePageTitle from "../hooks/usePageTitle.jsx";

const LoginPage = () => {
  usePageTitle("Admin Login");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginApi(formData);
      loginUser(data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 position-relative z-10 admin-login-card">
      <style>
        {`
          .admin-login-card .form-control,
          .admin-login-card .input-group-text,
          .admin-login-card .btn {
            font-size: 1rem !important;
            padding: 0.375rem 0.75rem !important;
            height: auto !important;
          }
          .admin-login-card .card {
            border-radius: 1rem !important;
          }
          .admin-login-card .form-label {
            font-size: 1rem !important;
            font-weight: 500 !important;
          }
          .admin-login-card .input-group-text {
            background-color: #e9ecef !important;
            border: 1px solid #ced4da !important;
          }
          .admin-login-card .form-control {
            border: 1px solid #ced4da !important;
          }
          .admin-login-card .btn-outline-secondary {
            border: 1px solid #ced4da !important;
            border-left: none !important;
            color: #6c757d !important;
            background-color: transparent !important;
          }
          .admin-login-card .bi {
            font-size: 1.1rem !important;
          }
        `}
      </style>
      <div className="row justify-content-center">

        <div className="col-md-4 d-none d-md-flex align-items-center justify-content-center">
          <img
            src="/Blog Vector.png"
            alt="Blog Illustration"
            className="img-fluid"
            style={{ maxHeight: "620px" }}
          />
        </div>

        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h2 className="text-center mb-4 fw-bold">
              <i className="bi bi-shield-lock me-2"></i>Admin Sign In
            </h2>

            {error && (
              <div className="alert alert-danger py-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3">
                <label className="form-label">Email or Username</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    className="form-control"
                    placeholder="Enter email or username"
                    required
                    autoComplete="username"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    className="form-control"
                    placeholder="Enter password"
                    required
                    autoComplete="new-password"
                    onChange={handleChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi bi-eye${showPassword ? "" : "-slash"}`}
                    ></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mb-3"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                )}
                Admin Sign In
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
