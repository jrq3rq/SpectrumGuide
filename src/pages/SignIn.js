import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay"; // Added import
import "../styles/SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const { login, isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/form", { state: { refresh: true } });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    setIsLoading(true); // Start loading
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
      console.log("User logged in:", result.user);
      login(result.user);
      setTimeout(() => {
        navigate("/form", { state: { refresh: true } });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Sign-in error:", error);
      setError(error.message || "An error occurred during sign-in.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        sessionStorage.setItem("requiresProfileSetup", "true");
        setTimeout(() => {
          navigate("/create-profile", { state: { refresh: true } });
          setIsLoading(false);
        }, 1500);
      } else {
        sessionStorage.removeItem("requiresProfileSetup");
        const profileData = docSnap.data();
        login({ ...user, ...profileData });
        const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
        setTimeout(() => {
          navigate(lastPage, { state: { refresh: true } });
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError(error.message || "An error occurred during Google sign-in.");
      setIsLoading(false);
    }
  };

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
            <p>You are now logged in as {user.email}</p>
            <Link to="/form">Go to Form</Link>
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
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="link-button"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
