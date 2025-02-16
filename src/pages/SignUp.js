import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentComponent from "../components/PaymentComponent";
import { createPaymentIntent } from "../services/paymentService";
import Tooltip from "../components/Tooltip"; // Tooltip Component
import "../styles/SignUp.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const planDisplayDescriptions = {
  free: "Free Spectrum: 1 credit/week for 1 Care Plan + 1 Story or 10 AI Chats.",
  silver:
    "Silver Spectrum: $9.99 for 10 credits. Each credit = 1-10 Custom Care Plans + 1-10 Stories or 100 AI Chats.",
  gold: "Gold Spectrum: $29.99 for 50 credits. Each credit = 1-50 Custom Care Plans + 1-50 Stories or 500 AI Chats.",
};
// Plan Descriptions for Tooltips
const planTooltips = {
  free: "Free weekly credit for 1 Care Plan, 1 Story, or 10 AI Chats. Perfect for exploring Spectrum Guide.",
  silver:
    "Silver Spectrum: $9.99 for 10 credits. Each credit offers 1-10 Custom Care Plans, 1-10 Stories, or 100 AI Chats. Ideal for small-scale personalized support.",
  gold: "Gold Spectrum: $29.99 for 50 credits. Each credit provides 1-50 Custom Care Plans, 1-50 Stories, or 500 AI Chats. Best for extensive, ongoing support needs.",
};
// Account Creators (Dropdown Options)
const accountCreators = [
  { id: "parentsGuardians", label: "Parents or Guardians" },
  { id: "teachersEducationalStaff", label: "Teachers and Educational Staff" },
  { id: "behavioralTherapists", label: "Behavioral Therapists/Therapists" },
  {
    id: "healthcareProviders",
    label: "Healthcare Providers (Pediatricians, Neurologists)",
  },
  {
    id: "specialEducationCoordinators",
    label: "Special Education Coordinators",
  },
  {
    id: "recreationalTherapists",
    label: "Recreational Therapists or Program Coordinators",
  },
  { id: "socialWorkers", label: "Social Workers or Case Managers" },
  { id: "other", label: "Other" },
];
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [clientSecret, setClientSecret] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });
  const [accountCreator, setAccountCreator] = useState("");
  const navigate = useNavigate();
  console.log("SignUp component is rendering");
  // Handle Sign-Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!accountCreator) {
      setError("Please select who is creating this account");
      return;
    }
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Step 2: Update Firebase Profile (Display Name)
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      // Step 3: Store Additional Data in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
        email,
        dob,
        accountCreator,
        plan: selectedPlan,
        credits:
          selectedPlan === "free" ? 1 : selectedPlan === "silver" ? 10 : 50,
        createdAt: new Date(),
        lastLogin: new Date(),
      });
      // Step 4: Handle Payment if User Selected a Paid Plan
      if (selectedPlan !== "free") {
        let amount;
        switch (selectedPlan) {
          case "silver":
            amount = 999; // $9.99 in cents
            break;
          case "gold":
            amount = 2999; // $29.99 in cents
            break;
          default:
            throw new Error("Invalid plan selected");
        }
        const paymentIntent = await createPaymentIntent({
          amount,
          currency: "usd",
          metadata: { plan: selectedPlan, accountCreator },
          receipt_email: email,
        });
        setClientSecret(paymentIntent.clientSecret);
        // Directly navigate to the payment page where payment processing will happen
        navigate("/payment", {
          state: {
            clientSecret: paymentIntent.clientSecret,
            selectedPlan: selectedPlan,
          },
        });
        // Add refresh here for paid plans
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.log("Free account created successfully");
        navigate("/form");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err.message);
    }
  };
  // Handle Plan Selection
  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setClientSecret(null);
  };

  // Tooltip Handlers
  const handleMouseMove = (e, plan) => {
    // Use planTooltips instead of planDescriptions
    setTooltip({
      show: true,
      x: e.clientX,
      y: e.clientY,
      text: planTooltips[plan],
    });
  };
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };
  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSignUp}>
        <div className="form-section">
          {/* Account Creator Dropdown */}
          <label htmlFor="accountCreator" className="label">
            Who is creating this account?
          </label>
          <select
            id="accountCreator"
            value={accountCreator}
            onChange={(e) => setAccountCreator(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            {accountCreators.map((creator) => (
              <option key={creator.id} value={creator.id}>
                {creator.label}
              </option>
            ))}
          </select>

          {/* User Info */}
          <label className="label">First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label className="label">Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label className="label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label">Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          <label className="label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="label">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Plan Selection */}
          <h3 className="label">Select Your Plan:</h3>
          <div className="plan-selection">
            {["free", "silver", "gold"].map((plan) => (
              <label
                key={plan}
                onMouseMove={(e) => handleMouseMove(e, plan)}
                onMouseLeave={handleMouseLeave}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan}
                  checked={selectedPlan === plan}
                  onChange={() => handlePlanSelection(plan)}
                />
                {planDisplayDescriptions[plan]}
              </label>
            ))}
          </div>
          {/* Tooltip */}
          {tooltip.show && (
            <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />
          )}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </div>
      </form>
      {/* Payment Processing for Paid Plans */}
      {clientSecret && selectedPlan !== "free" && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentComponent
            plan={selectedPlan}
            amount={selectedPlan === "silver" ? 9.99 : 29.99}
            onSuccess={() => {
              console.log("Payment successful, navigating to Form");
              navigate("/form");
            }}
            onFailure={(err) => {
              setError(`Payment failed: ${err.message}`);
            }}
          />
        </Elements>
      )}
    </div>
  );
};

export default SignUp;
