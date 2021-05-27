import React from "react";
import { Link } from "react-router-dom";
import { Loader } from "../Loader/Loader";
import cn from "classnames";
import styles from "./Button.module.css";

const Button = ({
  variant = "primary",
  size = "default",
  invert = false,
  modifier = null,
  disabled = false,
  asLink = false,
  loading = false,
  loader = false,
  children,
  className,
  ...rest
}) => {
  let loaderVariant = "default";

  const classes = cn(
    className,
    styles.root,
    styles[`is${variant.capitalize()}`],
    styles[`is${size.capitalize()}Size`],
    modifier ? styles[`is${modifier.capitalize()}`] : null,
    invert ? styles.isInverted : null,
    disabled === true ? styles.isDisabled : null
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
