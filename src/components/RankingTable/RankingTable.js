import { useGlobalFilter, useSortBy, useTable } from "react-table";
import React from "react";
import { TableCell, TableHeader, TableRow } from "../Table/Table";
import { Input } from "../Input/Input";
import { classNames } from "../../helper/classNames";
import "./RankingTable.css";

const RankingTable = ({ columns, data, className }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <div className="ranking-table-layout">
      <Input
        className="ranking-table-layout__search"
        placeholder="Search for member"
        onClear={() => setGlobalFilter(null)}
        clearable={true}
        onChange={(event) => {
          setGlobalFilter(event.target.value);
        }}
      />

      <div
        className={classNames("table", `table--${className}`)}
        {...getTableProps()}
      >
        <TableHeader headerGroups={headerGroups} />

        <div className="table-content" {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);

            return (
              <TableRow key={row.index} index={`row-${index}`}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell
                      {...cell.getCellProps({
                        className: cell.column.className,
                      })}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RankingTable;
