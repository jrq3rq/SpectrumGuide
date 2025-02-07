// import React, { useState } from "react";
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "../firebase"; // Ensure Firebase is correctly initialized
// import { useUser } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import "../styles/SignIn.css";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [testMode, setTestMode] = useState(false);
//   const [error, setError] = useState(null);
//   const { login } = useUser(); // Destructure login function
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submitted"); // Debugging

//     // Bypass sign-in if authentication is disabled
//     if (process.env.REACT_APP_DISABLE_AUTH === "true") {
//       login({ uid: "mockUserId", email: "mock@example.com" });
//       return;
//     }

//     try {
//       let result;
//       if (testMode) {
//         // Use test credentials
//         result = await signInWithEmailAndPassword(
//           auth,
//           "jamrey10001@gmail.com",
//           "Pass123!"
//         );
//       } else {
//         // Use user-provided credentials
//         result = await signInWithEmailAndPassword(auth, email, password);
//       }

//       console.log("User logged in:", result.user);
//       login(result.user); // Pass the Firebase user object to UserContext
//     } catch (error) {
//       console.error("Sign-in error:", error); // Debugging
//       setError(error.message || "An error occurred during sign-in.");
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       console.log("Google User logged in:", result.user);
//       login(result.user); // Pass the user to UserContext
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//       setError(error.message || "An error occurred during Google sign-in.");
//     }
//   };

//   // If authentication is disabled, bypass sign-in logic
//   if (process.env.REACT_APP_DISABLE_AUTH === "true") {
//     return (
//       <div className="social-stories-page">
//         <h1>Authentication is Disabled</h1>
//         <p>Click below to bypass authentication for development:</p>
//         <button
//           onClick={() => login({ uid: "mockUserId" }, false)}
//           className="generate-button"
//         >
//           Mock Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="social-stories-page">
//       <h1>Sign In</h1>
//       <div className="form-wrapper">
//         <div className="form-section">
//           <form onSubmit={handleSubmit}>
//             <h3>Email Sign In</h3>
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button type="submit" className="generate-button">
//               Sign In
//             </button>
//             <button
//               onClick={handleGoogleSignIn}
//               className="google-signin-button"
//             >
//               Sign In with Google
//             </button>
//           </form>
//           {error && <div className="error">{error}</div>}
//           <p className="toggle-sign">
//             Don't have an account?{" "}
//             <button
//               type="button"
//               onClick={() => {
//                 console.log("Sign Up button clicked");
//                 navigate("/signup");
//               }}
//               className="link-button"
//             >
//               Sign Up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [error, setError] = useState(null);
  const { login, isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Authentication state in SignIn:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

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
      console.log("Google User logged in:", result.user);
      login(result.user);
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
              onClick={() => {
                console.log("Sign Up button clicked");
                navigate("/signup");
              }}
              className="link-button"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
