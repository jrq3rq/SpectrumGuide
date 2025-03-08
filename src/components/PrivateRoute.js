import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "./LoadingOverlay";

const PrivateRoute = () => {
  const { isAuthenticated, user, isLoading } = useUser();
  const location = useLocation();

  const hasProfile = user?.firstName && user?.lastName && user?.dob;

  useEffect(() => {
    console.log(
      "PrivateRoute - Rendered: isLoading:",
      isLoading,
      "isAuthenticated:",
      isAuthenticated,
      "hasProfile:",
      hasProfile,
      "pathname:",
      location.pathname
    );
    if (isAuthenticated && hasProfile) {
      sessionStorage.setItem("lastVisitedPage", location.pathname);
    }
  }, [isAuthenticated, hasProfile, location.pathname]);

  // Wait for auth to resolve (isAuthenticated is null initially)
  if (isLoading || isAuthenticated === null) {
    console.log("PrivateRoute - Showing LoadingOverlay");
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    console.log("PrivateRoute - Redirecting to /signin");
    return <Navigate to="/signin" replace />;
  }

  if (!hasProfile) {
    console.log("PrivateRoute - Redirecting to /create-profile");
    return <Navigate to="/create-profile" replace />;
  }

  console.log("PrivateRoute - Rendering Outlet for:", location.pathname);
  return <Outlet />;
};

export default PrivateRoute;
