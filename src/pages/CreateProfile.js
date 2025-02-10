// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, firestore } from "../firebase";
// import { updatePassword } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { useUser } from "../context/UserContext";
// import "../styles/CreateProfile.css";
// import LoadingOverlay from "../components/LoadingOverlay";

// const CreateProfile = () => {
//   const { user, isAuthenticated, login } = useUser();
//   const navigate = useNavigate();
//   const formRef = useRef(null); // ✅ Add a reference to the form

//   // Form state
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dob, setDob] = useState("");
//   const [selectedPlan, setSelectedPlan] = useState("free");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Effect to check user profile
//   useEffect(() => {
//     const checkUserProfile = async () => {
//       if (!user || !isAuthenticated) {
//         navigate("/");
//         return;
//       }
//       try {
//         const userRef = doc(firestore, "users", user.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           sessionStorage.removeItem("requiresProfileSetup");
//           login({ ...user, ...docSnap.data() });
//           const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
//           navigate(lastPage);
//         } else {
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Error checking profile:", err);
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) {
//       checkUserProfile();
//     } else {
//       setLoading(false);
//     }
//   }, [user, isAuthenticated, login, navigate]);

//   const isGoogleUser = user?.providerData?.some(
//     (provider) => provider.providerId === "google.com"
//   );
//   if (!isGoogleUser || loading) {
//     return <div className="loading-message">Loading...</div>;
//   }

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!firstName || !lastName || !dob) {
//       setError("All fields are required.");
//       setIsSubmitting(false);
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setIsSubmitting(false);
//       return;
//     }
//     try {
//       const userRef = doc(firestore, "users", user.uid);
//       await setDoc(userRef, {
//         firstName,
//         lastName,
//         email: user.email,
//         dob,
//         plan: selectedPlan,
//         credits:
//           selectedPlan === "silver" ? 10 : selectedPlan === "gold" ? 50 : 0,
//         createdAt: new Date(),
//         lastLogin: new Date(),
//       });

//       if (password) {
//         await updatePassword(auth.currentUser, password);
//       }

//       sessionStorage.removeItem("requiresProfileSetup");
//       login({ ...user, firstName, lastName, dob, plan: selectedPlan });

//       setSuccess(true);
//       setError(null);

//       setTimeout(() => {
//         const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
//         navigate(lastPage);
//       }, 3000);
//     } catch (err) {
//       console.error("Error saving profile:", err);
//       setError("Failed to save profile. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="create-profile-page">
//         <h1>Complete Your Profile</h1>
//         {success ? (
//           <div className="success-message">
//             🎉 Your account has been created successfully! Redirecting...
//           </div>
//         ) : (
//           <>
//             {isSubmitting && <LoadingOverlay />}
//             <form
//               onSubmit={handleProfileSubmit}
//               className="profile-form"
//               ref={formRef}
//             >
//               <div className="profile-form-row">
//                 <div className="profile-form-col">
//                   <label>First Name:</label>
//                   <input
//                     type="text"
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="profile-form-col">
//                   <label>Last Name:</label>
//                   <input
//                     type="text"
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="profile-form-row">
//                 <div className="profile-form-col">
//                   <label>Date of Birth:</label>
//                   <input
//                     type="date"
//                     value={dob}
//                     onChange={(e) => setDob(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="profile-form-col">
//                   <label>Select Plan:</label>
//                   <select
//                     value={selectedPlan}
//                     onChange={(e) => setSelectedPlan(e.target.value)}
//                   >
//                     <option value="free">Free - Basic AI Access</option>
//                     <option value="silver">Silver - 10 Credits ($9.99)</option>
//                     <option value="gold">Gold - 50 Credits ($29.99)</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="profile-form-row">
//                 <div className="profile-form-col">
//                   <label>Set a Password:</label>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="profile-form-col">
//                   <label>Confirm Password:</label>
//                   <input
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//             </form>
//           </>
//         )}
//         {error && <p className="error">{error}</p>}

//         <button
//           className="external-submit-button"
//           onClick={() => formRef.current?.requestSubmit()}
//           disabled={isSubmitting}
//         >
//           Submit Profile
//         </button>
//       </div>
//     </>
//   );
// };

// export default CreateProfile;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { updatePassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useUser } from "../context/UserContext";
import "../styles/CreateProfile.css";
import LoadingOverlay from "../components/LoadingOverlay";

const CreateProfile = () => {
  const { user, isAuthenticated, login } = useUser();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to check if user already has a profile in Firestore
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user || !isAuthenticated) {
        navigate("/");
        return;
      }
      try {
        const userRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          sessionStorage.removeItem("requiresProfileSetup");
          login({ ...user, ...docSnap.data() });
          const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
          navigate(lastPage);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkUserProfile();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated, login, navigate]);

  // Allow only Google Auth users (without profile) to access this page
  const isGoogleUser = user?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );
  if (!isGoogleUser || loading) {
    return <div className="loading-message">Loading...</div>;
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!firstName || !lastName || !dob) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    // Validate Date of Birth format: exactly 4 digits for year and 2 for month/day
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dob)) {
      setError("Invalid date format. Please use YYYY-MM-DD.");
      setIsSubmitting(false);
      return;
    }

    // Ensure user is at least 13 years old
    const [year, month, day] = dob.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 13) {
      setError("You must be at least 13 years old.");
      setIsSubmitting(false);
      return;
    }

    // Validate email format (using the email from Firebase Auth)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError("Invalid email format.");
      setIsSubmitting(false);
      return;
    }

    // Check that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        email: user.email,
        dob,
        plan: selectedPlan,
        credits:
          selectedPlan === "silver" ? 10 : selectedPlan === "gold" ? 50 : 0,
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      sessionStorage.removeItem("requiresProfileSetup");
      login({ ...user, firstName, lastName, dob, plan: selectedPlan });
      setSuccess(true);
      setError(null);

      setTimeout(() => {
        const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
        navigate(lastPage);
      }, 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-profile-page">
      <h1>Complete Your Profile</h1>
      {success ? (
        <div className="success-message">
          🎉 Your account has been created successfully! Redirecting...
        </div>
      ) : (
        <>
          {isSubmitting && <LoadingOverlay />}
          <form
            onSubmit={handleProfileSubmit}
            className="profile-form"
            ref={formRef}
          >
            <div className="profile-form-row">
              <div className="profile-form-col">
                <label>First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="profile-form-col">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="profile-form-row">
              <div className="profile-form-col">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <div className="profile-form-col">
                <label>Select Plan:</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="free">Free - Basic AI Access</option>
                  <option value="silver">Silver - 10 Credits ($9.99)</option>
                  <option value="gold">Gold - 50 Credits ($29.99)</option>
                </select>
              </div>
            </div>
            <div className="profile-form-row">
              <div className="profile-form-col">
                <label>Set a Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="profile-form-col">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {error === "Passwords do not match." && (
                  <p className="password-error">{error}</p>
                )}
              </div>
            </div>
          </form>
          {error && error !== "Passwords do not match." && (
            <p className="error">{error}</p>
          )}
          <button
            className="external-submit-button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isSubmitting}
          >
            Submit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default CreateProfile;
