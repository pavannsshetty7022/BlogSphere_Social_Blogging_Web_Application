import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import ManagePosts from "./pages/ManagePosts";
import Sidebar from "./components/Sidebar";

import BackgroundLayout from "./components/BackgroundLayout";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";
import "./Admin.css";

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">Access Denied</h2>
        <p>This portal is restricted to administrative staff only.</p>
        <button className="btn btn-primary" onClick={() => window.location.href = 'http://localhost:5173'}>Back to Blog</button>
      </div>
    );
  }

  return (
    <div className="admin-wrapper d-flex">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      ></div>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={closeSidebar} />

      <div className="main-content flex-grow-1 d-flex flex-column">
        <div className="d-lg-none p-3 pb-0">
          <button
            className="btn btn-link p-0 text-dark"
            onClick={toggleSidebar}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className="flex-grow-1 p-4 main-content-body">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <main>
          <BackgroundLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ManageUsers />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/posts"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ManagePosts />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BackgroundLayout>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
