import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MobileSidebar.css";
import { useUser } from "../context/UserContext";
import useCreditTracker from "../hooks/useCreditTracker"; // Corrected from useCredits
import { firestore } from "../firebase"; // Import firestore for useCreditTracker

const MobileSidebar = ({ isOpen, toggleSidebar, navItems = [] }) => {
  const { isAdmin, user, userPlan, credits: contextCredits } = useUser(); // Get necessary data from UserContext

  // Use useCreditTracker to get the current credit count
  const { credits } = useCreditTracker({
    firestore,
    uid: user?.uid || null, // Use null if no uid yet
    initialCredits: isAdmin ? 999999 : contextCredits || 0, // Start with UserContext credits
    initialAiUsage: user?.aiUsage || { carePlans: 0, stories: 0, aiChats: 0 },
    plan: userPlan || "free",
    isAdmin,
  });

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
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="sidebar-link"
              onClick={toggleSidebar}
            >
              {item.icon}
              {item.name === "Credits" && ( // Updated to use name instead of id for consistency
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
