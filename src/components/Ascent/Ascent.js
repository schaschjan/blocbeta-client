import React, { useState } from "react";
import styles from "./Ascent.module.css";
import Flash from "../Icon/Flash";
import Top from "../Icon/Top";
import Resignation from "../Icon/Resignation";
import Todo from "../Icon/Todo";
import { joinClassNames } from "../../helper/classNames";

const icons = {
  top: Top,
  flash: Flash,
  resignation: Resignation,
  todo: Todo,
};

const getIcon = (type) => {
  return icons[type.toLowerCase()];
};

const Ascent = ({ type, checked, disabled, asyncHandler, ...rest }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div
      onClick={async () => {
        setLoading(true);
        await asyncHandler();
        setLoading(false);
      }}
      className={joinClassNames(
        styles.root,
        styles[`is${type.capitalize()}`],
        checked ? styles.isChecked : null,
        disabled ? styles.isDisabled : null,
        loading ? styles.isLoading : null
      )}
      {...rest}
    >
      <AscentIcon type={type} fill={checked} />
    </div>
  );
};

export function isDoubt(type) {
  if (!type) {
    return false;
  }

  return type.includes("-pending-doubt");
}

function AscentIcon({ type, fill }) {
  if (!type) {
    return null;
  }

  const doubted = type.includes("-pending-doubt");
  const Icon = getIcon(type.replace("-pending-doubt", "").toLowerCase());

  return <Icon fill={fill} style={{ opacity: doubted ? 0.5 : 1 }} />;
}

export { Ascent, AscentIcon, getIcon };
