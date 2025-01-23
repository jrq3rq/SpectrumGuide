import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatModal.css";
import { sendToAIService } from "../services/aiService";

const ChatModal = () => {
  const chatContainerRef = useRef(null);

  // Load existing chats from localStorage on initial render
  const [messages, setMessages] = useState(() => {
    const savedChats = localStorage.getItem("chatHistory");
    return savedChats ? JSON.parse(savedChats) : [];
  });

  // User input for new message
  const [userInput, setUserInput] = useState("");

  // Toggle controlling whether the auto-clear timer is enabled
  const [autoClearEnabled, setAutoClearEnabled] = useState(false);

  /**
   * 1) We define a list of valid intervals in minutes.
   *    - 1 to 30 (1-min increments)
   *    - 60 to 1440 (hourly increments up to 24 hr)
   */
  const minuteOptions = [
    ...Array.from({ length: 30 }, (_, i) => i + 1), // 1..30
    60,
    120,
    180,
    240,
    300,
    360,
    420,
    480,
    540,
    600,
    660,
    720, // up to 12h
    780,
    840,
    900,
    960,
    1020,
    1080,
    1140,
    1200,
    1260,
    1320,
    1380,
    1440, // up to 24h
  ];

  // 2) Auto-clear interval (default to 1 minute)
  const [autoClearMinutes, setAutoClearMinutes] = useState(1);

  // Save to localStorage whenever `messages` changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when `messages` changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * AUTO-CLEAR TIMER
   * If `autoClearEnabled` is ON, we set a timer that clears the chat
   * after `autoClearMinutes`. We default to resetting each time new messages arrive.
   * If you want the timer to *not* reset on new messages, remove "messages" from the dependency array.
   */
  useEffect(() => {
    if (!autoClearEnabled) return;

    const ms = autoClearMinutes * 60 * 1000;
    const timer = setTimeout(() => {
      setMessages([]);
      console.log(`Chat auto-cleared after ${autoClearMinutes} minute(s).`);
    }, ms);

    return () => clearTimeout(timer);
  }, [autoClearEnabled, autoClearMinutes, messages]);

  // Format date/time
  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString();
  };

  // Send userInput to AI, store both user and AI messages
  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    try {
      const aiResponse = await sendToAIService(userInput);
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error from AI service:", error);
      const errorMsg = {
        id: Date.now() + 2,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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

  // Send on Enter key (without SHIFT)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Download an individual message
  const handleDownloadMessage = (message) => {
    const blob = new Blob([JSON.stringify(message, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${message.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download entire chat
  const handleDownloadChat = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <h2>AI Chat Tester</h2>

        <div style={{ marginTop: "10px" }}>
          {/* Toggle the auto-clear function on/off */}
          <label>
            <input
              type="checkbox"
              checked={autoClearEnabled}
              onChange={() => setAutoClearEnabled((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Auto-Clear Enabled
          </label>
        </div>

        {/* Only show the select dropdown if autoClear is ON */}
        {autoClearEnabled && (
          <div style={{ marginTop: "10px" }}>
            <label>
              Clear after:
              <select
                value={autoClearMinutes}
                onChange={(e) => setAutoClearMinutes(Number(e.target.value))}
                style={{ marginLeft: "8px" }}
              >
                {minuteOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes < 60
                      ? `${minutes} min`
                      : `${minutes / 60} hr${minutes / 60 > 1 ? "s" : ""}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div style={{ marginTop: "10px" }}>
          <button className="download-chat-btn" onClick={handleDownloadChat}>
            Download Chat
          </button>
          <button className="clear-chat-btn" onClick={handleClearChat}>
            Clear Chat
          </button>
        </div>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.role === "user" ? "user" : "assistant"
            }`}
          >
            <div className="message-content">
              <p>{msg.content}</p>
              <span className="timestamp">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
            <div className="message-actions">
              <button
                onClick={() => handleDownloadMessage(msg)}
                className="download-btn"
              >
                Download
              </button>
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={2}
        />
        <button onClick={handleSend} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
