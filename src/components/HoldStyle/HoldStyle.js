import React from "react";
import "./HoldStyle.css";
import {classNames} from "../../helper/buildClassNames";

const HoldStyle = ({icon, small = false}) => {

  return (
    <div className={classNames(
      "holdstyle",
      small ? "holdstyle--small" : null
    )}>
      <div style={{backgroundImage: `url(${icon})`}} className="holdstyle__inner"/>
    </div>
  );
};

export default HoldStyle;
