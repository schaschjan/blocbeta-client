import "./Textarea.css";
import React from "react";

export const Textarea = ({ register, children, ...rest }) => {
  return (
    <textarea ref={register} {...rest}>
      {children}
    </textarea>
  );
};
