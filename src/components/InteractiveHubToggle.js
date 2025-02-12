import React, { useState } from "react";
import "../styles/InteractiveHubToggle.css"; // Import styles

const InteractiveHubToggle = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle state

  return (
    <div className="interactive-hub-container">
      {/* Toggle Button */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Open AI Guidance Hub " : "Close AI Guidance Hub "}
      </button>

      {/* Content Section (conditionally displayed) */}
      {isOpen && (
        <div className="interactive-hub-content">
          <p>
            Welcome to the Interactive Learning and Communication Hub , a
            revolutionary feature of Spectrum Guide designed to enhance the
            daily lives of autistic individuals through personalized AI-driven
            support. Here's what you should know:
          </p>
          <ul>
            <li>
              <strong>Personalized Visual Communication:</strong> This tool
              adapts to your dietary preferences, allergies, and sensory needs.
              Simply select your options from the dropdown menus, and the AI
              will tailor food and drink suggestions, ensuring they are safe and
              suitable for your dietary restrictions. For example, if dairy is
              an issue, milk-based drinks will be excluded.
            </li>
            <li>
              <strong>Educational Integration:</strong> Choose your educational
              level, and let the AI customize learning content that aligns with
              your learning style and interests. Whether you're at a beginner,
              intermediate, or advanced stage, the hub provides interactive
              modules that make learning engaging and effective.
            </li>
            <li>
              <strong>Dynamic Daily Routine Management:</strong> Input your
              preferred schedule, and watch as the AI crafts a daily routine
              that respects your educational needs, sensory preferences, and
              personal interests. This schedule can be adjusted in real-time,
              offering flexibility and predictability to help manage daily life
              with ease.
            </li>
            <li>
              <strong>AI-Driven Insights:</strong> After processing your inputs,
              the AI doesn't stop at providing suggestions; it offers insights
              on how you can improve communication, learning, and daily
              scheduling based on your interactions with the hub. This feature
              aims to continually refine your experience, much like Spectrum
              Guide's approach to behavioral insights.
            </li>
            <li>
              <strong>Privacy and Local Storage:</strong> All your data, from
              preferences to schedules, remains on your device, ensuring your
              privacy is never compromised. Spectrum Guide values your data
              security, providing you with control over your personal
              information.
            </li>
          </ul>
          <p>
            <em>
              Remember, this is a tool for empowerment, designed to adapt to
              your unique needs, fostering an environment where you can thrive
              with the support tailored just for you.
            </em>
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveHubToggle;
