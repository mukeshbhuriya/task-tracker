import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  token,
  adminOnly = false,
  userRole,
}) {
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && userRole !== "admin")
    return <Navigate to="/tasks" replace />;
  return children;
}
