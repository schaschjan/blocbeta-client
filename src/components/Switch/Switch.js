import React from "react";
import "./Switch.css";

export default ({value, ...rest}) => {

  let props = {...rest};

  if (value === true) {
    props.checked = true;
  } else {
    delete props.checked;
  }

  return (
    <div className="checkbox">
      <input
        {...props}
        className="checkbox__switch"
        id={"switch"}
        type="checkbox"
      />

      <label className="checkbox__label checkbox-label checkbox-label__button" htmlFor={"switch"}>
        <span className={`checkbox-label__button`}/>
      </label>
    </div>
  );
};