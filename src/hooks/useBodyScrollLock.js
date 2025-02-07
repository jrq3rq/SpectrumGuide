// src/hooks/useBodyScrollLock.js
import { useEffect } from "react";

export default function useBodyScrollLock() {
  useEffect(() => {
    // Save the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Lock scrolling
    document.body.style.overflow = "hidden";

    // Cleanup: restore the original overflow style when the component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}
