import React from "react";
import "../styles/Main.css"; // Add styles specific to the About page if needed
import ChildProfileForm from "../components/ChildProfileForm";

const Main = () => {
  return (
    <div className="main-page">
      <ChildProfileForm />
    </div>
  );
};

export default Main;
