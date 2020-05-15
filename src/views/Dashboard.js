import React, { useContext, useEffect } from "react";
import { Loader } from "../components/Loader/Loader";
import moment from "moment";
import { messages } from "../messages";
import { Link } from "react-router-dom";
import useApi, { api, cacheKeys } from "../hooks/useApi";
import { AppContext } from "../App";
import { PageHeader } from "../components/PageHeader/PageHeader";
import Wrapper from "../components/Wrapper/Wrapper";
import { queryCache } from "react-query";

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

  useEffect(() => {
    const prefetch = async () => {
      await queryCache.prefetchQuery(cacheKeys.boulders, api.boulder.active);
      await queryCache.prefetchQuery(cacheKeys.setters, api.setters.all);
      await queryCache.prefetchQuery(cacheKeys.walls, api.walls.all);
      await queryCache.prefetchQuery(cacheKeys.holdStyles, api.holdStyles.all);
      await queryCache.prefetchQuery(cacheKeys.tags, api.tags.all);
    };

    prefetch();
  }, []);

  const loading = [resetStatus, wallStatus, boulderStatus].includes("loading");

  if (loading) return <Loader />;

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

  return (
    <div className="container">
      <PageHeader title={`Hello ${user.username}!`} />

      <Wrapper>
        <h2>Reset Rotation</h2>
        <ul className="list-unstyled">
          {rotationStats.map((reset) => {
            let date = null;

            if (reset.averageSetDate) {
              date = `Last set: ${moment(reset.averageSetDate).fromNow()}`;
            } else {
              date = messages.reset;
            }

            return (
              <li>
                {reset.wall.name} {date}
              </li>
            );
          })}
        </ul>

        <h2>Boulders ({boulders.activeBoulders})</h2>
        <ul>
          <li>
            <Link
              to={{
                pathname: locationPath("/boulder"),
                search: "?ascent=todo",
                state: { fromDashboard: true },
              }}
            >
              Todo
            </Link>
          </li>

          <li>
            <Link
              to={{
                pathname: locationPath("/boulder"),
                search: "?ascent=todo&date=new",
                state: { fromDashboard: true },
              }}
            >
              New Todos
            </Link>
          </li>

          <li>
            <Link
              to={{
                pathname: locationPath("/boulder"),
                search: "?ascent=todo&date=new",
                state: { fromDashboard: true },
              }}
            >
              Projects
            </Link>
          </li>
        </ul>
      </Wrapper>
    </div>
  );
};

export default Dashboard;
