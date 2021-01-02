import React from "react";
import "./Textarea.css";
import { classNames } from "../../helper/classNames";

export const Textarea = ({ register, children, className, ...rest }) => {
  return (
    <textarea
      ref={register}
      {...rest}
      className={classNames(className, "textarea", "t--eta")}
    >
      {children}
    </textarea>
  );
};
