import React, { Fragment } from "react";
import "./Switch.css";

const Switch = ({ register, ref, name }) => {
  return (
    <Fragment>
      <input
        type="checkbox"
        id="toggle"
        className="checkbox"
        ref={register || ref}
        name={name}
      />
      <label htmlFor="toggle" className="switch" />
    </Fragment>
  );
};

export default Switch;
