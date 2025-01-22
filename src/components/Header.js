import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaDollarSign, FaBars } from "react-icons/fa";
import "../styles/Header.css";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

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
            <FaHome /> Home
          </Link>
          <Link to="/about" className="nav-link" onClick={toggleMobileMenu}>
            <FaInfoCircle /> About
          </Link>
          <Link to="/payment" className="nav-link" onClick={toggleMobileMenu}>
            <FaDollarSign /> Payment
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
