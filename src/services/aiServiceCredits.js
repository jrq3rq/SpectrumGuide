import axios from "axios";

const API_URL = process.env.REACT_APP_GROK_API_URL;
const API_KEY = process.env.REACT_APP_GROK_API_KEY;

/**
 * Sends the prompt to the AI service and manages credits.
 * @param {string} prompt - The prompt constructed from form data.
 * @param {number} credits - The user's available credits.
 * @returns {Promise<{response: string, creditsUsed: number}>} - AI response text and credits used.
 */
export const sendToAIService = async (prompt, credits) => {
  try {
    const promptTokens = estimateTokens(prompt); // Implement this function to estimate token count
    const creditsNeeded = Math.ceil(promptTokens / 1000); // Assuming 1 credit per 1000 tokens

    if (credits < creditsNeeded) {
      throw new Error("Not enough credits. Please purchase more.");
    }

    console.log("Sending prompt to AI service:", prompt);
    const response = await axios.post(
      API_URL,
      {
        messages: [
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
    return {
      response: response.data.choices[0].message.content,
      creditsUsed: creditsNeeded,
    };
  } catch (error) {
    console.error(
      "Error with AI service or credit system:",
      error.response?.data || error.message
    );
    throw error;
  }
};

function estimateTokens(text) {
  // This is a very rough estimation. You might want to use a more precise method or API for token counting.
  // A simple rule of thumb might be 1 token ≈ 4 characters, but this can vary.
  return Math.ceil(text.length / 4);
}
