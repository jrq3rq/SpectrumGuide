// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useUser } from "../context/UserContext";

// const PrivateRoute = () => {
//   const { isAuthenticated } = useUser();

//   return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default PrivateRoute;
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  // Store the last visited page in sessionStorage
  React.useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem("lastVisitedPage", location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  if (isLoading) return null; // Prevent premature redirection

  const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";

  return isAuthenticated ? <Outlet /> : <Navigate to={lastPage} replace />;
};

export default PrivateRoute;
