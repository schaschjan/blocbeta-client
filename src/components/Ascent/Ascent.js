import React from "react";
import "./Ascent.css";
import {buildClassNames} from "../../index";
import Flash from "../Icon/Flash";
import Top from "../Icon/Top";
import Resignation from "../Icon/Resignation";

const icons = {
  top: Top,
  flash: Flash,
  resignation: Resignation
};

const Ascent = ({type, checked, disabled, ...rest}) => {
  const classNames = buildClassNames(
    "ascent",
    type ? `ascent--${type}` : null,
    checked ? "ascent--checked" : null,
    disabled ? "ascent--disabled" : null
  );

  return (
    <div className={classNames} {...rest}>
      {React.createElement(icons[type], {
        fill: checked
      })}
    </div>
  );
};

export default Ascent;
