import React from "react";
import "../styles/Footer.css";
import logo from "../assets/puzzle-1020410_640.jpg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © 2025 <span className="brand-name">Spectrum Guide AI</span>
        </p>
        <p className="founder">Founded by Tatiana & Co.</p>
        <div className="footer-logo-container">
          <img src={logo} alt="Spectrum Guide Logo" className="footer-logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
