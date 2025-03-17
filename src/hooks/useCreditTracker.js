import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Add these imports
import { firestore } from "../firebase"; // Import firestore from your firebase config

const useCreditTracker = ({
  uid,
  initialCredits = 0,
  initialAiUsage = { carePlans: 0, stories: 0, aiChats: 0 },
  plan = "free",
  isAdmin = false,
}) => {
  const [credits, setCredits] = useState(initialCredits);
  const [aiUsage, setAiUsage] = useState(initialAiUsage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        console.error("useCreditTracker: Unknown plan, default to free");
        return 1;
    }
  }, []);

  const BASE_COSTS = {
    carePlan: 0.25,
    story: 0.25,
    aiChat: 0.05,
  };

  const updateLocalStorage = useCallback(
    async (newCredits, newAiUsage) => {
      if (!uid) return;
      try {
        const userRef = doc(firestore, "users", uid);
        await setDoc(
          userRef,
          { credits: newCredits, aiUsage: newAiUsage },
          { merge: true }
        );
        localStorage.setItem(`credits_${uid}`, newCredits);
        localStorage.setItem(`aiUsage_${uid}`, JSON.stringify(newAiUsage));
        console.log(
          "useCreditTracker: Updated Firestore and localStorage - Credits:",
          newCredits,
          "Usage:",
          newAiUsage
        );
      } catch (error) {
        console.error("useCreditTracker: Storage sync error:", error);
        setError(error.message);
      }
    },
    [uid]
  );

  const interactWithAIFeature = useCallback(
    async (feature, count = 1) => {
      if (!uid) {
        console.error("useCreditTracker: No user ID provided");
        return false;
      }
      if (isAdmin) {
        console.log("useCreditTracker: Admin bypass - tracking usage only");
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
        console.error("useCreditTracker: Unknown feature:", feature);
        return false;
      }

      const currentCredits = parseFloat(credits);
      if (currentCredits < cost) {
        console.error("useCreditTracker: Insufficient credits");
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
        "useCreditTracker: Feature used - Credits:",
        newCredits,
        "Usage:",
        newUsage
      );
      return true;
    },
    [uid, credits, aiUsage, isAdmin, updateLocalStorage]
  );

  useEffect(() => {
    if (!uid) {
      setCredits(initialCredits);
      setAiUsage(initialAiUsage);
      return;
    }

    setLoading(true);
    const loadCredits = async () => {
      const userRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists() && docSnap.data().credits !== undefined) {
        setCredits(parseFloat(docSnap.data().credits));
        setAiUsage(docSnap.data().aiUsage || initialAiUsage);
      } else {
        const planCredits = getPlanCredits(plan);
        setCredits(planCredits);
        setAiUsage(initialAiUsage);
        await updateLocalStorage(planCredits, initialAiUsage);
      }
      setLoading(false);
    };
    loadCredits();
  }, [
    uid,
    plan,
    initialCredits,
    initialAiUsage,
    getPlanCredits,
    updateLocalStorage,
  ]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `credits_${uid}` && e.newValue !== null) {
        const newCredits = parseFloat(e.newValue);
        if (newCredits !== credits) {
          setCredits(newCredits);
          console.log(
            "useCreditTracker: Updated credits from storage event:",
            newCredits
          );
        }
      }
      if (e.key === `aiUsage_${uid}` && e.newValue !== null) {
        const newUsage = JSON.parse(e.newValue);
        setAiUsage(newUsage);
        console.log(
          "useCreditTracker: Updated aiUsage from storage event:",
          newUsage
        );
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [uid, credits]);

  return { credits, aiUsage, interactWithAIFeature, loading, error };
};

export default useCreditTracker;
