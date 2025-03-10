import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import MobileSidebar from "./MobileSidebar";
import { navItems } from "../data/navData";
import { useUser } from "../context/UserContext";
import "../styles/Header.css";

const Header = () => {
  const { isAuthenticated, user, logout, userPlan, isAdmin, credits } =
    useUser();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const requiresProfileSetup =
    sessionStorage.getItem("requiresProfileSetup") === "true";
  const isOnCreateProfile = location.pathname === "/create-profile";

  useEffect(() => {
    console.log(
      "Header updated - isAuthenticated:",
      isAuthenticated,
      "user:",
      user,
      "isAdmin:",
      isAdmin,
      "credits:",
      credits,
      "requiresProfileSetup:",
      requiresProfileSetup
    );
  }, [isAuthenticated, user, isAdmin, credits, requiresProfileSetup]);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setIsHidden(window.scrollY > 0); // Only hide if not at top (scrollY > 0)
      } else {
        setIsHidden(false); // Always show when scrolling up or at top
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

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      try {
        await logout();
        navigate("/signin", { replace: true });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <header
        className={`header ${isHidden ? "header-hidden" : ""}`}
        role="banner"
      >
        <div className="header-container">
          <div
            className="logo"
            onClick={() => navigate("/signin", { replace: true })}
          >
            Spectrum's <span className="blue-title">AI Guide</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`header ${isHidden ? "header-hidden" : ""}`}
      role="banner"
    >
      <div className="header-container">
        <div
          className="logo"
          onClick={() => navigate("/about", { replace: true })}
        >
          Spectrum's <span className="blue-title">AI Guide</span>
        </div>

        <nav className="nav desktop-links">
          {!isOnCreateProfile &&
            !requiresProfileSetup &&
            navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="nav-link"
                onClick={(e) => {
                  console.log(
                    `Navbar clicked ${item.name} link to ${item.path}`
                  );
                  sessionStorage.setItem("lastVisitedPage", item.path);
                }}
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
        {!requiresProfileSetup && (
          <div className="header-right-icons">
            <div className="profile-menu" onClick={toggleProfileMenu}>
              <FaUserCircle className="profile-icon" />
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <span className="profile-name">
                    {user?.displayName || user?.email || "User"}
                  </span>
                  <button onClick={handleLogout} className="profile-button">
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              className={`mobile-menu-icon ${isMobileMenuOpen ? "open" : ""}`}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <FaBars />
            </button>
          </div>
        )}
      </div>
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        toggleSidebar={toggleMobileMenu}
        navItems={navItems}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        credits={credits}
        userPlan={userPlan}
      />
    </header>
  );
};

export default Header;
