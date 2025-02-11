import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import MobileSidebar from "./MobileSidebar";
import { navItems } from "../data/navData";
import { useUser } from "../context/UserContext";
import "../styles/Header.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useUser();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const toggleProfileMenu = () => {
    setProfileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <header
      className={`header ${isHidden ? "header-hidden" : ""}`}
      role="banner"
    >
      <div className="header-container">
        <div className="logo" onClick={() => navigate("/")}>
          Spectrum <span className="blue-title">Guide</span>
        </div>

        {isAuthenticated && (
          <nav className="nav desktop-links">
            {navItems.map((item) => (
              <Link key={item.id} to={item.path} className="nav-link">
                {item.icon}
                {item.id === 4 && (
                  <span className="credits-display">{credits}</span>
                )}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        )}
        <div className="header-right-icons">
          {isAuthenticated ? (
            <div className="profile-menu" onClick={toggleProfileMenu}>
              <FaUserCircle className="profile-icon" />
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <span className="profile-name">
                    {user?.displayName || "User"}
                  </span>
                  <button onClick={handleLogout} className="profile-button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}{" "}
          {/* This renders nothing when not authenticated */}
          {isAuthenticated && (
            <button
              className={`mobile-menu-icon ${isMobileMenuOpen ? "open" : ""}`}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <FaBars />
            </button>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          toggleSidebar={toggleMobileMenu}
          navItems={navItems}
        />
      )}
    </header>
  );
};

export default Header;
