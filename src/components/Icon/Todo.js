import * as React from "react";

const Todo = (props) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M0 0h24v24H0V0z" fill="#fff" />
      <circle cx={12} cy={12} r={5.5} stroke="#FFCB41" />
    </svg>
  );
};

export default Todo;
