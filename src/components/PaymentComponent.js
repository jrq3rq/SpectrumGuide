// src/components/PaymentComponent.js
import React from "react";
import CheckoutForm from "./CheckoutForm";

const PaymentComponent = ({ clientSecret, customerName, customerEmail }) => {
  return (
    <CheckoutForm
      clientSecret={clientSecret}
      customerName={customerName}
      customerEmail={customerEmail}
    />
  );
};

export default PaymentComponent;
