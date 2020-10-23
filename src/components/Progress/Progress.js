import React from "react";
import "./Progress.css";
import {classNames} from "../../helper/buildClassNames";

const Progress = ({percentage}) => {
  const classes = classNames(
    "progress",
    percentage > 66
      ? "progress--success"
      : percentage > 33
      ? "progress--warning"
      : "progress--danger"
  );

  return (
    <div className={classes}>
      <div style={{width: `${percentage}%`}}/>
    </div>
  );
};

export default Progress;
