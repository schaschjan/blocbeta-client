import React from "react";
import "./Emoji.css";

const Emoji = ({ children }) => {
  return (
    <span className="emoji" role={"img"} aria-label={"Emoji"}>
      {children}
    </span>
  );
};

export default Emoji;
