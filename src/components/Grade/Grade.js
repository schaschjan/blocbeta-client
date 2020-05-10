import React from "react";
import "./Grade.css";

const Grade = ({ color, name }) => {
  return (
    <div className="grade" style={{ color: color }}>
      {name}
    </div>
  );
};

export default Grade;
