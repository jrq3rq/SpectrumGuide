// src/pages/Payment.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added import for useNavigate
import "../styles/Payment.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentComponent from "../components/PaymentComponent";
import { createPaymentIntent } from "../services/paymentService";
import Tooltip from "../components/Tooltip"; // Assuming 'Tooltip' is in a 'components' folder
import SpectrumGuideInfo from "../components/SpectrumGuideInfo";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isAboutOpen, setIsAboutOpen] = useState(false); // State for toggling SpectrumGuideInfo
  const navigate = useNavigate(); // Added useNavigate hook

  const toggleAbout = () => {
    setIsAboutOpen((prev) => !prev);
  };

  const handlePurchase = async (plan) => {
    let amount;
    switch (plan) {
      case "silver":
        amount = 999; // $9.99 in cents for Silver Spectrum
        break;
      case "gold":
        amount = 2999; // $29.99 in cents for Gold Spectrum
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

  const showTooltip = (event, text) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setTooltipContent(text);
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <>
      <div className="payment-page">
        <h1>Purchase Credits</h1>
        <p>
          Spectrum Guide offers simple, credit-based options to access
          personalized AI recommendations. Choose the right package for you or
          your family and enhance your experience today.
        </p>

        <ul className="payment-options">
          <li>
            <span
              onMouseEnter={(e) =>
                showTooltip(
                  e,
                  "Bronze Spectrum: $9.95 for 10 credits. Each credit = 1 Personalized Care Plan, 1 Personalized Story, 10 AI Chats."
                )
              }
              onMouseLeave={hideTooltip}
            >
              <b>Bronze Spectrum</b>: <b style={{ color: "#02C7EB" }}>10</b>{" "}
              credits for $9.95
            </span>
            <button onClick={() => handlePurchase("bronze")}>Buy Now</button>
          </li>
          <li>
            <span
              onMouseEnter={(e) =>
                showTooltip(
                  e,
                  "Silver Spectrum: $19.95 for 25 credits. Each credit = 1 Personalized Care Plan, 1 Personalized Story, 10 AI Chats."
                )
              }
              onMouseLeave={hideTooltip}
            >
              <b>Silver Spectrum</b>: <b style={{ color: "#02C7EB" }}>25</b>{" "}
              credits for $19.95
            </span>
            <button onClick={() => handlePurchase("silver")}>Buy Now</button>
          </li>
          <li>
            <span
              onMouseEnter={(e) =>
                showTooltip(
                  e,
                  "Gold Spectrum: $29.95 for 50 credits. Each credit = 1 Personalized Care Plan, 1 Personalized Story, 10 AI Chats."
                )
              }
              onMouseLeave={hideTooltip}
            >
              <b>Gold Spectrum</b>: <b style={{ color: "#02C7EB" }}>50</b>{" "}
              credits for $29.95
            </span>
            <button onClick={() => handlePurchase("gold")}>Buy Now</button>
          </li>
        </ul>
        <p
          style={{
            backgroundColor: "#e3f2fd",
            padding: "10px",
            borderRadius: "8px",
            borderLeft: "4px solid #02C7EB",
            marginBottom: "15px",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          <strong>Pay-Per-Use Model:</strong> Spectrum Guide employs a flexible
          Pay-Per-Use system designed for personalized, AI-driven support in
          autism care. Here's how it works:
          <ul style={{ paddingLeft: "20px", margin: "0" }}>
            <li>
              <strong>1 Personalized Care Plan</strong> per credit, tailored to
              individual needs.
            </li>
            <li>
              <strong>1 Personalized Story</strong> per credit, crafted for
              social learning or routine management.
            </li>
            <li>
              <strong>10 AI Chats</strong> per credit, offering direct AI
              interaction across all plans.
            </li>
          </ul>
          Credits do not expire, offering you the flexibility to use them as
          needed, whether for new plans, immediate behavioral support, or
          educational strategies. This model allows you to access:
          <ul style={{ paddingLeft: "20px", margin: "0" }}>
            <li>Detailed care planning</li>
            <li>Effective sensory strategy management</li>
            <li>IEP development assistance</li>
            <li>Personalized social stories</li>
          </ul>
          with plans like <strong>Bronze,</strong> <strong>Silver,</strong> and{" "}
          <strong>Gold</strong>. Each plan provides a set number of credits,
          ensuring you pay only for the support you use, receiving insights
          tailored to your specific situation without the obligation of a
          subscription.
        </p>
        {/* Stripe Payment Form */}
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentComponent
              clientSecret={clientSecret}
              customerName="Customer Name" // Replace with dynamic data
              customerEmail="customer@example.com" // Replace with dynamic data
              onSuccess={() => {
                console.log("Payment successful, navigating to Form");
                navigate("/form");
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              }}
              onFailure={(err) => {
                console.error("Payment failed:", err);
                // Optionally, display error to the user
              }}
            />
          </Elements>
        )}
        {/* Tooltip */}
        {tooltipVisible && (
          <Tooltip text={tooltipContent} {...tooltipPosition} />
        )}
      </div>
      {/* <div className="spectrum-guide-info">
        <SpectrumGuideInfo isOpen={isAboutOpen} toggle={toggleAbout} />
      </div> */}
    </>
  );
};

export default Payment;
