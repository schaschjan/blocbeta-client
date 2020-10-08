import React from "react";

const EmptyState = ({children, isEmpty = true}) => {

  if (!children) {
    return <h2 className="t--gamma">🤷</h2>;
  }

  return <div>{children}</div>;
};

export default EmptyState;
