import React from "react";
import {Link} from "react-router-dom";
import {buildClassNames} from "../../index";
import "./Button.css";
import {Loader} from "../Loader/Loader";

export default ({
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

  const classes = buildClassNames(
    "button",
    `button--${variant}`,
    `button--${size}`,
    modifier ? `button--${modifier}` : null,
    disabled === true ? "button--disabled" : null
  );

  if (asLink) {
    return <Link {...rest} className={classes}>
      {children}

      {loader && loading && <Loader/>}
    </Link>;
  }

  return <button className={classes} {...rest}>
    {children}

    {loader && loading && <Loader variant={loaderVariant}/>}
  </button>
};