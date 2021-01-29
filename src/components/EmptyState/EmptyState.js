import React from "react";
import Emoji from "../Emoji/Emoji";

const EmptyState = ({ children }) => {
  if (!children) {
    return (
      <h2 className="t--gamma">
        <Emoji>🤷</Emoji>
      </h2>
    );
  }

  return <div>{children}</div>;
};

export default EmptyState;
