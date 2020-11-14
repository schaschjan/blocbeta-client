import * as React from "react";

const Burger = (props) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 17" fill="none" {...props}>
      <path
        d="M1 8.714h24M1 1h24M1 16h24"
        stroke="#000"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Burger;
