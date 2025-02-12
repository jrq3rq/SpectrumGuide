import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/ChatHistoryDisplay.css";

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
      notes: msg.notes || [],
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
    <div className="container">
      <h1 className="title">Chat History</h1>
      <div className="chatContainer" ref={chatContainerRef}>
        {messages.length > 0 ? (
          messages
            .slice()
            .reverse()
            .map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                onDelete={() => handleDeleteMessage(msg.id)}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onDownload={() => handleDownload(msg)}
              />
            ))
        ) : (
          <p className="noMessages">No chat history available.</p>
        )}
      </div>
      {messages.length > 0 && (
        <button className="downloadAllButton" onClick={handleDownloadChat}>
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="messageCard">
      <p className="role">{message.role.toUpperCase()}</p>
      <pre className="content">
        {expanded ? sanitizedContent : truncated}
        {isTruncated && (
          <button
            className="showMoreButton"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </pre>
      <p className="timestamp">
        Timestamp: {formatTimestamp(message.timestamp)}
      </p>

      {/* Notes Section */}
      <div className="notesSection">
        <h4 className="notesTitle">Notes:</h4>
        {notes.length > 0 ? (
          <ul className="notesList">
            {notes.map((note) => (
              <li key={note.id} className="noteItem">
                <div>
                  <span className="noteContent">{note.content}</span>
                  <span className="noteTimestamp">
                    {formatTimestamp(note.timestamp)}
                  </span>
                </div>
                <button
                  className="deleteNoteButton"
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
          <p className="noNotes">No notes added.</p>
        )}
      </div>

      {/* Add Note Input */}
      {showNoteInput && (
        <div className="addNoteContainer">
          <textarea
            className="addNoteTextarea"
            placeholder="Enter your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={3}
          />
          <div className="addNoteActions">
            <button className="saveNoteButton" onClick={handleSaveNote}>
              Save Note
            </button>
            <button
              className="cancelNoteButton"
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
      <div className="actions">
        <button className="actionButton" onClick={onDownload}>
          Download
        </button>
        <button className="deleteButton" onClick={onDelete}>
          Delete
        </button>
        <button
          className="addNoteButton"
          onClick={() => setShowNoteInput(!showNoteInput)}
        >
          <span>{isMobile ? "Notes" : "Add Note"}</span>{" "}
          <span>({notes.length})</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHistoryDisplay;
