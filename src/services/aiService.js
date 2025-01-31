// aiService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_GROK_API_URL; // Add this to your `.env` file
const API_KEY = process.env.REACT_APP_GROK_API_KEY; // Add this to your `.env` file

/**
 * Sends the prompt to the AI service and returns the response.
 * @param {string} prompt The prompt constructed from the form data.
 * @returns {Promise<string>} AI response text.
 */
export const sendToAIService = async (prompt) => {
  try {
    console.log("Sending prompt to AI service:", prompt); // Debug log
    const response = await axios.post(
      API_URL,
      {
        messages: [
          // { role: "system", content: "You are an assistant for parents." },
          {
            role: "system",
            content:
              "You are Spectrum, an AI caregiver assistant offering practical, empathetic support for autistic individuals. Respond only when asked. If asked who you are, state that you are Spectrum, an AI supporting caregivers.",
          },
          { role: "user", content: prompt },
        ],
        model: "grok-beta",
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from AI service:", response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error with AI service:",
      error.response?.data || error.message
    );
    throw new Error("Failed to retrieve a response from the AI service.");
  }
};
