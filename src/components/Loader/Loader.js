import React from "react";
import "./Loader.css";
import {buildClassNames} from "../../index";

export default ({variant = "primary"}) => {
  return (
    <span className={buildClassNames("loader", `loader--${variant}`)}>
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"/>
          <div className="sk-cube2 sk-cube"/>
          <div className="sk-cube4 sk-cube"/>
          <div className="sk-cube3 sk-cube"/>
        </div>
      </span>
  );
};
