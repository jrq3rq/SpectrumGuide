import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MobileSidebar.css";
import { useUser } from "../context/UserContext";
import { useCredits } from "../hooks/useCredits";

const MobileSidebar = ({ isOpen, toggleSidebar, navItems = [] }) => {
  const { isAdmin } = useUser(); // Updated to get isAdmin from context
  const credits = useCredits(); // Use the hook to get credits

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
              {item.id === 4 && ( // Check if this is the 'Buy Credits' link
                <span className="credits-display-mobile">
                  {isAdmin ? "∞" : credits} {/* Updated here to use isAdmin */}
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
