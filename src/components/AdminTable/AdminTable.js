import { TableHeader, TableRow } from "../Table/Table";
import React from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { joinClassNames } from "../../helper/classNames";
import styles from "./AdminTable.module.css";

export function AdminTable({ columns, data, rowClassName, headerClassName }) {
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    headerGroups,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <div className={styles.root} {...getTableProps()}>
      <TableHeader
        className={joinClassNames(styles.header, headerClassName)}
        headerGroups={headerGroups}
      />

      <div {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);

          return (
            <TableRow
              className={joinClassNames(styles.row, rowClassName)}
              cells={row.cells}
              key={`row-${index}`}
            />
          );
        })}
      </div>
    </div>
  );
}
