import React from "react";
import { Navigate } from "react-router-dom";
import useVetAuth from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { vet, loading } = useVetAuth();

  if (loading) return <div>Loading...</div>;

  if (!vet) return <Navigate to="/login" replace />;

  if (!vet.is_approved) return <Navigate to="/approval-pending" replace />;

  return children;
};

export default PrivateRoute;
