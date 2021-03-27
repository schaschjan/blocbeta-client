import React, { Fragment, useContext, useMemo } from "react";
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
import useRequest from "../../hooks/useRequest";
import calculatePercentage from "../../helper/calculatePercentage";
import { Loader } from "../../components/Loader/Loader";
import { RankingTable } from "../../components/RankingTable/RankingTable";

const Current = () => {
  const { user, contextualizedPath } = useContext(BoulderDBUIContext);

  const { data: ranking } = useRequest(`/ranking/current`);
  const { data: boulderCount } = useRequest(`/boulder/count`);

  const columns = useMemo(() => {
    return [
      {
        Header: "Rank",
        accessor: "rank",
        gridTemplate: "60px",
        Cell: ({ value }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        Header: "User",
        accessor: "user.username",
        gridTemplate: "minmax(70px, auto)",
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
        gridTemplate: "100px",
      },
      {
        Header: "Advance",
        accessor: "advance",
        gridTemplate: "100px",
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
        gridTemplate: "100px",
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Topped",
        accessor: "tops",
        gridTemplate: "100px",
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Last activity",
        accessor: "user.lastActivity",
        gridTemplate: "100px",
        Cell: ({ cell }) => {
          return <span>{moment(cell.value).fromNow()}</span>;
        },
      },
      {
        Header: "",
        id: "user.id",
        accessor: "user.id",
        gridTemplate: "100px",
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

  if (!ranking || !boulderCount) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Meta title="Current Ranking" />

      <RankingTable data={ranking.list} columns={columns} />

      <Link className={"t--eta"} to={contextualizedPath("/ranking/all-time")}>
        All time ranking
      </Link>
    </Fragment>
  );
};

export { Current };
