import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

const Button = ({ variant = "primary", asLink = false, ...rest }) => {
  if (asLink) {
    return <Link {...rest} className={`button button--${variant}`} />;
  }

  return <button className={`button button--${variant}`} {...rest} />;
};

export default Button;
