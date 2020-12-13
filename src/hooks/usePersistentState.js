import { useState, useEffect } from "react";

export default (key, defaultValue) => {
  const storageValue = localStorage.getItem(key);
  let current = null;

  if (storageValue && storageValue !== "null" && storageValue !== "undefined") {
    current = JSON.parse(localStorage.getItem(key));
  }

  const [state, setState] = useState(current || defaultValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};
