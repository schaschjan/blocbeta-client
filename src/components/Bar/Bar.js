import React from "react";
import "./Bar.css";
import { classNames } from "../../helper/classNames";

const Bar = ({ visible, children }) => {
  return (
    <div
      className={classNames("bar t--gamma", visible ? "bar--visible" : null)}
    >
      {children}
    </div>
  );
};

export { Bar };
