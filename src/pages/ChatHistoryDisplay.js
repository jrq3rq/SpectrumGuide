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
                >
                  ×
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
              onClick={() => setShowNoteInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="actions">
        <button className="actionButton" onClick={() => onDownload(message)}>
          Download
        </button>
        <button className="deleteButton" onClick={() => onDelete(message.id)}>
          Delete
        </button>
        <button
          className="addNoteButton"
          onClick={() => setShowNoteInput(!showNoteInput)}
        >
          <span>Add Note ({notes.length})</span>
        </button>
      </div>
    </div>
  );
};

const ChatHistoryDisplay = () => {
  const [messages, setMessages] = useState([]);
  const chatContainerRef = React.useRef(null);
  // Load only "profileFormResponse" chat history from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    // ✅ Only keep messages with type "profileFormResponse"
    const filteredMessages = savedMessages.filter(
      (msg) => msg.type === "profileFormResponse"
    );
    // Reverse the list here so that the most recent message is at the top
    setMessages(filteredMessages.reverse());
  }, []);
  // Ensure only profile form responses are saved in localStorage
  useEffect(() => {
    if (messages.length > 0) {
      // Save in reverse order so that when loaded, it's in the correct sequence
      localStorage.setItem("chatHistory", JSON.stringify(messages.reverse()));
    }
  }, [messages]);
  // Scroll to top when messages change, since the most recent message is now at the top
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0; // Scroll to top
    }
  }, [messages]);
  // Delete a single message by ID
  const handleDeleteMessage = useCallback((id) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((msg) => msg.id !== id);
      localStorage.setItem(
        "chatHistory",
        JSON.stringify(updatedMessages.reverse())
      ); // Save reversed
      return updatedMessages;
    });
  }, []);

  /** Function to handle downloading a message */
  /** Function to handle downloading a message with cleaned content and correct list numbering */
  const handleDownloadMessage = (message) => {
    // Helper function to clean text of markdown-like symbols
    const cleanText = (text) => text.replace(/[_*`#]/g, "").trim();

    // Function to fix and format lists, handling nested lists and major/minor numbering
    const fixList = (text) => {
      let lines = text.split("\n");
      let newLines = [];
      let majorCounter = 1;
      let minorCounter = 1;

      for (let line of lines) {
        // Detect major sections
        if (
          line.startsWith("1.") &&
          line.includes(":") &&
          !line.includes("Step")
        ) {
          line = `${majorCounter++}.${line.slice(1)}`;
          minorCounter = 1; // Reset for new section
        } else if (line.includes("Step")) {
          // Handle steps within sections
          line = line.replace(/Step \d+:/, `Step ${minorCounter++}:`);
        }
        newLines.push(line);
      }

      return newLines.join("\n");
    };

    // Clean each line of content individually, then fix list numbering
    const cleanContent = fixList(
      message.content
        .split("\n")
        .map((line) => cleanText(line))
        .join("\n")
    );

    const content = `Role: ${
      message.role
    }\nContent:\n${cleanContent}\nTimestamp: ${formatTimestamp(
      message.timestamp
    )}\nNotes:\n${
      message.notes
        ? message.notes
            .map(
              (note) =>
                `- ${cleanText(note.content)} (${formatTimestamp(
                  note.timestamp
                )})`
            )
            .join("\n")
        : "No notes."
    }`;

    // Create a Blob with the message details
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `message-${message.id}.txt`;
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a); // Remove the element

    // Clean up
    URL.revokeObjectURL(url);
  };
  // Add a note to a specific message
  const handleAddNote = (messageId, noteContent) => {
    const newNote = {
      id: uuidv4(),
      content: sanitizeContent(noteContent),
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, notes: [...msg.notes, newNote] } : msg
      );
      localStorage.setItem(
        "chatHistory",
        JSON.stringify(updatedMessages.reverse())
      ); // Save reversed
      return updatedMessages;
    });
  };
  // Delete a single note by message ID and note ID
  const handleDeleteNote = (messageId, noteId) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            notes: msg.notes.filter((note) => note.id !== noteId),
          };
        }
        return msg;
      });
      localStorage.setItem(
        "chatHistory",
        JSON.stringify(updatedMessages.reverse())
      ); // Save reversed
      return updatedMessages;
    });
  };

  return (
    <div className="container">
      <h1 className="title">Chat History</h1>
      <div className="chatContainer" ref={chatContainerRef}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            // <MessageCard
            //   key={msg.id}
            //   message={msg}
            //   onDelete={handleDeleteMessage}
            //   onAddNote={handleAddNote}
            //   onDeleteNote={handleDeleteNote}
            //   onDownload={() => console.log(`Downloading message ${msg.id}`)}
            //   />

            <MessageCard
              key={msg.id}
              message={msg}
              onDelete={handleDeleteMessage}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onDownload={() => handleDownloadMessage(msg)}
            />
          ))
        ) : (
          <p className="noMessages">No profile form responses available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryDisplay;
