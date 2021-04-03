import React from "react";
import styles from "./Table.module.css";
import { joinClassNames } from "../../helper/classNames";
import Downward from "../Icon/Downward";
import Upward from "../Icon/Upward";
import classNames from "classnames";

const TableRow = ({ cells, className }) => {
  return (
    <div className={joinClassNames(styles.row, className)}>
      {cells.map((cell, cellIndex) => {
        return (
          <div
            className={classNames(styles.cell, cell.column.className)}
            key={`cell-${cellIndex}`}
            {...cell.getCellProps()}
          >
            {cell.render("Cell")}
          </div>
        );
      })}
    </div>
  );
};

const TableHeader = ({ headerGroups, className }) => {
  return (
    <div className={classNames(styles.header, className)}>
      {headerGroups.map((headerGroup) => {
        return headerGroup.headers.map((column, index) => (
          <div
            className={joinClassNames(styles.headerCell, column.className)}
            {...column.getHeaderProps(column.getSortByToggleProps())}
            key={`header-cell-${index}`}
          >
            {column.render("Header")}
            <span className={styles.sortIndicator}>
              {column.isSorted ? (
                column.isSortedDesc ? (
                  <Downward />
                ) : (
                  <Upward />
                )
              ) : (
                ""
              )}
            </span>
          </div>
        ));
      })}
    </div>
  );
};

export { TableRow, TableHeader };
