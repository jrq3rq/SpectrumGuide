import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaDollarSign, FaRobot } from "react-icons/fa";

/**
 * A dedicated MobileSidebar with inline styles.
 * Receives isOpen & toggleSidebar from Header.
 * Slides in left-to-right if isOpen === true.
 */
const MobileSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      style={{
        ...styles.sidebar,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <Link to="/" style={styles.navLink} onClick={toggleSidebar}>
        <FaHome style={styles.icon} />
        <span>Home</span>
      </Link>
      <Link to="/about" style={styles.navLink} onClick={toggleSidebar}>
        <FaInfoCircle style={styles.icon} />
        <span>About</span>
      </Link>
      <Link to="/payment" style={styles.navLink} onClick={toggleSidebar}>
        <FaDollarSign style={styles.icon} />
        <span>Payment</span>
      </Link>
      <Link to="/interactions" style={styles.navLink} onClick={toggleSidebar}>
        <FaRobot style={styles.icon} />
        <span>Logs</span>
      </Link>
    </div>
  );
};

const styles = {
  sidebar: {
    position: "fixed",
    top: 60, // match header height offset
    left: 0,
    width: "100%",
    height: "calc(100vh - 70px)",
    backgroundColor: "#4a90e2",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    transition: "transform 0.3s ease-in-out",
    zIndex: 1999,
  },
  navLink: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    padding: "15px 0",
    width: "100%",
    textAlign: "center",
    transition: "color 0.3s ease, transform 0.3s ease",
  },
  icon: {
    marginBottom: 5,
  },
};

export default MobileSidebar;
