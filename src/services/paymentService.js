// src/services/paymentService.js
import axios from "axios";

const PAYMENT_API_URL = process.env.REACT_APP_PAYMENT_API_URL; // e.g., http://localhost:4242

/**
 * Creates a Payment Intent by sending the payment details to the backend.
 * @param {Object} paymentDetails - Details of the payment (amount, currency, etc.).
 * @returns {Promise<string>} - Client Secret for the payment intent.
 */
export const createPaymentIntent = async (paymentDetails) => {
  try {
    console.log("Creating payment intent with details:", paymentDetails);
    const response = await axios.post(
      `${PAYMENT_API_URL}/create-payment-intent`,
      paymentDetails,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from Payment API:", response.data);
    return response.data.clientSecret;
  } catch (error) {
    console.error(
      "Error with Payment API:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create payment intent.");
  }
};
