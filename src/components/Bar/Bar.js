import React from "react";
import styles from "./Bar.module.css";
import typography from "../../css/typography.module.css";
import { joinClassNames } from "../../helper/classNames";

const Bar = ({ visible, children }) => {
  return (
    <div
      className={joinClassNames(
        styles.root,
        visible ? styles.isVisible : null,
        typography.gamma
      )}
    >
      {children}
    </div>
  );
};

export { Bar };
