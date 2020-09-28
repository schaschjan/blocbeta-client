import React from "react"

export const Male = (props) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10.5 9.002a4.48 4.48 0 012.809.984L16.295 7H14V6h4v.705l.002.002L18 6.71V10h-1V7.71l-2.984 2.983A4.5 4.5 0 1110.5 9.002zm3.5 4.5a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0z"
        fill="#333"
      />
    </svg>
  )
};


export const Female = (props) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M15.183 13.06a4.481 4.481 0 01-2.682 1.29V16H15v1h-2.499v2.5h-1V17H9v-1h2.501v-1.65a4.5 4.5 0 113.682-1.29zm-5.657-.707a3.5 3.5 0 104.95-4.95 3.5 3.5 0 00-4.95 4.95z"
        fill="#333"
      />
    </svg>
  )
};

export const Search = (props) => {
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
  )
};

export const Menu = (props) => {
  return (
    <svg width={50} height={50} viewBox="0 0 50 50" fill="none" {...props}>
      <path d="M0 0h50v50H0V0z" fill="#fff"/>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0h50v50H0V0z"
        fill="#fff"
        fillOpacity={0.01}
      />
      <circle cx={25} cy={17} r={2} fill="#333"/>
      <circle cx={25} cy={25} r={2} fill="#333"/>
      <circle cx={25} cy={33} r={2} fill="#333"/>
    </svg>
  )
};