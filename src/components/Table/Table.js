import React from "react";
import styles from "./Table.module.css";
import { classNames } from "../../helper/classNames";
import Downward from "../Icon/Downward";
import Upward from "../Icon/Upward";

const TableRow = ({ cells, gridTemplateColumns }) => {
  return (
    <div
      className={styles.row}
      style={{
        gridTemplateColumns,
      }}
    >
      {cells.map((cell, cellIndex) => {
        return (
          <div
            className={classNames(styles.cell)}
            key={`cell-${cellIndex}`}
            {...cell.getCellProps({
              className: cell.column.className,
            })}
          >
            {cell.render("Cell")}
          </div>
        );
      })}
    </div>
  );
};

const TableHeader = ({ gridTemplateColumns, headerGroups }) => {
  return (
    <div
      className={styles.header}
      style={{
        gridTemplateColumns,
      }}
    >
      {headerGroups.map((headerGroup) => {
        return headerGroup.headers.map((column, index) => (
          <div
            className={styles.headerCell}
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
