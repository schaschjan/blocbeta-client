import React, {useContext, useMemo} from "react";
import {Loader} from "../../components/Loader/Loader";
import "./Current.css";
import Container from "../../components/Container/Container";
import useApi, {api, cache} from "../../hooks/useApi";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import Emoji from "../../components/Emoji/Emoji";
import Wrapper from "../../components/Wrapper/Wrapper";
import RankingTable from "../../components/RankingTable/RankingTable";
import {useParams} from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import {AppContext, Meta} from "../../App";
import {resolveBoulders} from "../../helpers";
import Paragraph from "../../components/Paragraph/Paragraph";

const Current = () => {
  const {a, b} = useParams();
  const {user} = useContext(AppContext);

  const {status: comparisonStatus, data: comparisons} = useApi(
    [cache.compare, b],
    () => api.compare.current(a, b)
  );
  const {status: compareUserStatus, data: compareUser} = useApi(
    [cache.user, b],
    () => api.user.show(b)
  );
  const {status: bouldersStatus, data: boulders} = useApi(
    cache.boulder,
    api.boulder.active
  );
  const {status: wallsStatus, data: walls} = useApi(
    cache.walls,
    api.walls.all
  );
  const {status: gradesStatus, data: grades} = useApi(
    cache.grades,
    api.grades.all
  );
  const {status: holdTypesStatus, data: holdTypes} = useApi(
    cache.holdTypes,
    api.holdTypes.all
  );

  const resolvedBoulders = useMemo(() => {
    return resolveBoulders(boulders, null, grades, walls, holdTypes, null);
  }, [boulders, grades, walls, holdTypes]);

  const data = useMemo(() => {
    if (!comparisons || !resolvedBoulders) {
      return;
    }

    comparisons.forEach((comparison) => {
      comparison.boulder = resolvedBoulders.find(
        (boulder) => boulder.id === comparison.subject
      );
    });

    return comparisons;
  }, [comparisons, resolvedBoulders]);

  if (!data) return <Loader/>;

  const columns = [
    // {
    //   id: "holdType",
    //   Header: "holdType",
    //   accessor: "holdType.name",
    //   className: `table-cell--holdType`,
    //   Cell: ({ row }) => {
    //     return (
    //         <HoldStyle
    //             name={row.original.holdType.name}
    //             icon={row.original.holdType.icon}
    //         />
    //     );
    //   },
    // },
    // {
    //   id: "grade",
    //   Header: "Grade",
    //   accessor: "grade.name",
    //   className: `table-cell--grade`,
    //   Cell: ({ row }) => {
    //     return (
    //         <Grade
    //             name={row.original.grade.name}
    //             color={row.original.grade.color}
    //         />
    //     );
    //   },
    // },
    {
      id: "points",
      Header: "Points",
      accessor: "points",
      className: `table-cell--points`,
      Cell: ({cell}) => <Paragraph>{cell.value} pts</Paragraph>,
    },
    {
      Header: "Name",
      accessor: "boulder.name",
    },
    {
      id: "start",
      Header: "Start",
      accessor: "boulder.startWall.name",
    },
    {
      id: "end",
      Header: "End",
      accessor: "boulder.endWall.name",
    },
    {
      Header: user.username,
      accessor: "a",
      Cell: ({cell}) => {
        return <Icon name={cell.value ? cell.value : "todo"}/>;
      },
    },
    {
      Header: compareUser.username,
      accessor: "b",
      Cell: ({cell}) => {
        return <Icon name={cell.value ? cell.value : "todo"}/>;
      },
    },
    {
      Header: "Comparison",
      Cell: ({cell}) => {
        const {positionA, positionB} = cell.row.original;

        if (positionA > positionB) {
          return <span>+</span>;
        }

        if (positionA < positionB) {
          return <span>-</span>;
        }

        return <span>=</span>;
      },
    },
  ];

  return (
    <Container>
      <Meta title={"Compare"}/>
      <PageHeader title={"Compare"}/>

      <Wrapper>
        {data && data.length > 0 ? (
          <RankingTable data={data} columns={columns} className={"compare"}/>
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

export {Current};
