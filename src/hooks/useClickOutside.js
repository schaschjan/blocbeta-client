import { useEffect, useRef } from "react";

export default (elementRef, callback) => {
  const callbackRef = useRef(null);
  callbackRef.current = callback;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target) &&
        callbackRef.current
      ) {
        callbackRef.current(event);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [callbackRef, elementRef]);
};
