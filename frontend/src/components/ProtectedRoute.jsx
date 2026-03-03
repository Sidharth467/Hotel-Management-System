import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If route requires a specific role
  if (role) {
    if (userRole !== role) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}