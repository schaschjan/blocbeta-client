import React from "react";
import { Close } from "../Icon/Close";
import "./Input.css";
import { classNames } from "../../helper/classNames";

const Input = ({
  className,
  onClear,
  prefix,
  type,
  value,
  filled = false,
  size = "default",
  ...rest
}) => {
  const classes = classNames(
    className,
    "input",
    `input--${type}`,
    `input--${size}`,
    filled ? "input--filled" : null
  );

  console.log(onClear, value);

  return (
    <div className={classes}>
      {prefix && <span>{prefix}</span>}

      <input type={type} {...rest} value={value} />

      {onClear && value && <Close onClick={(event) => onClear(event)} />}
    </div>
  );
};

export { Input };
