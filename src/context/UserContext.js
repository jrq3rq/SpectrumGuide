import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Correct path since firebase.js is in the src directory

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for mock login state first
    const mockAuth = JSON.parse(localStorage.getItem("mockAuth"));
    if (mockAuth && mockAuth.isAuthenticated) {
      setIsAuthenticated(mockAuth.isAuthenticated);
      setUser(mockAuth.user);
    } else {
      // If no mock login, listen for Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setIsAuthenticated(true);
          setUser(firebaseUser);
          if (window.location.pathname === "/") {
            navigate("/form");
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
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
    localStorage.setItem(
      "mockAuth",
      JSON.stringify({ isAuthenticated: true, user: userData })
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
        localStorage.removeItem("mockAuth");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
