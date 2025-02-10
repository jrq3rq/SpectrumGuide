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
import "../styles/SignIn.css";
import SpectrumGuideInfo from "../components/SpectrumGuideInfo";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [error, setError] = useState(null);
  const { login, isAuthenticated, user } = useUser();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Moved useNavigate outside of functions

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/form"); // ✅ Redirect user immediately if already logged in
    }
  }, [isAuthenticated, navigate]);
  const toggleAbout = () => {
    setIsAboutOpen((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (process.env.REACT_APP_DISABLE_AUTH === "true") {
      login({ uid: "mockUserId", email: "mock@example.com" }, false);
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
    } catch (error) {
      console.error("Sign-in error:", error);
      setError(error.message || "An error occurred during sign-in.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Check Firestore for user profile
      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // User does NOT have a profile → Force profile setup
        sessionStorage.setItem("requiresProfileSetup", "true");
        navigate("/create-profile");
      } else {
        // ✅ User has profile → Load data into context and redirect
        sessionStorage.removeItem("requiresProfileSetup");
        const profileData = docSnap.data();
        login({ ...user, ...profileData });

        // Redirect to last visited page or default `/form`
        const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
        navigate(lastPage);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError(error.message || "An error occurred during Google sign-in.");
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
      <h1>Sign In</h1>
      <div className="form-wrapper">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <h3>Email Sign In</h3>
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
            <button type="submit" className="generate-button">
              Sign In
            </button>
            <button
              onClick={handleGoogleSignIn}
              className="google-signin-button"
            >
              Sign In with Google
            </button>
          </form>
          {error && <div className="error">{error}</div>}
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

          {/* Spectrum Guide Info Button & Section */}
          <SpectrumGuideInfo isOpen={isAboutOpen} toggle={toggleAbout} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
