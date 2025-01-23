import React, { useState, useEffect } from "react";

const Interaction = () => {
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    const savedInteractions =
      JSON.parse(localStorage.getItem("interactions")) || [];
    setInteractions(savedInteractions);
  }, []);

  const handleDelete = (index) => {
    const updatedInteractions = interactions.filter((_, i) => i !== index);
    setInteractions(updatedInteractions);
    localStorage.setItem("interactions", JSON.stringify(updatedInteractions));
  };

  return (
    <div>
      <h1>Interactions</h1>
      {interactions.map((interaction, index) => (
        <div key={index} className="interaction-log">
          <p>
            <strong>Prompt:</strong> {JSON.stringify(interaction.prompt)}
          </p>
          <p>
            <strong>Response:</strong> {interaction.response}
          </p>
          <button onClick={() => handleDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Interaction;
