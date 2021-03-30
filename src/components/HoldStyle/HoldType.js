import React, { useMemo } from "react";
import "./HoldStyle.css";
import { classNames } from "../../helper/classNames";

const HoldType = ({ image, small = false }) =>
  useMemo(() => {
    return (
      <div
        className={classNames("holdstyle", small ? "holdstyle--small" : null)}
      >
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="holdstyle__image"
        />
      </div>
    );
  }, [image, small]);

export default HoldType;
