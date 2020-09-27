import React from "react";
import "./Select.css";

const Select = ({...rest}) => {

  return (
    <div className="select">
      <select {...rest}
      />
    </div>
  );
};

export default Select;
