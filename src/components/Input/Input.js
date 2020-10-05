import React from "react";
import {buildClassNames} from "../../index";
import "./Input.css";

export default ({className, prefix, type, ...rest}) => {
  return (
    <div className={buildClassNames(className, "input", `input--${type}`)}>
      {prefix && <span>{prefix}</span>}

      <input type={type} {...rest} />
    </div>
  );
};