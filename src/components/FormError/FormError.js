import React from "react";
import "./FormError.css";

const FormError = ({ message }) => {
  if (!message) {
    return null;
  }

  return <span className="form-error">{message}</span>;
};

export default FormError;
