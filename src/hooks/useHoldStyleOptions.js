import React from "react";
import { alphaSort } from "../helpers";
import HoldStyle from "../components/HoldStyle/HoldStyle";

const useHoldStyleOptions = (items) => {
  if (!items) {
    return null;
  }

  return alphaSort(items, "name").map((holdStyle) => {
    return {
      label: (
        <span>
          <HoldStyle name={holdStyle.name} icon={holdStyle.icon} small={true} />{" "}
          {holdStyle.name}{" "}
        </span>
      ),
      value: holdStyle.id,
    };
  });
};

export default useHoldStyleOptions;
