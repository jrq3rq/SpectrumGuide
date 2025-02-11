// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBars } from "react-icons/fa";
// import "../styles/Header.css";
// import MobileSidebar from "./MobileSidebar";
// import { navItems } from "../data/navData";
// import { useUser } from "../context/UserContext";

// const Header = () => {
//   const { isAuthenticated, user, logout } = useUser();
//   const [isHidden, setIsHidden] = useState(false);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [credits, setCredits] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const controlNavbar = () => {
//       if (typeof window !== "undefined") {
//         if (window.scrollY > lastScrollY) {
//           setIsHidden(true);
//         } else {
//           setIsHidden(false);
//         }
//         setLastScrollY(window.scrollY);
//       }
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", controlNavbar);
//       return () => window.removeEventListener("scroll", controlNavbar);
//     }
//   }, [lastScrollY]);

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen((prev) => !prev);
//   };

//   const handleIdentityClick = () => {
//     if (isAuthenticated) {
//       // Display confirmation dialog before logging out
//       if (window.confirm("Are you sure you want to log out?")) {
//         logout();
//         // Since logout will change isAuthenticated to false, we'll redirect to signin
//         navigate("/");
//       }
//     } else {
//       // Redirect to SignIn component when logged out
//       navigate("/");
//     }
//   };

//   // Function to scroll to the top of the page
//   const scrollToTop = () => {
//     if (typeof window !== "undefined") {
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth", // This provides a smooth scrolling effect
//       });
//     }
//   };

//   return (
//     <header
//       className={`header ${isHidden ? "header-hidden" : ""} ${
//         !isAuthenticated ? "logged-out" : ""
//       }`}
//       role="banner"
//     >
//       <div className="header-container">
//         {/* Changed Link to div and added onClick handler */}
//         <div className="logo" onClick={scrollToTop} aria-label="Scroll to top">
//           Spectrum <div className="blue-title">Guide</div>
//         </div>
//         {isAuthenticated && (
//           <nav className="nav desktop-links">
//             {navItems.map((item) => (
//               <Link key={item.id} to={item.path} className="nav-link">
//                 {item.icon}
//                 {item.id === 4 && (
//                   <span className="credits-display">{credits}</span>
//                 )}
//                 <span>{item.name}</span>
//               </Link>
//             ))}
//           </nav>
//         )}
//         {isAuthenticated && (
//           <button
//             className={`mobile-menu-icon ${isMobileMenuOpen ? "open" : ""}`}
//             onClick={toggleMobileMenu}
//             aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
//           >
//             <FaBars />
//           </button>
//         )}
//         <div
//           className={`identity-rectangle ${
//             isAuthenticated ? "logged-in" : "logged-out"
//           }`}
//           onClick={handleIdentityClick}
//           onMouseEnter={(e) => {
//             const tooltip = document.createElement("div");
//             tooltip.className = "identity-tooltip";
//             // Check if user exists before accessing its properties
//             tooltip.textContent = isAuthenticated
//               ? user && user.displayName
//                 ? user.displayName
//                 : "User"
//               : "Login";
//             e.currentTarget.appendChild(tooltip);
//           }}
//           onMouseLeave={(e) => {
//             const tooltip = e.currentTarget.querySelector(".identity-tooltip");
//             if (tooltip) {
//               e.currentTarget.removeChild(tooltip);
//             }
//           }}
//         ></div>
//       </div>
//       {isAuthenticated && (
//         <MobileSidebar
//           isOpen={isMobileMenuOpen}
//           toggleSidebar={toggleMobileMenu}
//           navItems={navItems}
//         />
//       )}
//     </header>
//   );
// };

// export default Header;
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
