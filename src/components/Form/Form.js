import React from "react";
import Label from "../Label/Label";
import "./Form.css";

export const Form = ({ children, ...rest }) => {
  return (
    <form {...rest} className="form">
      {children}
    </form>
  );
};

export const FormRow = ({ children, ...rest }) => {
  return (
    <div className="form-row" {...rest}>
      {children}
    </div>
  );
};

export const FormElement = ({ label, name, children }) => {
  return (
    <div className="form-element">
      <Label htmlFor={name}>{label}</Label>

      {children}
    </div>
  );
};
