// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useUser } from "../context/UserContext";
// import LoadingOverlay from "./LoadingOverlay"; // Already imported

// const PublicRoute = () => {
//   const { isAuthenticated, isLoading } = useUser();
//   const location = useLocation();

//   if (isLoading) {
//     return <LoadingOverlay />;
//   }

//   if (isAuthenticated && !["/create-profile"].includes(location.pathname)) {
//     const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
//     return <Navigate to={lastPage} replace />;
//   }

//   return <Outlet />;
// };

// export default PublicRoute;
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "./LoadingOverlay";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();
  const normalizedPath = location.pathname.toLowerCase().replace(/\/+$/, "");

  console.log("PublicRoute - Path:", normalizedPath, "Authenticated:", isAuthenticated, "Loading:", isLoading);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Allow public paths explicitly
  const publicPaths = ["/", "/signin", "/signup", "/investors"];
  if (publicPaths.includes(normalizedPath)) {
    return <Outlet />;
  }

  // Redirect authenticated users to last page or /form, except for /create-profile
  if (isAuthenticated && normalizedPath !== "/create-profile") {
    const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
    console.log("Redirecting to:", lastPage);
    return <Navigate to={lastPage} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;