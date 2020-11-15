import React, { Fragment, useEffect, useRef, forwardRef } from "react";
import { classNames } from "../../helper/classNames";
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
import "./BoulderTable.css";
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

const BoulderTable = ({
  columns,
  data,
  onSelectRows,
  globalFilterValue,
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
    setFilter,
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
    onSelectRows(selectedFlatRows.map((item) => item.original.id));
  }, [selectedFlatRows]);

  useEffect(() => {
    setGlobalFilter(globalFilterValue);
  }, [globalFilterValue]);

  return (
    <Fragment>
      <div className="boulder-list">
        {headerGroups.map((headerGroup) => (
          <div
            className={classNames(
              "boulder-list__header",
              "boulder-list-header",
              isAdmin ? "boulder-list__header--admin" : null
            )}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className="boulder-list-header__item t--eta"
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
            ))}
          </div>
        ))}

        <div className="boulder-list__content boulder-list-content">
          {page.map((row, index) => {
            prepareRow(row);

            return (
              <div
                className={classNames(
                  "boulder-list-content__item",
                  "boulder-list-content-item",
                  isAdmin ? "boulder-list-content__item--admin" : null
                )}
                key={index}
              >
                {row.cells.map((cell) => {
                  return (
                    <div
                      className={`t--eta boulder-list-content-item__cell boulder-list-content-item__cell--${cell.column.id}`}
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

        <div className="boulder-list__footer boulder-list-footer">
          <div className="boulder-list-footer__pager boulder-list-footer-pager ">
            <span className="boulder-list-footer-pager__info t--eta">
              {pageIndex * pageSize} - {(pageIndex + 1) * pageSize} of{" "}
              {pageOptions.length * pageSize}
            </span>

            <span
              onClick={() => previousPage()}
              className={classNames(
                "boulder-list-footer-pager__prev",
                !canPreviousPage
                  ? "boulder-list-footer-pager__prev--disabled"
                  : null
              )}
            >
              <Backward />
            </span>

            <span className={"boulder-list-footer-pager__separator"} />

            <span
              onClick={() => nextPage()}
              className={classNames(
                "boulder-list-footer-pager__next",
                !canNextPage
                  ? "boulder-list-footer-pager__next--disabled"
                  : null
              )}
            >
              <Forward />
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { BoulderTable };
