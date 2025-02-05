// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally, return a spinner or loading indicator
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
