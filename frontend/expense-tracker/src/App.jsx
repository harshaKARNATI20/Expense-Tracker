import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PrivateAdminRoute from "./components/Routes/PrivateAdminRoute";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminAnalytics from "./pages/Admin/AdminAnalytics"; // ✅ Fixed path

// 🔐 Route for authenticated users (user or admin)
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

// 🔐 Redirect root based on login and role
const RootRedirect = () => {
  const { token } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" />;
  return user?.isAdmin ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/dashboard/home" />
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🌐 Default root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 👤 User Routes (Protected) */}
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/home" />}
        />
        <Route
          path="/dashboard/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/income"
          element={
            <ProtectedRoute>
              <Income />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expense"
          element={
            <ProtectedRoute>
              <Expense />
            </ProtectedRoute>
          }
        />

        {/* 🛡️ Admin-only Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateAdminRoute>
              <AdminDashboard />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <PrivateAdminRoute>
              <AdminAnalytics />
            </PrivateAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
