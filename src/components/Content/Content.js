import React, { Fragment } from "react";
import "./Content.css";
import {classNames} from "../../helper/buildClassNames";

export const Content = ({ children, disabled, ...rest }) => {
  return (
    <Fragment>
      <div
        id="content"
        className={classNames(
          "content",
          disabled ? "content--disabled" : false
        )}
        {...rest}
      >
        {children}
      </div>
    </Fragment>
  );
};
