import React from "react";
import Icon from "../Icon/Icon";
import classnames from "classnames";
import "./Input.css";

const Input = ({ register, ref, prefix, icon, type, ...rest }) => {
  return (
    <div className={classnames("input", `input--${type}`)}>
      {icon && <Icon name={icon} />}
      {prefix && <span>{prefix}</span>}

      <input ref={register || ref} type={type} {...rest} />
    </div>
  );
};

export default Input;
