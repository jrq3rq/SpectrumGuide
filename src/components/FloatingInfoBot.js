import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/FloatingInfoBot.css";

const FloatingInfoBot = ({ onClick }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/signin") {
      // Delay for a smooth slide-in effect
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [location]);

  return (
    <button
      className={`floating-info-bot ${isVisible ? "slide-in" : ""}`}
      onClick={onClick}
    >
      <FaInfoCircle className="info-icon" />
    </button>
  );
};

export default FloatingInfoBot;
