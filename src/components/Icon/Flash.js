import * as React from "react"

const Flash = ({fill, ...rest}) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M0 0h24v24H0V0z"/>
      <path
        d="M12 5.293L7.646 9.646l.708.708L11.5 7.207V18h1V7.207l3.146 3.147.708-.708L12 5.293z"
        fill="#1687FF"
      />
    </svg>
  )
};

export default Flash;
