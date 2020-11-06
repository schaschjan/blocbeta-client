import React from "react";
import "./Select.css";

const Select = ({multiple, value = [], ...rest}) => {

console.log(value);
  let props = {...rest};
  // props.value= value.join(", ");

  return (
    <div className="select">
      <select {...props} multiple/>
    </div>
  );
};

export {Select}
