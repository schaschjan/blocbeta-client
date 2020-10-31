import React, {useMemo} from "react";
import "./HoldStyle.css";
import {classNames} from "../../helper/buildClassNames";

const HoldStyle = ({image, small = false}) => {

  return useMemo(() => (
    <div className={classNames("holdstyle", small ? "holdstyle--small" : null)}>
      <div style={{backgroundImage: `url(${image})`}} className="holdstyle__image"/>
    </div>
  ), [image]);

};

export default HoldStyle;
