import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for type checking
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing inputs
import "../styles/ChildProfileForm.css"; // Import matching CSS
import { sendToAIService } from "../services/aiService"; // Import AI service
import ChatModal from "./ChatModal"; // Import ChatModal
import LoadingOverlay from "./LoadingOverlay"; // Import LoadingOverlay

// Define carePlanRules
const carePlanRules = {
  customizedCarePlans: `
    - Tailor daily routines and care strategies to align with individual strengths, sensory preferences, and triggers.
    - Ensure a supportive and nurturing environment by accommodating the child's specific needs.
  `,
  educationalSupport: `
    - Develop personalized learning approaches or Individualized Education Plans (IEPs) based on the child's preferred communication styles, learning methods, and interests.
    - Optimize educational outcomes by adapting teaching methods to suit the child's unique learning style.
  `,
  behavioralSensoryManagement: `
    - Proactively manage the child's sensory sensitivities, challenges, and triggers.
    - Implement strategies to reduce stress and improve overall well-being by addressing sensory-related issues.
  `,
  safetyEmergencyPlanning: `
    - Address safety risks, wandering behaviors, and allergies to create safe environments at home, school, and in public spaces.
    - Develop emergency plans tailored to the child's specific safety needs.
  `,
  strengthBasedActivities: `
    - Highlight the child's strengths and special interests to boost confidence.
    - Encourage independence and foster enjoyable, meaningful experiences through activities aligned with the child's interests.
  `,
};

// Define Important Roles with Descriptions
const importantRoles = [
  {
    id: "parentsGuardians",
    label: "Parents or Guardians",
    reason:
      "They are with the child 24/7, providing the most consistent and immediate support. Their understanding and application of the child's needs directly impact daily life, safety, and emotional well-being.",
  },
  {
    id: "behavioralTherapists",
    label: "Behavioral Therapists/Therapists",
    reason:
      "Including Speech, Occupational, and Developmental Therapists. They work directly on the child's core challenges—communication, behavior management, sensory integration, and social skills. Therapy sessions are tailored to individual needs, making a direct impact on the child's quality of life and development.",
  },
  {
    id: "teachersEducationalStaff",
    label: "Teachers and Educational Staff",
    reason:
      "Education is a significant part of a child's life, where they spend a considerable amount of time. Teachers can adapt the learning environment and curriculum to support the child's unique learning style and needs, directly affecting educational outcomes and social interactions.",
  },
  {
    id: "specialEducationCoordinators",
    label: "Special Education Coordinators",
    reason:
      "While they might not interact daily with the child, their role in orchestrating the educational environment, including IEPs and classroom modifications, is crucial for the child's academic success and inclusion.",
  },
  {
    id: "healthcareProviders",
    label: "Healthcare Providers (Pediatricians, Neurologists)",
    reason:
      "Health monitoring and medical interventions are vital. Understanding the child's autism profile helps in managing any medical issues, monitoring developmental milestones, and ensuring that physical health supports overall well-being.",
  },
  {
    id: "recreationalTherapists",
    label: "Recreational Therapists or Program Coordinators",
    reason:
      "They provide opportunities for social interaction, physical activity, and personal growth in a therapeutic context. These activities can be crucial for social skills, self-esteem, and leisure enjoyment, which are often challenging areas for children with autism.",
  },
  {
    id: "socialWorkers",
    label: "Social Workers or Case Managers",
    reason:
      "Although they do not provide direct daily care, their role in navigating systems, advocating for services, and connecting families to resources can significantly influence the support network around the child, indirectly but importantly affecting their life.",
  },
];

// Field labels for more descriptive error messages
const fieldLabels = {
  name: "Child’s Name",
  dob: "Date of Birth",
  gender: "Gender",
  diagnosisType: "Diagnosis Type",
  communication: "Communication Ability",
  preferredCommunication: "Preferred Communication",
  carePlans: "Care Plans",
  importantRoles: "Important Roles",
  // Add more mappings if needed
};

const ChildProfileForm = () => {
  const [formData, setFormData] = useState({
    importantRoles: [], // New field for selected roles
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
    socialSupports: [],
    learningStyle: "",
    specialInterests: "",
    allergies: [],
    medications: "",
    wanderingBehavior: "",
    safetyRisks: [],
    carePlans: [], // Store selected care plan IDs
    notes: "", // New field for additional information
  });

  // Define error state
  const [errors, setErrors] = useState({});

  // Define loading and modal state
  const [isLoading, setIsLoading] = useState(false); // For loading overlay
  const [isModalOpen, setIsModalOpen] = useState(false); // Initially closed
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState("");

  // Options for the Care Plans (linked to carePlanRules)
  const carePlanOptions = [
    {
      id: "customizedCarePlans",
      label:
        "Customized Care Plans: Tailor daily routines and care strategies to align with individual strengths, sensory preferences, and triggers, ensuring a supportive and nurturing environment.",
    },
    {
      id: "educationalSupport",
      label:
        "Educational Support: Develop personalized learning approaches or Individualized Education Plans (IEPs) based on preferred communication styles, learning methods, and interests to optimize educational outcomes.",
    },
    {
      id: "behavioralSensoryManagement",
      label:
        "Behavioral and Sensory Management: Proactively manage sensory sensitivities, challenges, and triggers to reduce stress and improve overall well-being.",
    },
    {
      id: "safetyEmergencyPlanning",
      label:
        "Safety and Emergency Planning: Address safety risks, wandering behaviors, and allergies to create safe environments at home, school, and in public spaces.",
    },
    {
      id: "strengthBasedActivities",
      label:
        "Strength-Based Activities: Highlight strengths and special interests to boost confidence, encourage independence, and foster enjoyable, meaningful experiences.",
    },
  ];

  // Handle field changes (including multi-select care plans and importantRoles)
  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;

    if (type === "checkbox") {
      if (name === "carePlans" || name === "importantRoles") {
        if (checked) {
          // Add the selected option
          setFormData((prev) => ({
            ...prev,
            [name]: [...prev[name], value],
          }));
        } else {
          // Remove the unselected option
          setFormData((prev) => ({
            ...prev,
            [name]: prev[name].filter((item) => item !== value),
          }));
        }
        // Clear error message for the field
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
      // Clear error message for the field
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error message for the field as the user types
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "dob",
      "gender",
      "diagnosisType",
      "communication",
      "preferredCommunication",
      "carePlans",
      "importantRoles", // Add this field
      // "notes", // Uncomment if notes are required
    ];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = `${fieldLabels[field]} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to join arrays into a comma-separated string
  const safeJoin = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

  // Construct the AI prompt referencing carePlanRules
  const constructAIPrompt = (data) => {
    const dataDescription = `
Child’s Name: ${data.name}
Date of Birth: ${data.dob}
Gender: ${data.gender}
Diagnosis Type: ${data.diagnosisType}
Diagnosis Date: ${data.diagnosisDate}
Communication Ability: ${data.communication}
Preferred Communication: ${data.preferredCommunication}
Sensory Sensitivities: ${safeJoin(data.sensorySensitivities)}
Comfort Items: ${data.comfortItems}
Strengths: ${data.strengths}
Activities: ${data.activities}
Triggers: ${safeJoin(data.triggers)}
Challenges: ${safeJoin(data.challenges)}
Sleep Schedule: ${data.sleepSchedule}
Eating Habits: ${data.eatingHabits}
Interaction Style: ${data.interactionStyle}
Social Supports: ${safeJoin(data.socialSupports)}
Learning Style: ${data.learningStyle}
Special Interests: ${data.specialInterests}
Allergies: ${safeJoin(data.allergies)}
Medications: ${data.medications}
Wandering Behavior: ${data.wanderingBehavior}
Safety Risks: ${safeJoin(data.safetyRisks)}
Additional Notes: ${data.notes}
Important Roles:
${data.importantRoles
  .map((roleId) => {
    const role = importantRoles.find((r) => r.id === roleId);
    if (role) {
      // Check if reason exists
      return role.reason ? `${role.label}: ${role.reason}` : `${role.label}`;
    }
    return "";
  })
  .filter((line) => line !== "")
  .join("\n")}
`;

    // Translate selected care plans into a guidelines string
    const carePlansDescription = (data.carePlans || [])
      .map((planId) => {
        if (carePlanRules[planId]) {
          return carePlanRules[planId];
        }
        return "";
      })
      .join("\n");

    // Final combined prompt
    return `
Based on the following information, please provide detailed suggestions adhering to the specified care plans and important roles:

${dataDescription}

Care Plan Guidelines:
${carePlansDescription}

Please ensure that the recommendations are clear, actionable, and tailored to the child's needs, emphasizing readability and ease of understanding for the parents.
    `;
  };

  // Handle form submission with duplicate check
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setIsLoading(true); // Start loading

      try {
        // Sanitize all inputs before constructing the prompt
        const sanitizedFormData = {
          ...formData,
          name: DOMPurify.sanitize(formData.name),
          comfortItems: DOMPurify.sanitize(formData.comfortItems),
          strengths: DOMPurify.sanitize(formData.strengths),
          activities: DOMPurify.sanitize(formData.activities),
          sleepSchedule: DOMPurify.sanitize(formData.sleepSchedule),
          eatingHabits: DOMPurify.sanitize(formData.eatingHabits),
          interactionStyle: DOMPurify.sanitize(formData.interactionStyle),
          learningStyle: DOMPurify.sanitize(formData.learningStyle),
          specialInterests: DOMPurify.sanitize(formData.specialInterests),
          medications: DOMPurify.sanitize(formData.medications),
          wanderingBehavior: DOMPurify.sanitize(formData.wanderingBehavior),
          notes: DOMPurify.sanitize(formData.notes),
        };

        const prompt = constructAIPrompt(sanitizedFormData);

        // Check if this prompt was submitted recently
        if (prompt !== lastSubmittedPrompt) {
          setLastSubmittedPrompt(prompt);
          const aiResponse = await sendToAIService(prompt);
          setAiPrompt(aiResponse);
          setIsModalOpen(true);
        } else {
          console.log("Duplicate prompt detected. Not sending.");
          // Optionally, you could show a user message or do nothing
          alert(
            "You have already submitted this information. Please modify your inputs if you need to make changes."
          );
        }
      } catch (error) {
        console.error("Error calling AI service:", error);
        setAiPrompt("Sorry, something went wrong. Please try again later.");
        setIsModalOpen(true);
      } finally {
        setIsSubmitting(false);
        setIsLoading(false); // Stop loading
      }
    }
  };

  // Handle form reset (Refresh button)
  const handleReset = () => {
    setFormData({
      importantRoles: [], // Reset importantRoles
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
      socialSupports: [],
      learningStyle: "",
      specialInterests: "",
      allergies: [],
      medications: "",
      wanderingBehavior: "",
      safetyRisks: [],
      carePlans: [],
      notes: "", // Reset notes
    });
    setErrors({});
    setLastSubmittedPrompt(""); // Reset the last submitted prompt on form reset
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-container">
          {/* Left Section: Basic Information and Diagnosis Details */}
          <div className="form-section">
            {/* Important Roles Section */}
            <h3>Important Roles:</h3>
            <div className="important-roles-container">
              {importantRoles.map((role) => (
                <div key={role.id} className="important-role-option">
                  <label>
                    <input
                      type="checkbox"
                      name="importantRoles"
                      value={role.id}
                      checked={formData.importantRoles.includes(role.id)}
                      onChange={handleChange}
                    />
                    <span className="role-label">{role.label}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.importantRoles && (
              <small className="error-text" role="alert">
                {errors.importantRoles}
              </small>
            )}

            {/* Basic Information */}
            <h3>Basic Information:</h3>
            <label htmlFor="childName">
              Child’s Name:
              <input
                id="childName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter child’s name"
                required
                maxLength={100} // Limit input length
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <small className="error-text" role="alert">
                  {errors.name}
                </small>
              )}
            </label>
            <label htmlFor="childDOB">
              Date of Birth:
              <input
                id="childDOB"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className={errors.dob ? "input-error" : ""}
              />
              {errors.dob && (
                <small className="error-text" role="alert">
                  {errors.dob}
                </small>
              )}
            </label>
            <label htmlFor="childGender">
              Gender:
              <select
                id="childGender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={errors.gender ? "input-error" : ""}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <small className="error-text" role="alert">
                  {errors.gender}
                </small>
              )}
            </label>

            {/* Diagnosis Details */}
            <h3>Diagnosis Details:</h3>
            <label htmlFor="diagnosisType">
              Diagnosis Type:
              <select
                id="diagnosisType"
                name="diagnosisType"
                value={formData.diagnosisType}
                onChange={handleChange}
                required
                className={errors.diagnosisType ? "input-error" : ""}
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
              {errors.diagnosisType && (
                <small className="error-text" role="alert">
                  {errors.diagnosisType}
                </small>
              )}
            </label>
            <label htmlFor="diagnosisDate">
              Diagnosis Date:
              <input
                id="diagnosisDate"
                type="date"
                name="diagnosisDate"
                value={formData.diagnosisDate}
                onChange={handleChange}
              />
            </label>

            {/* Additional Notes */}
            <label htmlFor="additionalNotes">
              Additional Notes:
              <textarea
                id="additionalNotes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any additional information here..."
                rows={4} // Adjust rows as needed
                maxLength={500} // Limit input length
                className={errors.notes ? "input-error" : ""}
              ></textarea>
              {errors.notes && (
                <small className="error-text" role="alert">
                  {errors.notes}
                </small>
              )}
            </label>
          </div>

          {/* Right Section: Communication, Sensory Preferences, and Care Plans */}
          <div className="form-section">
            <h3>Communication:</h3>
            <label htmlFor="communicationAbility">
              Communication Ability:
              <select
                id="communicationAbility"
                name="communication"
                value={formData.communication}
                onChange={handleChange}
                required
                className={errors.communication ? "input-error" : ""}
                aria-describedby={
                  errors.communication ? "communication-error" : undefined
                }
              >
                <option value="">Select Communication Ability</option>
                <option value="Verbal">Verbal</option>
                <option value="Limited Verbal">Limited Verbal</option>
                <option value="Non-Verbal">Non-Verbal</option>
                <option value="Uses Assistive Devices">
                  Uses Assistive Devices
                </option>
              </select>
              {errors.communication && (
                <small
                  id="communication-error"
                  className="error-text"
                  role="alert"
                >
                  {errors.communication}
                </small>
              )}
            </label>
            <label htmlFor="preferredCommunication">
              Preferred Communication:
              <select
                id="preferredCommunication"
                name="preferredCommunication"
                value={formData.preferredCommunication}
                onChange={handleChange}
                required
                className={errors.preferredCommunication ? "input-error" : ""}
                aria-describedby={
                  errors.preferredCommunication
                    ? "preferred-communication-error"
                    : undefined
                }
              >
                <option value="">Select Preferred Communication</option>
                <option value="Speech">Speech</option>
                <option value="AAC Device">AAC Device</option>
                <option value="Gestures">Gestures</option>
                <option value="Sign Language">Sign Language</option>
                <option value="Other">Other</option>
              </select>
              {errors.preferredCommunication && (
                <small
                  id="preferred-communication-error"
                  className="error-text"
                  role="alert"
                >
                  {errors.preferredCommunication}
                </small>
              )}
            </label>

            {/* Sensory Preferences */}
            <h3>Sensory Preferences:</h3>
            <label htmlFor="sensorySensitivities">
              Sensitivities:
              <select
                id="sensorySensitivities"
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
            <label htmlFor="comfortItems">
              Comfort Items:
              <input
                id="comfortItems"
                type="text"
                name="comfortItems"
                value={formData.comfortItems}
                onChange={handleChange}
                placeholder="Enter comfort items"
                maxLength={100} // Limit input length
              />
            </label>

            {/* Care Plans */}
            <h3>Care Plans:</h3>
            <div className="care-plans-container">
              {carePlanOptions.map((plan) => (
                <label key={plan.id} className="care-plan-option">
                  <input
                    type="checkbox"
                    name="carePlans"
                    value={plan.id}
                    checked={formData.carePlans.includes(plan.id)}
                    onChange={handleChange}
                  />
                  <span className="care-plan-label">
                    {plan.label.split(":")[0]}
                  </span>
                </label>
              ))}
            </div>
            {errors.carePlans && (
              <small className="error-text" role="alert">
                {errors.carePlans}
              </small>
            )}

            {/* Buttons */}
            <div className="button-container">
              <button type="button" onClick={handleReset}>
                Refresh
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ChatModal is conditionally rendered */}
      {isModalOpen && (
        <div className="modal-overlay">
          <ChatModal
            initialPrompt={aiPrompt}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

// Define PropTypes (if any props are used)
ChildProfileForm.propTypes = {
  // Example:
  // someProp: PropTypes.string.isRequired,
};

export default ChildProfileForm;
