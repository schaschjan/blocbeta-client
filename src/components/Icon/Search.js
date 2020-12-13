import * as React from "react";

const Search = (props) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M18.114 17.406a.5.5 0 01-.707.708l.707-.708zm-.707.708l-4.51-4.51.707-.708 4.51 4.51-.707.708z"
        fill="#000"
      />
      <path
        clipRule="evenodd"
        d="M10.4 14.8a4.4 4.4 0 100-8.8 4.4 4.4 0 000 8.8z"
        stroke="#000"
      />
    </svg>
  );
};

export default Search;
