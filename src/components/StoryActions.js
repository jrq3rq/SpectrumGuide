import React from "react";
import TTSRadialControls from "./TTSRadialControls";
import "../styles/StoryActions.css";

const StoryActions = ({ story, onDownload, onDelete }) => {
  return (
    <div className="story-actions-container">
      <button
        onClick={() => onDownload(story)}
        className="download-story-button"
      >
        Download
      </button>
      <button
        onClick={() => onDelete(story.id)}
        className="delete-story-button"
      >
        Delete
      </button>
      {/* Pass the story color */}
      <TTSRadialControls
        text={story.content}
        chatId={story.id}
        storyColor={story.color}
      />
    </div>
  );
};

export default StoryActions;
