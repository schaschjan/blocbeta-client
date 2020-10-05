import { useEffect, useState } from "react";

export default (targetKey, callback) => {
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
