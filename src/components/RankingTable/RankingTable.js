import { useGlobalFilter, useSortBy, useTable } from "react-table";
import React, { Fragment, useMemo } from "react";
import { Input } from "../Input/Input";
import { TableHeader, TableRow } from "../Table/Table";
import Avatar from "../Avatar/Avatar";
import Emoji from "../Emoji/Emoji";
import styles from "./RankingTable.module.css";

const UserRank = ({ image, username, sentAllBoulders = false }) => {
  return (
    <Fragment>
      <Avatar image={image} />
      <span className={styles.rankUsername}>{username}</span>

      {sentAllBoulders && (
        <span className={styles.rankBadge}>
          <Emoji>🥋</Emoji>
        </span>
      )}
    </Fragment>
  );
};

const RankingTable = ({ columns, data, rowClassName, headerClassName }) => {
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
          className={headerClassName}
          headerGroups={headerGroups}
          gridTemplateColumns={gridTemplateColumns}
        />

        <div {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);

            return (
              <TableRow
                className={rowClassName}
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

export { RankingTable, UserRank };
