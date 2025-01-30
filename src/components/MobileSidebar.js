// src/components/MobileSidebar.js

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MobileSidebar.css";

const MobileSidebar = ({ isOpen, toggleSidebar, navItems }) => {
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
