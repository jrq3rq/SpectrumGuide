// src/pages/Payment.js
import React, { useState } from "react";
import "../styles/Payment.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentComponent from "../components/PaymentComponent";
import { createPaymentIntent } from "../services/paymentService";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePurchase = async (plan) => {
    let amount;
    switch (plan) {
      case "starter":
        amount = 999; // $9.99 in cents
        break;
      case "standard":
        amount = 1999; // $19.99 in cents
        break;
      case "family":
        amount = 2999; // $29.99 in cents
        break;
      default:
        console.error("Invalid plan selected");
        return;
    }

    // Ideally, collect actual customer details from user inputs
    const name = "Customer Name"; // Replace with dynamic data
    const email = "customer@example.com"; // Replace with dynamic data

    try {
      const clientSecret = await createPaymentIntent({
        amount,
        currency: "usd",
        metadata: { plan },
        receipt_email: email,
      });
      setClientSecret(clientSecret);
      setSelectedPlan(plan);
      console.log(`Client Secret for ${plan} plan:`, clientSecret);
    } catch (error) {
      console.error("Failed to create payment intent:", error.message);
      // Optionally, display error to the user
    }
  };

  return (
    <div className="payment-page">
      <h1>Purchase Credits</h1>
      <p>
        Spectrum Guide offers flexible, credit-based options to access
        personalized AI recommendations. Choose the right package for your
        family and start making meaningful progress today.
      </p>
      <ul className="payment-options">
        <li>
          <span>Starter Pack: 10 credits for $9.99</span>
          <button onClick={() => handlePurchase("starter")}>Buy Now</button>
        </li>
        <li>
          <span>Standard Pack: 25 credits for $19.99</span>
          <button onClick={() => handlePurchase("standard")}>Buy Now</button>
        </li>
        <li>
          <span>Family Pack: 50 credits for $29.99</span>
          <button onClick={() => handlePurchase("family")}>Buy Now</button>
        </li>
      </ul>
      <p>
        Credits allow you to generate care plans, manage sensory strategies, and
        much more.
      </p>

      {/* Stripe Payment Form */}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentComponent
            clientSecret={clientSecret}
            customerName="Customer Name" // Replace with dynamic data
            customerEmail="customer@example.com" // Replace with dynamic data
          />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
