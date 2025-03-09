import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "./LoadingOverlay"; // Import LoadingOverlay

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const requiresProfileSetup =
    sessionStorage.getItem("requiresProfileSetup") === "true";

  if (
    location.pathname === "/create-profile" &&
    isAuthenticated &&
    requiresProfileSetup
  ) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requiresProfileSetup) {
    return <Navigate to="/create-profile" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
