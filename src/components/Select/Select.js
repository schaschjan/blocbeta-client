import React, { useEffect, useState } from "react";
import "./Select.css";

const Select = ({ multiple = false, value = [], ...rest }) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);

    if (!value) {
      setSelected("");
    }
  }, [value]);

  return (
    <div className="select">
      <select multiple={multiple} value={selected} {...rest} />
    </div>
  );
};

export { Select };
