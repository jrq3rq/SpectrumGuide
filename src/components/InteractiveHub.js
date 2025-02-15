import React, { useState } from "react";
import "../styles/InteractiveHub.css";
import { FaBrain, FaUtensils, FaBookOpen, FaClock } from "react-icons/fa";
import InteractiveHubToggle from "./InteractiveHubToggle";

const InteractiveHub = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    dietary: "",
    allergies: [],
    sensory: "",
    educationalLevel: "beginner",
    schedule: "",
  });

  // State for AI response
  const [aiResponse, setAiResponse] = useState(null);

  // Handling form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For allergies, we'll handle it differently since it's now an array
    if (name === "allergies") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prevState) => ({
        ...prevState,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Simulating AI processing
  const processWithAI = () => {
    // This would be where you send formData to an AI service
    // For this example, we simulate AI processing with a timeout
    setTimeout(() => {
      const response = {
        communication: {
          foodOptions: ["Apple", "Banana", "Rice Cakes"], // Example based on dietary and allergies
          drinkOptions: ["Water", "Juice"], // Example based on allergies
        },
        education: {
          content: ["Basic Numbers", "Primary Colors"], // Example based on educationalLevel
        },
        schedule: [
          { time: "8:15 AM", activity: "Reading" },
          { time: "9:00 AM", activity: "Math" },
          { time: "10:30 AM", activity: "Recess" },
        ], // Example schedule
      };
      setAiResponse(response);
    }, 2000); // Simulating a delay for AI processing
  };

  // Handling form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    processWithAI();
  };

  // Rendering AI processed data
  const renderAIResponse = () => {
    if (!aiResponse) return null;
    return (
      <div className="ai-response">
        <h2>AI Suggestions</h2>
        <div className="communication-section">
          <h3>Communication</h3>
          <p>Food Options: {aiResponse.communication.foodOptions.join(", ")}</p>
          <p>
            Drink Options: {aiResponse.communication.drinkOptions.join(", ")}
          </p>
        </div>
        <div className="education-section">
          <h3>Education</h3>
          <p>Learning Content: {aiResponse.education.content.join(", ")}</p>
        </div>
        <div className="schedule-section">
          <h3>Schedule</h3>
          <ul>
            {aiResponse.schedule.map((item, index) => (
              <li key={index}>
                {item.time} - {item.activity} <FaClock />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Options for dropdowns
  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
  ];
  const allergyOptions = [
    "Dairy",
    "Nuts",
    "Gluten",
    "Soy",
    "Eggs",
    "Fish",
    "Shellfish",
  ];
  const sensoryOptions = [
    "Sensitive to Loud Noises",
    "Prefers Low Light",
    "Likes Textures",
    "Dislikes Crowds",
  ];
  const educationalLevels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="interactive-hub">
      <div className="feature-description">
        <InteractiveHubToggle />
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="dietary">Dietary Preferences:</label>
          <select
            name="dietary"
            id="dietary"
            value={formData.dietary}
            onChange={handleInputChange}
          >
            <option value="">Select Dietary Preference</option>
            {dietaryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="allergies">Allergies:</label>
          <select
            name="allergies"
            id="allergies"
            multiple
            value={formData.allergies}
            onChange={handleInputChange}
          >
            {allergyOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="sensory">Sensory Preferences:</label>
          <select
            name="sensory"
            id="sensory"
            value={formData.sensory}
            onChange={handleInputChange}
          >
            <option value="">Select Sensory Preference</option>
            {sensoryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="educationalLevel">Educational Level:</label>
          <select
            name="educationalLevel"
            id="educationalLevel"
            value={formData.educationalLevel}
            onChange={handleInputChange}
          >
            {educationalLevels.map((level, index) => (
              <option key={index} value={level.toLowerCase()}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="schedule">
            Preferred Schedule (comma-separated times and activities):
          </label>
          <input
            type="text"
            name="schedule"
            id="schedule"
            value={formData.schedule}
            onChange={handleInputChange}
            placeholder="e.g., 8:15 AM, Reading; 9:00 AM, Math"
          />
        </div>
        <button type="submit">Submit to AI</button>
      </form>
      {renderAIResponse()}
    </div>
  );
};

export default InteractiveHub;
