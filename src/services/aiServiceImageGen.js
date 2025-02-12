import axios from "axios";

const API_URL = process.env.REACT_APP_GROK_API_URL; // Add this to your `.env` file
const API_KEY = process.env.REACT_APP_GROK_API_KEY; // Add this to your `.env` file
const IMAGE_API_URL = process.env.REACT_APP_GROK_IMAGE_API_URL; // New env variable for image API

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

/**
 * Generates an image based on the provided text description.
 * @param {string} description The text description for the image generation.
 * @returns {Promise<string>} URL of the generated image.
 */
export const generateImageFromText = async (description) => {
  try {
    console.log("Generating image from description:", description); // Debug log
    const response = await axios.post(
      IMAGE_API_URL,
      {
        prompt: description,
        // Additional parameters might be required by your image generation service
        // For example: size, format, style, etc.
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Image generation response:", response.data);
    // Assuming the API returns a URL or data URL for the image
    return response.data.image_url; // Adjust this based on your API's response structure
  } catch (error) {
    console.error(
      "Error with image generation service:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to generate an image from the provided description."
    );
  }
};
