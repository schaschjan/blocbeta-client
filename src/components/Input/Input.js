import React from "react";
import {buildClassNames} from "../../index";
import {Close} from "../Icon/Close";
import "./Input.css";

export default ({
                  className,
                  clearable,
                  onClear,
                  prefix,
                  type,
                  value,
                  filled = false,
                  size = "default",
                  ...rest
                }) => {

  const classes = buildClassNames(
    className,
    "input",
    `input--${type}`,
    `input--${size}`,
    filled ? "input--filled" : null
  );

  return (
    <div className={classes}>
      {prefix && <span>{prefix}</span>}

      <input type={type} {...rest} value={value}/>

      {(clearable && value) && (
        <Close onClick={(event) => onClear(event)}/>
      )}
    </div>
  );
};