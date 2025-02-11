import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for type checking
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing inputs
import "../styles/ChildProfileForm.css"; // Import matching CSS
import { sendToAIService } from "../services/aiService"; // Import AI service
// import { sendToAIService } from "../services/aiServiceCredits";
import ChatModal from "./ChatModal"; // Import ChatModal
import LoadingOverlay from "./LoadingOverlay"; // Import LoadingOverlay
import { useUser } from "../context/UserContext";

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
    id: "teachersEducationalStaff",
    label: "Teachers and Educational Staff",
    reason:
      "Education is a significant part of a child's life, where they spend a considerable amount of time. Teachers can adapt the learning environment and curriculum to support the child's unique learning style and needs, directly affecting educational outcomes and social interactions.",
  },
  {
    id: "behavioralTherapists",
    label: "Behavioral Therapists/Therapists",
    reason:
      "Including Speech, Occupational, and Developmental Therapists. They work directly on the child's core challenges—communication, behavior management, sensory integration, and social skills. Therapy sessions are tailored to individual needs, making a direct impact on the child's quality of life and development.",
  },
  {
    id: "healthcareProviders",
    label: "Healthcare Providers (Pediatricians, Neurologists)",
    reason:
      "Health monitoring and medical interventions are vital. Understanding the child's autism profile helps in managing any medical issues, monitoring developmental milestones, and ensuring that physical health supports overall well-being.",
  },
  {
    id: "specialEducationCoordinators",
    label: "Special Education Coordinators",
    reason:
      "While they might not interact daily with the child, their role in orchestrating the educational environment, including IEPs and classroom modifications, is crucial for the child's academic success and inclusion.",
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
  carePlans: "Care Plans",
  importantRoles: "Important Roles",
  // Remove other fields from this mapping as they're no longer required
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
  const { userPlan } = useUser();
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
    const requiredFields = ["name", "carePlans", "importantRoles"];

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
    // Essential Information (Bolded for clarity)
    const essentialInfo = `
  **Child’s Name:** **${data.name}**
  `;

    // Important Roles (Dynamically inserted)
    const importantRolesInfo = data.importantRoles.length
      ? `**Selected Important Roles:**\n${data.importantRoles
          .map((roleId) => {
            const role = importantRoles.find((r) => r.id === roleId);
            return role ? `**${role.label}:** ${role.reason}` : "";
          })
          .join("\n")}`
      : "**No important roles selected.**";

    // Care Plans (Dynamically inserted)
    const carePlansInfo = data.carePlans.length
      ? `**Selected Care Plans:**\n${data.carePlans
          .map((planId) => {
            const plan = carePlanOptions.find((p) => p.id === planId);
            return plan ? `**${plan.label.split(":")[0]}**` : "";
          })
          .join("\n")}`
      : "**No care plans selected.**";

    // Additional Information (Only adds fields that were filled)
    const additionalInfoSections = [
      { label: "Date of Birth", value: data.dob },
      { label: "Gender", value: data.gender },
      { label: "Diagnosis Type", value: data.diagnosisType },
      { label: "Diagnosis Date", value: data.diagnosisDate },
      { label: "Communication Ability", value: data.communication },
      { label: "Preferred Communication", value: data.preferredCommunication },
      {
        label: "Sensory Sensitivities",
        value: safeJoin(data.sensorySensitivities),
      },
      { label: "Comfort Items", value: data.comfortItems },
      { label: "Strengths", value: data.strengths },
      { label: "Activities", value: data.activities },
      { label: "Triggers", value: safeJoin(data.triggers) },
      { label: "Challenges", value: safeJoin(data.challenges) },
      { label: "Sleep Schedule", value: data.sleepSchedule },
      { label: "Eating Habits", value: data.eatingHabits },
      { label: "Interaction Style", value: data.interactionStyle },
      { label: "Social Supports", value: safeJoin(data.socialSupports) },
      { label: "Learning Style", value: data.learningStyle },
      { label: "Special Interests", value: data.specialInterests },
      { label: "Allergies", value: safeJoin(data.allergies) },
      { label: "Medications", value: data.medications },
      { label: "Wandering Behavior", value: data.wanderingBehavior },
      { label: "Safety Risks", value: safeJoin(data.safetyRisks) },
      { label: "Additional Notes", value: data.notes },
    ]
      .filter((section) => section.value && section.value.trim() !== "")
      .map((section) => `**${section.label}:** ${section.value}`)
      .join("\n");

    // Care Plan Guidance
    const carePlansDescription = data.carePlans
      .map((planId) => carePlanRules[planId] || "")
      .join("\n");

    // Final AI prompt with clear **role-based** instructions
    return `
  Based on the following details, please provide **specific guidance tailored to the child's needs**, emphasizing how the selected **important roles** and **care plans** can help.

  ${essentialInfo}

  ${importantRolesInfo}

  ${carePlansInfo}

  ${
    additionalInfoSections
      ? `\n**Additional Context:**\n${additionalInfoSections}`
      : ""
  }

  **Care Plan Guidelines:**
  ${carePlansDescription}

  ### **Instructions for AI:**
  - **Ensure recommendations are role-specific.** If "Teachers and Educational Staff" is selected, provide educational strategies. If "Parents or Guardians" is selected, include home-based techniques.
  - **Provide actionable, step-by-step guidance.**
  - **Make the response clear and concise**, so caregivers and professionals can quickly understand and apply the information.
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
    } else {
      // Form validation failed
      // Error overlays will be displayed automatically
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

      <div
        className={`form-wrapper ${
          userPlan === "silver" || userPlan === "gold" ? "premium-plan" : ""
        }`}
      >
        <form onSubmit={handleSubmit} className="form-container">
          {/* Left Section: Basic Information and Diagnosis Details */}
          <div className="form-section">
            {/* Important Roles Section */}
            <div className="input-container">
              <h3 className="h3">Important Roles:</h3>
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
                <div className="error-overlay active" role="alert">
                  {errors.importantRoles}
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="input-container">
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
              </label>
              {errors.name && (
                <div className="error-overlay active" role="alert">
                  {errors.name}
                </div>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="childDOB">
                Date of Birth:
                <input
                  id="childDOB"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={errors.dob ? "input-error" : ""}
                />
              </label>
              {errors.dob && (
                <div className="error-overlay active" role="alert">
                  {errors.dob}
                </div>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="childGender">
                Gender:
                <select
                  id="childGender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? "input-error" : ""}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              {errors.gender && (
                <div className="error-overlay active" role="alert">
                  {errors.gender}
                </div>
              )}
            </div>

            {/* Diagnosis Details */}
            <div className="input-container">
              <h3>Diagnosis Details:</h3>
              <label htmlFor="diagnosisType">
                Diagnosis Type:
                <select
                  id="diagnosisType"
                  name="diagnosisType"
                  value={formData.diagnosisType}
                  onChange={handleChange}
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
              </label>
              {errors.diagnosisType && (
                <div className="error-overlay active" role="alert">
                  {errors.diagnosisType}
                </div>
              )}
            </div>

            <div className="input-container">
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
              {errors.diagnosisDate && (
                <div className="error-overlay active" role="alert">
                  {errors.diagnosisDate}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="input-container">
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
              </label>
              {errors.notes && (
                <div className="error-overlay active" role="alert">
                  {errors.notes}
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Communication, Sensory Preferences, and Care Plans */}
          <div className="form-section">
            {/* Communication Section */}
            <div className="input-container">
              <h3>Communication:</h3>
              <label htmlFor="communicationAbility">
                Communication Ability:
                <select
                  id="communicationAbility"
                  name="communication"
                  value={formData.communication}
                  onChange={handleChange}
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
              </label>
              {errors.communication && (
                <div
                  id="communication-error"
                  className="error-overlay active"
                  role="alert"
                >
                  {errors.communication}
                </div>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="preferredCommunication">
                Preferred Communication:
                <select
                  id="preferredCommunication"
                  name="preferredCommunication"
                  value={formData.preferredCommunication}
                  onChange={handleChange}
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
              </label>
              {errors.preferredCommunication && (
                <div
                  id="preferred-communication-error"
                  className="error-overlay active"
                  role="alert"
                >
                  {errors.preferredCommunication}
                </div>
              )}
            </div>

            {/* Sensory Preferences */}
            <div className="input-container">
              <h3>Sensory Preferences:</h3>
              <label htmlFor="sensorySensitivities">
                Sensitivities:
                <select
                  id="sensorySensitivities"
                  name="sensorySensitivities"
                  // className="sensorySensitivities"
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
              {errors.sensorySensitivities && (
                <div className="error-overlay active" role="alert">
                  {errors.sensorySensitivities}
                </div>
              )}
            </div>

            <div className="input-container">
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
              {errors.comfortItems && (
                <div className="error-overlay active" role="alert">
                  {errors.comfortItems}
                </div>
              )}
            </div>

            {/* Care Plans */}
            <div className="input-container">
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
                <div className="error-overlay active" role="alert">
                  {errors.carePlans}
                </div>
              )}
            </div>

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
