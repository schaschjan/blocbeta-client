import React from "react";
import { Meta } from "../../App";
import typography from "../../css/typography.module.css";
import { joinClassNames } from "../../helper/classNames";

function AccessDenied() {
  return (
    <>
      <Meta title={"Access denied"} description={"Access denied"} />
      <h1 className={joinClassNames(typography.alpha, typography.paragraph)}>
        Access denied :/
      </h1>
      <p>This incident will be not be reported.</p>
    </>
  );
}

export { AccessDenied };
