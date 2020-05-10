import { useEffect, useState } from "react";

const useKeyDown = (targetKey, callback) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const onKeyDown = ({ key }) => {
    if (key === targetKey) {
      callback();
    }
  };

  const onKeyUp = ({ key }) => {
    if (key === targetKey) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return keyPressed;
};

export default useKeyDown;
