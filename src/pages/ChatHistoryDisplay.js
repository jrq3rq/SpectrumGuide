import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid"; // Ensure you have uuid installed: npm install uuid

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Reference to the chat container for scrolling
  const chatContainerRef = React.useRef(null);

  // Detect screen width change for responsive styling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const initializedMessages = savedMessages.map((msg) => ({
      ...msg,
      notes: msg.notes || [], // Ensure notes is an array
    }));
    setMessages(initializedMessages);
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

  // Add a note to a specific message
  const handleAddNote = (messageId, noteContent) => {
    const newNote = {
      id: uuidv4(),
      content: sanitizeContent(noteContent),
      timestamp: Date.now(),
    };

    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, notes: [...msg.notes, newNote] } : msg
    );

    setMessages(updatedMessages);
    localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
  };

  // Delete a single note by message ID and note ID
  const handleDeleteNote = (messageId, noteId) => {
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        const updatedNotes = msg.notes.filter((note) => note.id !== noteId);
        return { ...msg, notes: updatedNotes };
      }
      return msg;
    });

    setMessages(updatedMessages);
    localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
  };

  // Function to handle downloading a single message
  const handleDownload = (message) => {
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

  // Function to download the entire chat history
  const handleDownloadChat = () => {
    const messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const content = messages
      .map(
        (msg) =>
          `[${msg.role.toUpperCase()} - ${formatTimestamp(
            msg.timestamp
          )}]\n${sanitizeContent(msg.content)}\n${
            msg.notes && msg.notes.length > 0
              ? msg.notes
                  .map(
                    (note) =>
                      `  - Note: ${note.content} (Added on ${formatTimestamp(
                        note.timestamp
                      )})`
                  )
                  .join("\n")
              : ""
          }\n`
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
    <div style={styles.container(isMobile)}>
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
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote} // Pass the delete note handler
                onDownload={() => handleDownload(msg)} // Pass the download handler
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

const MessageCard = ({
  message,
  onDelete,
  onAddNote,
  onDeleteNote,
  onDownload,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Safeguard: Ensure notes is always an array
  const notes = message.notes || [];

  const sanitizedContent = sanitizeContent(message.content);
  const { truncated, isTruncated } = truncateContent(sanitizedContent);

  const handleSaveNote = () => {
    if (noteContent.trim() === "") return;
    onAddNote(message.id, noteContent);
    setNoteContent("");
    setShowNoteInput(false);
  };

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

      {/* Notes Section */}
      <div style={styles.notesSection}>
        <h4 style={styles.notesTitle}>Notes:</h4>
        {notes.length > 0 ? (
          <ul style={styles.notesList}>
            {notes.map((note) => (
              <li key={note.id} style={styles.noteItem}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={styles.noteContent}>{note.content}</span>
                  <span style={styles.noteTimestamp}>
                    {formatTimestamp(note.timestamp)}
                  </span>
                </div>
                {/* Delete Note Button */}
                <button
                  style={styles.deleteNoteButton}
                  onClick={() => onDeleteNote(message.id, note.id)}
                  title="Delete Note"
                  aria-label="Delete Note"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noNotes}>No notes added.</p>
        )}
      </div>

      {/* Add Note Input */}
      {showNoteInput && (
        <div style={styles.addNoteContainer}>
          <textarea
            style={styles.addNoteTextarea}
            placeholder="Enter your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={3}
          />
          <div style={styles.addNoteActions}>
            <button style={styles.saveNoteButton} onClick={handleSaveNote}>
              Save Note
            </button>
            <button
              style={styles.cancelNoteButton}
              onClick={() => {
                setShowNoteInput(false);
                setNoteContent("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button style={styles.actionButton} onClick={onDownload}>
          Download
        </button>
        <button style={styles.deleteButton} onClick={onDelete}>
          Delete
        </button>
        <button
          style={styles.addNoteButton}
          onClick={() => setShowNoteInput(!showNoteInput)}
        >
          Add Note ({notes.length})
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: (isMobile) => ({
    maxWidth: "1200px",
    margin: "20px auto",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: isMobile ? "transparent" : "#ffffff",
    border: isMobile ? "none" : "1px solid #c3c3c3",
  }),

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
    backgroundColor: "#F4F4F9",
    border: "1px solid #c3c3c3",
    borderRadius: "10px",
  },

  messageCard: {
    marginBottom: "15px",
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "left",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  role: {
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: "5px",
    textAlign: "left",
  },

  content: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "0.95rem",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5",
    marginBottom: "10px",
    border: "1px solid #c3c3c3",
    textAlign: "left",
  },

  timestamp: {
    fontSize: "0.9rem",
    color: "#777",
    marginBottom: "10px",
    textAlign: "left",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between", // Distribute buttons evenly
    alignItems: "center", // Vertically center the buttons
    flexWrap: "nowrap", // Prevent buttons from wrapping
    gap: "0px", // Maintain gap between buttons
    marginTop: "10px",
  },

  actionButton: {
    backgroundColor: "#3a86ff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    flex: "1", // Allow buttons to grow equally
    margin: "0 5px", // Add horizontal margin for spacing
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },

  deleteButton: {
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    flex: "1", // Allow buttons to grow equally
    margin: "0 5px", // Add horizontal margin for spacing
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },

  addNoteButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    flex: "1",
    margin: "0 5px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },

  showMoreButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#3a86ff",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginLeft: "5px",
    textDecoration: "underline",
    padding: "0",
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
    width: "100%",
    border: "1px solid #C3C3C3",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },

  // New Styles for Notes
  notesSection: {
    marginTop: "15px",
  },

  notesTitle: {
    marginBottom: "10px",
    fontSize: "1rem",
    color: "#333",
  },

  notesList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },

  noteItem: {
    backgroundColor: "#e8f5e9", // Light green background
    padding: "8px 10px",
    borderRadius: "5px",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative", // For positioning the delete button if needed
    border: "1px solid #c3c3c3",
  },

  noteContent: {
    color: "#2e7d32", // Darker green text
    fontSize: "0.9rem",
  },

  noteTimestamp: {
    fontSize: "0.8rem",
    color: "#555",
    marginLeft: "10px",
  },

  addNoteContainer: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  addNoteTextarea: {
    width: "100%",
    padding: "8px",
    fontSize: "0.9rem",
    border: "1px solid #c3c3c3",
    borderRadius: "5px",
    resize: "vertical",
  },

  addNoteActions: {
    display: "flex",
    gap: "10px",
    margin: "5px 0px 10px 0px",
  },

  saveNoteButton: {
    width: "100%",
    backgroundColor: "#4caf50", // Green color
    border: "1px solid #C3C3C3",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },

  cancelNoteButton: {
    width: "100%",
    backgroundColor: "#FF6B6B", // Green color
    border: "1px solid #C3C3C3",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },

  // Delete Note Button
  deleteNoteButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#c3c3c3", // Red color to indicate deletion
    fontSize: "1.2rem",
    cursor: "pointer",
    marginLeft: "10px",
    transition: "color 0.2s ease",
  },

  // Hover Effects for All Buttons (Optional)
  // Note: Inline styles do not support pseudo-classes like :hover
  // For hover effects, consider using CSS classes or a CSS-in-JS library
  // For simplicity, we'll omit hover effects here.
};

export default ChatHistoryDisplay;
