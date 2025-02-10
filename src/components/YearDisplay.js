// components/YearDisplay.js
import React from "react";

const YearDisplay = () => {
  const currentYear = new Date().getFullYear();
  return <span>{currentYear}</span>;
};

export default YearDisplay;
