import React from "react";
import "./Icon.css";

import {ReactComponent as Upward} from "./icons/upward.svg";
import {ReactComponent as Downward} from "./icons/downward.svg";
import {ReactComponent as Backward} from "./icons/backward.svg";
import {ReactComponent as Forward} from "./icons/forward.svg";
import {ReactComponent as Search} from "./icons/search.svg";
import {ReactComponent as Avatar} from "./icons/avatar.svg";
import {ReactComponent as Female} from "./icons/female.svg";
import {ReactComponent as Male} from "./icons/male.svg";
import {ReactComponent as Menu} from "./icons/menu.svg";
import {ReactComponent as Burger} from "./icons/burger.svg";
import {ReactComponent as Error} from "./icons/error.svg";
import {ReactComponent as Close} from "./icons/close.svg";
import {classNames} from "../../helper/buildClassNames";

const Icon = ({name, onClick, className, fill, ...rest}) => {
  let icon;
  let size;

  if (name === "flash" || name === "flash-pending-doubt") {
    const doubted = name === "flash-pending-doubt";

    size = "small";
    icon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H24V24H0V0Z" fill="white"/>
        <path
          d="M12 5.29291L7.64648 9.64646L8.35359 10.3536L11.5 7.20712V18H12.5V7.20712L15.6465 10.3536L16.3536 9.64646L12 5.29291Z"
          fill={fill ? fill : "#1687FF"}
        />
      </svg>
    );
  }

  if (name === "top" || name === "top-pending-doubt") {
    size = "small";
    icon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H24V24H0V0Z" fill="white"/>
        <path
          d="M9.23503 17.4628L8.99348 17.7044L4 12.7109L4.70711 12.0038L8.99628 16.2929L19.2892 6L19.9963 6.70711L9.23782 17.4656L9.23503 17.4628Z"
          fill={fill ? fill : "#02DEAF"}
        />
      </svg>
    );
  }

  if (name === "resignation") {
    size = "small";
    icon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H24V24H0V0Z" fill="white"/>
        <path
          d="M11.295 12.0021L6 17.2971L6.70711 18.0042L12.0021 12.7092L17.2972 18.0042L18.0043 17.2971L12.7092 12.0021L18.0042 6.70711L17.2971 6L12.0021 11.295L6.70715 6.00001L6.00005 6.70711L11.295 12.0021Z"
          fill="#FF5D5F"
        />
      </svg>
    );
  }

  if (name === "todo") {
    size = "small";
    icon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H24V24H0V0Z" fill="white"/>
        <circle cx="12" cy="12" r="5.5" stroke="#FFCB41"/>
      </svg>
    );
  }

  if (name === "search") {
    size = "small";
    icon = <Search/>;
  }

  if (name === "forward") {
    size = "small";
    icon = <Forward/>;
  }

  if (name === "downward") {
    size = "small";
    icon = <Downward/>;
  }

  if (name === "backward") {
    size = "small";
    icon = <Backward/>;
  }

  if (name === "open-filters") {
    size = "large";
    icon = <Menu/>;
  }

  if (name === "burger") {
    size = "large";
    icon = <Burger/>;
  }

  if (name === "close-large") {
    size = "large";
    icon = <Close/>;
  }

  if (name === "error") {
    size = "small";
    icon = <Error/>;
  }

  if (name === "upward") {
    size = "small";
    icon = <Upward/>;
  }

  if (name === "female") {
    size = "small";
    icon = <Female/>;
  }

  if (name === "male") {
    size = "small";
    icon = <Male/>;
  }

  if (name === "avatar") {
    size = "small";
    icon = <Avatar/>;
  }

  return (
    <span
      className={classNames(
        "icon",
        `icon--${size}`,
        onClick ? "icon--clickable" : null,
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {icon}
    </span>
  );
};

export default Icon;
