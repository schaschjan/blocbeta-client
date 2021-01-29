import React, { Fragment, useEffect, useRef, forwardRef } from "react";
import Downward from "../Icon/Downward";
import Upward from "../Icon/Upward";
import {
  usePagination,
  useTable,
  useGlobalFilter,
  useSortBy,
  useRowSelect,
  useFilters,
} from "react-table";
import styles from "./BoulderTable.module.css";
import Forward from "../Icon/Forward";
import Backward from "../Icon/Backward";

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

const DetailToggle = ({ boulderId, toggleHandler, active, value }) => {
  const style = `${styles.toggleDetails} ${
    active ? styles["toggleDetails--active"] : null
  }`;

  return (
    <span onClick={() => toggleHandler(boulderId)} className={style}>
      {value} <Forward />
    </span>
  );
};

const BoulderTable = ({
  columns,
  data,
  onSelectRows,
  globalFilter,
  filters,
  isAdmin = false,
}) => {
  const {
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setAllFilters,
    setGlobalFilter,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20, filters },
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetPage: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        if (!isAdmin) {
          return columns;
        }

        return [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ];
      });
    }
  );

  useEffect(() => {
    setAllFilters(filters);
  }, [filters]);

  useEffect(() => {
    onSelectRows(selectedFlatRows.map((item) => item.original.id));
  }, [selectedFlatRows]);

  useEffect(() => {
    setGlobalFilter(globalFilter);
  }, [globalFilter]);

  const rowStyle = isAdmin ? styles["gridRow--admin"] : styles.gridRow;

  return (
    <Fragment>
      <div className={styles.root}>
        {headerGroups.map((headerGroup) => {
          return (
            <div className={rowStyle} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <div
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`${styles.headerItem} ${
                      styles[`headerItem--${column.id}`]
                    }`}
                  >
                    {column.render("Header")}

                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <Downward />
                      ) : (
                        <Upward />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div>
          {page.map((row, index) => {
            prepareRow(row);

            return (
              <div
                className={`${rowStyle} ${styles.contentGridRow}`}
                key={index}
              >
                {row.cells.map((cell) => {
                  return (
                    <div
                      className={`${styles.cell} ${
                        styles[`cell--${cell.column.id}`]
                      }`}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className={styles.pager}>
          <span className={styles.pagerInfo}>
            {pageIndex * pageSize} - {(pageIndex + 1) * pageSize} of{" "}
            {pageOptions.length * pageSize}
          </span>

          <span
            onClick={() => previousPage()}
            className={
              canPreviousPage ? styles.pagerNav : styles["pagerNav--disabled"]
            }
          >
            <Backward />
          </span>

          <span className={styles.pagerSeparator} />

          <span
            onClick={() => nextPage()}
            className={
              canNextPage ? styles.pagerNav : styles["pagerNav--disabled"]
            }
          >
            <Forward />
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export { BoulderTable, DetailToggle };
