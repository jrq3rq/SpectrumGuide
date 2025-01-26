import React, { useState, useEffect, useMemo, useCallback } from "react";

/** Convert timestamp to YYYY-MM-DD */
function formatDate(timestamp) {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Remove characters like '**', '*', '_' from the text */
function sanitizeText(text) {
  if (!text) return "";
  return text.replace(/[*_]+/g, "").trim();
}

/** Show only the first N sentences (default: 2) */
function truncateSentences(text, maxSentences = 2) {
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const truncated = sentences.slice(0, maxSentences).join(" ").trim();
  return sentences.length > maxSentences ? truncated + "..." : truncated;
}

const Interaction = () => {
  const [interactions, setInteractions] = useState([]);

  // Load from localStorage once
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("interactions")) || [];
    setInteractions(saved);
  }, []);

  // Remove an interaction (by id) and update localStorage
  const handleDelete = useCallback(
    (id) => {
      const updated = interactions.filter((item) => item.id !== id);
      setInteractions(updated);
      localStorage.setItem("interactions", JSON.stringify(updated));
    },
    [interactions]
  );

  // Group interactions by date
  const groupedInteractions = useMemo(() => {
    return interactions.reduce((acc, item) => {
      const dateKey = item.timestamp ? formatDate(item.timestamp) : "Unknown";
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [interactions]);

  // Sort date keys: newest first
  const sortedDateKeys = useMemo(() => {
    return Object.keys(groupedInteractions).sort((a, b) => b.localeCompare(a));
  }, [groupedInteractions]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Interactions (Grouped by Date)</h1>
      <div style={styles.scrollableArea}>
        {sortedDateKeys.map((dateStr) => (
          <div key={dateStr} style={styles.dateGroup}>
            <h2 style={styles.dateHeading}>{dateStr}</h2>
            {groupedInteractions[dateStr].map((interaction) => (
              <ChatCard
                key={interaction.id}
                interaction={interaction}
                onDelete={() => handleDelete(interaction.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Card for a single interaction: collapsible text & deletion */
const ChatCard = ({ interaction, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Validation and sanitization
  if (
    !interaction ||
    !interaction.id ||
    !interaction.prompt ||
    !interaction.response ||
    !interaction.timestamp
  ) {
    console.error("Invalid interaction data:", interaction);
    return null;
  }

  const safePrompt = sanitizeText(interaction.prompt);
  const safeResponse = sanitizeText(interaction.response);

  return (
    <div style={{ ...styles.interactionCard, transition: "height 0.3s ease" }}>
      <p style={styles.text}>
        <strong>Prompt:</strong>{" "}
        {expanded ? safePrompt : truncateSentences(safePrompt, 2)}
      </p>
      <p style={styles.text}>
        <strong>Response:</strong>{" "}
        {expanded ? safeResponse : truncateSentences(safeResponse, 2)}
      </p>
      <p style={styles.timestamp}>
        <strong>Timestamp:</strong> {interaction.timestamp}
      </p>
      <div style={styles.actions}>
        <button
          style={styles.toggleBtn}
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Show Less" : "Show More"}
          tabIndex="0"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
        <button
          style={styles.deleteBtn}
          onClick={onDelete}
          aria-label="Delete interaction"
          tabIndex="0"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

/** Inline styles with slight modifications for visual enhancement */
const styles = {
  container: {
    height: "calc(100vh - 140px)", // Adjust for header and footer
    width: "90%",
    maxWidth: "800px",
    margin: "20px auto",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    padding: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "1.5rem",
    color: "#333",
  },
  scrollableArea: {
    overflowY: "auto",
    flex: 1,
    paddingBottom: "60px", // Padding to ensure content doesn't touch the footer
  },
  dateGroup: {
    marginBottom: "24px",
  },
  dateHeading: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "12px",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "6px",
    textAlign: "left",
    color: "#555",
  },
  interactionCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    textAlign: "left",
  },
  text: {
    margin: "0 0 8px 0",
    lineHeight: "1.6",
    fontSize: "1rem",
    wordWrap: "break-word",
    color: "#4a4a4a",
  },
  timestamp: {
    margin: "0 0 8px 0",
    fontSize: "0.85rem",
    color: "#777",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleBtn: {
    backgroundColor: "#3a86ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#2b70e3",
    },
  },
  deleteBtn: {
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#e65757",
    },
  },
  footer: {
    marginTop: "auto", // Pushes footer to the bottom
    backgroundColor: "#f4f4f9",
    color: "#555",
    textAlign: "center",
    padding: "15px 0",
    fontSize: "14px",
  },
};

export default Interaction;
