import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import "../styles/ChildProfileForm.css";
import { sendToAIService } from "../services/aiServiceImageGen";
import ChatModal from "./ChatModal";
import LoadingOverlay from "./LoadingOverlay";
import { useUser } from "../context/UserContext";
import FloatingChatBot from "./FloatingChatBot";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import useCreditTracker from "../hooks/useCreditTracker";
import { firestore } from "../firebase";

// Custom multi-select component
const CustomMultiSelect = ({ name, value, options, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((val) => val !== optionValue)
      : [...value, optionValue];
    onChange({ target: { name, value: newValue } });
  };

  const displayedValue =
    value.length > 0
      ? value
          .map((val) => options.find((opt) => opt.value === val)?.label || val)
          .join(", ")
      : "Select options...";

  return (
    <div className="custom-multi-select" ref={dropdownRef}>
      <div
        className={`select-display ${error ? "input-error" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {displayedValue}
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options
            .filter((option) => option.value !== "") // Exclude the placeholder option
            .map((option) => (
              <label key={option.value} className="dropdown-option">
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
        </div>
      )}
    </div>
  );
};

// Care plan rules in sentence case (already correct)
const carePlanRules = {
  customizedCarePlans: `
    - Tailor daily routines and care strategies to align with individual strengths, sensory preferences, and triggers.
    - Ensure a supportive and nurturing environment by accommodating the child's specific needs.
  `,
  educationalSupport: `
    - Develop personalized learning approaches or individualized education plans (IEPs) based on the child's preferred communication styles, learning methods, and interests.
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

// Important roles in sentence case (already correct)
const importantRoles = [
  {
    id: "parentsGuardians",
    label: "Parents or guardians",
    reason:
      "They are with the child 24/7, providing the most consistent and immediate support. Their understanding and application of the child's needs directly impact daily life, safety, and emotional well-being.",
  },
  {
    id: "teachersEducationalStaff",
    label: "Teachers and educational staff",
    reason:
      "Education is a significant part of a child's life, where they spend a considerable amount of time. Teachers can adapt the learning environment and curriculum to support the child's unique learning style and needs, directly affecting educational outcomes and social interactions.",
  },
  {
    id: "behavioralTherapists",
    label: "Behavioral therapists/therapists",
    reason:
      "Including speech, occupational, and developmental therapists. They work directly on the child's core challenges—communication, behavior management, sensory integration, and social skills. Therapy sessions are tailored to individual needs, making a direct impact on the child's quality of life and development.",
  },
  {
    id: "healthcareProviders",
    label: "Healthcare providers (pediatricians, neurologists)",
    reason:
      "Health monitoring and medical interventions are vital. Understanding the child's autism profile helps in managing any medical issues, monitoring developmental milestones, and ensuring that physical health supports overall well-being.",
  },
  {
    id: "specialEducationCoordinators",
    label: "Special education coordinators",
    reason:
      "While they might not interact daily with the child, their role in orchestrating the educational environment, including IEPs and classroom modifications, is crucial for the child's academic success and inclusion.",
  },
  {
    id: "recreationalTherapists",
    label: "Recreational therapists or program coordinators",
    reason:
      "They provide opportunities for social interaction, physical activity, and personal growth in a therapeutic context. These activities can be crucial for social skills, self-esteem, and leisure enjoyment, which are often challenging areas for children with autism.",
  },
  {
    id: "socialWorkers",
    label: "Social workers or case managers",
    reason:
      "Although they do not provide daily care, their role in navigating systems, advocating for services, and connecting families to resources can significantly influence the support network around the child, indirectly but importantly affecting their life.",
  },
];

// Field labels in sentence case (already correct)
const fieldLabels = {
  name: "Child's name",
  carePlans: "Care plans",
  importantRoles: "Important roles",
};

const ChildProfileForm = ({ onLoad }) => {
  const [formData, setFormData] = useState({
    importantRoles: [],
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
    notes: "",
    dietRestrictions: [],
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState("");
  const {
    user,
    userPlan,
    isAdmin,
    credits: initialCredits,
    aiUsage: initialAiUsage,
    addMessageToHistory,
  } = useUser();
  const location = useLocation();

  // Initialize credit tracking
  const { credits, interactWithAIFeature } = useCreditTracker({
    firestore,
    uid: user?.uid,
    initialCredits: isAdmin ? 999999 : initialCredits || 0,
    initialAiUsage: initialAiUsage || { carePlans: 0, stories: 0, aiChats: 0 },
    plan: userPlan,
    isAdmin,
  });

  // Care plan options in sentence case (already correct)
  const carePlanOptions = [
    {
      id: "customizedCarePlans",
      label:
        "Customized care plans: Tailor daily routines and care strategies to align with individual strengths, sensory preferences, and triggers, ensuring a supportive and nurturing environment.",
    },
    {
      id: "educationalSupport",
      label:
        "Educational support: Develop personalized learning approaches or individualized education plans (IEPs) based on preferred communication styles, learning methods, and interests to optimize educational outcomes.",
    },
    {
      id: "behavioralSensoryManagement",
      label:
        "Behavioral and sensory management: Proactively manage sensory sensitivities, challenges, and triggers to reduce stress and improve overall well-being.",
    },
    {
      id: "safetyEmergencyPlanning",
      label:
        "Safety and emergency planning: Address safety risks, wandering behaviors, and allergies to create safe environments at home, school, and in public spaces.",
    },
    {
      id: "strengthBasedActivities",
      label:
        "Strength-based activities: Highlight strengths and special interests to boost confidence, encourage independence, and foster enjoyable, meaningful experiences.",
    },
    {
      id: "dietFocusedCarePlan",
      label:
        "Diet-focused care plan: Creates a care plan tailored exclusively to special diet restrictions (e.g., gluten-free, no peanuts) to enhance safety and address sensory sensitivities and allergies (20-40% of autistic kids affected).",
    },
  ];

  // Sensory sensitivity options in sentence case
  const sensorySensitivityOptions = [
    { value: "", label: "Select sensory sensitivities" },
    { value: "Light", label: "Light (e.g., bright lights cause discomfort)" },
    { value: "Sound", label: "Sound (e.g., loud noises trigger distress)" },
    {
      value: "Textures",
      label: "Textures (e.g., certain food/cloth textures)",
    },
    { value: "Crowds", label: "Crowds (e.g., social overload)" },
    { value: "Smell", label: "Smell (e.g., strong odors like soy)" },
    { value: "Temperature", label: "Temperature (e.g., hot/cold sensitivity)" },
    { value: "Taste", label: "Taste (e.g., bitter or spicy aversion)" },
    { value: "Touch", label: "Touch (e.g., aversion to specific touches)" },
    { value: "None", label: "None" },
  ];

  // Diet restriction options in sentence case
  const dietRestrictionOptions = [
    { value: "", label: "Select diet restrictions" },
    { value: "Gluten-Free", label: "Gluten-free (e.g., wheat sensitivity)" },
    { value: "Dairy-Free", label: "Dairy-free (e.g., lactose intolerance)" },
    { value: "No Peanuts", label: "No peanuts (allergy risk)" },
    {
      value: "No Tree Nuts",
      label: "No tree nuts (allergy risk, e.g., almonds, walnuts)",
    },
    { value: "No Soy", label: "No soy (sensory aversion or allergy)" },
    { value: "No Eggs", label: "No eggs (allergy or texture aversion)" },
    {
      value: "No Shellfish",
      label: "No shellfish (allergy risk, e.g., shrimp, crab)",
    },
    {
      value: "No Artificial Colors/Flavors",
      label: "No artificial colors/flavors (behavioral trigger)",
    },
    { value: "Low Sugar", label: "Low sugar (reduces hyperactivity)" },
    {
      value: "No Red Meat",
      label: "No red meat (sensory aversion to texture/smell)",
    },
    {
      value: "Vegetarian",
      label: "Vegetarian (ethical or sensory preference)",
    },
    { value: "Vegan", label: "Vegan (ethical or sensory preference)" },
    { value: "Ketogenic", label: "Ketogenic (e.g., for seizure management)" },
    {
      value: "Low FODMAP",
      label: "Low FODMAP (e.g., for gastrointestinal issues)",
    },
    { value: "Halal", label: "Halal (cultural/religious requirement)" },
    { value: "Kosher", label: "Kosher (cultural/religious requirement)" },
    { value: "NKA (No Known Allergies)", label: "NKA (no known allergies)" },
    { value: "Other", label: "Other (specify in notes)" },
  ];

  useEffect(() => {
    if (location.state?.showLoading) {
      onLoad(location.state);
    }
  }, [location.state, onLoad]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "carePlans" || name === "importantRoles") {
        if (checked) {
          setFormData((prev) => ({
            ...prev,
            [name]: [...prev[name], value],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: prev[name].filter((item) => item !== value),
          }));
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["name", "carePlans", "importantRoles"];
    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = `${fieldLabels[field]} is required.`;
      }
    });
    // Optional: Add validation for sensory sensitivities and diet restrictions if needed
    if (
      formData.carePlans.includes("behavioralSensoryManagement") &&
      !formData.sensorySensitivities.length
    ) {
      newErrors.sensorySensitivities =
        "At least one sensory sensitivity is required for behavioral and sensory management.";
    }
    if (
      formData.carePlans.includes("dietFocusedCarePlan") &&
      !formData.dietRestrictions.length
    ) {
      newErrors.dietRestrictions =
        "At least one diet restriction is required for diet-focused care plan.";
    }
    // Check for conflicting diet restrictions
    if (
      formData.dietRestrictions.includes("NKA (No Known Allergies)") &&
      formData.dietRestrictions.length > 1
    ) {
      newErrors.dietRestrictions =
        "Cannot select 'NKA (no known allergies)' with other restrictions.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const safeJoin = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

  const constructAiPrompt = (data) => {
    const essentialInfo = `**Child's name:** ${data.name}`;
    const importantRolesInfo = data.importantRoles.length
      ? `**Selected important roles:**\n${data.importantRoles
          .map((roleId) => {
            const role = importantRoles.find((r) => r.id === roleId);
            return role ? `**${role.label}:** ${role.reason}` : "";
          })
          .join("\n")}`
      : "**No important roles selected.**";
    const carePlansInfo = data.carePlans.length
      ? `**Selected care plans:**\n${data.carePlans
          .map((planId) => {
            const plan = carePlanOptions.find((p) => p.id === planId);
            return plan ? `**${plan.label.split(":")[0]}**` : "";
          })
          .join("\n")}`
      : "**No care plans selected.**";
    const sensorySensitivitiesInfo = data.sensorySensitivities.length
      ? `**Sensory sensitivities:** ${safeJoin(
          data.sensorySensitivities
        )} (triggers affecting daily comfort)`
      : "**No sensory sensitivities specified.**";
    const dietRestrictionsInfo = data.dietRestrictions.length
      ? `**Diet restrictions:** ${safeJoin(data.dietRestrictions)}${
          data.dietRestrictions.includes("Other") && data.notes
            ? ` (Other details: ${data.notes})`
            : ""
        } (e.g., gluten-free, no peanuts to address sensory sensitivities and allergies, affecting 20-40% of autistic kids per studies like Aponte & Romanczyk)`
      : "**No diet restrictions specified.**";
    const ageInfo = data.age
      ? `**Age:** ${data.age} (used to tailor social stories and content for developmental relevance, e.g., simpler narratives for a 5-year-old or job skills for a 15-year-old)`
      : "**No age specified.**";
    const additionalInfoSections = [
      { label: "Date of birth", value: data.dob },
      { label: "Gender", value: data.gender },
      { label: "Diagnosis type", value: data.diagnosisType },
      { label: "Diagnosis date", value: data.diagnosisDate },
      { label: "Communication ability", value: data.communication },
      { label: "Preferred communication", value: data.preferredCommunication },
      { label: "Comfort items", value: data.comfortItems },
      { label: "Strengths", value: data.strengths },
      { label: "Activities", value: data.activities },
      { label: "Triggers", value: safeJoin(data.triggers) },
      { label: "Challenges", value: safeJoin(data.challenges) },
      { label: "Sleep schedule", value: data.sleepSchedule },
      { label: "Eating habits", value: data.eatingHabits },
      { label: "Interaction style", value: data.interactionStyle },
      { label: "Social supports", value: safeJoin(data.socialSupports) },
      { label: "Learning style", value: data.learningStyle },
      { label: "Special interests", value: data.specialInterests },
      { label: "Allergies", value: safeJoin(data.allergies) },
      { label: "Medications", value: data.medications },
      { label: "Wandering behavior", value: data.wanderingBehavior },
      { label: "Safety risks", value: safeJoin(data.safetyRisks) },
      { label: "Additional notes", value: data.notes },
    ]
      .filter((section) => section.value && section.value.trim() !== "")
      .map((section) => `**${section.label}:** ${section.value}`)
      .join("\n");
    const carePlansDescription = data.carePlans
      .map((planId) => carePlanRules[planId] || "")
      .join("\n");
    return `
  Based on the following details, provide specific guidance tailored to the child's needs, emphasizing how the selected important roles and care plans can help.
  ${essentialInfo}
  ${importantRolesInfo}
  ${carePlansInfo}
  ${sensorySensitivitiesInfo}
  ${dietRestrictionsInfo}
  ${ageInfo}
  ${
    additionalInfoSections
      ? `\n**Additional context:**\n${additionalInfoSections}`
      : ""
  }
  **Care plan guidelines:**
  ${carePlansDescription}
  ### Instructions for AI:
  - Ensure recommendations are role-specific. If "teachers and educational staff" is selected, provide educational strategies. If "parents or guardians" is selected, include home-based techniques.
  - If "diet-focused care plan" is selected, focus on customizing routines with the specified diet restrictions (e.g., gluten-free snacks, no peanut exposure) to enhance safety and address sensory/allergy needs (20-40% of autistic kids affected).
  - If "behavioral and sensory management" is selected, incorporate strategies to mitigate the identified sensory sensitivities (e.g., dim lights for light sensitivity, ear protection for sound sensitivity).
  - Tailor social stories and content based on age (e.g., simpler narratives for younger children, job skills for teens) to ensure developmental relevance and improve engagement when age is provided.
  - Provide actionable, step-by-step guidance combining all inputs to reduce caregiver guesswork and align support with individual needs.
  - Make the response clear and concise, so caregivers and professionals can quickly understand and apply the information.
  `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setIsLoading(true);
      try {
        const canProceed = await interactWithAIFeature("carePlan", 1);
        if (!canProceed) {
          alert("Not enough credits to generate a care plan.");
          setIsSubmitting(false);
          setIsLoading(false);
          return;
        }

        const sanitizedFormData = {
          ...formData,
          name: DOMPurify.sanitize(formData.name),
          notes: DOMPurify.sanitize(formData.notes),
        };

        const prompt = constructAiPrompt(sanitizedFormData);

        if (prompt !== lastSubmittedPrompt) {
          setLastSubmittedPrompt(prompt);
          const aiResponse = await sendToAIService(prompt);
          setAiPrompt(aiResponse);

          const labeledResponse = {
            id: uuidv4(),
            role: "assistant",
            content: aiResponse,
            timestamp: new Date().toISOString(),
            notes: [],
            fromForm: true,
            type: "profileFormResponse",
          };

          addMessageToHistory(labeledResponse);

          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            setIsModalOpen(true);
          }, 1500);
        } else {
          alert(
            "You have already submitted this information. Please modify your inputs if you need to make changes."
          );
        }
      } catch (error) {
        console.error("Error calling AI service:", error);
        setAiPrompt("Sorry, something went wrong. Please try again later.");
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setIsModalOpen(true);
        }, 1500);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      importantRoles: [],
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
      notes: "",
      dietRestrictions: [],
      age: "",
    });
    setErrors({});
    setLastSubmittedPrompt("");
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div
        className={`child-profile-form ${
          userPlan === "silver" || userPlan === "gold" ? "premium-plan" : ""
        }`}
      >
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-section">
            <div className="input-container">
              <h3 className="h3">
                Important roles
                <span className="credits-display">
                  {" "}
                  Credit balance: {credits || 0}
                </span>
              </h3>
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
            <div className="input-container">
              <h3>Basic information</h3>
              <label htmlFor="child-name">
                Child's name
                <input
                  id="child-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter child's name"
                  required
                  maxLength={100}
                  className={errors.name ? "input-error" : ""}
                />
              </label>
              {errors.name && (
                <div className="error-overlay active" role="alert">
                  {errors.name}
                </div>
              )}
              <label htmlFor="child-age">
                Age
                <input
                  id="child-age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter child's age (e.g., 5)"
                  min="0"
                  max="120"
                  className={errors.age ? "input-error" : ""}
                />
              </label>
              {errors.age && (
                <div className="error-overlay active" role="alert">
                  {errors.age}
                </div>
              )}
            </div>
            <div className="input-container">
              <label htmlFor="child-dob">
                Date of birth
                <input
                  id="child-dob"
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
              <label htmlFor="child-gender">
                Gender
                <select
                  id="child-gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? "input-error" : ""}
                >
                  <option value="">Select gender</option>
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
            <div className="input-container">
              <h3>Diagnosis details</h3>
              <label htmlFor="diagnosis-type">
                Diagnosis type
                <select
                  id="diagnosis-type"
                  name="diagnosisType"
                  value={formData.diagnosisType}
                  onChange={handleChange}
                  className={errors.diagnosisType ? "input-error" : ""}
                >
                  <option value="">Select diagnosis type</option>
                  <option value="ASD Level 1">
                    ASD level 1 (requiring support)
                  </option>
                  <option value="ASD Level 2">
                    ASD level 2 (requiring substantial support)
                  </option>
                  <option value="ASD Level 3">
                    ASD level 3 (requiring very substantial support)
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
              <label htmlFor="diagnosis-date">
                Diagnosis date
                <input
                  id="diagnosis-date"
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
            <div className="input-container">
              <label htmlFor="additional-notes">
                Additional notes
                <textarea
                  id="additional-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any additional information here..."
                  rows={4}
                  maxLength={500}
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
          <div className="form-section">
            <div className="input-container">
              <h3>Communication</h3>
              <label htmlFor="communication-ability">
                Communication ability
                <select
                  id="communication-ability"
                  name="communication"
                  value={formData.communication}
                  onChange={handleChange}
                  className={errors.communication ? "input-error" : ""}
                  aria-describedby={
                    errors.communication ? "communication-error" : undefined
                  }
                >
                  <option value="">Select communication ability</option>
                  <option value="Verbal">Verbal</option>
                  <option value="Limited Verbal">Limited verbal</option>
                  <option value="Non-Verbal">Non-verbal</option>
                  <option value="Uses Assistive Devices">
                    Uses assistive devices
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
              <label htmlFor="preferred-communication">
                Preferred communication
                <select
                  id="preferred-communication"
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
                  <option value="">Select preferred communication</option>
                  <option value="Speech">Speech</option>
                  <option value="AAC Device">AAC device</option>
                  <option value="Gestures">Gestures</option>
                  <option value="Sign Language">Sign language</option>
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
            <div className="input-container">
              <h3>Sensory preferences</h3>
              <label htmlFor="sensory-sensitivities">
                Sensory sensitivities
                <CustomMultiSelect
                  name="sensorySensitivities"
                  value={formData.sensorySensitivities}
                  options={sensorySensitivityOptions}
                  onChange={handleChange}
                  error={errors.sensorySensitivities}
                />
              </label>
              {errors.sensorySensitivities && (
                <div
                  id="sensory-sensitivities-error"
                  className="error-overlay active"
                  role="alert"
                >
                  {errors.sensorySensitivities}
                </div>
              )}
            </div>
            <div className="input-container">
              <label htmlFor="comfort-items">
                Comfort items
                <input
                  id="comfort-items"
                  type="text"
                  name="comfortItems"
                  value={formData.comfortItems}
                  onChange={handleChange}
                  placeholder="Enter comfort items"
                  maxLength={100}
                />
              </label>
              {errors.comfortItems && (
                <div className="error-overlay active" role="alert">
                  {errors.comfortItems}
                </div>
              )}
            </div>
            <div className="input-container">
              <h3>Dietary restrictions</h3>
              <label htmlFor="diet-restrictions">
                Diet restrictions
                <CustomMultiSelect
                  name="dietRestrictions"
                  value={formData.dietRestrictions}
                  options={dietRestrictionOptions}
                  onChange={handleChange}
                  error={errors.dietRestrictions}
                />
              </label>
              {errors.dietRestrictions && (
                <div
                  id="diet-restrictions-error"
                  className="error-overlay active"
                  role="alert"
                >
                  {errors.dietRestrictions}
                </div>
              )}
            </div>
            <div className="input-container">
              <h3>Care plans</h3>
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
      <FloatingChatBot onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <div className="modal-overlay">
          <ChatModal
            initialPrompt={aiPrompt}
            onClose={() => setIsModalOpen(false)}
            fromForm={true}
          />
        </div>
      )}
    </>
  );
};

ChildProfileForm.propTypes = {
  onLoad: PropTypes.func,
};

export default ChildProfileForm;
