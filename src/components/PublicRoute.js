import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "./LoadingOverlay"; // Already imported

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isAuthenticated && !["/create-profile"].includes(location.pathname)) {
    const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
    return <Navigate to={lastPage} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
