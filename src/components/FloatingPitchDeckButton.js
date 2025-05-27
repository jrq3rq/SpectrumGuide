import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import "../styles/FloatingPitchDeckButton.css";

const FloatingPitchDeckButton = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/signin") {
      setTimeout(() => setIsVisible(true), 100); // Match FloatingInfoBot animation
    } else {
      setIsVisible(false);
    }
  }, [location]);

  return (
    <Link
      to="/investors"
      className={`floating-pitch-deck-button ${isVisible ? "slide-in" : ""}`}
      aria-label="View Pitch Deck"
    >
      <FaFileAlt className="pitch-deck-icon" />
      <span className="pitch-deck-text">Pitch Deck</span>
    </Link>
  );
};

export default FloatingPitchDeckButton;