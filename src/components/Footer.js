import React from "react";
import "../styles/Footer.css";
// import logo from "../assets/favicon-32x32.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* <img src={logo} alt="Spectrum Guide Logo" className="footer-logo" /> */}
        <p>
          © 2025 <span className="brand-name">Spectrum Guide AI</span>
        </p>
        <p className="founder">Founded by Tatiana Reyes & Co.</p>
      </div>
    </footer>
  );
};

export default Footer;
