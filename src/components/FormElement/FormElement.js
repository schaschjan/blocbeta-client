import React from "react";
import { Label } from "../../index";

export default ({ label, name, children }) => {
  return (
    <div className="form-element">
      <Label htmlFor={name}>{label}</Label>

      {children}
    </div>
  );
};
