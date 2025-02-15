import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import { useUser } from "../context/UserContext";

export const useCredits = () => {
  const { user } = useUser();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setCredits(doc.data().credits || 0);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return credits;
};
