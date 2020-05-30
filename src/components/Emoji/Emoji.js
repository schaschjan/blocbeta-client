import React from "react";
import "./Emoji.css";

const Emoji = ({ children }) => {
  return (
    <span className="emoji" role={"image"}>
      {children}
    </span>
  );
};

export default Emoji;
