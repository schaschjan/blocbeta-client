import { joinClassNames } from "../../helper/classNames";
import styles from "./RateButton.module.css";
import React from "react";

export default function RateButton({
  onAdd,
  onDelete,
  value,
  direction,
  disabled = false,
}) {
  return (
    <button
      onClick={!value ? onAdd : onDelete}
      className={joinClassNames(
        styles.root,
        disabled ? styles.isDisabled : null
      )}
    >
      {direction === "up" ? "👍" : "👎"}
    </button>
  );
}
