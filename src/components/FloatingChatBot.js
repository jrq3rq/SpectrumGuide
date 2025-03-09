import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaRobot, FaBrain } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/FloatingChatBot.css";

const FloatingChatBot = ({ onClick }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/form") {
      // Delay for a smooth slide-in effect
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [location]);

  return (
    <button
      // Use 'slide-in' class for the sliding effect when visible, otherwise no class for hidden state
      className={`floating-chat-bot ${isVisible ? "slide-in" : ""}`}
      onClick={onClick}
    >
      <FaRobot className="chat-icon" />
    </button>
  );
};

export default FloatingChatBot;
