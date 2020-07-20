import React, { Fragment, useContext } from "react";
import { Loader } from "../../../components/Loader/Loader";
import Avatar from "../../../components/Avatar/Avatar";
import Paragraph from "../../../components/Paragraph/Paragraph";
import moment from "moment";
import "./Current.css";
import Icon from "../../../components/Icon/Icon";
import Container from "../../../components/Container/Container";
import useApi, { api, cacheKeys } from "../../../hooks/useApi";
import { PageHeader } from "../../../components/PageHeader/PageHeader";
import EmptyState from "../../../components/EmptyState/EmptyState";
import Emoji from "../../../components/Emoji/Emoji";
import Wrapper from "../../../components/Wrapper/Wrapper";
import RankingTable from "../../../components/RankingTable/RankingTable";
import Progress from "../../../components/Progress/Progress";
import { getPercentage } from "../../../helpers";
import { Link } from "react-router-dom";
import { AppContext, Meta } from "../../../App";

const Actions = ({ b }) => {
  const { user, locationPath } = useContext(AppContext);
  const a = user.id;

  return (
    <Link to={locationPath(`/compare/${a}/to/${b}/at/current`)}>Compare</Link>
  );
};

const Current = () => {
  const { status: rankingStatus, data: ranking } = useApi(
    cacheKeys.ranking.current,
    api.ranking.current
  );

  const { status: bouldersStatus, data: boulders } = useApi(
    cacheKeys.boulders,
    api.boulder.active
  );

  if ([rankingStatus, bouldersStatus].includes("loading")) return <Loader />;

  const columns = [
    {
      Header: "Rank",
      accessor: "rank",
      className: `table-cell--rank`,
      Cell: ({ cell }) => {
        return <strong>{cell.value}</strong>;
      },
    },
    {
      Header: "User",
      accessor: "user.username",
      className: "table-cell--user",
      Cell: ({ cell, row }) => {
        return (
          <Fragment>
            <Avatar user={row.original.user} />
            {cell.value}

            {row.original.boulder === boulders.length && <span> s🥋</span>}
          </Fragment>
        );
      },
    },
    {
      Header: "Gender",
      accessor: "user.gender",
      Cell: ({ cell }) => {
        return <Icon name={cell.value} />;
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
        const percentage = (cell.value / boulders.length) * 100;

        return <Progress percentage={percentage} />;
      },
    },
    {
      Header: "Flashed",
      accessor: "flashes",
      Cell: ({ cell }) => getPercentage(cell.value, boulders.length),
    },
    {
      Header: "Topped",
      accessor: "tops",
      Cell: ({ cell }) => getPercentage(cell.value, boulders.length),
    },
    {
      Header: "Last activity",
      accessor: "user.lastActivity",
      Cell: ({ cell }) => {
        return <Paragraph>{moment(cell.value).fromNow()}</Paragraph>;
      },
    },
    {
      Header: "",
      id: "user.id",
      accessor: "user.id",
      className: "table-cell--actions",
      Cell: ({ cell }) => <Actions b={cell.value} />,
    },
  ];

  return (
    <Container>
      <Meta title="Current Ranking" />
      <PageHeader title="Current Ranking" />

      <Wrapper>
        {ranking.length > 0 ? (
          <RankingTable
            data={ranking}
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
      </Wrapper>
    </Container>
  );
};

export default Current;
