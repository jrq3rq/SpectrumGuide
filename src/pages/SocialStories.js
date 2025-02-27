import React, { useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { sendToAIService } from "../services/aiServiceImageGen";
import { useUser } from "../context/UserContext";
import useLocalStorage from "../hooks/useLocalStorage";
import "../styles/SocialStories.css";
import LoadingOverlay from "../components/LoadingOverlay";
import StoryActions from "../components/StoryActions";

// Helper function to get the story background color based on story type
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
  return colors[type] || "#FFFFFF"; // Default to white if type not found
};

/** Format a timestamp into a human-readable string */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/** Sanitize text by removing markdown symbols like *, [, ], and ` */
function sanitizeContent(content) {
  return content.replace(/[*[\]`]/g, "").trim();
}

/** Truncate content to a maximum number of lines (default 3) */
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

/** Build formatted text for downloads */
function buildDownloadContent(story) {
  const sanitized = sanitizeContent(story.content);
  return `[SPECTRUM STORY - ${
    story.customName || formatTimestamp(story.date)
  }]\n${sanitized}\n`;
}

const MAX_STORIES = 8;

const SocialStories = () => {
  // Use custom hook to persist stories and chats separately.
  const [isLoading, setIsLoading] = useState(false);
  const { chatHistory } = useUser(); // Use the chatHistory from UserContext
  const [stories, setStories] = useLocalStorage("socialStories", []);

  // States for generating a new story
  const [selectedChatId, setSelectedChatId] = useState("");
  const [storyType, setStoryType] = useState("Social Skills");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // States for inline renaming of saved stories
  const [isRenamingId, setIsRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // For controlling expansion of each saved story separately
  const [expandedSaved, setExpandedSaved] = useState({});

  // Filter chatHistory to only include chats from forms
  const formChats = chatHistory.filter(
    (chat) => chat.type === "profileFormResponse"
  );

  // Find the selected chat from chatHistory
  const selectedChat = chatHistory.find((msg) => msg.id === selectedChatId);

  /** Build an AI prompt based on the selected chat and chosen story type */
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

Generate a ${storyType} story that teaches relevant social skills, routines, or prepares for specific scenarios.
Make it engaging, supportive, and personalized for the child's needs.
    `;
  };

  /** Handle story generation */
  const handleGenerateStory = async () => {
    if (!selectedChatId) return;
    setIsGenerating(true);
    setIsLoading(true);

    try {
      const prompt = buildPrompt();
      const response = await sendToAIService(prompt);
      const sanitizedResponse = sanitizeContent(response);
      const timestamp = selectedChat.timestamp || Date.now();
      const newStory = {
        id: Date.now(),
        chatId: selectedChatId,
        date: timestamp,
        customName: "",
        content: sanitizedResponse,
        type: storyType,
        color: getColorForStoryType(storyType),
      };

      let updatedStories = [...stories];
      if (updatedStories.length >= MAX_STORIES) {
        if (
          window.confirm(
            "Maximum story limit reached. The oldest story will be deleted to make room for a new one. Do you agree?"
          )
        ) {
          updatedStories.shift(); // Remove the oldest story
        } else {
          alert(
            "Maximum story limit reached. Please delete old stories to make room for new ones."
          );
          setIsGenerating(false);
          setIsLoading(false);
          return;
        }
      }
      updatedStories.unshift(newStory);
      setStories(updatedStories);
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

  /** Delete a saved story with a confirmation warning */
  const handleDeleteStory = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      setStories(stories.filter((s) => s.id !== id));
    }
  };

  /** Download a story */
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

  /** Begin renaming a story */
  const handleRenameStart = (story) => {
    setIsRenamingId(story.id);
    setRenameValue(story.customName || "");
  };

  /** Save the new name */
  const handleRenameSave = (story) => {
    setStories(
      stories.map((s) =>
        s.id === story.id ? { ...s, customName: renameValue.trim() } : s
      )
    );
    setIsRenamingId(null);
    setRenameValue("");
  };

  /** Cancel renaming */
  const handleRenameCancel = () => {
    setIsRenamingId(null);
    setRenameValue("");
  };

  /** Toggle expansion of a saved story's content */
  const toggleSavedExpand = (id) => {
    setExpandedSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Truncate the generated story for preview (3 lines maximum)
  const { truncated, isTruncated } = (() => {
    if (!generatedStory) return { truncated: "", isTruncated: false };
    const lines = generatedStory.split("\n");
    if (lines.length > 3) {
      return { truncated: lines.slice(0, 3).join("\n"), isTruncated: true };
    }
    return { truncated: generatedStory, isTruncated: false };
  })();

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="social-stories-page">
        <h1>
          <FaBookOpen size={40} color="#00c7eb" /> Social Stories
        </h1>
        <p>
          Social Stories are custom narratives tailored to teach specific social
          skills or prepare for particular scenarios. They provide personalized
          guidance that complements each individual's unique needs.
        </p>

        {/* Section to generate a new story */}
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

        {/* Display saved stories */}
        <div className="saved-stories-section">
          <h2>Saved Stories</h2>
          {stories.length === 0 ? (
            <p>No stories saved yet.</p>
          ) : (
            <div className="stories-list">
              {stories.map((story) => {
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
