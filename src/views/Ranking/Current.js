import React, { Fragment, useContext, useMemo } from "react";
import Progress from "../../components/Progress/Progress";
import { Meta } from "../../App";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import Male from "../../components/Icon/Male";
import Female from "../../components/Icon/Female";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useRequest } from "../../hooks/useRequest";
import calculatePercentage from "../../helper/calculatePercentage";
import { Loader } from "../../components/Loader/Loader";
import {
  RankingTable,
  UserRank,
} from "../../components/RankingTable/RankingTable";
import styles from "./Current.module.css";
import { joinClassNames } from "../../helper/classNames";
import typography from "../../css/typography.module.css";
import { AccessDenied } from "../../components/AccessDenied/AccessDenied";
import {parseDate} from "../../helper/parseDate";

const Current = () => {
  const { user, contextualizedPath } = useContext(BoulderDBUIContext);

  const { data: ranking } = useRequest(`/ranking/current`);
  const { data: boulderCount } = useRequest(`/boulder/count`, true, {
    params: { active: true },
  });

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
        Cell: ({ cell, row }) => (
          <UserRank
            username={cell.value}
            image={row.original.user.image}
            sentAllBoulders={row.original.boulder === boulderCount}
          />
        ),
      },
      {
        Header: "Gender",
        accessor: "user.gender",
        gridTemplate: "80px",
        className: styles.genderCell,
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
        className: styles.pointsCell,
      },
      {
        Header: "Advance",
        accessor: "advance",
        gridTemplate: "100px",
        className: styles.advanceCell,
      },
      {
        Header: "Boulders",
        accessor: "boulders",
        gridTemplate: "110px",
        className: styles.bouldersCell,
        Cell: ({ cell }) => {
          return <Progress percentage={(cell.value / boulderCount) * 100} />;
        },
      },
      {
        Header: "Flashed",
        accessor: "flashes",
        gridTemplate: "100px",
        className: styles.flashedCell,
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Topped",
        accessor: "tops",
        gridTemplate: "100px",
        className: styles.toppedCell,
        Cell: ({ cell }) => calculatePercentage(cell.value, boulderCount),
      },
      {
        Header: "Last activity",
        accessor: "user.lastActivity",
        gridTemplate: "100px",
        className: styles.lastActivityCell,
        Cell: ({ cell }) => {
          return <span>{parseDate(cell.value)}</span>;
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

  if (!user.visible) {
    return <AccessDenied />;
  }

  return (
    <Fragment>
      <Meta title="Current Ranking" />

      <RankingTable
        data={ranking.list}
        columns={columns}
        rowClassName={styles.tableRow}
        headerClassName={styles.tableHeader}
      />

      <Link
        className={joinClassNames(styles.allTimeLink, typography.eta)}
        to={contextualizedPath("/ranking/all-time")}
      >
        All time ranking
      </Link>
    </Fragment>
  );
};

export { Current };
