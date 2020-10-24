import React from "react";
import "./Loader.css";
import {classNames} from "../../helper/buildClassNames";

export const Loader = ({variant = "primary"}) => {
  return (
    <span className={classNames("loader", `loader--${variant}`)}>
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"/>
          <div className="sk-cube2 sk-cube"/>
          <div className="sk-cube4 sk-cube"/>
          <div className="sk-cube3 sk-cube"/>
        </div>
      </span>
  );
};

export const LoadedContent = ({loading, children}) => {
  return loading ? <Loader/> : children;
};
