import React, { useContext, useEffect } from "react";
import { Loader } from "../../components/Loader/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import useApi, { api, cacheKeys } from "../../hooks/useApi";
import { AppContext, Meta } from "../../App";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import Wrapper from "../../components/Wrapper/Wrapper";
import { queryCache } from "react-query";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, locationPath } = useContext(AppContext);

  const { status: resetStatus, data: rotation } = useApi(
    cacheKeys.stats.resetRotation,
    api.stats.resetRotation
  );

  const { status: boulderStatus, data: boulders } = useApi(
    cacheKeys.stats.boulder,
    api.stats.boulder
  );

  const { status: wallStatus, data: walls } = useApi(
    cacheKeys.walls,
    api.walls.all
  );

  const { status: rankingStatus, data: ranking } = useApi(
    cacheKeys.ranking.current,
    api.ranking.current
  );

  useEffect(() => {
    const prefetch = async () => {
      await queryCache.prefetchQuery(cacheKeys.boulders, api.boulder.active);
      await queryCache.prefetchQuery(cacheKeys.setters, api.setters.all);
      await queryCache.prefetchQuery(cacheKeys.walls, api.walls.all);
      await queryCache.prefetchQuery(cacheKeys.holdStyles, api.holdStyles.all);
      await queryCache.prefetchQuery(cacheKeys.tags, api.tags.all);
    };

    prefetch();

    api.ping();

  }, []);

  const loading = [
    resetStatus,
    wallStatus,
    boulderStatus,
    rankingStatus,
  ].includes("loading");

  if (loading) return <Loader />;

  let rank = ranking.find((rank) => {
    return rank.user.id == user.id;
  });

  if (!rank) {
    rank = {
      rank: "–",
      boulders: 0,
      flashes: 0,
      tops: 0,
    };
  }

  const rotationStats = walls.map((wall) => {
    const reset = rotation.find((reset) => reset.id === wall.id);

    return {
      wall: wall,
      averageSetDate: reset ? moment(reset.averageSetDate) : null,
    };
  });

  rotationStats.sort((a, b) => {
    return a.averageSetDate < b.averageSetDate ? -1 : 1;
  });

  console.log(boulders);

  return (
    <div className="container">
      <Meta title="Dashboard" />
      <PageHeader title={`Hello ${user.username}!`} />

      <Wrapper>
        <div className="tiles">
          <div>
            <Link
              to={{
                pathname: locationPath("/boulder"),
                search: "?ascent=todo",
                state: { fromDashboard: true },
              }}
            >
              <h2>All ({boulders.activeBoulders})</h2>
            </Link>

            <Link
              to={{
                pathname: locationPath("/boulder"),
                search: "?ascent=todo",
                state: { fromDashboard: true },
              }}
            >
              <h2>Todos ({boulders.activeBoulders - rank.boulders})</h2>
            </Link>

            <Link
              to={{
                pathname: locationPath("/boulder"),
                search: "?ascent=todo&date=new",
                state: { fromDashboard: true },
              }}
            >
              <h2>New Boulders ({boulders.newBoulders})</h2>
            </Link>
          </div>

          <div>
            <h2>Rank {rank.rank}</h2>

            <h2>
              Flashrate{" "}
              {rank.boulders > 0
                ? Math.floor((rank.flashes / rank.boulders) * 100)
                : 0}
              %
            </h2>

            <h2>
              Boulders{" "}
              {Math.floor((rank.boulders / boulders.activeBoulders) * 100)}% (
              {rank.boulders} of {boulders.activeBoulders})
            </h2>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default Dashboard;
