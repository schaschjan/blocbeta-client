import React, {useMemo} from "react";
import "./Grade.css";

const Grade = ({color, name}) => {

  return useMemo(() => (
    <div className="grade" style={{color: color}}>
      Grade {name}
    </div>
  ), [color, name]);
};

export default Grade;
