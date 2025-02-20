import React, { useState } from "react";
import "../styles/Footer.css";
import logo from "../assets/puzzle-1020410_640.jpg";
import YearDisplay from "./YearDisplay";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p>
            © <YearDisplay />{" "}
            <span className="brand-name">Spectrum Guide AI</span>
          </p>
          <p className="founder">By Tatiana & Co. </p>
          <div className="footer-logo-container">
            <img src={logo} alt="Spectrum Guide Logo" className="footer-logo" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
