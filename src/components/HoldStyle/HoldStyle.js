import React from "react";
import "./HoldStyle.css";
import classnames from "classnames";

const HoldStyle = ({ name, small }) => {
  let icon = <div style={{ background: "#ffffff" }}></div>;

  return (
    <div className={classnames("holdstyle", ``, small ? "holdstyle--small" : null)}>
      {icon}
    </div>
  );
};

export default HoldStyle;
