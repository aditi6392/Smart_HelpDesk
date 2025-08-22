// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, token, role: userRole } = useContext(AuthContext);

  // If not logged in → send to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required (like "admin") → check
  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />; // block users from admin routes
  }

  // Otherwise allow
  return children;
}
