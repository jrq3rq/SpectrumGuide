import React, { useState, useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import { sendToAIService } from "../services/aiServiceImageGen";
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom";
import "../styles/SocialStories.css";
import LoadingOverlay from "../components/LoadingOverlay";
import StoryActions from "../components/StoryActions";
import useCreditTracker from "../hooks/useCreditTracker";
import { firestore } from "../firebase";
import useLocalStorage from "../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid"; // Added for unique story IDs

const getColorForStoryType = (type) => {
  const colors = {
    "Social Skills": "#E6F7FF",
    Routine: "#FFF5E6",
    Scenario: "#E6FFE6",
    General: "#E6E6FA",
    "Emotional Regulation": "#FFE6F7",
    "Conflict Resolution": "#E6F7E6",
    "Safety & Emergency": "#FFF0E6",
    "Self-Advocacy": "#E6F5FF",
    "Coping Strategies": "#F5E6FF",
    "Empathy Building": "#FFE6E6",
  };
  return colors[type] || "#FFFFFF";
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function sanitizeContent(content) {
  return content.replace(/[*[\]`]/g, "").trim();
}

function truncateContent(content, maxLines = 3) {
  const lines = content.split("\n");
  if (lines.length > maxLines) {
    return {
      truncated: lines.slice(0, maxLines).join("\n"),
      isTruncated: true,
    };
  }
  return { truncated: content, isTruncated: false };
}

function buildDownloadContent(story) {
  const sanitized = sanitizeContent(story.content);
  return `[SPECTRUM STORY - ${
    story.customName || formatTimestamp(story.date)
  }]\n${sanitized}\n`;
}

const SocialStories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    user,
    userPlan,
    isAdmin,
    credits: initialCredits,
    aiUsage: initialAiUsage,
    chatHistory,
    socialStories = [],
    addSocialStory,
    removeSocialStory,
    updateSocialStory,
  } = useUser();
  const { credits, interactWithAIFeature } = useCreditTracker({
    firestore,
    uid: user?.uid,
    initialCredits: isAdmin ? 999999 : initialCredits || 0,
    initialAiUsage: initialAiUsage || { carePlans: 0, stories: 0, aiChats: 0 },
    plan: userPlan,
    isAdmin,
  });
  const location = useLocation();

  const [selectedChatId, setSelectedChatId] = useState("");
  const [storyType, setStoryType] = useState("Social Skills");
  const [supportLevel, setSupportLevel] = useState(
    "Level 1 (Low Support Needs)"
  );
  const [tone, setTone] = useState("Calm and Reassuring");
  const [context, setContext] = useState("Home");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isRenamingId, setIsRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [expandedSaved, setExpandedSaved] = useState({});

  useEffect(() => {
    console.log("ChatHistory in SocialStories:", chatHistory);
  }, [chatHistory]);

  const formChats = chatHistory.filter(
    (chat) => chat.type === "profileFormResponse"
  );
  const selectedChat = chatHistory.find((msg) => msg.id === selectedChatId);

  const buildPrompt = () => {
    if (!selectedChat) return "";
    const dateTimeStr = selectedChat.timestamp
      ? formatTimestamp(selectedChat.timestamp)
      : "Unknown Time";
    const childName = selectedChat.name || "the child";
    const chatContent = selectedChat.content || "[No content in chat]";
    return `
You are Spectrum, a compassionate AI caregiver assistant.
We have a chat from ${childName} at ${dateTimeStr} with the following text:

"${chatContent}"

Generate a ${storyType} story tailored for a child with ${supportLevel} autism spectrum needs.
The story should have a ${tone} tone and be set in a ${context} context.
Make it engaging, supportive, and personalized to teach relevant skills or prepare for scenarios,
using language and structure appropriate to the child's support level.
    `;
  };

  const handleGenerateStory = async () => {
    if (!selectedChatId) {
      console.log("No chat selected, cannot generate story.");
      return;
    }
    console.log("Selected chat for story generation:", selectedChat);
    setIsGenerating(true);
    setIsLoading(true);

    // Check and deduct credits for story generation
    const canProceed = await interactWithAIFeature("story", 1); // 0.25 credits per story
    if (!canProceed) {
      alert("Not enough credits to generate a story.");
      setIsGenerating(false);
      setIsLoading(false);
      return;
    }

    try {
      const prompt = buildPrompt();
      const response = await sendToAIService(prompt);
      const sanitizedResponse = sanitizeContent(response);
      const timestamp = selectedChat.timestamp || Date.now();
      const newStory = {
        id: uuidv4(), // Added unique ID
        chatId: selectedChatId,
        date: timestamp,
        customName: "",
        content: sanitizedResponse,
        type: storyType,
        supportLevel,
        tone,
        context,
        color: getColorForStoryType(storyType),
      };

      addSocialStory(newStory);
      setGeneratedStory(sanitizedResponse);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error generating story:", error);
      setGeneratedStory("Error generating story. Please try again later.");
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const handleDeleteStory = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      removeSocialStory(id);
    }
  };

  const handleDownloadStory = (story) => {
    const content = buildDownloadContent(story);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `social-story-${story.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRenameStart = (story) => {
    setIsRenamingId(story.id);
    setRenameValue(story.customName || "");
  };

  const handleRenameSave = (story) => {
    const updatedStory = { ...story, customName: renameValue.trim() };
    updateSocialStory(story.id, updatedStory);
    setIsRenamingId(null);
    setRenameValue("");
  };

  const handleRenameCancel = () => {
    setIsRenamingId(null);
    setRenameValue("");
  };

  const toggleSavedExpand = (id) => {
    setExpandedSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { truncated, isTruncated } = truncateContent(generatedStory);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="social-stories-page">
        <h1>
          <FaBookOpen size={40} color="#00c7eb" /> Social Stories{" "}
          <span className="credits-display">
            {" "}
            Credit balance: {credits || 0}
          </span>
        </h1>
        <p>
          Social Stories are custom narratives tailored to teach specific social
          skills or prepare for particular scenarios. They provide personalized
          guidance that complements each individual's unique needs.
        </p>

        <div className="generate-section">
          <label className="label-inline">
            Select a Chat:
            <select
              value={selectedChatId}
              onChange={(e) => setSelectedChatId(e.target.value)}
            >
              <option value="">-- Choose a Chat --</option>
              {formChats
                .slice()
                .reverse()
                .map((msg) => (
                  <option key={msg.id} value={msg.id}>
                    {formatTimestamp(msg.timestamp)}
                  </option>
                ))}
            </select>
          </label>

          <label className="label-inline">
            Story Type:
            <select
              value={storyType}
              onChange={(e) => setStoryType(e.target.value)}
            >
              <option
                value="Social Skills"
                style={{ backgroundColor: "#E6F7FF" }}
              >
                Social Skills
              </option>
              <option value="Routine" style={{ backgroundColor: "#FFF5E6" }}>
                Routine
              </option>
              <option value="Scenario" style={{ backgroundColor: "#E6FFE6" }}>
                Scenario
              </option>
              <option value="General" style={{ backgroundColor: "#E6E6FA" }}>
                General
              </option>
              <option
                value="Emotional Regulation"
                style={{ backgroundColor: "#FFE6F7" }}
              >
                Emotional Regulation
              </option>
              <option
                value="Conflict Resolution"
                style={{ backgroundColor: "#E6F7E6" }}
              >
                Conflict Resolution
              </option>
              <option
                value="Safety & Emergency"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                Safety & Emergency
              </option>
              <option
                value="Self-Advocacy"
                style={{ backgroundColor: "#E6F5FF" }}
              >
                Self-Advocacy
              </option>
              <option
                value="Coping Strategies"
                style={{ backgroundColor: "#F5E6FF" }}
              >
                Coping Strategies
              </option>
              <option
                value="Empathy Building"
                style={{ backgroundColor: "#FFE6E6" }}
              >
                Empathy Building
              </option>
            </select>
          </label>

          <label className="label-inline">
            Support Level:
            <select
              value={supportLevel}
              onChange={(e) => setSupportLevel(e.target.value)}
            >
              <option value="Level 1 (Low Support Needs)">
                Level 1 (Low Support Needs)
              </option>
              <option value="Level 2 (Moderate Support Needs)">
                Level 2 (Moderate Support Needs)
              </option>
              <option value="Level 3 (High Support Needs)">
                Level 3 (High Support Needs)
              </option>
            </select>
          </label>

          <label className="label-inline">
            Tone:
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="Calm and Reassuring">Calm and Reassuring</option>
              <option value="Positive and Encouraging">
                Positive and Encouraging
              </option>
              <option value="Direct and Instructional">
                Direct and Instructional
              </option>
            </select>
          </label>

          <label className="label-inline">
            Context:
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
            >
              <option value="Home">Home</option>
              <option value="School">School</option>
              <option value="Community">Community</option>
            </select>
          </label>

          <button
            onClick={handleGenerateStory}
            disabled={isGenerating}
            className="generate-button"
          >
            {isGenerating ? "Generating..." : "Generate Story"}
          </button>
        </div>

        {generatedStory && (
          <div
            className="latest-generated"
            style={{ backgroundColor: getColorForStoryType(storyType) }}
          >
            <h2>Latest Generated Story</h2>
            <pre className="generated-story-content">
              {isExpanded ? generatedStory : truncated}
            </pre>
            {isTruncated && (
              <button
                className="show-more-button"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}

        <hr />

        <div className="saved-stories-section">
          <h2>Saved Stories</h2>
          {socialStories.length === 0 ? (
            <p>No stories saved yet.</p>
          ) : (
            <div className="stories-list">
              {socialStories.map((story) => {
                const displayDate = formatTimestamp(story.date);
                const displayTitle = story.customName || displayDate;
                const isStoryRenaming = isRenamingId === story.id;
                const isStoryExpanded = expandedSaved[story.id] || false;
                const {
                  truncated: savedTruncated,
                  isTruncated: savedIsTruncated,
                } = truncateContent(story.content, 3);
                return (
                  <div
                    key={story.id}
                    className="story-card"
                    style={{ backgroundColor: story.color }}
                  >
                    <div className="story-header">
                      {isStoryRenaming ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="rename-input"
                          autoFocus
                        />
                      ) : (
                        <strong
                          onClick={() => handleRenameStart(story)}
                          className="chat-title"
                        >
                          {displayTitle}
                        </strong>
                      )}
                      <span className="story-actions">
                        {isStoryRenaming ? (
                          <>
                            <button
                              onClick={() => handleRenameSave(story)}
                              className="save-rename-button"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleRenameCancel}
                              className="cancel-rename-button"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRenameStart(story)}
                            className="rename-button"
                          >
                            Rename
                          </button>
                        )}
                      </span>
                    </div>
                    <div className="story-content">
                      <pre className="generated-story-content">
                        {isStoryExpanded ? story.content : savedTruncated}
                      </pre>
                      {savedIsTruncated && (
                        <button
                          className="show-more-button"
                          onClick={() => toggleSavedExpand(story.id)}
                        >
                          {isStoryExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>
                    <StoryActions
                      story={story}
                      onDownload={() => handleDownloadStory(story)}
                      onDelete={() => handleDeleteStory(story.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SocialStories;
