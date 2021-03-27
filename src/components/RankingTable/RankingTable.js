import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import React, { Fragment, useMemo } from "react";
import styles from "../../views/Compare/Current.module.css";
import { Input } from "../Input/Input";
import { TableHeader, TableRow } from "../Table/Table";
import { Pagination } from "../BoulderTable/Pagination";

const RankingTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    headerGroups,
    setGlobalFilter,
    page,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const gridTemplateColumns = useMemo(() => {
    return columns.map((column) => column.gridTemplate).join(" ");
  }, [columns]);

  return (
    <Fragment>
      <div className={styles.search}>
        <Input
          onChange={(event) => setGlobalFilter(event.target.value)}
          className={styles.searchInput}
          onClear={() => setGlobalFilter("")}
          placeholder={"search"}
        />
      </div>

      <div {...getTableProps()}>
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
};

export { RankingTable };
