import React from "react";
import "./Grade.css";

const Grade = ({ color, name, internal = false }) => {
  if (internal) {
    return (
      <div className="grade grade--internal" style={{ color: color }}>
        ({name})
      </div>
    );
  }

  return (
    <div className="grade" style={{ color: color }}>
      {name}
    </div>
  );
};

export default Grade;
