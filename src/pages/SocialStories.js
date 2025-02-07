// SocialStories.js
import React, { useState } from "react";
import { MdMenuBook } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { sendToAIService } from "../services/aiService";
// import { sendToAIService } from "../services/aiServiceCredits";
import useLocalStorage from "../hooks/useLocalStorage";
import "../styles/SocialStories.css";
import LoadingOverlay from "../components/LoadingOverlay"; // Import the LoadingOverlay component

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

const MAX_STORIES = 5;

const SocialStories = () => {
  // Use custom hook to persist stories and chats separately.
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useLocalStorage("chatHistory", []);
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
    setIsLoading(true); // Start the loading overlay

    try {
      const prompt = buildPrompt();
      const response = await sendToAIService(prompt);
      const sanitizedResponse = sanitizeContent(response);
      const timestamp = selectedChat.timestamp || Date.now();
      const newStory = {
        id: Date.now(),
        chatId: selectedChatId,
        date: timestamp,
        customName: "", // Defaults to the formatted timestamp if not renamed
        content: sanitizedResponse,
      };

      let updatedStories = [...stories];
      if (updatedStories.length >= MAX_STORIES) {
        if (
          window.confirm(
            "Maximum story limit reached. The oldest story will be deleted. Do you agree?"
          )
        ) {
          updatedStories.shift();
        } else {
          setIsGenerating(false);
          setIsLoading(false); // Stop loading overlay if cancelled
          return;
        }
      }
      updatedStories.unshift(newStory); // Add new story at the beginning
      setStories(updatedStories);
      setGeneratedStory(sanitizedResponse);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error generating story:", error);
      setGeneratedStory("Error generating story. Please try again later.");
    } finally {
      setIsGenerating(false);
      setIsLoading(false); // Stop the loading overlay after process completes
    }
  };

  /** Delete a saved story */
  const handleDeleteStory = (id) => {
    setStories(stories.filter((s) => s.id !== id));
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
    setExpandedSaved({ ...expandedSaved, [id]: !expandedSaved[id] });
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
      {isLoading && <LoadingOverlay />}{" "}
      {/* Loading overlay appears when isLoading is true */}
      <div className="social-stories-page">
        <h1>
          <FaBookOpen size={40} color="#00c7eb" /> Social Stories
        </h1>
        <p>
          Social Stories are custom narratives tailored to teach specific social
          skills or prepare for particular scenarios. They provide personalized
          guidance that complements each child's unique needs.
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
              {chatHistory.map((msg) => {
                const displayName = msg.name
                  ? msg.name
                  : formatTimestamp(msg.timestamp);
                const partial = msg.content
                  ? msg.content.substring(0, 25) + "..."
                  : "[No content]";
                return (
                  <option key={msg.id} value={msg.id}>
                    {`${displayName} - ${partial}`}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="label-inline">
            Story Type:
            <select
              value={storyType}
              onChange={(e) => setStoryType(e.target.value)}
            >
              <option value="Social Skills">Social Skills</option>
              <option value="Routine">Routine</option>
              <option value="Scenario">Scenario</option>
              <option value="General">General</option>
              <option value="Emotional Regulation">Emotional Regulation</option>
              <option value="Conflict Resolution">Conflict Resolution</option>
              <option value="Safety & Emergency">Safety & Emergency</option>
              <option value="Self-Advocacy">Self-Advocacy</option>
              <option value="Coping Strategies">Coping Strategies</option>
              <option value="Empathy Building">Empathy Building</option>
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

        {/* Display generated story with Show More/Less toggle */}
        {generatedStory && (
          <div className="latest-generated">
            <h2>Latest Generated Story</h2>
            <pre className="generated-story-content">
              {isExpanded ? generatedStory : truncated}
              {isTruncated && (
                <button
                  className="show-more-button"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              )}
            </pre>
          </div>
        )}

        <hr />

        {/* Display saved stories in reverse order (newest first) */}
        <div className="saved-stories-section">
          <h2>Saved Stories</h2>
          {stories.length === 0 ? (
            <p>No stories saved yet.</p>
          ) : (
            <div className="stories-list">
              {stories
                .slice() // Create a shallow copy
                .reverse() // Reverse the order so the newest comes first
                .map((story) => {
                  const displayDate = formatTimestamp(story.date);
                  const displayTitle = story.customName || displayDate;
                  const isStoryRenaming = isRenamingId === story.id;
                  const isStoryExpanded = expandedSaved[story.id] || false;
                  const {
                    truncated: savedTruncated,
                    isTruncated: savedIsTruncated,
                  } = truncateContent(story.content, 3);
                  return (
                    <div key={story.id} className="story-card">
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
                          {savedIsTruncated && (
                            <button
                              className="show-more-button"
                              onClick={() => toggleSavedExpand(story.id)}
                            >
                              {isStoryExpanded ? "Show Less" : "Show More"}
                            </button>
                          )}
                        </pre>
                      </div>

                      <div className="story-footer">
                        <button
                          onClick={() => handleDownloadStory(story)}
                          className="download-story-button"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="delete-story-button"
                        >
                          Delete
                        </button>
                      </div>
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
