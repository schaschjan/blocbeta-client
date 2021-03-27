import React, { Fragment, useContext, useMemo } from "react";
import Progress from "../../components/Progress/Progress";
import { Meta } from "../../App";
import moment from "moment";
import Avatar from "../../components/Avatar/Avatar";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { Button } from "../../components/Button/Button";
import Male from "../../components/Icon/Male";
import Female from "../../components/Icon/Female";
import calculatePercentage from "../../helper/calculatePercentage";
import useRequest from "../../hooks/useRequest";
import { RankingTable } from "../../components/RankingTable/RankingTable";

const AllTime = () => {
  const { user, contextualizedPath } = useContext(BoulderDBUIContext);

  const { data: ranking } = useRequest(`/ranking/all-time`);
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
                <span className="rank-badge">🥋</span>
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
        Header: "Boulders",
        accessor: "boulders",
        gridTemplate: "110px",
        Cell: ({ cell }) => {
          const percentage = (cell.value / boulderCount) * 100;

          return <Progress percentage={percentage} />;
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
                `/compare/${user.id}/to/${cell.value}/at/AllTime`
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
      <Meta title="AllTime Ranking" />

      <RankingTable data={ranking ? ranking.list : []} columns={columns} />
    </Fragment>
  );
};

export { AllTime };
