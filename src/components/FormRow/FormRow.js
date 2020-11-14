import React from "react";
import "./FormRow.css";

export default ({ children, ...rest }) => {
  return (
    <div className="form-row" {...rest}>
      {children}
    </div>
  );
};
