import React from "react";
import styles from "./Avatar.module.css";
import AvatarIcon from "../Icon/Avatar";
import { joinClassNames } from "../../helper/classNames";

const Avatar = ({ image }) => {
  if (!image) {
    return (
      <div className={joinClassNames(styles.root, styles.isFallback)}>
        <AvatarIcon />
      </div>
    );
  }

  return (
    <div
      className={styles.root}
      style={{ backgroundImage: `url(${image}?w=80&h=80&fit=crop)` }}
    />
  );
};

export default Avatar;
