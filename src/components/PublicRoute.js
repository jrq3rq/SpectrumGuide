import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "./LoadingOverlay";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  console.log(
    "PublicRoute - Rendered: isLoading:",
    isLoading,
    "isAuthenticated:",
    isAuthenticated,
    "pathname:",
    location.pathname
  );

  if (isLoading) {
    console.log("PublicRoute - Showing LoadingOverlay");
    return <LoadingOverlay />;
  }

  const requiresProfileSetup =
    sessionStorage.getItem("requiresProfileSetup") === "true";
  const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";

  if (isAuthenticated && !["/signin", "/signup"].includes(location.pathname)) {
    console.log(
      "PublicRoute - Redirecting to:",
      requiresProfileSetup ? "/create-profile" : lastPage
    );
    return requiresProfileSetup ? (
      <Navigate to="/create-profile" replace />
    ) : (
      <Navigate to={lastPage} replace />
    );
  }

  console.log("PublicRoute - Rendering Outlet for:", location.pathname);
  return <Outlet />;
};

export default PublicRoute;
