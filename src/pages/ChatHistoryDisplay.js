import React, { useState, useEffect, useCallback } from "react";

/** Format timestamp for display */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/** Sanitize content to remove markdown-like symbols */
function sanitizeContent(content) {
  return content.replace(/[#_*`~]/g, "").trim();
}

/** Truncate long content to the first few lines */
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

const ChatHistoryDisplay = () => {
  const [messages, setMessages] = useState([]);

  // Reference to the chat container for scrolling
  const chatContainerRef = React.useRef(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setMessages(savedMessages);
  }, []);

  // Scroll to top whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0; // Scroll to top
    }
  }, [messages]);

  // Delete a single message by ID
  const handleDeleteMessage = useCallback(
    (id) => {
      const updatedMessages = messages.filter((msg) => msg.id !== id);
      setMessages(updatedMessages);
      localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
    },
    [messages]
  );

  // Download a single message as a text file
  const handleDownloadMessage = (message) => {
    const content = `[${message.role.toUpperCase()} - ${formatTimestamp(
      message.timestamp
    )}]\n${sanitizeContent(message.content)}\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${message.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download the entire chat history as a text file
  const handleDownloadChat = () => {
    const content = messages
      .map(
        (msg) =>
          `[${msg.role.toUpperCase()} - ${formatTimestamp(
            msg.timestamp
          )}]\n${sanitizeContent(msg.content)}\n`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chat History</h1>
      <div style={styles.chatContainer} ref={chatContainerRef}>
        {messages.length > 0 ? (
          messages
            .slice() // Create a shallow copy to avoid mutating state
            .reverse() // Reverse to show newest messages first
            .map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                onDelete={() => handleDeleteMessage(msg.id)}
                onDownload={() => handleDownloadMessage(msg)}
              />
            ))
        ) : (
          <p style={styles.noMessages}>No chat history available.</p>
        )}
      </div>
      {messages.length > 0 && (
        <button style={styles.downloadAllButton} onClick={handleDownloadChat}>
          Download All
        </button>
      )}
    </div>
  );
};

const MessageCard = ({ message, onDelete, onDownload }) => {
  const [expanded, setExpanded] = useState(false);
  const sanitizedContent = sanitizeContent(message.content);
  const { truncated, isTruncated } = truncateContent(sanitizedContent);

  return (
    <div style={styles.messageCard}>
      <p style={styles.role}>{message.role.toUpperCase()}</p>
      <pre style={styles.content}>
        {expanded ? sanitizedContent : truncated}
        {isTruncated && (
          <button
            style={styles.showMoreButton}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </pre>
      <p style={styles.timestamp}>
        Timestamp: {formatTimestamp(message.timestamp)}
      </p>
      <div style={styles.actions}>
        <button style={styles.actionButton} onClick={onDownload}>
          Download
        </button>
        <button style={styles.deleteButton} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "90%",
    maxWidth: "800px",
    margin: "20px auto",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddddddcc",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "1.5rem",
    color: "#333",
  },
  chatContainer: {
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px",
    //   backgroundColor: "#ffffff",
    backgroundColor: "#F4F4F9",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  messageCard: {
    marginBottom: "15px",
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "left", // Aligns all content within the message card to the left
  },
  role: {
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: "5px",
    textAlign: "left", // Ensures the role text is left-aligned
  },
  content: {
    backgroundColor: "#ffffff",
    // backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "0.95rem",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5",
    marginBottom: "10px",
    border: "1px solid #DDDDDD",
    textAlign: "left", // Aligns the chat content to the left
  },
  timestamp: {
    fontSize: "0.9rem",
    color: "#777",
    marginBottom: "10px",
    textAlign: "left", // Aligns the timestamp to the left
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start", // Aligns action buttons to the start (left)
  },
  actionButton: {
    backgroundColor: "#3a86ff",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  showMoreButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#3a86ff",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginLeft: "5px",
    textDecoration: "underline",
  },
  noMessages: {
    textAlign: "center",
    color: "#777",
  },
  downloadAllButton: {
    display: "block",
    margin: "20px auto",
    backgroundColor: "#3a86ff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default ChatHistoryDisplay;
