import React from "react";
import "./Paragraph.css";

const Paragraph = ({ children, ...rest }) => {
  return <p {...rest}>{children}</p>;
};

export default Paragraph;
