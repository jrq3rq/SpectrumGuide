// import React, { useState, useEffect, useCallback } from "react";
// import { v4 as uuidv4 } from "uuid";
// import "../styles/ChatHistoryDisplay.css";
// import { useUser } from "../context/UserContext";

// /** Format timestamp for display */
// function formatTimestamp(timestamp) {
//   const date = new Date(timestamp);
//   return date.toLocaleString();
// }

// /** Sanitize content to remove markdown-like symbols */
// function sanitizeContent(content) {
//   return content.replace(/[#_*`~]/g, "").trim();
// }

// /** Truncate long content to the first few lines */
// function truncateContent(content, maxLines = 3) {
//   const lines = content.split("\n");
//   if (lines.length > maxLines) {
//     return {
//       truncated: lines.slice(0, maxLines).join("\n"),
//       isTruncated: true,
//     };
//   }
//   return { truncated: content, isTruncated: false };
// }

// const MessageCard = ({
//   message,
//   notes,
//   onDelete,
//   onAddNote,
//   onDeleteNote,
//   onDownload,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [showNoteInput, setShowNoteInput] = useState(false);
//   const [noteContent, setNoteContent] = useState("");
//   const [isAddingNote, setIsAddingNote] = useState(false);
//   const [isDeletingNote, setIsDeletingNote] = useState(false);
//   const [error, setError] = useState("");

//   const sanitizedContent = sanitizeContent(message.content);
//   const { truncated, isTruncated } = truncateContent(sanitizedContent);

//   const handleSaveNote = async () => {
//     if (noteContent.trim() === "") {
//       setError("Note content cannot be empty.");
//       return;
//     }

//     setIsAddingNote(true);
//     setError("");
//     try {
//       await onAddNote(message.id, noteContent);
//       setNoteContent("");
//       console.log(
//         "Note added for message:",
//         message.id,
//         "Content:",
//         noteContent
//       );
//     } catch (err) {
//       console.error("Error adding note:", err);
//       setError("Failed to add note. Check console.");
//     } finally {
//       setIsAddingNote(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if (!window.confirm("Are you sure you want to delete this note?")) return;

//     setIsDeletingNote(true);
//     setError("");
//     try {
//       await onDeleteNote(message.id, noteId);
//       console.log("Note deleted:", noteId, "from message:", message.id);
//     } catch (err) {
//       console.error("Error deleting note:", err);
//       setError("Failed to delete note. Check console.");
//     } finally {
//       setIsDeletingNote(false);
//     }
//   };

//   return (
//     <div className="messageCard">
//       <p className="role">{message.role.toUpperCase()}</p>
//       <pre className="content">
//         {expanded ? sanitizedContent : truncated}
//         {isTruncated && (
//           <button
//             className="showMoreButton"
//             onClick={() => setExpanded(!expanded)}
//           >
//             {expanded ? "Show Less" : "Show More"}
//           </button>
//         )}
//       </pre>
//       <p className="timestamp">
//         Timestamp: {formatTimestamp(message.timestamp)}
//       </p>

//       <div className="notesSection">
//         <h4 className="notesTitle">Notes:</h4>
//         {notes.length > 0 ? (
//           <ul className="notesList">
//             {notes.map((note) => (
//               <li key={note.id} className="noteItem">
//                 <div>
//                   <span className="noteContent">{note.content}</span>
//                   <span className="noteTimestamp">
//                     {formatTimestamp(note.timestamp)}
//                   </span>
//                 </div>
//                 <button
//                   className="deleteNoteButton"
//                   onClick={() => handleDeleteNote(note.id)}
//                   disabled={isDeletingNote}
//                   aria-label="Delete note"
//                 >
//                   ×
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="noNotes">No notes added.</p>
//         )}
//       </div>

//       {error && <p className="errorMessage">{error}</p>}

//       {showNoteInput && (
//         <div className="addNoteContainer">
//           <textarea
//             className="addNoteTextarea"
//             placeholder="Enter your note here..."
//             value={noteContent}
//             onChange={(e) => setNoteContent(e.target.value)}
//             rows={3}
//             maxLength={500}
//             disabled={isAddingNote}
//           />
//           <div className="addNoteActions">
//             <button
//               className="saveNoteButton"
//               onClick={handleSaveNote}
//               disabled={isAddingNote}
//             >
//               {isAddingNote ? "Saving..." : "Save Note"}
//             </button>
//             <button
//               className="cancelNoteButton"
//               onClick={() => {
//                 setNoteContent("");
//                 setShowNoteInput(false);
//                 setError("");
//               }}
//               disabled={isAddingNote}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="actions">
//         <button className="actionButton" onClick={() => onDownload(message)}>
//           Download
//         </button>
//         <button
//           className="deleteButton"
//           onClick={() => {
//             if (
//               window.confirm(
//                 "Are you sure you want to delete this message? This action cannot be undone."
//               )
//             ) {
//               onDelete(message.id);
//             }
//           }}
//         >
//           Delete
//         </button>
//         <button
//           className="addNoteButton"
//           onClick={() => setShowNoteInput(!showNoteInput)}
//           disabled={isAddingNote}
//         >
//           <span>Add Note ({notes.length})</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// const ChatHistoryDisplay = () => {
//   const {
//     profileFormResponses,
//     addMessageToHistory,
//     removeMessageFromHistory,
//     addNoteToMessage,
//     deleteNoteFromMessage,
//     notes,
//   } = useUser();

//   const [messages, setMessages] = useState([]);
//   const [messageNotes, setMessageNotes] = useState({}); // Define messageNotes state

//   useEffect(() => {
//     // Filter to ensure only ChildProfileForm responses are displayed
//     const filteredMessages = profileFormResponses.filter(
//       (msg) => msg.type === "profileFormResponse" && msg.fromForm === true
//     );
//     setMessages(filteredMessages);
//     console.log("Filtered ProfileFormResponses:", filteredMessages);
//     console.log("Raw ProfileFormResponses:", profileFormResponses);

//     const notesMap = {};
//     filteredMessages.forEach((msg) => {
//       if (msg.noteIds) {
//         notesMap[msg.id] = notes.filter((note) =>
//           msg.noteIds.includes(note.id)
//         );
//       }
//     });
//     setMessageNotes(notesMap);
//     console.log("Message Notes Map:", notesMap);
//   }, [profileFormResponses, notes]);

//   const handleDeleteMessage = useCallback(
//     (id) => {
//       removeMessageFromHistory(id);
//       setMessages((prev) => prev.filter((msg) => msg.id !== id));
//       console.log("Message deleted, updated messages:", messages);
//     },
//     [removeMessageFromHistory]
//   );

//   const handleDownloadMessage = (message) => {
//     const cleanText = (text) => text.replace(/[_*`#]/g, "").trim();
//     const fixList = (text) => {
//       let lines = text.split("\n");
//       let newLines = [];
//       let majorCounter = 1;
//       let minorCounter = 1;
//       for (let line of lines) {
//         if (
//           line.startsWith("1.") &&
//           line.includes(":") &&
//           !line.includes("Step")
//         ) {
//           line = `${majorCounter++}.${line.slice(1)}`;
//           minorCounter = 1;
//         } else if (line.includes("Step")) {
//           line = line.replace(/Step \d+:/, `Step ${minorCounter++}:`);
//         }
//         newLines.push(line);
//       }
//       return newLines.join("\n");
//     };

//     const cleanContent = fixList(
//       message.content
//         .split("\n")
//         .map((line) => cleanText(line))
//         .join("\n")
//     );
//     const content = `Role: ${
//       message.role
//     }\nContent:\n${cleanContent}\nTimestamp: ${formatTimestamp(
//       message.timestamp
//     )}\nNotes:\n${
//       messageNotes[message.id]
//         ? messageNotes[message.id]
//             .map(
//               (note) =>
//                 `- ${cleanText(note.content)} (${formatTimestamp(
//                   note.timestamp
//                 )})`
//             )
//             .join("\n")
//         : "No notes."
//     }`;

//     const blob = new Blob([content], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `message-${message.id}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const handleAddNote = useCallback(
//     async (messageId, noteContent) => {
//       try {
//         await addNoteToMessage(messageId, noteContent);
//         console.log("Note added successfully for message:", messageId);
//       } catch (err) {
//         console.error("Error adding note:", err);
//       }
//     },
//     [addNoteToMessage]
//   );

//   const handleDeleteNote = useCallback(
//     async (messageId, noteId) => {
//       try {
//         await deleteNoteFromMessage(messageId, noteId);
//         console.log(
//           "Note deleted successfully for message:",
//           messageId,
//           "Note ID:",
//           noteId
//         );
//       } catch (err) {
//         console.error("Error deleting note:", err);
//       }
//     },
//     [deleteNoteFromMessage]
//   );

//   return (
//     <div className="container">
//       <h1 className="title">Chat History</h1>
//       <div className="chatContainer">
//         {messages.length > 0 ? (
//           messages.map((msg) => (
//             <MessageCard
//               key={msg.id}
//               message={msg}
//               notes={messageNotes[msg.id] || []}
//               onDelete={handleDeleteMessage}
//               onAddNote={handleAddNote}
//               onDeleteNote={handleDeleteNote}
//               onDownload={() => handleDownloadMessage(msg)}
//             />
//           ))
//         ) : (
//           <p className="noMessages">No profile form responses available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatHistoryDisplay;
import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/ChatHistoryDisplay.css";
import { useUser } from "../context/UserContext";

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
  notes,
  onDelete,
  onAddNote,
  onDeleteNote,
  onDownload,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [error, setError] = useState("");

  const sanitizedContent = sanitizeContent(message.content);
  const { truncated, isTruncated } = truncateContent(sanitizedContent);

  const handleSaveNote = async () => {
    if (noteContent.trim() === "") {
      setError("Note content cannot be empty.");
      return;
    }

    setIsAddingNote(true);
    setError("");
    try {
      await onAddNote(message.id, noteContent);
      setNoteContent("");
      console.log(
        "Note added for message:",
        message.id,
        "Content:",
        noteContent
      );
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add note. Check console.");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    setIsDeletingNote(true);
    setError("");
    try {
      await onDeleteNote(message.id, noteId);
      console.log("Note deleted:", noteId, "from message:", message.id);
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note. Check console.");
    } finally {
      setIsDeletingNote(false);
    }
  };

  return (
    <div className="message-card">
      <p className="role">{message.role.toUpperCase()}</p>
      <pre className="content">
        {expanded ? sanitizedContent : truncated}
        {isTruncated && (
          <button
            className="show-more-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </pre>
      <p className="timestamp">
        Timestamp: {formatTimestamp(message.timestamp)}
      </p>

      <div className="notes-section">
        <h4 className="notes-title">Notes:</h4>
        {notes.length > 0 ? (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.id} className="note-item">
                <div>
                  <span className="note-content">{note.content}</span>
                  <span className="note-timestamp">
                    {formatTimestamp(note.timestamp)}
                  </span>
                </div>
                <button
                  className="delete-note-button"
                  onClick={() => handleDeleteNote(note.id)}
                  disabled={isDeletingNote}
                  aria-label="Delete note"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notes">No notes added.</p>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {showNoteInput && (
        <div className="add-note-container">
          <textarea
            className="add-note-textarea"
            placeholder="Enter your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={3}
            maxLength={500}
            disabled={isAddingNote}
          />
          <div className="add-note-actions">
            <button
              className="save-note-button"
              onClick={handleSaveNote}
              disabled={isAddingNote}
            >
              {isAddingNote ? "Saving..." : "Save Note"}
            </button>
            <button
              className="cancel-note-button"
              onClick={() => {
                setNoteContent("");
                setShowNoteInput(false);
                setError("");
              }}
              disabled={isAddingNote}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="actions">
        <button className="action-button" onClick={() => onDownload(message)}>
          Download
        </button>
        <button
          className="delete-button"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to delete this message? This action cannot be undone."
              )
            ) {
              onDelete(message.id);
            }
          }}
        >
          Delete
        </button>
        <button
          className="add-note-button"
          onClick={() => setShowNoteInput(!showNoteInput)}
          disabled={isAddingNote}
        >
          <span>Add Note ({notes.length})</span>
        </button>
      </div>
    </div>
  );
};

const ChatHistoryDisplay = () => {
  const {
    profileFormResponses,
    addMessageToHistory,
    removeMessageFromHistory,
    addNoteToMessage,
    deleteNoteFromMessage,
    notes,
  } = useUser();

  const [messages, setMessages] = useState([]);
  const [messageNotes, setMessageNotes] = useState({});

  useEffect(() => {
    // Filter to ensure only ChildProfileForm responses are displayed
    const filteredMessages = profileFormResponses.filter(
      (msg) => msg.type === "profileFormResponse" && msg.fromForm === true
    );
    setMessages(filteredMessages);
    console.log("Filtered ProfileFormResponses:", filteredMessages);
    console.log("Raw ProfileFormResponses:", profileFormResponses);

    const notesMap = {};
    filteredMessages.forEach((msg) => {
      if (msg.noteIds) {
        notesMap[msg.id] = notes.filter((note) =>
          msg.noteIds.includes(note.id)
        );
      }
    });
    setMessageNotes(notesMap);
    console.log("Message Notes Map:", notesMap);
  }, [profileFormResponses, notes]);

  const handleDeleteMessage = useCallback(
    (id) => {
      removeMessageFromHistory(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      console.log("Message deleted, updated messages:", messages);
    },
    [removeMessageFromHistory]
  );

  const handleDownloadMessage = (message) => {
    const cleanText = (text) => text.replace(/[_*`#]/g, "").trim();
    const fixList = (text) => {
      let lines = text.split("\n");
      let newLines = [];
      let majorCounter = 1;
      let minorCounter = 1;
      for (let line of lines) {
        if (
          line.startsWith("1.") &&
          line.includes(":") &&
          !line.includes("Step")
        ) {
          line = `${majorCounter++}.${line.slice(1)}`;
          minorCounter = 1;
        } else if (line.includes("Step")) {
          line = line.replace(/Step \d+:/, `Step ${minorCounter++}:`);
        }
        newLines.push(line);
      }
      return newLines.join("\n");
    };

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
      messageNotes[message.id]
        ? messageNotes[message.id]
            .map(
              (note) =>
                `- ${cleanText(note.content)} (${formatTimestamp(
                  note.timestamp
                )})`
            )
            .join("\n")
        : "No notes."
    }`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${message.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddNote = useCallback(
    async (messageId, noteContent) => {
      try {
        await addNoteToMessage(messageId, noteContent);
        console.log("Note added successfully for message:", messageId);
      } catch (err) {
        console.error("Error adding note:", err);
      }
    },
    [addNoteToMessage]
  );

  const handleDeleteNote = useCallback(
    async (messageId, noteId) => {
      try {
        await deleteNoteFromMessage(messageId, noteId);
        console.log(
          "Note deleted successfully for message:",
          messageId,
          "Note ID:",
          noteId
        );
      } catch (err) {
        console.error("Error deleting note:", err);
      }
    },
    [deleteNoteFromMessage]
  );

  return (
    <div className="chat-history-display">
      <h1 className="title">Chat History</h1>
      <div className="chat-container">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageCard
              key={msg.id}
              message={msg}
              notes={messageNotes[msg.id] || []}
              onDelete={handleDeleteMessage}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onDownload={() => handleDownloadMessage(msg)}
            />
          ))
        ) : (
          <p className="no-messages">No profile form responses available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryDisplay;
