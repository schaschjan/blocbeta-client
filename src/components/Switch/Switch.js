import React from "react";
import "./Switch.css";

export default ({value, id, ...rest}) => {

  let props = {...rest};

  props.checked = value === true;

  return (
    <div className="checkbox">
      <input
        {...props}
        className="checkbox__switch"
        id={id}
        type="checkbox"
      />

      <label className="checkbox__label checkbox-label checkbox-label__button" htmlFor={id}>
        <span className={`checkbox-label__button`}/>
      </label>
    </div>
  );
};
