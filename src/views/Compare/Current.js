import React, {useContext, useMemo} from "react";
import {Loader} from "../../components/Loader/Loader";
import "./Current.css";
import Container from "../../components/Container/Container";
import useApi, {api, cacheKeys} from "../../hooks/useApi";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import Emoji from "../../components/Emoji/Emoji";
import Wrapper from "../../components/Wrapper/Wrapper";
import RankingTable from "../../components/RankingTable/RankingTable";
import {useParams} from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import {AppContext} from "../../App";

const Current = () => {
  const {a, b} = useParams();
  const {user} = useContext(AppContext);

  const {status: comparisonStatus, data: comparisons} = useApi(
    [cacheKeys.compare, b],
    () => api.compare.current(a, b)
  );

  const {status: bouldersStatus, data: boulders} = useApi(
    cacheKeys.boulders,
    api.boulder.active
  );

  const {status: compareUserStatus, data: compareUser} = useApi(
    [cacheKeys.user, b],
    () => api.user.show(b)
  );

  const data = useMemo(() => {
    if (!comparisons || !boulders) {
      return
    }

    comparisons.forEach(comparison => {
      comparison.boulder = boulders.find(boulder => boulder.id === comparison.subject)
    });

    return comparisons

  }, [comparisons, boulders])

  console.log(data);

  const columns = [
    {
      Header: 'Name',
      accessor: "boulder.name",
    },
    {
      Header: user.username,
      accessor: "a",
      Cell: ({cell}) => {
        return <Icon name={cell.value ? cell.value : 'todo'}/>
      },
    },
    {
      Header: "B",
      accessor: "b",
      Cell: ({cell}) => {
        return <Icon name={cell.value ? cell.value : 'todo'}/>
      },
    },
  ];

  const loading = [
    comparisonStatus
  ].includes("loading");

  if (loading) return <Loader/>

  return (
    <Container>
      <PageHeader title={"Compare "}/>

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

export default Current;
