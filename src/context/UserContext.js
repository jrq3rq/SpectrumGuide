import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState("free");

  // ✅ Load all chat history, not just form responses
  const [chatHistory, setChatHistory] = useState(() => {
    const savedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    return savedChats; // No need to filter here, we'll filter when displaying
  });

  const navigate = useNavigate();

  // ✅ Ensure chat history is saved anytime it updates
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // ✅ Firebase Authentication Handling
  useEffect(() => {
    const mockAuth = JSON.parse(localStorage.getItem("mockAuth"));
    if (mockAuth && mockAuth.isAuthenticated) {
      setIsAuthenticated(mockAuth.isAuthenticated);
      setUser(mockAuth.user);
      setUserPlan(mockAuth.plan || "free");
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setIsAuthenticated(true);
          setUser(firebaseUser);
          const plan = await fetchUserPlanFromFirestore(firebaseUser.uid);
          setUserPlan(plan || "free");

          if (window.location.pathname === "/") {
            navigate("/form");
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setUserPlan("free");
          if (window.location.pathname !== "/signup") {
            navigate("/");
          }
        }
      });

      return () => unsubscribe();
    }
  }, [navigate]);

  const login = (userData, shouldNavigate = true) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserPlan(userData.plan || "free");
    localStorage.setItem(
      "mockAuth",
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
        plan: userData.plan || "free",
      })
    );
    if (shouldNavigate) {
      navigate("/form");
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
        setUserPlan("free");
        localStorage.removeItem("mockAuth");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const fetchUserPlanFromFirestore = async (uid) => {
    console.log("Fetching plan for user:", uid);
    return "free"; // Placeholder for Firestore interaction
  };

  // ✅ **Store all messages, but filter form messages when displaying**
  const addMessageToHistory = (message) => {
    setChatHistory((prevChats) => {
      const updatedChats = [...prevChats, message]; // Append new message
      localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  // ✅ **Remove a message from history**
  const removeMessageFromHistory = (messageId) => {
    setChatHistory((prevChats) => {
      const updatedChats = prevChats.filter((msg) => msg.id !== messageId);
      localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  // ✅ **Add a note to a specific message**
  const addNoteToMessage = (messageId, noteContent) => {
    setChatHistory((prevChats) => {
      const newNote = {
        id: uuidv4(),
        content: noteContent.trim(),
        timestamp: Date.now(),
      };

      const updatedChats = prevChats.map((msg) =>
        msg.id === messageId
          ? { ...msg, notes: [...(msg.notes || []), newNote] }
          : msg
      );

      localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  // ✅ **Delete a note from a specific message**
  const deleteNoteFromMessage = (messageId, noteId) => {
    setChatHistory((prevChats) => {
      const updatedChats = prevChats.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            notes: msg.notes.filter((note) => note.id !== noteId),
          };
        }
        return msg;
      });

      localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user,
        userPlan,
        login,
        logout,
        chatHistory, // ✅ Includes all messages now
        addMessageToHistory,
        removeMessageFromHistory,
        addNoteToMessage,
        deleteNoteFromMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom hook to access the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
