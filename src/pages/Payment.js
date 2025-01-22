import React from "react";
import "../styles/Payment.css"; // Add styles specific to the Payment page if needed

const Payment = () => {
  return (
    <div className="payment-page">
      <h1>Payment Options</h1>
      <p>
        Spectrum Guide offers affordable plans to suit your needs. Choose the
        best option for your family and start accessing personalized AI
        recommendations today.
      </p>
      <ul>
        <li>Basic Plan: $9.99/month</li>
        <li>Pro Plan: $19.99/month</li>
        <li>Premium Plan: $29.99/month</li>
      </ul>
      <button>Subscribe Now</button>
    </div>
  );
};

export default Payment;
