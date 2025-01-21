import React, { useState } from "react";
import "../styles/ChildProfileForm.css";

const ChildProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    diagnosisType: "",
    diagnosisDate: "",
    communication: "",
    preferredCommunication: "",
    sensorySensitivities: [],
    comfortItems: "",
    strengths: "",
    activities: "",
    triggers: [],
    challenges: [],
    sleepSchedule: "",
    eatingHabits: "",
    interactionStyle: "",
    socialSupports: "",
    learningStyle: "",
    specialInterests: "",
    allergies: [],
    medications: "",
    wanderingBehavior: "",
    safetyRisks: [],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle multi-select dropdowns
    if (type === "select-multiple") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="form-wrapper">
      {/* Left Section */}
      <div className="form-section">
        <h3>Basic Information:</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <label>
            Child’s Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter child’s name"
              required
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <h3>Diagnosis Details:</h3>
          <label>
            Diagnosis Type:
            <select
              name="diagnosisType"
              value={formData.diagnosisType}
              onChange={handleChange}
            >
              <option value="">Select Diagnosis Type</option>
              <option value="ASD Level 1">
                ASD Level 1 (Requiring Support)
              </option>
              <option value="ASD Level 2">
                ASD Level 2 (Requiring Substantial Support)
              </option>
              <option value="ASD Level 3">
                ASD Level 3 (Requiring Very Substantial Support)
              </option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Diagnosis Date:
            <input
              type="date"
              name="diagnosisDate"
              value={formData.diagnosisDate}
              onChange={handleChange}
            />
          </label>
        </form>
      </div>

      {/* Right Section */}
      <div className="form-section">
        <h3>Communication:</h3>
        <label>
          Verbal/Non-Verbal:
          <select
            name="communication"
            value={formData.communication}
            onChange={handleChange}
          >
            <option value="">Select Communication Ability</option>
            <option value="Verbal">Verbal</option>
            <option value="Limited Verbal">Limited Verbal</option>
          </select>
        </label>
        <label>
          Preferred Communication:
          <select
            name="preferredCommunication"
            value={formData.preferredCommunication}
            onChange={handleChange}
          >
            <option value="">Select Preferred Communication</option>
            <option value="Speech">Speech</option>
            <option value="AAC Device">AAC Device</option>
            <option value="Gestures">Gestures</option>
            <option value="Sign Language">Sign Language</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <h3>Sensory Preferences:</h3>
        <label>
          Sensitivities:
          <select
            name="sensorySensitivities"
            value={formData.sensorySensitivities}
            onChange={handleChange}
            multiple
          >
            <option value="Light">Light</option>
            <option value="Sound">Sound</option>
            <option value="Textures">Textures</option>
            <option value="Crowds">Crowds</option>
            <option value="Smell">Smell</option>
            <option value="Temperature">Temperature</option>
          </select>
        </label>
        <label>
          Comfort Items:
          <input
            type="text"
            name="comfortItems"
            value={formData.comfortItems}
            onChange={handleChange}
            placeholder="Enter comfort items"
          />
        </label>
        <div className="button-container">
          <button type="button">Refresh</button>
          <button type="submit">Submit</button>
          <button type="button">Download</button>
        </div>
      </div>
    </div>
  );
};

export default ChildProfileForm;
