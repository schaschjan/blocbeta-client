import React from "react";
import {Close} from "../Icon/Close";
import "./Input.css";
import {classNames} from "../../helper/buildClassNames";

const Input = ({
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

  const classes = classNames(
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

export default Input
