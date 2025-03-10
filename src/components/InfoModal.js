import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/InfoModal.css";

// InfoModal component provides an interactive chat-like interface for users to explore Spectrum's AI Guide features
// within the autism-support-app frontend, located at src/components/InfoModal.js
const InfoModal = ({ onClose }) => {
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [currentNodeId, setCurrentNodeId] = useState(null);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Scroll to the latest message when messages update
  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0) {
      const firstMessage = chatContainerRef.current.firstChild;
      if (firstMessage) {
        firstMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [messages]);

  // Conversation nodes for managing the interactive flow
  const conversationNodes = {
    start: {
      response:
        "Welcome! Explore Spectrum's AI Guide. What would you like to know?",
      options: [
        "what_is_spectrum",
        "features",
        "who_can_use",
        "pricing",
        "privacy",
        "how_to_sign_up",
      ],
    },
    what_is_spectrum: {
      response:
        "Spectrum's AI Guide is an innovative AI tool designed to support parents, caregivers, educators, and professionals in nurturing individuals with autism. It provides personalized insights, tailored recommendations, and actionable plans to enhance understanding and manage daily challenges effectively.",
      options: ["mission", "features", "how_to_sign_up"],
    },
    mission: {
      response:
        "At Spectrum's AI Guide, we believe every autistic individual deserves personalized support that acknowledges their unique needs, strengths, and challenges. Our mission is to empower those involved in their care with AI-driven tools, fostering environments where everyone can thrive.",
      options: ["features", "who_can_use"],
    },
    features: {
      response:
        "Spectrum's AI Guide offers a suite of features including: Customized Care Plans, Educational Support, Behavioral and Sensory Management, Safety and Emergency Planning, Strength-Based Activities, and Social Stories.",
      options: [
        "care_plans",
        "educational_support",
        "behavioral_management",
        "safety_planning",
        "strength_activities",
        "social_stories",
      ],
    },
    care_plans: {
      response:
        "Customized Care Plans: Tailor daily routines and strategies to match individual strengths, sensory preferences, and triggers, fostering a supportive environment.",
      options: ["learn_more_features", "how_to_sign_up"],
    },
    educational_support: {
      response:
        "Educational Support: Develop personalized learning approaches or Individualized Education Plans (IEPs) that align with communication styles, learning methods, and interests for optimal educational outcomes.",
      options: ["learn_more_features", "how_to_sign_up"],
    },
    behavioral_management: {
      response:
        "Behavioral and Sensory Management: Address sensory sensitivities and behavioral challenges proactively with strategies that minimize stress and enhance well-being.",
      options: ["learn_more_features", "how_to_sign_up"],
    },
    safety_planning: {
      response:
        "Safety and Emergency Planning: Manage safety risks, wandering behaviors, and allergies to ensure secure environments across various settings.",
      options: ["learn_more_features", "how_to_sign_up"],
    },
    strength_activities: {
      response:
        "Strength-Based Activities: Leverage individual strengths and interests to boost confidence and encourage independence through engaging activities.",
      options: ["learn_more_features", "how_to_sign_up"],
    },
    social_stories: {
      response:
        "Social Stories: Use AI to create personalized narratives that help with social cues, routine management, and emotional regulation, making learning both engaging and supportive.",
      options: ["learn_more_features", "how_to_sign_up"],
    },
    learn_more_features: {
      response:
        "Spectrum's AI Guide uses AI to turn complex data into practical, actionable insights, ensuring personalized support for every individual's journey. We continuously update our technology to meet the evolving needs of the autism community.",
      options: ["how_to_sign_up", "privacy"],
    },
    who_can_use: {
      response:
        "Anyone can sign up, but Spectrum's AI Guide is tailored for parents, caregivers, educators, and professionals supporting autistic individuals.",
      options: ["features", "how_to_sign_up"],
    },
    pricing: {
      response:
        "Spectrum's Guide operates on a flexible Pay-Per-Use model, where users purchase credits for specific services or features. This model allows you to pay only for what you use, making personalized support more accessible and cost-effective. It offers a free tier with limited credits; premium plans unlock more features.",
      options: ["free_includes", "premium_plans"],
    },
    free_includes: {
      response:
        "The free tier includes basic care plans and social stories. Ready to try it?",
      options: ["how_to_sign_up"],
    },
    premium_plans: {
      response:
        "Premium plans (bronze, silver, gold) offer more credits and advanced features. Check them out on the signup page.",
      options: ["how_to_sign_up"],
    },
    privacy: {
      response:
        "At Spectrum's AI Guide, your privacy is our priority. All data is stored locally on your device—never on external servers—ensuring you maintain full control and confidentiality over sensitive information.",
      options: ["privacy_details", "how_to_sign_up"],
    },
    privacy_details: {
      response:
        "Important notes: Storage Limitation: Your device’s storage capacity sets the limit. You might need to manage or delete older data to make room for new content. Device Dependency: Data stays on the device where it’s stored. If you lose or switch devices, manual backup or transfer is required. No Cloud Sync: Data doesn’t sync across devices, so using Spectrum's AI Guide on multiple devices requires extra data management steps. We recommend maintaining a backup strategy for your essential data.",
      options: ["how_to_sign_up"],
    },
    how_to_sign_up: {
      response:
        "Click 'Sign Up' below the sign-in form to create an account with your email and password, or use Google sign-in. Ready to get started?",
      url: "/signup",
    },
  };

  // Handle click on conversation options
  const handleOptionClick = (nextNodeId, currentMessage) => {
    console.log(
      "Clicked option:",
      nextNodeId,
      "Current message:",
      currentMessage
    );

    const node = conversationNodes[nextNodeId];
    if (!node) {
      console.error(`Node not found: ${nextNodeId}`);
      return;
    }

    setVisitedNodes((prev) => new Set([...prev, nextNodeId]));
    setCurrentNodeId(nextNodeId);

    const userMessage = {
      id: uuidv4(),
      role: "user",
      content:
        currentMessage.options[nextNodeId] ||
        nextNodeId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      timestamp: new Date().toISOString(),
    };

    const aiMessage = {
      id: uuidv4(),
      role: "assistant",
      content: node.response,
      timestamp: new Date().toISOString(),
      options: node.options || null,
      url: node.url || null,
      nodeId: nextNodeId,
    };

    setMessages((prev) => [aiMessage, userMessage, ...prev]);
  };

  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();

  const MessageBubble = ({ message }) => (
    <div
      className={`info-message ${
        message.role === "user" ? "user" : "assistant"
      }`}
    >
      <p>{message.content}</p>
      {message.options && (
        <div className="link-buttons">
          {message.options.map((optionId, index) => (
            <button
              key={index}
              className="helper-link-button"
              onClick={() => handleOptionClick(optionId, message)}
              disabled={visitedNodes.has(optionId)}
            >
              {conversationNodes[optionId].displayText ||
                optionId
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      )}
      {message.url && (
        <div className="link-buttons">
          <a
            href={message.url}
            className="helper-link-button"
            onClick={() => onClose()}
          >
            Go to {message.url.split("/")[1]}
          </a>
        </div>
      )}
      <span className="info-timestamp">
        {formatTimestamp(message.timestamp)}
      </span>
    </div>
  );

  return (
    <div className="info-modal">
      <div className="info-header">
        <h2>Spectrum Info Bot</h2>
        <button
          onClick={onClose}
          className="info-close-button"
          aria-label="Close Info Modal"
        >
          ×
        </button>
      </div>
      <div className="info-container" ref={chatContainerRef}>
        {messages.length === 0 && (
          <div className="info-hints">
            <p className="info-welcome">{conversationNodes.start.response}</p>
            <div className="hint-buttons">
              {conversationNodes.start.options.map((optionId, index) => (
                <button
                  key={index}
                  className="hint-button"
                  onClick={() =>
                    handleOptionClick(optionId, {
                      options: conversationNodes.start.options,
                    })
                  }
                  disabled={visitedNodes.has(optionId)}
                >
                  {optionId
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <div className="info-input">
        <input
          type="text"
          placeholder="Type your question..."
          disabled={true}
          aria-label="Type your question"
        />
        <button
          className="info-send-btn"
          disabled={true}
          aria-label="Send Question"
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default InfoModal;
