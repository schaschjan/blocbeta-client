import React from "react";
import "./HoldStyle.css";
import classnames from "classnames";

const HoldStyle = ({ name, small, icon }) => {
  return (
    <div
      className={classnames("holdstyle", ``, small ? "holdstyle--small" : null)}
    >
      <div style={{ backgroundImage: `url(${icon})` }} />
    </div>
  );
};

export default HoldStyle;
