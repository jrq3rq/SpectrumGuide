// // src/components/Header.js

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaBars } from "react-icons/fa";
// import "../styles/Header.css";
// import MobileSidebar from "./MobileSidebar";
// import { navItems } from "../data/navData"; // Import navigation data

// const Header = () => {
//   const [isHidden, setIsHidden] = useState(false);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Show/hide header on scroll
//   useEffect(() => {
//     const controlNavbar = () => {
//       const currentScrollY = window.scrollY;
//       if (currentScrollY > lastScrollY && currentScrollY > 80) {
//         setIsHidden(true);
//       } else {
//         setIsHidden(false);
//       }
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", controlNavbar);
//     return () => window.removeEventListener("scroll", controlNavbar);
//   }, [lastScrollY]);

//   // Toggle the mobile sidebar
//   const toggleMobileMenu = () => {
//     setMobileMenuOpen((prev) => !prev);
//   };

//   // Close sidebar if user clicks outside of it
//   useEffect(() => {
//     const handleCloseMenu = (e) => {
//       if (!e.target.closest(".nav") && !e.target.closest(".mobile-menu-icon")) {
//         setMobileMenuOpen(false);
//       }
//     };

//     if (isMobileMenuOpen) {
//       document.addEventListener("click", handleCloseMenu);
//     } else {
//       document.removeEventListener("click", handleCloseMenu);
//     }

//     return () => {
//       document.removeEventListener("click", handleCloseMenu);
//     };
//   }, [isMobileMenuOpen]);

//   return (
//     <header
//       className={`header ${isHidden ? "header-hidden" : ""}`}
//       role="banner"
//     >
//       <div className="header-container">
//         {/* Logo (always visible) */}
//         <Link to="/" className="logo" aria-label="Home">
//           Spectrum Guide
//         </Link>

//         {/* Desktop Nav */}
//         <nav className="nav desktop-links">
//           {navItems.map((item) => (
//             <Link key={item.id} to={item.path} className="nav-link">
//               {item.icon}
//               <span>{item.name}</span>
//             </Link>
//           ))}
//         </nav>

//         {/* Mobile menu icon (hamburger) */}
//         <button
//           className="mobile-menu-icon"
//           onClick={toggleMobileMenu}
//           aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
//           aria-expanded={isMobileMenuOpen}
//           aria-controls="mobile-sidebar"
//         >
//           <FaBars />
//         </button>
//       </div>

//       {/* Mobile Sidebar */}
//       <MobileSidebar
//         isOpen={isMobileMenuOpen}
//         toggleSidebar={toggleMobileMenu}
//         navItems={navItems}
//       />
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../styles/Header.css";
import MobileSidebar from "./MobileSidebar";
import { navItems } from "../data/navData";

const Header = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header
      className={`header ${isHidden ? "header-hidden" : ""}`}
      role="banner"
    >
      <div className="header-container">
        <Link to="/" className="logo" aria-label="Home">
          Spectrum <div className="blue-title">Guide</div>
        </Link>
        <nav className="nav desktop-links">
          {navItems.map((item) => (
            <Link key={item.id} to={item.path} className="nav-link">
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <button
          className={`mobile-menu-icon ${
            isMobileMenuOpen ? "open" : ""
          }`} /* Add "open" class dynamically */
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <FaBars />
        </button>
      </div>
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        toggleSidebar={toggleMobileMenu}
        navItems={navItems}
      />
    </header>
  );
};

export default Header;
