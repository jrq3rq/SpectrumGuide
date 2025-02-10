import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PrivateRoute = () => {
  const { isAuthenticated, user, isLoading } = useUser();
  const location = useLocation();

  // ✅ Check if profile is actually complete
  const hasProfile = user?.firstName && user?.lastName && user?.dob;

  React.useEffect(() => {
    if (isAuthenticated && hasProfile) {
      sessionStorage.setItem("lastVisitedPage", location.pathname);
    }
  }, [isAuthenticated, hasProfile, location.pathname]);

  if (isLoading) return <div className="loading-message">Loading...</div>;

  if (isAuthenticated && !hasProfile) {
    return <Navigate to="/create-profile" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
