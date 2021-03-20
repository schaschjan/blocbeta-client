import * as React from "react";

Todo.defaultProps = {
  fill: false,
};

export default function Todo({ fill, ...rest }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M0 0h24v24H0V0z" />
      <circle cx={12} cy={12} r={5.5} stroke={fill ? "#FFCB41" : "#000000"} />
    </svg>
  );
}
