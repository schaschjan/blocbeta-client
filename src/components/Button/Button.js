import React from "react";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {Loader} from "../Loader/Loader";
import "./Button.css";

const Button = ({variant = "primary", disabled = false, asLink = false, loading = false, loader = false, children, ...rest}) => {

  const classes = classNames("button", `button--${variant}`, disabled === true ? "button--disabled" : null);

  if (asLink) {
    return <Link {...rest} className={classes}>
      {children}

      {loader && loading && <Loader/>}
    </Link>;
  }

  return <button className={classes} {...rest}>
    {children}

    {loader && loading && <Loader/>}
  </button>
};

export default Button;
