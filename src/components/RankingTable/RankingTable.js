import { useGlobalFilter, useSortBy, useTable } from "react-table";
import React, { Fragment, useMemo } from "react";
import styles from "../../views/Compare/Current.module.css";
import { Input } from "../Input/Input";
import { TableHeader, TableRow } from "../Table/Table";

const RankingTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    headerGroups,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
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
          {rows.map((row, index) => {
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
    </Fragment>
  );
};

export { RankingTable };
