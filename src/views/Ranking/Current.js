import React, { Fragment, useContext, useMemo } from "react";
import { useApi } from "../../hooks/useApi";
import { useQuery } from "react-query";
import Emoji from "../../components/Emoji/Emoji";
import Progress from "../../components/Progress/Progress";
import { Meta } from "../../App";
import moment from "moment";
import Avatar from "../../components/Avatar/Avatar";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import "./Current.css";
import Male from "../../components/Icon/Male";
import Female from "../../components/Icon/Female";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useSortBy, useTable } from "react-table";
import { TableHeader, TableRow } from "../../components/Table/Table";
import { LoadedContent } from "../../components/Loader/Loader";

const calculatePercentage = (amount, total) => {
  let percentage = 0;

  if (amount > 0) {
    percentage = (amount / total) * 100;
  }

  if (percentage === 0) {
    return `${amount} (0%)`;
  }

  if (percentage < 1) {
    return `${amount} (<1%)`;
  }

  return `${amount} (${Math.floor(percentage)}%)`;
};

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const gridTemplateColumns = columns
    .map((column) => column.gridTemplate)
    .join(" ");

  return (
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
  );
};

const Current = () => {
  const { user, contextualizedPath } = useContext(BoulderDBUIContext);

  const { status: rankingStatus, data: ranking } = useQuery(
    "currentRanking",
    useApi("currentRanking")
  );

  const { data: boulderCount } = useQuery(
    "boulderCount",
    useApi("boulderCount")
  );

  const columns = useMemo(() => {
    return [
      {
        Header: "Rank",
        accessor: "rank",
        gridTemplate: "72px",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: "User",
        accessor: "user.username",
        gridTemplate: "auto",
        Cell: ({ cell, row }) => {
          return (
            <Fragment>
              <Avatar image={row.original.user.image} />
              <span className="rank-username">{cell.value}</span>

              {row.original.boulder === boulderCount && (
                <span className="rank-badge">
                  <Emoji>🥋</Emoji>
                </span>
              )}
            </Fragment>
          );
        },
      },
      {
        Header: "Gender",
        accessor: "user.gender",
        gridTemplate: "80px",
        Cell: ({ cell }) => {
          if (cell.value === "male") {
            return <Male />;
          }

          if (cell.value === "female") {
            return <Female />;
          }

          return "-";
        },
      },
      {
        Header: "Points",
        accessor: "score",
        gridTemplate: "110px",
      },
      {
        Header: "Advance",
        accessor: "advance",
        gridTemplate: "110px",
      },
      {
        Header: "Boulders",
        accessor: "boulders",
        gridTemplate: "110px",
        Cell: ({ cell }) => {
          return <Progress percentage={(cell.value / boulderCount) * 100} />;
        },
      },
      {
        Header: "Flashed",
        accessor: "flashes",
        gridTemplate: "110px",
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Topped",
        accessor: "tops",
        gridTemplate: "110px",
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Last activity",
        accessor: "user.lastActivity",
        gridTemplate: "120px",
        Cell: ({ cell }) => {
          return <span>{moment(cell.value).fromNow()}</span>;
        },
      },
      {
        Header: "",
        id: "user.id",
        accessor: "user.id",
        gridTemplate: "120px",
        Cell: ({ cell }) => {
          if (parseInt(cell.value) === parseInt(user.id)) {
            return null;
          }

          return (
            <Button
              asLink={true}
              variant="primary"
              size="small"
              to={contextualizedPath(
                `/compare/${user.id}/to/${cell.value}/at/current`
              )}
            >
              Compare
            </Button>
          );
        },
      },
    ];
  }, [boulderCount]);

  return (
    <Fragment>
      <Meta title="Current Ranking" />
      <h1 className="t--alpha page-title">Current Ranking</h1>

      <LoadedContent loading={rankingStatus !== "success"}>
        <Table data={ranking ? ranking.list : []} columns={columns} />
      </LoadedContent>

      <Link className={"t--eta"} to={contextualizedPath("/ranking/all-time")}>
        All time ranking
      </Link>
    </Fragment>
  );
};

export { Current };
