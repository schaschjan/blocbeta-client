import React, { Fragment, useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Meta } from "../../App";
import useRequest from "../../hooks/useRequest";
import { usePagination, useSortBy, useTable } from "react-table";
import { TableHeader, TableRow } from "../../components/Table/Table";
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
import { AscentIcon } from "../../components/Ascent/Ascent";
import { Pagination } from "../../components/BoulderTable/Pagination";

const Current = () => {
  const { a, b } = useParams();

  const { isAdmin } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  const { boulders } = useBoulders();
  const { data: comparisons } = useRequest(`/compare/${a}/to/${b}/at/current`);
  const { data: compareUser } = useRequest(`/user/${b}`, false);

  const [detailBoulder, setDetailBoulder] = useState(null);

  const columns = useMemo(() => {
    return [
      {
        ...boulderTableColumns.holdType,
        gridTemplate: "minmax(20px, 60px)",
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
        gridTemplate: "140px",
        Cell: ({ value }) => <AscentIcon type={value} />,
      },
      {
        Header: compareUser.username,
        accessor: "b",
        gridTemplate: "140px",
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
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    headerGroups,
    page,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useSortBy,
    usePagination
  );

  const gridTemplateColumns = columns
    .map((column) => column.gridTemplate)
    .join(" ");

  return (
    <Fragment>
      <Meta title="Compare" />

      <h1 className="t--alpha page-title">Compare</h1>

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

      <Drawer onClose={() => setDetailBoulder(null)}>
        {detailBoulder && <BoulderDetails id={detailBoulder} />}
      </Drawer>
    </Fragment>
  );
};

export { Current };
