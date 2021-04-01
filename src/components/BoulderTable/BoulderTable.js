import React, { Fragment, useEffect, useRef, forwardRef, useMemo } from "react";
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
import Grade from "../Grade/Grade";
import { Pagination } from "./Pagination";
import { Ascent } from "../Ascent/Ascent";
import { TableHeader, TableRow } from "../Table/Table";

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
    active ? styles.isActiveToggleDetails : null
  }`;

  return (
    <span onClick={() => toggleHandler(boulderId)} className={style}>
      {children} <Forward />
    </span>
  );
};

const WallLink = ({ name, onClick }) =>
  useMemo(() => {
    return (
      <span className={styles.wallLink} onClick={onClick}>
        {name}
      </span>
    );
  }, [name]);

const BoulderTable = ({
  columns,
  data,
  onSelectRows,
  globalFilter,
  filters,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
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
    useRowSelect
  );

  useEffect(() => {
    setAllFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (onSelectRows) {
      onSelectRows(selectedFlatRows.map((item) => item.original.id));
    }
  }, [selectedFlatRows]);

  useEffect(() => {
    setGlobalFilter(globalFilter);
  }, [globalFilter]);

  const gridTemplateColumns = useMemo(() => {
    return columns.map((column) => column.gridTemplate).join(" ");
  }, [columns]);

  return useMemo(() => {
    return (
      <Fragment>
        <div className={styles.root} {...getTableProps()}>
          <TableHeader
            headerGroups={headerGroups}
            gridTemplateColumns={gridTemplateColumns}
          />

          <div {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);

              return (
                <TableRow
                  gridTemplateColumns={gridTemplateColumns}
                  cells={row.cells}
                  key={`row-${index}`}
                />
              );
            })}
          </div>
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
      </Fragment>
    );
  }, [data, onSelectRows, globalFilter, filters]);
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
  selection: {
    id: "selection",
    gridTemplate: "40px",
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <div>
        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
      </div>
    ),
  },
  holdType: {
    id: "holdType",
    accessor: "holdType",
    Header: "Hold",
    gridTemplate: "minmax(20px, 60px)",
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
    gridTemplate: "80px",
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
    gridTemplate: "60px",
    sortType: (a, b) => {
      return a.values.points > b.values.points ? -1 : 1;
    },
  },
  name: {
    id: "name",
    accessor: "name",
    Header: "Name",
    gridTemplate: "auto",
  },
  startWall: {
    id: "start",
    accessor: "startWall",
    Header: "Start",
    gridTemplate: "140px",
    sortType: (a, b) => (a.values.start.name > b.values.start.name ? -1 : 1),
    filter: (rows, id, filterValue) =>
      rows.filter((row) => row.values[id].name === filterValue),
  },
  endWall: {
    id: "end",
    accessor: "endWall",
    Header: "End",
    gridTemplate: "140px",
    sortType: (a, b) => (a.values.end.name > b.values.end.name ? -1 : 1),
    filter: (rows, id, filterValue) =>
      rows.filter((row) => row.values[id].name === filterValue),
  },
  setters: {
    id: "setter",
    accessor: ({ setters }) =>
      setters.map((setter) => setter.username).join(", "),
    Header: "Setter",
    gridTemplate: "140px",
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => row.values[id].includes(filterValue));
    },
  },
  date: {
    id: "date",
    accessor: "created_at",
    Header: "Date",
    gridTemplate: "100px",
    sortType: (a, b) => (a.timestamp > b.timestamp ? -1 : 1),
    Cell: ({ value }) => value.string,
  },
  ascent: {
    id: "ascent",
    accessor: "ascent",
    Header: "Ascent",
    gridTemplate: "152px",
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

export { BoulderTable, DetailToggle, WallLink, boulderTableColumns, Ascents };
