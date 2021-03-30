import React, {
  useContext,
  Fragment,
  useEffect,
  useRef,
  forwardRef,
  useMemo,
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
import { Link } from "react-router-dom";
import { BoulderDBUIContext } from "../BoulderDBUI";
import Grade from "../Grade/Grade";
import { Pagination } from "./Pagination";
import moment from "moment";
import { Ascent } from "../Ascent/Ascent";

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

        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={pageOptions.length}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </div>
    </Fragment>
  );
};

const Ascents = ({ removeHandler, addHandler, value }) =>
  useMemo(() => {
    return (
      <div className={styles.ascents}>
        <Ascent
          type="flash"
          disabled={value.id && value.type !== "flash"}
          checked={value.type === "flash"}
          asyncHandler={async () => {
            value.id
              ? await removeHandler(value.id)
              : await addHandler(value.boulderId, "flash");
          }}
        />

        <Ascent
          type="top"
          disabled={value.id && value.type !== "top"}
          checked={value.type === "top"}
          asyncHandler={async () => {
            value.id
              ? await removeHandler(value.id)
              : await addHandler(value.boulderId, "top");
          }}
        />

        <Ascent
          type="resignation"
          disabled={value.id && value.type !== "resignation"}
          checked={value.type === "resignation"}
          asyncHandler={async () => {
            value.id
              ? await removeHandler(value.id)
              : await addHandler(value.boulderId, "resignation");
          }}
        />
      </div>
    );
  }, [value]);

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
    accessor: "startWall",
    Header: "Start",
    filter: (rows, id, filterValue) =>
      rows.filter((row) => row.values[id].name === filterValue),
  },
  endWall: {
    id: "end",
    accessor: "endWall",
    Header: "End",
    filter: (rows, id, filterValue) =>
      rows.filter((row) => row.values[id].name === filterValue),
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
    accessor: ({ created_at }) => moment(created_at).format("ll"),
    sortType: (a, b) => {
      return moment(a.original.created_at).valueOf() >
        moment(b.original.created_at).valueOf()
        ? -1
        : 1;
    },
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

const WallLink = ({ name, onClick }) =>
  useMemo(() => {
    return (
      <span className={styles.wallLink} onClick={onClick}>
        {name}
      </span>
    );
  }, [name]);

export { BoulderTable, DetailToggle, WallLink, boulderTableColumns, Ascents };
