import React from "react";
import "./Label.css";

export default ({ children, ...rest }) => {
  return (
    <label className="label" {...rest}>
      {children}
    </label>
  );
};
