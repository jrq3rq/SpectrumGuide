import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "./LoadingOverlay";

const PrivateRoute = () => {
  const { isAuthenticated, user, isLoading } = useUser();
  const location = useLocation();

  const hasProfile = user?.firstName && user?.lastName && user?.dob;

  useEffect(() => {
    if (isAuthenticated && hasProfile) {
      sessionStorage.setItem("lastVisitedPage", location.pathname);
    }
  }, [isAuthenticated, hasProfile, location.pathname]);

  if (isLoading) return <LoadingOverlay />;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasProfile) {
    return <Navigate to="/create-profile" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
