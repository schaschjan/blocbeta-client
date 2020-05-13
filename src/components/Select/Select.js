import React from "react";
import ReactSelect from "react-select";
import "./Select.css";

const Select = ({ ...rest }) => {
  return (
    <ReactSelect
      {...rest}
      className="react-select react-select--formless"
      classNamePrefix="react-select"
    />
  );
};

export default Select;
