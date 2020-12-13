import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";
import { Loader } from "../Loader/Loader";
import { classNames } from "../../helper/classNames";

const Button = ({
  variant = "primary",
  size = "default",
  modifier = null,
  disabled = false,
  asLink = false,
  loading = false,
  loader = false,
  children,
  ...rest
}) => {
  let loaderVariant = "default";

  const classes = classNames(
    "button",
    `button--${variant}`,
    `button--${size}`,
    modifier ? `button--${modifier}` : null,
    disabled === true ? "button--disabled" : null
  );

  if (asLink) {
    return (
      <Link {...rest} className={classes}>
        {children}

        {loader && loading && <Loader />}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}

      {loader && loading && <Loader variant={loaderVariant} />}
    </button>
  );
};

export { Button };
