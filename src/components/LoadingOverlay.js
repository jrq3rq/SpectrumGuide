import React, { useEffect } from "react";
import "../styles/LoadingOverlay.css";

const LoadingOverlay = () => {
  useEffect(() => {
    // Disable background scrolling when the loading overlay is mounted
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="loading-overlay" aria-live="assertive" aria-busy="true">
      <div className="loading-icon" role="status" aria-label="Loading"></div>
    </div>
  );
};

export default LoadingOverlay;
