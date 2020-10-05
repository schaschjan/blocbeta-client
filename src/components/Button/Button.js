import React from "react";
import {Link} from "react-router-dom";
import {buildClassNames, Loader} from "../../index";
import "./Button.css";

export default ({variant = "primary", disabled = false, asLink = false, loading = false, loader = false, children, ...rest}) => {

  const classes = buildClassNames("button", `button--${variant}`, disabled === true ? "button--disabled" : null);

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