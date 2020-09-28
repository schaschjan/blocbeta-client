import React from "react";
import Icon from "../Icon/Icon";
import classnames from "classnames";
import "./Input.css";

const Input = ({className, register, onClear, clearable, ref, prefix, type, ...rest}) => {
  return (
    <div className={classnames(className, "input", `input--${type}`, onClear ? "input--clearable" : null)}>
      {prefix && <span>{prefix}</span>}

      <input ref={register || ref} type={type}{...rest} />

      {(onClear && clearable) && <Icon name="close"/>}
    </div>
  );
};

export default Input;
