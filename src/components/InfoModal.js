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

  // Prevent body scrolling when modal is open, utilizing useBodyScrollLock hook context
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

  // Flat conversation nodes for managing the interactive flow
  const conversationNodes = {
    start: {
      response: "Explore Spectrum's AI Guide! Click to start.",
      options: [
        "what_is_spectrum",
        "what_does_app_do",
        "how_to_sign_up",
        "is_it_free",
        "who_can_use",
      ],
    },
    what_is_spectrum: {
      response:
        "Spectrum's AI Guide is a tool to assist caregivers and users with autism-related needs, offering care plans, social stories, and more.",
      options: ["how_does_it_work", "who_can_use_it"],
    },
    what_does_app_do: {
      response:
        "This app offers tools like care plans, social stories, and chat support for autism care.",
      options: [
        "explore_care_plans",
        "explore_social_stories",
        "try_chat_support",
      ],
    },
    how_to_sign_up: {
      response:
        "Click 'Sign Up' below the sign-in form to create an account with your email and password or use Google sign-in.",
      options: ["get_started", "learn_plans"],
    },
    is_it_free: {
      response:
        "Yes, it offers a free tier with limited credits; premium plans unlock more features.",
      options: ["see_pricing", "free_includes"],
    },
    who_can_use: {
      response:
        "Anyone can sign up, but it’s tailored for caregivers, educators, and autism support professionals.",
      options: ["more_info_who"],
    },
    how_does_it_work: {
      response:
        "It uses AI to create personalized care plans and social stories based on user input.",
      options: ["what_are_care_plans", "what_are_social_stories"],
    },
    who_can_use_it: {
      response:
        "It’s designed for caregivers, educators, and professionals supporting autistic individuals.",
      options: ["more_details_who"],
    },
    explore_care_plans: {
      response:
        "Care Plans help structure daily routines for autistic individuals.",
      options: ["learn_more_care_plans"],
    },
    explore_social_stories: {
      response: "Social Stories assist with social skills through narratives.",
      options: ["learn_more_social_stories"],
    },
    try_chat_support: {
      response: "Chat with an assistant for real-time autism support.",
      options: ["sign_up_chat_support"],
    },
    get_started: {
      response: "Ready to join? Click below.",
      url: "/signup",
    },
    learn_plans: {
      response: "We offer free and premium plans (bronze, silver, gold).",
      options: ["see_pricing_plans"],
    },
    see_pricing: {
      response: "Explore our plans on the signup page.",
      url: "/signup",
    },
    free_includes: {
      response: "Free tier includes basic care plans and social stories.",
      options: ["sign_up_free"],
    },
    more_info_who: {
      response: "It’s optimized for autism support with professional tools.",
      options: ["sign_up_who"],
    },
    what_are_care_plans: {
      response:
        "Care Plans are tailored schedules to support daily routines for autistic individuals.",
      options: ["create_care_plan", "benefits_care_plans"],
    },
    what_are_social_stories: {
      response:
        "Social Stories are short narratives to help with social skills and understanding.",
      options: ["create_social_story", "benefits_social_stories"],
    },
    more_details_who: {
      response:
        "Anyone can sign up, but it’s optimized for autism support professionals.",
      options: ["sign_up_details_who"],
    },
    learn_more_care_plans: {
      response: "Sign up to create and customize care plans.",
      options: ["sign_up_learn_care_plans"],
    },
    learn_more_social_stories: {
      response: "Sign up to create tailored social stories.",
      options: ["sign_up_learn_social_stories"],
    },
    sign_up_chat_support: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    see_pricing_plans: {
      response: "Check our plans on the signup page.",
      url: "/signup",
    },
    sign_up_free: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    sign_up_who: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    create_care_plan: {
      response: "Sign up to access tools for creating personalized care plans.",
      options: ["sign_up_create_care_plan"],
    },
    benefits_care_plans: {
      response:
        "They improve consistency and reduce stress for caregivers and users.",
      options: ["see_examples_care_plans"],
    },
    create_social_story: {
      response:
        "Sign up to design custom social stories for specific situations.",
      options: ["sign_up_create_social_story"],
    },
    benefits_social_stories: {
      response: "They enhance social comprehension and reduce anxiety.",
      options: ["see_examples_social_stories"],
    },
    sign_up_details_who: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    sign_up_learn_care_plans: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    sign_up_learn_social_stories: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    sign_up_create_care_plan: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    see_examples_care_plans: {
      response: "Examples are available after signing up.",
      options: ["sign_up_examples_care_plans"],
    },
    sign_up_create_social_story: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    see_examples_social_stories: {
      response: "Examples are available after signing up.",
      options: ["sign_up_examples_social_stories"],
    },
    sign_up_examples_care_plans: {
      response: "Click below to create your account.",
      url: "/signup",
    },
    sign_up_examples_social_stories: {
      response: "Click below to create your account.",
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
