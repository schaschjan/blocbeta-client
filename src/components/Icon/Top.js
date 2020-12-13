import * as React from "react";

const Top = ({ fill, ...rest }) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M0 0h24v24H0V0z" />
      <path
        d="M9.235 17.463l-.242.241L4 12.711l.707-.707 4.29 4.289L19.288 6l.707.707L9.238 17.466l-.003-.003z"
        fill={fill ? "#02DEAF" : "#000000"}
      />
    </svg>
  );
};

export default Top;
