import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import LoadingOverlay from "./LoadingOverlay";

const PublicRoute = () => {
  const { isAuthenticated, user, isLoading, login } = useUser();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user || !isAuthenticated) {
        setProfileChecked(true); // No user, allow public routes
        return;
      }

      try {
        const userRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          sessionStorage.removeItem("requiresProfileSetup");
          login({ ...user, ...docSnap.data() });
        } else {
          sessionStorage.setItem("requiresProfileSetup", "true");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }

      setProfileChecked(true);
    };

    if (isAuthenticated) checkUserProfile();
    else setProfileChecked(true);
  }, [isAuthenticated, user, login]);

  if (isLoading || !profileChecked) {
    return <LoadingOverlay />; // Use LoadingOverlay instead of text
  }

  const requiresProfileSetup =
    sessionStorage.getItem("requiresProfileSetup") === "true";
  const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";

  if (isAuthenticated) {
    return requiresProfileSetup ? (
      <Navigate to="/create-profile" replace />
    ) : (
      <Navigate to={lastPage} replace />
    );
  }

  return <Outlet />;
};

export default PublicRoute;
