import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useUser } from "../context/UserContext";

export const useCredits = () => {
  const { user, isAdmin } = useUser();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        let newCredits = userData.credits || 0;

        // Auto-replenish credits if admin and credits reach 0
        if (isAdmin && newCredits <= 0) {
          await updateDoc(userRef, { credits: 999999 }); // Set a high value to represent infinity
          newCredits = 999999;
        }

        setCredits(newCredits);
      }
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  return credits;
};
