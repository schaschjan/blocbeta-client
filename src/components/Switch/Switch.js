import React, {Fragment} from "react";
import "./Switch.css";

const Switch = ({value,...rest}) => {
  return (
    <Fragment>
      <input
        type="checkbox"
        className="checkbox"
        {...rest}
      />
      <label htmlFor="toggle" className="switch"/>
    </Fragment>
  );
};

export default Switch;
