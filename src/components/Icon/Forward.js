import * as React from "react"

const Forward = (props) => {
  return (
    <svg width={24} height={24} viewBox="0 -1 24 24" fill="none" {...props}>
      <path fill="#fff" fillOpacity={0.01} d="M0 0h24v24H0z" />
      <path
        d="M9 7l6 5.102L9 17"
        stroke="#333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
};

export default Forward;