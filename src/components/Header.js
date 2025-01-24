import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaInfoCircle,
  FaDollarSign,
  FaRobot,
} from "react-icons/fa";
import "../styles/Header.css";
import MobileSidebar from "./MobileSidebar";

const Header = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // State that controls the mobile sidebar
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show/hide header on scroll
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Toggle the mobile sidebar
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Close sidebar if user clicks outside of it
  useEffect(() => {
    const handleCloseMenu = (e) => {
      if (!e.target.closest(".nav") && !e.target.closest(".mobile-menu-icon")) {
        setMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleCloseMenu);
    } else {
      document.removeEventListener("click", handleCloseMenu);
    }

    return () => {
      document.removeEventListener("click", handleCloseMenu);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`header ${isHidden ? "header-hidden" : ""}`}
      role="banner"
    >
      <div className="header-container">
        {/* Logo (always visible) */}
        <Link to="/" className="logo" aria-label="Home">
          Spectrum Guide
        </Link>

        {/* Desktop Nav (Uncommented with icons) */}
        <div className="nav desktop-links">
          <Link to="/" className="nav-link">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/about" className="nav-link">
            <FaInfoCircle />
            <span>About</span>
          </Link>
          <Link to="/payment" className="nav-link">
            <FaDollarSign />
            <span>Payment</span>
          </Link>
          <Link to="/interactions" className="nav-link">
            <FaRobot />
            <span>Logs</span>
          </Link>
        </div>

        {/* Mobile menu icon (hamburger) */}
        <button
          className="mobile-menu-icon"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <FaBars />
        </button>
      </div>

      {/* The separate mobile sidebar component */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        toggleSidebar={toggleMobileMenu}
      />
    </header>
  );
};

export default Header;
