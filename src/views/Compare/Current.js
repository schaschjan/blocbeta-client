import React, { Fragment, useContext, useMemo } from "react";
import "./Current.module.css";
import { useParams } from "react-router-dom";
import { AppContext, Meta } from "../../App";
import useRequest from "../../hooks/useRequest";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { Input } from "../../components/Input/Input";
import {
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "../../components/Table/Table";
import styles from "./Current.module.css";
import Downward from "../../components/Icon/Downward";
import Upward from "../../components/Icon/Upward";

const Current = () => {
  const { a, b } = useParams();
  const { user } = useContext(AppContext);

  const { data: boulders } = useRequest(`/boulder`);
  const { data: comparisons } = useRequest(`/compare/${a}/to/${b}/at/current`);
  const { data: compareUser } = useRequest(`/user/${b}`, false);

  const columns = useMemo(() => {
    return [
      {
        Header: "Hold",
        gridTemplate: "1fr",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: "Grade",
        gridTemplate: "1fr",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: "Name",
        gridTemplate: "1fr",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: "Start",
        accessor: "startWall.name",
        gridTemplate: "1fr",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: "You",
        accessor: "a",
        gridTemplate: "1fr",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: compareUser.username,
        accessor: "b",
        gridTemplate: "1fr",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
    ];
  }, []);

  const data = useMemo(() => {
    return boulders.map((boulder) => {
      return {
        ...boulder,
        ...comparisons.find((comparison) => comparison.subject === boulder.id),
      };
    });
  }, [boulders, comparisons, compareUser]);

  console.log(data);

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

  const rowTemplateColumns = columns
    .map((column) => column.gridTemplate)
    .join(" ");

  return (
    <Fragment>
      <Meta title="Current Ranking" />
      <h1 className="t--alpha page-title">Current Comparison</h1>

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

        <div {...getTableProps()}>
          <div
            className={styles.header}
            style={{
              gridTemplateColumns: rowTemplateColumns,
            }}
          >
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

          <div {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);

              return (
                <div
                  key={`row-${index}`}
                  className={styles.row}
                  style={{
                    gridTemplateColumns: rowTemplateColumns,
                  }}
                >
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { Current };
