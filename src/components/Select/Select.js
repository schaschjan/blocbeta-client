import React, { Fragment, useState } from "react";
import ReactSelect from "react-select";
import "./Select.css";

const Select = ({ required, ...rest }) => {
  const [value, setValue] = useState(null);

  const onChange = (event) => {
    setValue(event.value);
  };

  return (
    <Fragment>
      <ReactSelect
        {...rest}
        onChange={onChange}
        className="react-select react-select--formless"
        classNamePrefix="react-select"
      />

      <input
        tabIndex={-1}
        autoComplete="off"
        style={{ opacity: 0, height: 0 }}
        value={value}
        required={required}
      />
    </Fragment>
  );
};

export default Select;
