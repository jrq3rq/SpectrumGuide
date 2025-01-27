// src/components/CheckoutForm.js
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = ({ clientSecret, customerName, customerEmail }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe or payment details not properly initialized.");
      return;
    }

    try {
      setProcessing(true);
      const cardElement = elements.getElement(CardElement);

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerName,
              email: customerEmail,
            },
          },
        });

      if (confirmError) {
        console.error("Payment failed:", confirmError.message);
        setError(confirmError.message);
      } else {
        console.log("Payment succeeded!", paymentIntent);
        setSuccess(true);
        // Optionally, update user credits here or notify backend
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formStyles = {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #c3c3c3",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyles = {
    display: "block",
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: processing ? "#ccc" : "#4a90e2",
    border: "none",
    borderRadius: "4px",
    cursor: processing ? "not-allowed" : "pointer",
    marginTop: "15px",
    transition: "background-color 0.3s ease",
  };

  const errorStyles = {
    color: "#9e2146",
    fontSize: "14px",
    marginTop: "10px",
  };

  const successStyles = {
    color: "#4caf50",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "10px",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {error && <div style={errorStyles}>{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        style={buttonStyles}
      >
        {processing ? "Processing..." : "Pay"}
      </button>
      {success && <div style={successStyles}>Payment successful!</div>}
    </form>
  );
};

export default CheckoutForm;
