import React from "react";
import ChildProfileForm from "./components/ChildProfileForm";
import "./styles/App.css"; // Import global styles

const App = () => {
  return (
    <div className="app-container">
      <h1>Autism Support Form</h1>
      <ChildProfileForm />
    </div>
  );
};

export default App;
