import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Correct path since firebase.js is in the src directory

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState("free"); // Add this for plan info
  const navigate = useNavigate();

  useEffect(() => {
    // Check for mock login state first
    const mockAuth = JSON.parse(localStorage.getItem("mockAuth"));
    if (mockAuth && mockAuth.isAuthenticated) {
      setIsAuthenticated(mockAuth.isAuthenticated);
      setUser(mockAuth.user);
      setUserPlan(mockAuth.plan || "free"); // Update to include plan from mockAuth
    } else {
      // If no mock login, listen for Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setIsAuthenticated(true);
          setUser(firebaseUser);
          // Fetch user plan from Firestore or another source
          // Here is a placeholder for fetching the plan, you would need to implement actual fetching logic.
          const plan = await fetchUserPlanFromFirestore(firebaseUser.uid);
          setUserPlan(plan || "free");

          if (window.location.pathname === "/") {
            navigate("/form");
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setUserPlan("free"); // Reset plan to free when user logs out
          if (window.location.pathname !== "/signup") {
            navigate("/");
          }
        }
      });

      return () => unsubscribe();
    }
  }, [navigate]);

  const login = (userData, shouldNavigate = true) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserPlan(userData.plan || "free"); // Include plan info here when logging in
    localStorage.setItem(
      "mockAuth",
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
        plan: userData.plan || "free",
      })
    );
    if (shouldNavigate) {
      navigate("/form");
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
        setUserPlan("free"); // Reset plan to free when user logs out
        localStorage.removeItem("mockAuth");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  // Placeholder for fetching user plan from Firestore
  const fetchUserPlanFromFirestore = async (uid) => {
    // This function should fetch the user's plan from Firestore
    // Example:
    // const docRef = doc(firestore, "users", uid);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   return docSnap.data().plan;
    // }
    // return "free"; // Default to free if no plan found
    console.log("Fetching plan for user:", uid);
    return "free"; // Placeholder return
  };

  return (
    <UserContext.Provider
      value={{ isAuthenticated, user, userPlan, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
