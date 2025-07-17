import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateAdminRoute;
