import * as React from "react";

const Avatar = (props) => {
  return (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none" {...props}>
      <path
        clipRule="evenodd"
        d="M11 21c5.523 0 10-4.477 10-10S16.523 1 11 1 1 5.477 1 11s4.477 10 10 10z"
        stroke="#9CA7E7"
      />
      <path
        d="M5 8c0 1 1 1.5 2 1.5S9 9 9 8l-.5 5H11M17 8c0 1-1 1.5-2 1.5S13 9 13 8M17 12c0 1.997-1.499 6-6.014 6-1.64 0-2.878-.53-3.79-1.3"
        stroke="#9CA7E7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Avatar;
