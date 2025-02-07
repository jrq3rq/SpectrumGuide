import React from "react";

const Tooltip = ({ text, x, y }) => {
  const style = {
    position: "fixed",
    // Adjust position based on mouse coordinates (x, y)
    left: `${x + 10}px`,
    top: `${y + 10}px`,
    backgroundColor: "#02C7EB",
    color: "#000",
    padding: "10px 10px",
    width: "200px",
    borderRadius: "4px",
    fontSize: "12px",
    whiteSpace: "normal", // Allow text to wrap
    wordWrap: "break-word", // Break long words if needed
    zIndex: 1000,
    pointerEvents: "none", // Prevent tooltip from capturing mouse events
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    // opacity: 0.9,
    transition: "opacity 0.3s",
    // Optionally, you can add maxWidth to further control the container size:
    maxWidth: "200px",
    border: "1px solid #555", // A 1px solid border with a slightly lighter color than the background
  };

  return <div style={style}>{text}</div>;
};

export default Tooltip;
