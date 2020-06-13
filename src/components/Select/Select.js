import React from "react";
import ReactSelect from "react-select";
import "./Select.css";

const Select = ({ onChange, ...rest }) => {
  return (
    <ReactSelect
      {...rest}
      onChange={onChange}
      className="react-select react-select--formless"
      classNamePrefix="react-select"
    />
  );
};

export default Select;
