import React from "react";
import "./HyperLink.css";
import {classNames} from "../../helper/buildClassNames";

const HyperLink = ({className,children, light, active, href, ...rest }) => {
  const classes = classNames(
    "hyperlink",
    active ? "hyperlink--active" : null,
    light ? "hyperlink--light" : null,
    className
  );

  if (href) {
    return (
      <a {...rest} href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <span {...rest} className={classes}>
      {children}
    </span>
  );
};

export default HyperLink;
