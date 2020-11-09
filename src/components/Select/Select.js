import React from "react";
import "./Select.css";

const Select = ({multiple = false, value = [], ...rest}) => {

  let props = {...rest};

  return (
    <div className="select">
      <select {...props} multiple={multiple}/>
    </div>
  );
};

export {Select}
