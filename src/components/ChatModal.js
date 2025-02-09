// import React, { useState, useRef, useEffect } from "react";
// import "../styles/ChatModal.css";
// import { v4 as uuidv4 } from "uuid"; // Import UUID
// import { sendToAIService } from "../services/aiService"; // Ensure this service exists
// // import { sendToAIService } from "../services/aiServiceCredits";

// const ChatModal = ({ initialPrompt = "", onClose }) => {
//   const chatContainerRef = useRef(null);

//   // Disable background scrolling when the modal is open
//   useEffect(() => {
//     const originalStyle = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = originalStyle;
//     };
//   }, []);

//   // Load existing chats from localStorage on initial render
//   const [messages, setMessages] = useState(() => {
//     const savedChats = localStorage.getItem("chatHistory");
//     if (savedChats) {
//       let parsedMessages = JSON.parse(savedChats);
//       // Remove duplicates based on role and content
//       return parsedMessages.filter(
//         (msg, index, self) =>
//           index ===
//           self.findIndex(
//             (m) => m.role === msg.role && m.content === msg.content
//           )
//       );
//     }
//     return [];
//   });

//   // User input for new message
//   const [userInput, setUserInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Effect to auto-scroll to the top when messages update
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = 0; // Scroll to top
//     }
//   }, [messages]);

//   // Inject initial prompt as assistant message only once
//   useEffect(() => {
//     if (initialPrompt.trim()) {
//       const aiMessage = {
//         id: uuidv4(),
//         role: "assistant",
//         content: sanitizeContent(initialPrompt),
//         timestamp: new Date().toISOString(),
//         notes: [], // Initialize notes array
//       };
//       // Check if initial prompt is already in messages to avoid duplicates
//       if (
//         !messages.some(
//           (msg) => msg.content === aiMessage.content && msg.role === "assistant"
//         )
//       ) {
//         setMessages((prev) => {
//           const updated = [...prev, aiMessage];
//           saveMessagesToLocalStorage(updated);
//           return updated;
//         });
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initialPrompt]);

//   /** Function to sanitize AI responses by removing markdown-like syntax */
//   const sanitizeContent = (content) => {
//     // Remove markdown symbols: #, *, _, `, ~
//     return content.replace(/[#_*`~]/g, "").trim();
//   };

//   /** Save messages to localStorage without duplicates */
//   const saveMessagesToLocalStorage = (updatedMessages) => {
//     const uniqueMessages = updatedMessages.filter(
//       (msg, index, self) =>
//         index ===
//         self.findIndex((m) => m.role === msg.role && m.content === msg.content)
//     );
//     localStorage.setItem("chatHistory", JSON.stringify(uniqueMessages));
//   };

//   /** Handle sending a message */
//   const handleSend = async () => {
//     const content = userInput.trim();
//     if (!content) return;

//     const userMessage = {
//       id: uuidv4(),
//       role: "user",
//       content,
//       timestamp: new Date().toISOString(),
//       notes: [], // Initialize notes array
//     };

//     // Check for duplicate user message
//     if (
//       !messages.some((msg) => msg.role === "user" && msg.content === content)
//     ) {
//       setMessages((prev) => {
//         const updated = [...prev, userMessage];
//         saveMessagesToLocalStorage(updated);
//         return updated;
//       });
//     } else {
//       console.log("Duplicate user message prevented.");
//     }

//     setUserInput("");
//     setIsLoading(true);

//     try {
//       const aiResponse = await sendToAIService(content);
//       const sanitizedResponse = sanitizeContent(aiResponse);

//       // Assuming AI response includes multiple sections separated by a delimiter, e.g., "###"
//       const sections = sanitizedResponse.split(/###\s*/).filter(Boolean);

//       const aiMessages = sections.map((section) => ({
//         id: uuidv4(),
//         role: "assistant",
//         content: section.trim(),
//         timestamp: new Date().toISOString(),
//         notes: [], // Initialize notes array
//       }));

//       // Filter out duplicate assistant messages
//       const newAiMessages = aiMessages.filter(
//         (aiMsg) =>
//           !messages.some(
//             (msg) => msg.role === "assistant" && msg.content === aiMsg.content
//           )
//       );

//       if (newAiMessages.length > 0) {
//         setMessages((prev) => {
//           const updated = [...prev, ...newAiMessages];
//           saveMessagesToLocalStorage(updated);
//           return updated;
//         });
//       } else {
//         console.log("Duplicate assistant messages prevented.");
//       }

//       // Save interactions to localStorage (if applicable)
//       const newInteraction = {
//         id: uuidv4(),
//         prompt: content,
//         response: sanitizedResponse,
//         timestamp: new Date().toISOString(),
//       };
//       let existingInteractions =
//         JSON.parse(localStorage.getItem("interactions")) || [];
//       // Avoid duplicates in interactions as well
//       if (
//         !existingInteractions.some(
//           (interaction) =>
//             interaction.prompt === newInteraction.prompt &&
//             interaction.response === newInteraction.response
//         )
//       ) {
//         existingInteractions.push(newInteraction);
//         localStorage.setItem(
//           "interactions",
//           JSON.stringify(existingInteractions)
//         );
//       }
//     } catch (error) {
//       console.error("Error from AI service:", error);
//       const errorMsg = {
//         id: uuidv4(),
//         role: "assistant",
//         content: "Sorry, something went wrong. Please try again.",
//         timestamp: new Date().toISOString(),
//         notes: [], // Initialize notes array
//       };
//       setMessages((prev) => {
//         const updated = [...prev, errorMsg];
//         saveMessagesToLocalStorage(updated);
//         return updated;
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /** Handle deleting a single message */
//   const handleDeleteMessage = (messageId) => {
//     setMessages((prev) => {
//       const updated = prev.filter((msg) => msg.id !== messageId);
//       saveMessagesToLocalStorage(updated);
//       return updated;
//     });
//   };

//   /** Handle clearing the entire chat */
//   const handleClearChat = () => {
//     if (window.confirm("Are you sure you want to clear the chat?")) {
//       setMessages([]);
//       localStorage.removeItem("chatHistory");
//     }
//   };

//   /** Handle sending message on Enter key (without Shift) */
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   /** Download a single message as a text file */
//   const handleDownloadMessage = (message) => {
//     const textContent = `[${message.role.toUpperCase()} - ${formatTimestamp(
//       message.timestamp
//     )}]\n${message.content}\n`;

//     const blob = new Blob([textContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `message-${message.id}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   /** Download the entire chat as a text file */
//   const handleDownloadChat = () => {
//     const textContent = messages
//       .map((msg) => {
//         return `[${msg.role.toUpperCase()} - ${formatTimestamp(
//           msg.timestamp
//         )}]\n${msg.content}\n`;
//       })
//       .join("\n");

//     const blob = new Blob([textContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "chat-history.txt";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   /** Format timestamp for display */
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString();
//   };

//   return (
//     <div className="chat-modal">
//       <div className="chat-header">
//         <h2>AI Chat Assistant</h2>
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="close-modal-btn"
//           aria-label="Close Chat Modal"
//         >
//           &times;
//         </button>
//       </div>

//       <div className="chat-container" ref={chatContainerRef}>
//         {messages
//           .slice()
//           .reverse()
//           .map((msg) => (
//             <div
//               key={msg.id}
//               className={`chat-message ${
//                 msg.role === "user" ? "user" : "assistant"
//               }`}
//             >
//               <div className="message-content">
//                 <p>{msg.content}</p>
//                 <span className="timestamp">
//                   {formatTimestamp(msg.timestamp)}
//                 </span>
//               </div>
//               <div className="message-actions">
//                 <button
//                   onClick={() => handleDownloadMessage(msg)}
//                   className="download-btn"
//                   aria-label={`Download message from ${msg.role}`}
//                 >
//                   Download
//                 </button>
//                 <button
//                   onClick={() => handleDeleteMessage(msg.id)}
//                   className="delete-btn"
//                   aria-label="Delete message"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}

//         {/* Loading Spinner */}
//         {isLoading && (
//           <div className="loading-spinner">
//             <div className="spinner"></div>
//             <p>Loading response...</p>
//           </div>
//         )}
//       </div>

//       <div className="chat-input">
//         <textarea
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           rows={2}
//           disabled={isLoading} // Disable input while loading
//           aria-label="Type your message"
//         />
//         <button
//           onClick={handleSend}
//           className="send-btn"
//           disabled={isLoading}
//           aria-label="Send Message"
//         >
//           {isLoading ? "Sending..." : "Send"}
//         </button>

//         {/* New container for Download and Clear buttons */}
//         <div className="bottom-buttons-container">
//           <button
//             className="download-chat-btn"
//             onClick={handleDownloadChat}
//             aria-label="Download Chat History"
//           >
//             Download Chat
//           </button>
//           <button
//             className="clear-chat-btn"
//             onClick={handleClearChat}
//             aria-label="Clear Chat History"
//           >
//             Clear Chat
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatModal;
// File: src/components/ChatModal.jsx
import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatModal.css";
import { v4 as uuidv4 } from "uuid";
import { sendToAIService } from "../services/aiService";
import ttsService from "../core/tts-service";
import TTSRadialControls from "../components/TTSRadialControls";

const ChatModal = ({ initialPrompt = "", onClose }) => {
  const chatContainerRef = useRef(null);

  // Disable background scrolling when the modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Load existing chats from localStorage on initial render
  const [messages, setMessages] = useState(() => {
    const savedChats = localStorage.getItem("chatHistory");
    if (savedChats) {
      let parsedMessages = JSON.parse(savedChats);
      return parsedMessages.filter(
        (msg, index, self) =>
          index ===
          self.findIndex(
            (m) => m.role === msg.role && m.content === msg.content
          )
      );
    }
    return [];
  });

  // User input and loading state
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to top when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  // Inject initial prompt as an assistant message (and speak it via TTS)
  useEffect(() => {
    if (initialPrompt.trim()) {
      const aiMessage = {
        id: uuidv4(),
        role: "assistant",
        content: sanitizeContent(initialPrompt),
        timestamp: new Date().toISOString(),
        notes: [],
      };
      if (
        !messages.some(
          (msg) => msg.content === aiMessage.content && msg.role === "assistant"
        )
      ) {
        setMessages((prev) => {
          const updated = [...prev, aiMessage];
          saveMessagesToLocalStorage(updated);
          // Trigger TTS for the initial prompt if enabled
          if (ttsService.getTtsEnabled()) {
            ttsService.speakText(aiMessage.content);
          }
          return updated;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  // Utility to remove unwanted markdown-like syntax from responses
  const sanitizeContent = (content) => {
    return content.replace(/[#_*`~]/g, "").trim();
  };

  // Save messages to localStorage without duplicates
  const saveMessagesToLocalStorage = (updatedMessages) => {
    const uniqueMessages = updatedMessages.filter(
      (msg, index, self) =>
        index ===
        self.findIndex((m) => m.role === msg.role && m.content === msg.content)
    );
    localStorage.setItem("chatHistory", JSON.stringify(uniqueMessages));
  };

  // Handle sending a message
  const handleSend = async () => {
    const content = userInput.trim();
    if (!content) return;

    const userMessage = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      notes: [],
    };

    // Prevent duplicate user messages
    if (
      !messages.some((msg) => msg.role === "user" && msg.content === content)
    ) {
      setMessages((prev) => {
        const updated = [...prev, userMessage];
        saveMessagesToLocalStorage(updated);
        return updated;
      });
    } else {
      console.log("Duplicate user message prevented.");
    }

    setUserInput("");
    setIsLoading(true);

    try {
      const aiResponse = await sendToAIService(content);
      const sanitizedResponse = sanitizeContent(aiResponse);
      // Split response into sections if there are multiple parts
      const sections = sanitizedResponse.split(/###\s*/).filter(Boolean);

      // Create a message object for each section
      const aiMessages = sections.map((section) => ({
        id: uuidv4(),
        role: "assistant",
        content: section.trim(),
        timestamp: new Date().toISOString(),
        notes: [],
      }));

      // Filter out duplicate assistant messages
      const newAiMessages = aiMessages.filter(
        (aiMsg) =>
          !messages.some(
            (msg) => msg.role === "assistant" && msg.content === aiMsg.content
          )
      );

      if (newAiMessages.length > 0) {
        setMessages((prev) => {
          const updated = [...prev, ...newAiMessages];
          saveMessagesToLocalStorage(updated);
          return updated;
        });
        // Trigger TTS for the new assistant message(s) (example: speak the first one)
        if (ttsService.getTtsEnabled()) {
          ttsService.speakText(newAiMessages[0].content);
        }
      } else {
        console.log("Duplicate assistant messages prevented.");
      }

      // Save interactions to localStorage (if applicable)
      const newInteraction = {
        id: uuidv4(),
        prompt: content,
        response: sanitizedResponse,
        timestamp: new Date().toISOString(),
      };
      let existingInteractions =
        JSON.parse(localStorage.getItem("interactions")) || [];
      if (
        !existingInteractions.some(
          (interaction) =>
            interaction.prompt === newInteraction.prompt &&
            interaction.response === newInteraction.response
        )
      ) {
        existingInteractions.push(newInteraction);
        localStorage.setItem(
          "interactions",
          JSON.stringify(existingInteractions)
        );
      }
    } catch (error) {
      console.error("Error from AI service:", error);
      const errorMsg = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
        notes: [],
      };
      setMessages((prev) => {
        const updated = [...prev, errorMsg];
        saveMessagesToLocalStorage(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a message
  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => {
      const updated = prev.filter((msg) => msg.id !== messageId);
      // Do not call saveMessagesToLocalStorage here
      return updated;
    });
  };

  // Handle clearing the entire chat
  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
      localStorage.removeItem("chatHistory");
    }
  };

  // Send message on Enter (without Shift)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Download a single message as text
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

  // Download the entire chat as text
  const handleDownloadChat = () => {
    const textContent = messages
      .map((msg) => {
        return `[${msg.role.toUpperCase()} - ${formatTimestamp(
          msg.timestamp
        )}]\n${msg.content}\n`;
      })
      .join("\n");
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <h2>AI Chat Assistant</h2>
        <button
          onClick={onClose}
          className="close-modal-btn"
          aria-label="Close Chat Modal"
        >
          &times;
        </button>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        {messages
          .slice()
          .reverse()
          .map((msg) => (
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
                {/* Render TTS controls inside the message container for assistant messages */}
                {msg.role === "assistant" && (
                  <TTSRadialControls text={msg.content} />
                )}
              </div>
              <div className="message-actions">
                <button
                  onClick={() => handleDownloadMessage(msg)}
                  className="download-btn"
                  aria-label={`Download message from ${msg.role}`}
                >
                  Download
                </button>
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="delete-btn"
                  aria-label="Delete message"
                >
                  Delete
                </button>
              </div>
            </div>
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
          onKeyDown={handleKeyDown}
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
