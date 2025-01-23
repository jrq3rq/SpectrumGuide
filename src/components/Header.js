import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaDollarSign,
  FaBars,
  FaRobot,
} from "react-icons/fa";
import "../styles/Header.css";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleCloseMenu = (e) => {
      if (!e.target.closest(".nav") && !e.target.closest(".mobile-menu-icon")) {
        setMobileMenuOpen(false);
      }
    };

    // Add event listener only when menu is open
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleCloseMenu);
    } else {
      document.removeEventListener("click", handleCloseMenu);
    }

    // Cleanup to avoid memory leaks
    return () => {
      document.removeEventListener("click", handleCloseMenu);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <Link to="/" className="logo" aria-label="Home">
          Spectrum Guide
        </Link>
        <nav
          className={`nav ${isMobileMenuOpen ? "open" : ""}`}
          aria-label="Main Navigation"
        >
          <Link to="/" className="nav-link" onClick={toggleMobileMenu}>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/about" className="nav-link" onClick={toggleMobileMenu}>
            <FaInfoCircle /> <span>About</span>
          </Link>
          <Link to="/payment" className="nav-link" onClick={toggleMobileMenu}>
            <FaDollarSign /> <span>Payment</span>
          </Link>
          <Link
            to="/interactions"
            className="nav-link"
            onClick={toggleMobileMenu}
          >
            <FaRobot /> <span>Logs</span>
          </Link>
        </nav>
        <button
          className="mobile-menu-icon"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <FaBars />
        </button>
      </div>
    </header>
  );
};

export default Header;
