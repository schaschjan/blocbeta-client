import React, {
  useContext,
  Fragment,
  useEffect,
  useRef,
  forwardRef,
} from "react";
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
import { Link } from "react-router-dom";
import { BoulderDBUIContext } from "../BoulderDBUI";
import Grade from "../Grade/Grade";

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

const DetailToggle = ({ boulderId, toggleHandler, active, children }) => {
  const style = `${styles.toggleDetails} ${
    active ? styles["toggleDetails--active"] : null
  }`;

  return (
    <span onClick={() => toggleHandler(boulderId)} className={style}>
      {children} <Forward />
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
  const { contextualizedPath } = useContext(BoulderDBUIContext);

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

                <Link
                  to={contextualizedPath(`/admin/boulder/${row.original.id}`)}
                >
                  &nbsp;&nbsp;&nbsp;✎
                </Link>
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

const boulderTableColumns = {
  holdType: {
    id: "holdType",
    accessor: "holdType",
    Header: "Hold",
    sortType: (a, b) => {
      return a.values.holdType.name > b.values.holdType.name ? -1 : 1;
    },
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => {
        return row.values[id].name === filterValue;
      });
    },
  },
  grade: {
    id: "grade",
    accessor: "grade",
    Header: "Grade",
    sortType: (a, b) => {
      const gradeA = a.values.grade.internal
        ? a.values.grade.internal.name
        : a.values.grade.name;
      const gradeB = b.values.grade.internal
        ? b.values.grade.internal.name
        : b.values.grade.name;

      return gradeA > gradeB ? -1 : 1;
    },
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const rowValue = row.values[id].internal
          ? row.values[id].internal.name
          : row.values[id].name;

        return rowValue === filterValue;
      });
    },
  },
  points: {
    id: "points",
    accessor: "points",
    Header: "Points",
    sortType: (a, b) => {
      return a.values.points > b.values.points ? -1 : 1;
    },
  },
  name: {
    id: "name",
    accessor: "name",
    Header: "Name",
  },
  startWall: {
    id: "start",
    accessor: "startWall.name",
    Header: "Start",
  },
  endWall: {
    id: "end",
    accessor: "endWall.name",
    Header: "End",
  },
  setters: {
    id: "setter",
    accessor: "setters",
    Header: "Setter",
    filter: (rows, id, filterValue) => {
      return rows.filter((row) =>
        row.values[id].some((item) => item.username === filterValue)
      );
    },
  },
  date: {
    id: "date",
    accessor: "createdAt",
    Header: "Date",
  },
  ascent: {
    id: "ascent",
    accessor: "ascent",
    Header: "Ascent",
    sortType: (a, b) => {
      return a.values.ascent.type > b.values.ascent.type ? -1 : 1;
    },
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const rowValue = row.values[id].type ? row.values[id].type : "todo";

        return rowValue === filterValue;
      });
    },
  },
};

export { BoulderTable, DetailToggle, boulderTableColumns };
