import React, { useMemo } from "react";
import "./Grade.css";

const Grade = ({ color, name, internalColor = null, internalName = null }) => {
  return useMemo(
    () => (
      <div className="grade" style={{ color: color }}>
        Grade {name}
        {internalColor && internalName && internalName !== name && (
          <span
            style={{
              color: internalColor,
              paddingLeft: "4px",
            }}
          >
            ({internalName})
          </span>
        )}
      </div>
    ),
    [color, name]
  );
};

export default Grade;
