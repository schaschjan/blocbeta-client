import React, { Fragment, useContext, useMemo, useState } from "react";
import "./Current.module.css";
import { useParams } from "react-router-dom";
import { Meta } from "../../App";
import useRequest from "../../hooks/useRequest";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { Input } from "../../components/Input/Input";
import { TableCell, TableHeaderCell } from "../../components/Table/Table";
import styles from "./Current.module.css";
import Downward from "../../components/Icon/Downward";
import Upward from "../../components/Icon/Upward";
import { useBoulders } from "../../hooks/useBoulders";
import {
  boulderTableColumns,
  DetailToggle,
} from "../../components/BoulderTable/BoulderTable";
import HoldType from "../../components/HoldStyle/HoldType";
import Grade from "../../components/Grade/Grade";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import BoulderDetails from "../../components/BoulderDetails/BoulderDetails";
import { Drawer, DrawerContext } from "../../components/Drawer/Drawer";
import { Ascent, AscentIcon } from "../../components/Ascent/Ascent";

const Current = () => {
  const { a, b } = useParams();

  const { isAdmin } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  const { idle, boulders } = useBoulders();
  const { data: comparisons } = useRequest(`/compare/${a}/to/${b}/at/current`);
  const { data: compareUser } = useRequest(`/user/${b}`, false);

  const [detailBoulder, setDetailBoulder] = useState(null);

  const columns = useMemo(() => {
    return [
      {
        ...boulderTableColumns.holdType,
        gridTemplate: "minmax(20px, 40px)",
        Cell: ({ value }) => <HoldType image={value.image} />,
      },
      {
        ...boulderTableColumns.grade,
        gridTemplate: "80px",
        Cell: ({ value }) => {
          if (isAdmin && value.internal) {
            return (
              <Grade
                name={value.name}
                color={value.color}
                internalName={value.internal.name}
                internalColor={value.internal.color}
              />
            );
          }

          return <Grade name={value.name} color={value.color} />;
        },
      },
      {
        ...boulderTableColumns.points,
        gridTemplate: "60px",
        Cell: ({ value }) => `${value} pts`,
      },
      {
        ...boulderTableColumns.name,
        gridTemplate: "auto",
        Cell: ({ value, row }) => {
          const boulderId = row.original.id;

          return (
            <DetailToggle
              active={detailBoulder === boulderId}
              boulderId={boulderId}
              toggleHandler={(id) => {
                setDetailBoulder(id);
                toggleDrawer(true);
              }}
            >
              {value}
            </DetailToggle>
          );
        },
      },
      {
        ...boulderTableColumns.startWall,
        gridTemplate: "140px",
      },
      {
        ...boulderTableColumns.endWall,
        gridTemplate: "140px",
      },
      {
        Header: "You",
        accessor: "a",
        gridTemplate: "60px",
        Cell: ({ value }) => <AscentIcon type={value} />,
      },
      {
        Header: compareUser.username,
        accessor: "b",
        gridTemplate: "60px",
        Cell: ({ value }) => <AscentIcon type={value} />,
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

      <Drawer onClose={() => setDetailBoulder(null)}>
        {detailBoulder && <BoulderDetails id={detailBoulder} />}
      </Drawer>
    </Fragment>
  );
};

export { Current };
