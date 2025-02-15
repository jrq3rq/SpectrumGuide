import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/ChatModal.css";
import { v4 as uuidv4 } from "uuid";
import { sendToAIService } from "../services/aiServiceImageGen";
import ttsService from "../core/tts-service";
import TTSRadialControls from "../components/TTSRadialControls";
import { useUser } from "../context/UserContext"; // Adjust the path if necessary

const ChatModal = ({ initialPrompt = "", onClose, fromForm }) => {
  const chatContainerRef = useRef(null);
  const { addMessageToHistory } = useUser(); // Use useUser to get context values

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const [messages, setMessages] = useState(() => {
    if (initialPrompt.trim() && fromForm) {
      return [
        {
          id: uuidv4(),
          role: "assistant",
          content: initialPrompt,
          timestamp: new Date().toISOString(),
          notes: [],
          fromForm: true,
        },
      ];
    }
    return [];
  });

  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  const sanitizeContent = (content) => content.replace(/[#_*`~]/g, "").trim();

  const truncateContent = (content, maxLines = 3) => {
    const lines = content.split("\n");
    if (lines.length > maxLines) {
      return {
        truncated: lines.slice(0, maxLines).join("\n"),
        isTruncated: true,
      };
    }
    return { truncated: content, isTruncated: false };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleSend = async () => {
    const content = userInput.trim();
    if (!content) return;

    const userMessage = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      notes: [],
      fromForm: false,
    };
    setMessages((prev) => [userMessage, ...prev]);
    setUserInput("");
    setIsLoading(true);

    try {
      const aiResponse = await sendToAIService(content);
      const sanitizedResponse = sanitizeContent(aiResponse);
      const aiMessage = {
        id: uuidv4(),
        role: "assistant",
        content: sanitizedResponse,
        timestamp: new Date().toISOString(),
        notes: [],
        fromForm: fromForm, // Ensure this is set correctly based on whether the chat is from a form
      };
      setMessages((prev) => [aiMessage, ...prev]);
      if (ttsService.getTtsEnabled()) {
        ttsService.speakText(aiMessage.content);
      }

      if (fromForm) {
        addMessageToHistory(aiMessage);
      }
    } catch (error) {
      console.error("Error from AI service:", error);
      const errorMsg = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
        notes: [],
        fromForm: false,
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleDownloadMessage = (message) => {
    const textContent = `[${message.role.toUpperCase()} - ${formatTimestamp(
      message.timestamp
    )}]\n${message.content}\n`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${message.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadChat = () => {
    const textContent = messages
      .map(
        (msg) =>
          `[${msg.role.toUpperCase()} - ${formatTimestamp(msg.timestamp)}]\n${
            msg.content
          }\n`
      )
      .join("\n");
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const MessageBubble = ({ message }) => {
    const [expanded, setExpanded] = useState(false);
    const sanitizedContent = sanitizeContent(message.content);
    const { truncated, isTruncated } = truncateContent(sanitizedContent);

    return (
      <div
        key={message.id}
        className={`chat-message ${
          message.role === "user" ? "user" : "assistant"
        }`}
      >
        <div className="message-content">
          <p>
            {expanded ? sanitizedContent : truncated}
            {isTruncated && !expanded && (
              <span
                className="showMoreButton"
                onClick={() => setExpanded(true)}
              >
                ... Show More
              </span>
            )}
            {isTruncated && expanded && (
              <span
                className="showMoreButton showLess"
                onClick={() => setExpanded(false)}
              >
                ... Show Less
              </span>
            )}
          </p>
          <span className="timestamp">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.role === "assistant" && (
            <TTSRadialControls text={sanitizedContent} />
          )}
        </div>
        <div className="message-actions">
          <button
            onClick={() => handleDownloadMessage(message)}
            className="download-btn"
            aria-label={`Download message from ${message.role}`}
          >
            Download
          </button>
          <button
            onClick={() => handleDeleteMessage(message.id)}
            className="delete-btn"
            aria-label="Delete message"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <h2>AI Chat Assistant</h2>
        <button
          onClick={handleCloseModal}
          className="close-modal-btn"
          aria-label="Close Chat Modal"
        >
          ×
        </button>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <MessageBubble message={msg} />
        ))}
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading response...</p>
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          rows={2}
          disabled={isLoading}
          aria-label="Type your message"
        />
        <button
          onClick={handleSend}
          className="send-btn"
          disabled={isLoading}
          aria-label="Send Message"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
        <div className="bottom-buttons-container">
          <button
            className="download-chat-btn"
            onClick={handleDownloadChat}
            aria-label="Download Chat History"
          >
            Download Chat
          </button>
          <button
            className="clear-chat-btn"
            onClick={handleClearChat}
            aria-label="Clear Chat History"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
