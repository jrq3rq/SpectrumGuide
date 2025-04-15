import axios from "axios";
import { storage } from "../firebase";
import {
  ref,
  uploadString,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";

const GROK_API_URL = process.env.REACT_APP_GROK_API_URL;
const GROK_API_KEY = process.env.REACT_APP_GROK_API_KEY;
const GROK_IMAGE_API_URL = process.env.REACT_APP_GROK_IMAGE_API_URL;
const GROK_IMAGE_API_KEY =
  process.env.REACT_APP_GROK_IMAGE_API_KEY ||
  process.env.REACT_APP_GROK_API_KEY;

/**
 * Sends the prompt to the Grok API for text generation.
 * @param {string} prompt The prompt constructed from the form data.
 * @returns {Promise<string>} AI response text.
 */
export const sendToAIService = async (prompt) => {
  try {
    console.log("Sending prompt to Grok API for text generation:", prompt);
    const response = await axios.post(
      GROK_API_URL,
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
          Authorization: `Bearer ${GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Grok API:", response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error with Grok API:",
      error.response?.data || error.message
    );
    throw new Error("Failed to retrieve a response from the Grok API.");
  }
};

/**
 * Generates an image using Grok's Aurora API and caches it in Firebase Storage.
 * @param {string} description The text description for the image generation.
 * @param {Object} options Additional options for image generation (e.g., size, userId, symbolId).
 * @returns {Promise<string>} Base64 data URL of the generated or cached image.
 */
export const generateImageFromText = async (description, options = {}) => {
  const { userId, symbolId, size = "1024x768" } = options;

  if (!GROK_IMAGE_API_URL || !GROK_IMAGE_API_KEY) {
    throw new Error("Grok Image API URL or Key is missing.");
  }

  if (!userId || !symbolId) {
    throw new Error("Missing userId or symbolId.");
  }

  const storagePath = `ai-symbols/${userId}/${symbolId}.jpg`;
  const storageRef = ref(storage, storagePath);

  // Check cache
  try {
    await getMetadata(storageRef);
    const cachedUrl = await getDownloadURL(storageRef);
    // Fetch the image data as a base64 string to avoid CORS issues
    const imageResponse = await axios.get(cachedUrl, {
      responseType: "arraybuffer",
    });
    return `data:image/jpeg;base64,${Buffer.from(
      imageResponse.data,
      "binary"
    ).toString("base64")}`;
  } catch (error) {
    if (error.code !== "storage/object-not-found") {
      console.error("Firebase cache error:", error);
    }
  }

  // Sanitize prompt
  const cleanedPrompt = description.replace(/[*_`#\\-]/g, "").slice(0, 950);

  try {
    const response = await axios.post(
      GROK_IMAGE_API_URL,
      {
        prompt: cleanedPrompt,
        n: 1,
        response_format: "url",
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_IMAGE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const base64Image = `data:image/jpeg;base64,${Buffer.from(
      imageResponse.data,
      "binary"
    ).toString("base64")}`;

    try {
      await uploadString(storageRef, base64Image.split(",")[1], "base64", {
        contentType: "image/jpeg",
      });
    } catch (uploadError) {
      console.error("Error caching image in Firebase:", uploadError);
    }

    return base64Image;
  } catch (error) {
    console.error(
      "Grok Aurora generation failed:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate an image with Grok Aurora API.");
  }
};
