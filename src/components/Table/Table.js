import React from "react";
import "./Table.css";
import { classNames } from "../../helper/classNames";
import Downward from "../Icon/Downward";
import Upward from "../Icon/Upward";

export const TableRow = ({ children, ...rest }) => {
  return (
    <div className="table-row" {...rest}>
      {children}
    </div>
  );
};

export const TableCell = ({ children, className }) => {
  return <div className={classNames("table-cell", className)}>{children}</div>;
};

export const TableHeader = ({ headerGroups }) => {
  return (
    <div className="table-header">
      {headerGroups.map((headerGroup) => {
        return headerGroup.headers.map((column, index) => (
          <TableHeaderCell
            {...column.getHeaderProps(column.getSortByToggleProps())}
            key={index}
          >
            {column.render("Header")}
            <span className="sort-indicator">
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
          </TableHeaderCell>
        ));
      })}
    </div>
  );
};

export const TableHeaderCell = ({ children, ...rest }) => {
  return (
    <div className="table-header-cell" {...rest}>
      {children}
    </div>
  );
};
