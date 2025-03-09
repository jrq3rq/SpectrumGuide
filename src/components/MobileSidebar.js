import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/MobileSidebar.css";
import { useUser } from "../context/UserContext";

const MobileSidebar = ({ isOpen, toggleSidebar, navItems = [] }) => {
  const { isAdmin, user, userPlan, credits } = useUser();
  const location = useLocation();
  const requiresProfileSetup =
    sessionStorage.getItem("requiresProfileSetup") === "true";
  const isOnCreateProfile = location.pathname === "/create-profile";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, [isOpen]);

  useEffect(() => {
    console.log(
      "MobileSidebar - Credits:",
      credits,
      "isAdmin:",
      isAdmin,
      "localStorage credits:",
      localStorage.getItem(`credits_${user?.uid}`)
    );
  }, [credits, isAdmin, user?.uid]); // Debug log to verify credits

  return (
    <>
      <aside
        id="mobile-sidebar"
        className={`mobile-sidebar ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <nav className="sidebar-nav">
          {!isOnCreateProfile &&
            !requiresProfileSetup &&
            navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="sidebar-link"
                onClick={toggleSidebar}
              >
                {item.icon}
                {item.name === "Credits" && (
                  <span className="credits-display">
                    {isAdmin ? "∞" : credits || 0}
                  </span>
                )}
                <span>{item.name}</span>
              </Link>
            ))}
        </nav>
      </aside>
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default MobileSidebar;
