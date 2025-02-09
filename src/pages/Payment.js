// src/pages/Payment.js
import React, { useState } from "react";
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
                  "Silver Spectrum: Get 10 credits for $9.99, now covering 10,000 words of AI interaction. This can include:\n- Weekly personalized care plan adjustments\n- Two detailed social stories\n- Multiple sensory management strategies"
                )
              }
              onMouseLeave={hideTooltip}
            >
              Silver Spectrum: 10 credits (10,000 words) for $9.99
            </span>
            <button
              onMouseEnter={(e) =>
                showTooltip(
                  e,
                  "Silver Spectrum: Get 10 credits for $9.99, now covering 10,000 words of AI interaction. This can include:\n- Weekly personalized care plan adjustments\n- Two detailed social stories\n- Multiple sensory management strategies"
                )
              }
              onMouseLeave={hideTooltip}
              onClick={() => handlePurchase("silver")}
            >
              Buy Now
            </button>
          </li>

          <li>
            <span
              onMouseEnter={(e) =>
                showTooltip(
                  e,
                  "Gold Spectrum: 50 credits for $29.99, now providing 50,000 words of AI interaction. This can include:\n- Monthly comprehensive care plans for multiple individuals\n- A series of 10 social stories\n- Extensive behavioral analysis and strategy adjustments\n- Continuous educational support and IEP modifications"
                )
              }
              onMouseLeave={hideTooltip}
            >
              Gold Spectrum: 50 credits (50,000 words) for $29.99
            </span>
            <button
              onMouseEnter={(e) =>
                showTooltip(
                  e,
                  "Gold Spectrum: 50 credits for $29.99, now providing 50,000 words of AI interaction. This can include:\n- Monthly comprehensive care plans for multiple individuals\n- A series of 10 social stories\n- Extensive behavioral analysis and strategy adjustments\n- Continuous educational support and IEP modifications"
                )
              }
              onMouseLeave={hideTooltip}
              onClick={() => handlePurchase("gold")}
            >
              Buy Now
            </button>
          </li>
        </ul>

        <p
          style={{
            backgroundColor: "#e3f2fd",
            padding: "10px",
            borderRadius: "5px",
            borderLeft: "4px solid #02C7EB",
            marginBottom: "15px",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          <strong>Pay-Per-Use Model:</strong> Spectrum Guide operates on a
          flexible Pay-Per-Use model, allowing you to purchase credits for
          specific services or features. Each credit grants access to AI-powered
          support, enabling you to generate detailed care plans, manage sensory
          strategies, develop IEPs, and create personalized social stories.
          Every credit provides up to 1,000 words of interaction, ensuring you
          receive precise, customized insights tailored to your needs—without
          requiring a full subscription.
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
