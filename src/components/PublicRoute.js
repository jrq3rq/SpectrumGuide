// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useUser } from "../context/UserContext";

// const PublicRoute = () => {
//   const { isAuthenticated } = useUser();

//   // If the user is authenticated, redirect to /form
//   // Otherwise, render the Outlet which will show the sign-in component
//   return !isAuthenticated ? <Outlet /> : <Navigate to="/form" replace />;
// };

// export default PublicRoute;
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) return null; // Wait for authentication state to load

  // If the user is authenticated, always redirect to /form
  return !isAuthenticated ? <Outlet /> : <Navigate to="/form" replace />;
};

export default PublicRoute;
