import React from "react";
import "./Select.css";

export default ({...rest}) => {

  return (
    <div className="select">
      <select {...rest}
      />
    </div>
  );
};
