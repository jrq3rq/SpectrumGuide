import React, { useState } from "react";
import "../styles/Footer.css";
import logo from "../assets/logo.png";
import YearDisplay from "./YearDisplay";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p>
            © <YearDisplay />{" "}
            <span className="brand-name">Spectrum's Guide</span>
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
