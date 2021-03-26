import React, { Fragment, useContext, useMemo } from "react";
import { useApi } from "../../hooks/useApi";
import { useQuery } from "react-query";
import EmptyState from "../../components/EmptyState/EmptyState";
import Emoji from "../../components/Emoji/Emoji";
import Progress from "../../components/Progress/Progress";
import { Meta } from "../../App";
import moment from "moment";
import Avatar from "../../components/Avatar/Avatar";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { LoadedContent } from "../../components/Loader/Loader";
import "./AllTime.css";
import { Button } from "../../components/Button/Button";
import Male from "../../components/Icon/Male";
import Female from "../../components/Icon/Female";
import { Link } from "react-router-dom";

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

const AllTime = () => {
  const { user, contextualizedPath } = useContext(BoulderDBUIContext);

  const { status: rankingStatus, data: ranking } = useQuery(
    "allTimeRanking",
    useApi("allTimeRanking")
  );

  const { status: boulderCountStatus, data: boulderCount } = useQuery(
    "boulderCount",
    useApi("boulderCount")
  );

  const columns = useMemo(() => {
    return [
      {
        Header: "Rank",
        accessor: "rank",
        className: `table-cell--rank`,
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: "User",
        accessor: "user.username",
        className: "table-cell--user",
        Cell: ({ cell, row }) => {
          return (
            <Fragment>
              <Avatar image={row.original.user.image} />
              <span className="rank-username">{cell.value}</span>

              {row.original.boulder === boulderCount && (
                <span className="rank-badge">🥋</span>
              )}
            </Fragment>
          );
        },
      },
      {
        Header: "Gender",
        accessor: "user.gender",
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
      },
      {
        Header: "Advance",
        accessor: "advance",
      },
      {
        Header: "Boulders",
        accessor: "boulders",
        className: "table-cell--boulders",
        Cell: ({ cell }) => {
          const percentage = (cell.value / boulderCount) * 100;

          return <Progress percentage={percentage} />;
        },
      },
      {
        Header: "Flashed",
        accessor: "flashes",
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Topped",
        accessor: "tops",
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Last activity",
        accessor: "user.lastActivity",
        Cell: ({ cell }) => {
          return <span>{moment(cell.value).fromNow()}</span>;
        },
      },
      {
        Header: "",
        id: "user.id",
        accessor: "user.id",
        className: "table-cell--actions",
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
                `/compare/${user.id}/to/${cell.value}/at/AllTime`
              )}
            >
              Compare
            </Button>
          );
        },
      },
    ];
  }, [user.id, boulderCount]);

  return (
    <Fragment>
      <Meta title="AllTime Ranking" />
      <h1 className="t--alpha page-title">AllTime Ranking</h1>

      <LoadedContent
        loading={[rankingStatus, boulderCountStatus].includes("loading")}
      >
        {ranking && ranking.list && ranking.list.length > 0 ? (
          <Fragment>
            <br />

            <Link
              className={"t--eta"}
              to={contextualizedPath("/ranking/all-time")}
            >
              All time ranking
            </Link>
          </Fragment>
        ) : (
          <EmptyState>
            <h2 className="t--gamma">
              <Emoji>🤷</Emoji>
            </h2>
          </EmptyState>
        )}
      </LoadedContent>
    </Fragment>
  );
};

export { AllTime };
