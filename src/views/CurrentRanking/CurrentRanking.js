import React, {Fragment, useContext, useMemo} from "react";
import {useApiV2} from "../../hooks/useApi";
import {useQuery} from "react-query";
import RankingTable from "../../components/RankingTable/RankingTable";
import EmptyState from "../../components/EmptyState/EmptyState";
import Emoji from "../../components/Emoji/Emoji";
import Progress from "../../components/Progress/Progress";
import {getPercentage} from "../../helpers";
import {Meta} from "../../App";
import Paragraph from "../../components/Paragraph/Paragraph";
import moment from "moment";
import Avatar from "../../components/Avatar/Avatar";
import "./CurrentRanking.css";
import Button from "../../components/Button/Button";
import {Female, Male} from "../../components/Icon/Icons";
import {Loader} from "../../index";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";

export default () => {
  const {user, contextualizedPath} = useContext(BlocBetaUIContext);

  const {
    status: rankingStatus,
    data: ranking
  } = useQuery("currentRanking", useApiV2("currentRanking"));

  const {
    status: boulderCountStatus,
    data: boulderCount
  } = useQuery("boulderCount", useApiV2("boulderCount"));

  const columns = useMemo(() => {

    return [
      {
        Header: "Rank",
        accessor: "rank",
        className: `table-cell--rank`,
        Cell: ({row}) => {
          return <strong>{row.index++}</strong>;
        },
      },
      {
        Header: "User",
        accessor: "user.username",
        className: "table-cell--user",
        Cell: ({cell, row}) => {
          return (
            <Fragment>
              <Avatar user={row.original.user}/>
              {cell.value}

              {row.original.boulder === boulderCount && <span className='rank-badge'>🥋</span>}
            </Fragment>
          );
        },
      },
      {
        Header: "Gender",
        accessor: "user.gender",
        Cell: ({cell}) => {

          if (cell.value === "male") {
            return <Male/>
          }

          if (cell.value === "female") {
            return <Female/>
          }

          return "-"
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
        Cell: ({cell}) => {
          const percentage = (cell.value / boulderCount) * 100;

          return <Progress percentage={percentage}/>;
        },
      },
      {
        Header: "Flashed",
        accessor: "flashes",
        Cell: ({cell}) => getPercentage(cell.value, boulderCount),
      },
      {
        Header: "Topped",
        accessor: "tops",
        Cell: ({cell}) => getPercentage(cell.value, boulderCount),
      },
      {
        Header: "Last activity",
        accessor: "user.lastActivity",
        Cell: ({cell}) => {
          return <Paragraph>{moment(cell.value).fromNow()}</Paragraph>;
        },
      },
      {
        Header: "",
        id: "user.id",
        accessor: "user.id",
        className: "table-cell--actions",
        Cell: ({cell}) => {
          if (parseInt(cell.value) === parseInt(user.id)) {
            return null
          }

          return (
            <Button asLink={true}
                    variant="text"
                    to={contextualizedPath(`/compare/${user.id}/to/${cell.value}/at/current`)}>
              Compare
            </Button>
          );
        }
      },
    ];
  }, [user.id, boulderCount]);

  if ([rankingStatus, boulderCountStatus].includes("loading")) return <Loader/>;


  return (
    <Fragment>
      <Meta title="Current Ranking"/>

      <h1 className="t--alpha page-title">
        Current Ranking
      </h1>

      {ranking.list.length > 0 ? (
        <RankingTable
          data={ranking.list}
          columns={columns}
          className={"current"}
        />
      ) : (
        <EmptyState>
          <h2>
            No one here… <Emoji>🤷</Emoji>
          </h2>
        </EmptyState>
      )}
    </Fragment>
  );
};
