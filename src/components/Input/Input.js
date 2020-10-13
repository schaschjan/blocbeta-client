import React from "react";
import {buildClassNames} from "../../index";
import "./Input.css";
import {Close} from "../Icon/Close";

export default ({className, clearable, onClear, prefix, type, value, ...rest}) => {
  return (
    <div className={buildClassNames(className, "input", `input--${type}`)}>
      {prefix && <span>{prefix}</span>}

      <input type={type} {...rest} value={value}/>

      {(clearable && value) && (
        <Close onClick={(event) => onClear(event)}/>
      )}
    </div>
  );
};