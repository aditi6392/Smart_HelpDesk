import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) return null; // wait for auth check

  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
