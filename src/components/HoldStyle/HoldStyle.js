import React from "react";
import "./HoldStyle.css";
import {buildClassNames} from "../../index";

const HoldStyle = ({icon, small = false}) => {

  return (
    <div className={buildClassNames(
      "holdstyle",
      small ? "holdstyle--small" : null
    )}>
      <div style={{backgroundImage: `url(${icon})`}} className="holdstyle__inner"/>
    </div>
  );
};

export default HoldStyle;
