// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   useCallback,
// } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { auth, firestore } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import useLocalStorage from "../hooks/useLocalStorage";
// import { v4 as uuidv4 } from "uuid";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [user, setUser] = useState(null);
//   const [userPlan, setUserPlan] = useState("free");
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [credits, setCredits] = useState(0);
//   const [aiUsage, setAiUsage] = useState({
//     carePlans: 0,
//     stories: 0,
//     aiChats: 0,
//   });
//   // Use stored uid from localStorage if available on mount
//   const initialUid = localStorage.getItem("uid");
//   const [chatHistoryKey, setChatHistoryKey] = useState(
//     initialUid ? `chatHistory_${initialUid}` : null
//   );
//   const [socialStoriesKey, setSocialStoriesKey] = useState(
//     initialUid ? `socialStories_${initialUid}` : null
//   );
//   const [profileFormResponsesKey, setProfileFormResponsesKey] = useState(
//     initialUid ? `profileFormResponses_${initialUid}` : null
//   );
//   const [isLoading, setIsLoading] = useState(true);

//   const initialChatHistory = [
//     {
//       id: uuidv4(),
//       content: "Welcome to the chat! This is a sample message.",
//       timestamp: new Date().toISOString(),
//       role: "assistant",
//     },
//     {
//       id: uuidv4(),
//       content: "Hi! How can I assist you today?",
//       timestamp: new Date().toISOString(),
//       role: "user",
//     },
//   ];

//   const [chatHistory, setChatHistory] = useLocalStorage(
//     chatHistoryKey,
//     initialChatHistory
//   );
//   const [socialStories, setSocialStories] = useLocalStorage(
//     socialStoriesKey,
//     []
//   );
//   const [profileFormResponses, setProfileFormResponses] = useLocalStorage(
//     profileFormResponsesKey,
//     []
//   );

//   const navigate = useNavigate();
//   const location = useLocation();

//   const getPlanCredits = useCallback((plan) => {
//     switch (plan) {
//       case "free":
//         return 1;
//       case "bronze":
//         return 10;
//       case "silver":
//         return 25;
//       case "gold":
//         return 50;
//       default:
//         console.error("UserContext: Unknown plan, default to free");
//         return 1;
//     }
//   }, []);

//   const BASE_COSTS = {
//     carePlan: 0.25,
//     story: 0.25,
//     aiChat: 0.05,
//   };

//   const updateLocalStorage = useCallback(
//     (newCredits, newAiUsage) => {
//       if (!user?.uid) return;
//       try {
//         localStorage.setItem(`credits_${user.uid}`, newCredits);
//         localStorage.setItem(`aiUsage_${user.uid}`, JSON.stringify(newAiUsage));
//         console.log(
//           "UserContext: Local storage updated - Credits:",
//           newCredits,
//           "Usage:",
//           newAiUsage
//         );
//       } catch (error) {
//         console.error("UserContext: Local storage error:", error);
//       }
//     },
//     [user?.uid]
//   );

//   const interactWithAIFeature = useCallback(
//     async (feature, count = 1) => {
//       if (!user?.uid) {
//         console.error("UserContext: No user ID provided");
//         return false;
//       }
//       if (isAdmin) {
//         console.log("UserContext: Admin bypass - tracking usage only");
//         const currentUsageCredits = parseFloat(aiUsage[feature] || 0);
//         const newUsage = {
//           ...aiUsage,
//           [feature]: parseFloat(
//             currentUsageCredits + BASE_COSTS[feature] * count
//           ).toFixed(2),
//         };
//         setAiUsage(newUsage);
//         updateLocalStorage(credits, newUsage);
//         return true;
//       }

//       const cost = BASE_COSTS[feature] * count;
//       if (!cost) {
//         console.error("UserContext: Unknown feature:", feature);
//         return false;
//       }

//       const currentCredits = parseFloat(credits);
//       if (currentCredits < cost) {
//         console.error("UserContext: Insufficient credits");
//         return false;
//       }

//       const newCredits = parseFloat(currentCredits - cost).toFixed(2);
//       const currentUsageCredits = parseFloat(aiUsage[feature] || 0);
//       const newUsage = {
//         ...aiUsage,
//         [feature]: parseFloat(currentUsageCredits + cost).toFixed(2),
//       };

//       setCredits(newCredits);
//       setAiUsage(newUsage);
//       updateLocalStorage(newCredits, newUsage);
//       console.log(
//         "UserContext: Feature used - Credits:",
//         newCredits,
//         "Usage:",
//         newUsage
//       );
//       return true;
//     },
//     [user?.uid, credits, aiUsage, isAdmin, updateLocalStorage]
//   );

//   const migrateOldData = (uid) => {
//     const oldChatHistory = localStorage.getItem("chatHistory");
//     const oldSocialStories = localStorage.getItem("socialStories");
//     const newChatHistoryKey = `chatHistory_${uid}`;
//     const newSocialStoriesKey = `socialStories_${uid}`;
//     const newProfileFormResponsesKey = `profileFormResponses_${uid}`;

//     if (oldChatHistory && !localStorage.getItem(newChatHistoryKey)) {
//       console.log("Migrating old chatHistory to", newChatHistoryKey);
//       localStorage.setItem(newChatHistoryKey, oldChatHistory);
//       setChatHistory(JSON.parse(oldChatHistory));
//     } else if (!localStorage.getItem(newChatHistoryKey)) {
//       console.log("Initializing chatHistory for", newChatHistoryKey);
//       localStorage.setItem(
//         newChatHistoryKey,
//         JSON.stringify(initialChatHistory)
//       );
//       setChatHistory(initialChatHistory);
//     }

//     if (oldSocialStories && !localStorage.getItem(newSocialStoriesKey)) {
//       console.log("Migrating old socialStories to", newSocialStoriesKey);
//       localStorage.setItem(newSocialStoriesKey, oldSocialStories);
//       setSocialStories(JSON.parse(oldSocialStories));
//     }

//     if (!localStorage.getItem(newProfileFormResponsesKey)) {
//       console.log(
//         "Initializing profileFormResponses for",
//         newProfileFormResponsesKey
//       );
//       localStorage.setItem(newProfileFormResponsesKey, JSON.stringify([]));
//       setProfileFormResponses([]);
//     }
//   };

//   useEffect(() => {
//     console.log("UserContext - Initializing, pathname:", location.pathname);
//     setIsLoading(true);

//     const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
//       console.log(
//         "UserContext - onAuthStateChanged, firebaseUser:",
//         !!firebaseUser
//       );
//       if (firebaseUser) {
//         try {
//           const userData = await fetchUserProfile(firebaseUser);
//           const plan = userData.plan || "free";
//           setIsAuthenticated(true);
//           setUser(userData);
//           setUserPlan(plan);
//           setIsAdmin(userData.isAdmin || false);
//           const storedCredits = localStorage.getItem(
//             `credits_${firebaseUser.uid}`
//           );
//           const storedUsage = localStorage.getItem(
//             `aiUsage_${firebaseUser.uid}`
//           );
//           const parsedStoredUsage = storedUsage
//             ? JSON.parse(storedUsage)
//             : null;
//           setCredits(
//             userData.isAdmin
//               ? 999999
//               : storedCredits !== null
//               ? parseFloat(storedCredits)
//               : parseFloat(userData.credits) || getPlanCredits(plan)
//           );
//           setAiUsage({
//             carePlans: parseFloat(
//               parsedStoredUsage?.carePlans || aiUsage.carePlans || 0
//             ),
//             stories: parseFloat(
//               parsedStoredUsage?.stories || aiUsage.stories || 0
//             ),
//             aiChats: parseFloat(
//               parsedStoredUsage?.aiChats || aiUsage.aiChats || 0
//             ),
//           });
//           setChatHistoryKey(`chatHistory_${firebaseUser.uid}`);
//           setSocialStoriesKey(`socialStories_${firebaseUser.uid}`);
//           setProfileFormResponsesKey(
//             `profileFormResponses_${firebaseUser.uid}`
//           );
//           migrateOldData(firebaseUser.uid);
//         } catch (error) {
//           console.error("UserContext - Error in onAuthStateChanged:", error);
//           setIsAuthenticated(false);
//           navigate("/signin", { replace: true });
//         }
//       } else {
//         console.log("UserContext - No user detected");
//         setIsAuthenticated(false);
//         setUser(null);
//         setUserPlan("free");
//         setIsAdmin(false);
//         setCredits(0);
//         setAiUsage({ carePlans: 0, stories: 0, aiChats: 0 });
//         localStorage.removeItem("mockAuth");
//         localStorage.removeItem("uid");
//         sessionStorage.clear();
//         if (
//           location.pathname !== "/signin" &&
//           location.pathname !== "/signup"
//         ) {
//           navigate("/signin", { replace: true });
//         }
//       }
//       setIsLoading(false);
//     });

//     return () => {
//       console.log("UserContext - Cleaning up auth listener");
//       if (unsubscribeAuth) unsubscribeAuth();
//     };
//   }, [navigate, location.pathname, getPlanCredits]);

//   const fetchUserProfile = async (firebaseUser) => {
//     try {
//       const userRef = doc(firestore, "users", firebaseUser.uid);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists()) {
//         return { ...firebaseUser, ...docSnap.data() };
//       }
//       return firebaseUser;
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       return firebaseUser;
//     }
//   };

//   const checkProfileAndNavigate = async (uid, intendedPath = "/about") => {
//     try {
//       console.log(
//         "UserContext - Checking profile for uid:",
//         uid,
//         "intendedPath:",
//         intendedPath
//       );
//       navigate(intendedPath, { replace: true });
//     } catch (error) {
//       console.error("Error checking profile in UserContext:", error);
//       window.location.href = "/signin";
//     }
//   };

//   const login = async (userData, shouldNavigate = true) => {
//     console.log("UserContext - Logging in user:", userData);
//     setIsLoading(true);
//     const fullUserData = await fetchUserProfile(userData);
//     const plan = fullUserData.plan || "free";
//     setIsAuthenticated(true);
//     setUser(fullUserData);
//     setUserPlan(plan);
//     setIsAdmin(fullUserData.isAdmin === true);
//     const storedCredits = localStorage.getItem(`credits_${fullUserData.uid}`);
//     setCredits(
//       fullUserData.isAdmin
//         ? 999999
//         : storedCredits !== null
//         ? parseFloat(storedCredits)
//         : parseFloat(fullUserData.credits) || getPlanCredits(plan)
//     );
//     setAiUsage(
//       fullUserData.aiUsage || { carePlans: 0, stories: 0, aiChats: 0 }
//     );
//     setChatHistoryKey(`chatHistory_${fullUserData.uid}`);
//     setSocialStoriesKey(`socialStories_${fullUserData.uid}`);
//     setProfileFormResponsesKey(`profileFormResponses_${fullUserData.uid}`);
//     migrateOldData(fullUserData.uid);
//     localStorage.setItem(
//       "mockAuth",
//       JSON.stringify({
//         isAuthenticated: true,
//         user: fullUserData,
//         plan: plan,
//         isAdmin: fullUserData.isAdmin === true,
//         credits: fullUserData.isAdmin
//           ? 999999
//           : storedCredits !== null
//           ? parseFloat(storedCredits)
//           : parseFloat(fullUserData.credits) || getPlanCredits(plan),
//         aiUsage: fullUserData.aiUsage || {
//           carePlans: 0,
//           stories: 0,
//           aiChats: 0,
//         },
//       })
//     );
//     localStorage.setItem("uid", fullUserData.uid);
//     if (shouldNavigate) {
//       checkProfileAndNavigate(
//         fullUserData.uid,
//         sessionStorage.getItem("lastVisitedPage") || "/about"
//       );
//     }
//     setIsLoading(false);
//     window.location.reload(); // Add refresh here
//   };

//   const logout = async () => {
//     console.log(
//       "UserContext - Initiating logout, pathname:",
//       location.pathname
//     );
//     try {
//       await signOut(auth);
//       console.log("UserContext - SignOut complete");
//       setIsAuthenticated(false);
//       setUser(null);
//       setUserPlan("free");
//       setIsAdmin(false);
//       setCredits(0);
//       setAiUsage({ carePlans: 0, stories: 0, aiChats: 0 });
//       localStorage.removeItem("mockAuth");
//       localStorage.removeItem("uid");
//       sessionStorage.clear();
//       setIsLoading(false);
//       console.log("UserContext - Logout complete, forcing /signin");
//       window.location.href = "/signin";
//     } catch (error) {
//       console.error("UserContext - Error signing out:", error);
//       setIsAuthenticated(false);
//       setUser(null);
//       setUserPlan("free");
//       setIsAdmin(false);
//       setCredits(0);
//       setAiUsage({ carePlans: 0, stories: 0, aiChats: 0 });
//       localStorage.removeItem("mockAuth");
//       localStorage.removeItem("uid");
//       sessionStorage.clear();
//       setIsLoading(false);
//       console.log("UserContext - Error path, forcing /signin");
//       window.location.href = "/signin";
//     }
//   };

//   const addMessageToHistory = (message) => {
//     setChatHistory((prevChats) => {
//       const newChats = [message, ...prevChats] || [];
//       console.log("Adding message to chatHistory:", newChats);
//       return newChats;
//     });
//   };

//   const addProfileFormResponse = (response) => {
//     setProfileFormResponses((prevResponses) => {
//       const newResponses = [response, ...prevResponses] || [];
//       console.log("Adding profile form response:", newResponses);
//       return newResponses;
//     });
//   };

//   const removeMessageFromHistory = (messageId) => {
//     setChatHistory(
//       (prevChats) => prevChats.filter((msg) => msg.id !== messageId) || []
//     );
//   };

//   const addNoteToMessage = (messageId, noteContent) => {
//     setProfileFormResponses(
//       (prevResponses) =>
//         prevResponses.map((msg) =>
//           msg.id === messageId
//             ? {
//                 ...msg,
//                 notes: [
//                   ...(msg.notes || []),
//                   {
//                     id: uuidv4(),
//                     content: noteContent.trim(),
//                     timestamp: new Date().toISOString(),
//                   },
//                 ],
//               }
//             : msg
//         ) || []
//     );
//   };

//   const deleteNoteFromMessage = (messageId, noteId) => {
//     setProfileFormResponses(
//       (prevResponses) =>
//         prevResponses.map((msg) =>
//           msg.id === messageId
//             ? {
//                 ...msg,
//                 notes: (msg.notes || []).filter((note) => note.id !== noteId),
//               }
//             : msg
//         ) || []
//     );
//   };

//   const addSocialStory = (story) => {
//     setSocialStories((prevStories) => {
//       const newStories = [story, ...prevStories] || [];
//       console.log("Adding social story:", newStories);
//       return newStories;
//     });
//   };

//   const removeSocialStory = (storyId) => {
//     setSocialStories(
//       (prevStories) => prevStories.filter((story) => story.id !== storyId) || []
//     );
//   };

//   const updateSocialStory = (storyId, updatedStory) => {
//     setSocialStories(
//       (prevStories) =>
//         prevStories.map((story) =>
//           story.id === storyId ? { ...updatedStory, id: storyId } : story
//         ) || []
//     );
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         isAuthenticated,
//         user,
//         userPlan,
//         isAdmin,
//         credits,
//         aiUsage,
//         login,
//         logout,
//         chatHistory,
//         addMessageToHistory,
//         removeMessageFromHistory,
//         addNoteToMessage,
//         deleteNoteFromMessage,
//         socialStories,
//         addSocialStory,
//         removeSocialStory,
//         updateSocialStory,
//         isLoading,
//         interactWithAIFeature,
//         profileFormResponses,
//         addProfileFormResponse,
//         setProfileFormResponses,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import useLocalStorage from "../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState("free");
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState(0);
  const [aiUsage, setAiUsage] = useState({
    carePlans: 0,
    stories: 0,
    aiChats: 0,
  });
  const initialUid = localStorage.getItem("uid");
  const [chatHistoryKey, setChatHistoryKey] = useState(
    initialUid ? `chatHistory_${initialUid}` : null
  );
  const [socialStoriesKey, setSocialStoriesKey] = useState(
    initialUid ? `socialStories_${initialUid}` : null
  );
  const [profileFormResponsesKey, setProfileFormResponsesKey] = useState(
    initialUid ? `profileFormResponses_${initialUid}` : null
  );
  const [isLoading, setIsLoading] = useState(true);

  const initialChatHistory = [
    {
      id: uuidv4(),
      content: "Welcome to the chat! This is a sample message.",
      timestamp: new Date().toISOString(),
      role: "assistant",
    },
    {
      id: uuidv4(),
      content: "Hi! How can I assist you today?",
      timestamp: new Date().toISOString(),
      role: "user",
    },
  ];

  const [chatHistory, setChatHistory] = useLocalStorage(
    chatHistoryKey,
    initialChatHistory
  );
  const [socialStories, setSocialStories] = useLocalStorage(
    socialStoriesKey,
    []
  );
  const [profileFormResponses, setProfileFormResponses] = useLocalStorage(
    profileFormResponsesKey,
    []
  );

  const navigate = useNavigate();
  const location = useLocation();

  const getPlanCredits = useCallback((plan) => {
    switch (plan) {
      case "free":
        return 1;
      case "bronze":
        return 10;
      case "silver":
        return 25;
      case "gold":
        return 50;
      default:
        console.error("UserContext: Unknown plan, default to free");
        return 1;
    }
  }, []);

  const BASE_COSTS = {
    carePlan: 0.25,
    story: 0.25,
    aiChat: 0.05,
  };

  const updateLocalStorage = useCallback(
    (newCredits, newAiUsage) => {
      if (!user?.uid) return;
      try {
        localStorage.setItem(`credits_${user.uid}`, newCredits);
        localStorage.setItem(`aiUsage_${user.uid}`, JSON.stringify(newAiUsage));
        console.log(
          "UserContext: Local storage updated - Credits:",
          newCredits,
          "Usage:",
          newAiUsage
        );
      } catch (error) {
        console.error("UserContext: Local storage error:", error);
      }
    },
    [user?.uid]
  );

  const interactWithAIFeature = useCallback(
    async (feature, count = 1) => {
      if (!user?.uid) {
        console.error("UserContext: No user ID provided");
        return false;
      }
      if (isAdmin) {
        console.log("UserContext: Admin bypass - tracking usage only");
        const currentUsageCredits = parseFloat(aiUsage[feature] || 0);
        const newUsage = {
          ...aiUsage,
          [feature]: parseFloat(
            currentUsageCredits + BASE_COSTS[feature] * count
          ).toFixed(2),
        };
        setAiUsage(newUsage);
        updateLocalStorage(credits, newUsage);
        return true;
      }

      const cost = BASE_COSTS[feature] * count;
      if (!cost) {
        console.error("UserContext: Unknown feature:", feature);
        return false;
      }

      const currentCredits = parseFloat(credits);
      if (currentCredits < cost) {
        console.error("UserContext: Insufficient credits");
        return false;
      }

      const newCredits = parseFloat(currentCredits - cost).toFixed(2);
      const currentUsageCredits = parseFloat(aiUsage[feature] || 0);
      const newUsage = {
        ...aiUsage,
        [feature]: parseFloat(currentUsageCredits + cost).toFixed(2),
      };

      setCredits(newCredits);
      setAiUsage(newUsage);
      updateLocalStorage(newCredits, newUsage);
      console.log(
        "UserContext: Feature used - Credits:",
        newCredits,
        "Usage:",
        newUsage
      );
      return true;
    },
    [user?.uid, credits, aiUsage, isAdmin, updateLocalStorage]
  );

  const migrateOldData = (uid) => {
    const newChatHistoryKey = `chatHistory_${uid}`;
    const newSocialStoriesKey = `socialStories_${uid}`;
    const newProfileFormResponsesKey = `profileFormResponses_${uid}`;

    // Load existing data if available, otherwise initialize with defaults
    const storedChatHistory = localStorage.getItem(newChatHistoryKey);
    const storedSocialStories = localStorage.getItem(newSocialStoriesKey);
    const storedProfileResponses = localStorage.getItem(
      newProfileFormResponsesKey
    );

    if (storedChatHistory) {
      console.log("Loading existing chatHistory for", newChatHistoryKey);
      setChatHistory(JSON.parse(storedChatHistory));
    } else if (!localStorage.getItem(newChatHistoryKey)) {
      console.log("Initializing chatHistory for", newChatHistoryKey);
      localStorage.setItem(
        newChatHistoryKey,
        JSON.stringify(initialChatHistory)
      );
      setChatHistory(initialChatHistory);
    }

    if (storedSocialStories) {
      console.log("Loading existing socialStories for", newSocialStoriesKey);
      setSocialStories(JSON.parse(storedSocialStories));
    } else if (!localStorage.getItem(newSocialStoriesKey)) {
      console.log("Initializing socialStories for", newSocialStoriesKey);
      localStorage.setItem(newSocialStoriesKey, JSON.stringify([]));
      setSocialStories([]);
    }

    if (storedProfileResponses) {
      console.log(
        "Loading existing profileFormResponses for",
        newProfileFormResponsesKey
      );
      setProfileFormResponses(JSON.parse(storedProfileResponses));
    } else if (!localStorage.getItem(newProfileFormResponsesKey)) {
      console.log(
        "Initializing profileFormResponses for",
        newProfileFormResponsesKey
      );
      localStorage.setItem(newProfileFormResponsesKey, JSON.stringify([]));
      setProfileFormResponses([]);
    }

    // Migrate old data if it exists and hasn't been migrated yet
    const oldChatHistory = localStorage.getItem("chatHistory");
    const oldSocialStories = localStorage.getItem("socialStories");
    if (oldChatHistory && !localStorage.getItem(newChatHistoryKey)) {
      console.log("Migrating old chatHistory to", newChatHistoryKey);
      localStorage.setItem(newChatHistoryKey, oldChatHistory);
      setChatHistory(JSON.parse(oldChatHistory));
    }
    if (oldSocialStories && !localStorage.getItem(newSocialStoriesKey)) {
      console.log("Migrating old socialStories to", newSocialStoriesKey);
      localStorage.setItem(newSocialStoriesKey, oldSocialStories);
      setSocialStories(JSON.parse(oldSocialStories));
    }
  };

  useEffect(() => {
    console.log("UserContext - Initializing, pathname:", location.pathname);
    setIsLoading(true);

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
        "UserContext - onAuthStateChanged, firebaseUser:",
        !!firebaseUser
      );
      if (firebaseUser) {
        try {
          const userRef = doc(firestore, "users", firebaseUser.uid);
          const docSnap = await getDoc(userRef);
          const requiresProfileSetup = !docSnap.exists();
          sessionStorage.setItem(
            "requiresProfileSetup",
            requiresProfileSetup ? "true" : "false"
          );

          const userData = await fetchUserProfile(firebaseUser);
          const plan = userData.plan || "free";
          setIsAuthenticated(true);
          setUser(userData);
          setUserPlan(plan);
          setIsAdmin(userData.isAdmin || false);
          const storedCredits = localStorage.getItem(
            `credits_${firebaseUser.uid}`
          );
          const storedUsage = localStorage.getItem(
            `aiUsage_${firebaseUser.uid}`
          );
          const parsedStoredUsage = storedUsage
            ? JSON.parse(storedUsage)
            : null;
          setCredits(
            userData.isAdmin
              ? 999999
              : storedCredits !== null
              ? parseFloat(storedCredits)
              : parseFloat(userData.credits) || getPlanCredits(plan)
          );
          setAiUsage({
            carePlans: parseFloat(
              parsedStoredUsage?.carePlans || aiUsage.carePlans || 0
            ),
            stories: parseFloat(
              parsedStoredUsage?.stories || aiUsage.stories || 0
            ),
            aiChats: parseFloat(
              parsedStoredUsage?.aiChats || aiUsage.aiChats || 0
            ),
          });
          setChatHistoryKey(`chatHistory_${firebaseUser.uid}`);
          setSocialStoriesKey(`socialStories_${firebaseUser.uid}`);
          setProfileFormResponsesKey(
            `profileFormResponses_${firebaseUser.uid}`
          );
          migrateOldData(firebaseUser.uid);

          if (requiresProfileSetup && location.pathname !== "/create-profile") {
            console.log(
              "UserContext - Redirecting to /create-profile for profile setup"
            );
            navigate("/create-profile", { replace: true });
          } else if (
            !requiresProfileSetup &&
            (location.pathname === "/signin" || location.pathname === "/signup")
          ) {
            const lastPage =
              sessionStorage.getItem("lastVisitedPage") || "/form";
            console.log("UserContext - Redirecting to last page:", lastPage);
            navigate(lastPage, { replace: true });
          }
        } catch (error) {
          console.error("UserContext - Error in onAuthStateChanged:", error);
          setIsAuthenticated(false);
          navigate("/signin", { replace: true });
        }
      } else {
        console.log("UserContext - No user detected");
        setIsAuthenticated(false);
        setUser(null);
        setUserPlan("free");
        setIsAdmin(false);
        setCredits(0);
        setAiUsage({ carePlans: 0, stories: 0, aiChats: 0 });
        localStorage.removeItem("mockAuth");
        localStorage.removeItem("uid");
        sessionStorage.clear();
        if (
          location.pathname !== "/signin" &&
          location.pathname !== "/signup"
        ) {
          navigate("/signin", { replace: true });
        }
      }
      setIsLoading(false);
    });

    return () => {
      console.log("UserContext - Cleaning up auth listener");
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [navigate, location.pathname, getPlanCredits]);

  const fetchUserProfile = async (firebaseUser) => {
    try {
      const userRef = doc(firestore, "users", firebaseUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return { ...firebaseUser, ...docSnap.data() };
      }
      return firebaseUser;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return firebaseUser;
    }
  };

  const checkProfileAndNavigate = async (uid, intendedPath = "/form") => {
    try {
      console.log(
        "UserContext - Checking profile for uid:",
        uid,
        "intendedPath:",
        intendedPath
      );
      const userRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        console.log(
          "UserContext - Profile not found, redirecting to /create-profile"
        );
        sessionStorage.setItem("requiresProfileSetup", "true");
        navigate("/create-profile", { replace: true });
      } else {
        sessionStorage.removeItem("requiresProfileSetup");
        navigate(intendedPath, { replace: true });
      }
    } catch (error) {
      console.error("Error checking profile in UserContext:", error);
      navigate("/signin", { replace: true });
    }
  };

  const login = async (userData, shouldNavigate = true) => {
    console.log("UserContext - Logging in user:", userData);
    setIsLoading(true);
    const fullUserData = await fetchUserProfile(userData);
    const plan = fullUserData.plan || "free";
    const userRef = doc(firestore, "users", fullUserData.uid);
    const docSnap = await getDoc(userRef);
    const requiresProfileSetup = !docSnap.exists();
    sessionStorage.setItem(
      "requiresProfileSetup",
      requiresProfileSetup ? "true" : "false"
    );

    setIsAuthenticated(true);
    setUser(fullUserData);
    setUserPlan(plan);
    setIsAdmin(fullUserData.isAdmin === true);
    const storedCredits = localStorage.getItem(`credits_${fullUserData.uid}`);
    setCredits(
      fullUserData.isAdmin
        ? 999999
        : storedCredits !== null
        ? parseFloat(storedCredits)
        : parseFloat(fullUserData.credits) || getPlanCredits(plan)
    );
    setAiUsage(
      fullUserData.aiUsage || { carePlans: 0, stories: 0, aiChats: 0 }
    );
    setChatHistoryKey(`chatHistory_${fullUserData.uid}`);
    setSocialStoriesKey(`socialStories_${fullUserData.uid}`);
    setProfileFormResponsesKey(`profileFormResponses_${fullUserData.uid}`);
    migrateOldData(fullUserData.uid);
    localStorage.setItem(
      "mockAuth",
      JSON.stringify({
        isAuthenticated: true,
        user: fullUserData,
        plan: plan,
        isAdmin: fullUserData.isAdmin === true,
        credits: fullUserData.isAdmin
          ? 999999
          : storedCredits !== null
          ? parseFloat(storedCredits)
          : parseFloat(fullUserData.credits) || getPlanCredits(plan),
        aiUsage: fullUserData.aiUsage || {
          carePlans: 0,
          stories: 0,
          aiChats: 0,
        },
      })
    );
    localStorage.setItem("uid", fullUserData.uid);

    if (shouldNavigate) {
      if (requiresProfileSetup && location.pathname !== "/create-profile") {
        console.log(
          "UserContext - Redirecting to /create-profile for profile setup"
        );
        navigate("/create-profile", { replace: true });
      } else if (!requiresProfileSetup) {
        const lastPage = sessionStorage.getItem("lastVisitedPage") || "/form";
        console.log("UserContext - Redirecting to last page:", lastPage);
        navigate(lastPage, { replace: true });
      }
    }
    setIsLoading(false);
  };

  const logout = async () => {
    console.log(
      "UserContext - Initiating logout, pathname:",
      location.pathname
    );
    try {
      await signOut(auth);
      console.log("UserContext - SignOut complete");
      setIsAuthenticated(false);
      setUser(null);
      setUserPlan("free");
      setIsAdmin(false);
      setCredits(0);
      setAiUsage({ carePlans: 0, stories: 0, aiChats: 0 });
      localStorage.removeItem("mockAuth");
      localStorage.removeItem("uid");
      sessionStorage.clear();
      setIsLoading(false);
      console.log("UserContext - Logout complete, forcing /signin");
      window.location.href = "/signin";
    } catch (error) {
      console.error("UserContext - Error signing out:", error);
      setIsAuthenticated(false);
      setUser(null);
      setUserPlan("free");
      setIsAdmin(false);
      setCredits(0);
      setAiUsage({ carePlans: 0, stories: 0, aiChats: 0 });
      localStorage.removeItem("mockAuth");
      localStorage.removeItem("uid");
      sessionStorage.clear();
      setIsLoading(false);
      console.log("UserContext - Error path, forcing /signin");
      window.location.href = "/signin";
    }
  };

  const addMessageToHistory = (message) => {
    setChatHistory((prevChats) => {
      const newChats = [message, ...prevChats] || [];
      console.log("Adding message to chatHistory:", newChats);
      return newChats;
    });
  };

  const addProfileFormResponse = (response) => {
    setProfileFormResponses((prevResponses) => {
      const newResponses = [response, ...prevResponses] || [];
      console.log("Adding profile form response:", newResponses);
      return newResponses;
    });
  };

  const removeMessageFromHistory = (messageId) => {
    setChatHistory(
      (prevChats) => prevChats.filter((msg) => msg.id !== messageId) || []
    );
  };

  const addNoteToMessage = (messageId, noteContent) => {
    setProfileFormResponses(
      (prevResponses) =>
        prevResponses.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                notes: [
                  ...(msg.notes || []),
                  {
                    id: uuidv4(),
                    content: noteContent.trim(),
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : msg
        ) || []
    );
  };

  const deleteNoteFromMessage = (messageId, noteId) => {
    setProfileFormResponses(
      (prevResponses) =>
        prevResponses.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                notes: (msg.notes || []).filter((note) => note.id !== noteId),
              }
            : msg
        ) || []
    );
  };

  const addSocialStory = (story) => {
    setSocialStories((prevStories) => {
      const newStories = [story, ...prevStories] || [];
      console.log("Adding social story:", newStories);
      return newStories;
    });
  };

  const removeSocialStory = (storyId) => {
    setSocialStories(
      (prevStories) => prevStories.filter((story) => story.id !== storyId) || []
    );
  };

  const updateSocialStory = (storyId, updatedStory) => {
    setSocialStories(
      (prevStories) =>
        prevStories.map((story) =>
          story.id === storyId ? { ...updatedStory, id: storyId } : story
        ) || []
    );
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user,
        userPlan,
        isAdmin,
        credits,
        aiUsage,
        login,
        logout,
        chatHistory,
        addMessageToHistory,
        removeMessageFromHistory,
        addNoteToMessage,
        deleteNoteFromMessage,
        socialStories,
        addSocialStory,
        removeSocialStory,
        updateSocialStory,
        isLoading,
        interactWithAIFeature,
        profileFormResponses,
        addProfileFormResponse,
        setProfileFormResponses,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
