import React from "react";
import styles from "./Pagination.module.css";
import Backward from "../Icon/Backward";
import Forward from "../Icon/Forward";
import { joinClassNames } from "../../helper/classNames";

function Pagination({
  pageIndex,
  pageSize,
  pageCount,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
}) {
  return (
    <div className={styles.root}>
      <span className={styles.info}>
        {pageIndex * pageSize} - {(pageIndex + 1) * pageSize} of{" "}
        {pageCount * pageSize}
      </span>

      <span
        onClick={() => previousPage()}
        className={joinClassNames(
          styles.button,
          !canPreviousPage ? styles.isDisabledButton : null
        )}
      >
        <Backward />
      </span>

      <span className={styles.separator} />

      <span
        onClick={() => nextPage()}
        className={joinClassNames(
          styles.button,
          !canNextPage ? styles.isDisabledButton : null
        )}
      >
        <Forward />
      </span>
    </div>
  );
}

export { Pagination };
