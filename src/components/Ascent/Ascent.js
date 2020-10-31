import React from "react";
import "./Ascent.css";
import Flash from "../Icon/Flash";
import Top from "../Icon/Top";
import Resignation from "../Icon/Resignation";
import {classNames} from "../../helper/buildClassNames";

const icons = {
  top: Top,
  flash: Flash,
  resignation: Resignation
};

const Ascent = ({type, checked, disabled, ...rest}) => {
  return (
    <div className={classNames(
      "ascent",
      type ? `ascent--${type}` : null,
      checked ? "ascent--checked" : null,
      disabled ? "ascent--disabled" : null
    )} {...rest}>
      {React.createElement(icons[type], {
        fill: checked
      })}
    </div>
  );
};

export default Ascent;
