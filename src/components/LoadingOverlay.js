// src/components/LoadingOverlay.js

import React from "react";
import "../styles/LoadingOverlay.css"; // Create this CSS file

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay" aria-live="assertive" aria-busy="true">
      <div className="loading-icon" role="status" aria-label="Loading"></div>
    </div>
  );
};

export default LoadingOverlay;
