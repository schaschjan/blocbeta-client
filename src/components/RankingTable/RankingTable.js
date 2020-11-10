import {useGlobalFilter, useSortBy, useTable} from "react-table";
import React from "react";
import {TableCell, TableHeader, TableRow} from "../Table/Table";
import SwipeOut from "../SwipeOut/SwipeOut";
import {Input} from "../Input/Input";
import "./RankingTable.css";
import {classNames} from "../../helper/buildClassNames";

const RankingTable = ({columns, data, Actions, className}) => {
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

  const Row = ({cells, ...rest}) => {
    return (
      <TableRow {...rest}>
        {cells.map((cell) => {
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

  return (
    <div className="ranking-table-layout content-offset">
      <Input
        className="ranking-table-layout__search"
        placeholder="Search for member"
        onClear={() => setGlobalFilter(null)}
        clearable={true}
        onChange={event => {
          setGlobalFilter(event.target.value);
        }}
      />

      <div className={classNames("ranking-table-layout__table", "table", `table--${className}`)}{...getTableProps()}>
        <TableHeader headerGroups={headerGroups}/>

        <div className="table-content" {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);

            if (Actions) {
              return (
                <SwipeOut actions={Actions} key={row.index}>
                  <Row key={index} cells={row.cells}/>
                </SwipeOut>
              );
            }

            return <Row cells={row.cells} key={row.index}/>;
          })}
        </div>
      </div>
    </div>
  );
};

export default RankingTable;
