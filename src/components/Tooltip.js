import React from "react";

const Tooltip = ({ text, x, y }) => {
  const style = {
    position: "fixed",
    // Adjust position based on mouse coordinates (x, y)
    left: `${x + 10}px`,
    top: `${y + 10}px`,
    backgroundColor: "#E3F2FD",
    // backgroundColor: "#02C7EB",
    color: "#555",
    padding: "20px 20px",
    borderRadius: "4px",
    fontSize: "12px",
    whiteSpace: "normal", // Allow text to wrap
    wordWrap: "break-word", // Break long words if needed
    zIndex: 1000,
    pointerEvents: "none", // Prevent tooltip from capturing mouse events
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    // opacity: 0.9,
    transition: "opacity 0.3s",
    maxWidth: "300px",
    borderLeft: "4px solid #00c7eb",
    // borderTop: "1px solid #00c7eb",
    // borderRight: "1px solid #00c7eb",
    // borderBottom: "1px solid #00c7eb",
    textAlign: "left", // Add this to align text to the left
  };

  return <div style={style}>{text}</div>;
};

export default Tooltip;
