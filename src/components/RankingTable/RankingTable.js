import { useGlobalFilter, useSortBy, useTable } from "react-table";
import classnames from "classnames";
import React from "react";
import Search from "../Search/Search";
import { TableCell, TableHeader, TableRow } from "../Table/Table";
import SwipeOut from "../SwipeOut/SwipeOut";

const RankingTable = ({ columns, data, Actions, className }) => {
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
    <div>
      <Search
        placeholder="Search for member"
        onClear={() => setGlobalFilter(null)}
        onInputChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
      />

      <div
        className={classnames("table", `table--${className}`)}
        {...getTableProps()}
      >
        <TableHeader headerGroups={headerGroups} />

        <div className="table-content" {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);

            const Row = ({ ...rest }) => {
              return (
                <TableRow {...rest}>
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
            };

            if (Actions) {
              return (
                <SwipeOut actions={Actions}>
                  <Row key={index} />
                </SwipeOut>
              );
            }

            return <Row />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RankingTable;
