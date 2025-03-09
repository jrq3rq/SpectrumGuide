import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import FloatingInfoBot from "../components/FloatingInfoBot";
import InfoModal from "../components/InfoModal";
import "../styles/SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [testMode] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { login, isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SignIn - Form submitted");
    setIsLoading(true);
    if (process.env.REACT_APP_DISABLE_AUTH === "true") {
      login({ uid: "mockUserId", email: "mock@example.com" }, false);
      setTimeout(() => {
        navigate("/form", { state: { refresh: true } });
        setIsLoading(false);
      }, 1500);
      return;
    }
    try {
      let result;
      if (testMode) {
        result = await signInWithEmailAndPassword(
          auth,
          "jamrey10001@gmail.com",
          "Pass123!"
        );
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log("SignIn - User logged in:", result.user);
      login(result.user);
      navigate("/form", { state: { refresh: true } });
      setIsLoading(false);
    } catch (error) {
      console.error("SignIn - Sign-in error:", error);
      setError(error.message || "An error occurred during sign-in.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      console.log("SignIn - Initiating Google Sign-In");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("SignIn - Google Sign-In successful, user:", user);
      login(user, true); // Let UserContext handle navigation
      setIsLoading(false);
    } catch (error) {
      console.error("SignIn - Google Sign-In Error:", error);
      setError(
        `Google Sign-In failed: ${error.message || "Please try again."}`
      );
      setIsLoading(false);
    }
  };

  console.log(
    "SignIn - Rendering, isAuthenticated:",
    isAuthenticated,
    "isLoading:",
    isLoading,
    "user:",
    user
  );

  if (process.env.REACT_APP_DISABLE_AUTH === "true") {
    return (
      <div className="social-stories-page">
        <h1>Authentication is Disabled</h1>
        <p>Click below to bypass authentication for development:</p>
        <button
          onClick={() =>
            login({ uid: "mockUserId", email: "mock@example.com" }, false)
          }
          className="generate-button"
        >
          Mock Login
        </button>
        {isAuthenticated && (
          <div>
            <p>You are now logged in as {user?.email || "Mock User"}</p>
            <Link to="/form">Go to Form</Link>
          </div>
        )}
        <FloatingInfoBot onClick={() => setIsInfoModalOpen(true)} />
        {isInfoModalOpen && (
          <div className="modal-overlay">
            <InfoModal onClose={() => setIsInfoModalOpen(false)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="social-stories-page">
      {isLoading && <LoadingOverlay />}
      <h1>Sign In</h1>
      <div className="form-section">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="generate-button"
            disabled={isLoading}
          >
            Sign In
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="google-signin-button"
            disabled={isLoading}
          >
            Sign In with Google
          </button>
        </form>
        <p className="toggle-sign">
          Don't have an account?{" "}
          <Link to="/signup" className="link-button">
            Sign Up
          </Link>
        </p>
      </div>
      <FloatingInfoBot onClick={() => setIsInfoModalOpen(true)} />
      {isInfoModalOpen && (
        <div className="modal-overlay">
          <InfoModal onClose={() => setIsInfoModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default SignIn;
