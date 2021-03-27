import React, { Fragment, useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Meta } from "../../App";
import useRequest from "../../hooks/useRequest";
import { useBoulders } from "../../hooks/useBoulders";
import {
  boulderTableColumns,
  DetailToggle,
} from "../../components/BoulderTable/BoulderTable";
import HoldType from "../../components/HoldStyle/HoldType";
import Grade from "../../components/Grade/Grade";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import BoulderDetails from "../../components/BoulderDetails/BoulderDetails";
import { Drawer, DrawerContext } from "../../components/Drawer/Drawer";
import { AscentIcon } from "../../components/Ascent/Ascent";
import convertToKeyValueObject from "../../helper/convertToKeyValueObject";
import styles from "./Current.module.css";
import { RankingTable } from "../../components/RankingTable/RankingTable";
import { Loader } from "../../components/Loader/Loader";

const Current = () => {
  const { a, b } = useParams();

  const { isAdmin } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  const { boulders } = useBoulders();

  const { data: comparisons } = useRequest(`/compare/${a}/to/${b}/at/current`);
  const { data: compareUser } = useRequest(`/user/${b}`, false);
  const { data: ranking } = useRequest(`/ranking/current`);

  const [detailBoulder, setDetailBoulder] = useState(null);

  const columns = useMemo(() => {
    return [
      {
        ...boulderTableColumns.holdType,
        gridTemplate: "minmax(20px, 60px)",
        Cell: ({ value }) => <HoldType image={value.image} />,
      },
      {
        ...boulderTableColumns.grade,
        gridTemplate: "80px",
        Cell: ({ value }) => {
          if (isAdmin && value.internal) {
            return (
              <Grade
                name={value.name}
                color={value.color}
                internalName={value.internal.name}
                internalColor={value.internal.color}
              />
            );
          }

          return <Grade name={value.name} color={value.color} />;
        },
      },
      {
        ...boulderTableColumns.points,
        gridTemplate: "60px",
        Cell: ({ value }) => `${value} pts`,
      },
      {
        ...boulderTableColumns.name,
        gridTemplate: "auto",
        Cell: ({ value, row }) => {
          const boulderId = row.original.id;

          return (
            <DetailToggle
              active={detailBoulder === boulderId}
              boulderId={boulderId}
              toggleHandler={(id) => {
                setDetailBoulder(id);
                toggleDrawer(true);
              }}
            >
              {value}
            </DetailToggle>
          );
        },
      },
      {
        ...boulderTableColumns.startWall,
        gridTemplate: "140px",
      },
      {
        ...boulderTableColumns.endWall,
        gridTemplate: "140px",
      },
      {
        Header: "You",
        accessor: "a",
        gridTemplate: "140px",
        Cell: ({ value }) => <AscentIcon type={value} />,
      },
      {
        Header: compareUser ? compareUser.username : "",
        accessor: "b",
        gridTemplate: "140px",
        Cell: ({ value }) => <AscentIcon type={value} />,
      },
    ];
  }, [compareUser]);

  const data = useMemo(() => {
    if (!comparisons) {
      return [];
    }

    const comparisonsMap = convertToKeyValueObject(comparisons, "subject");

    return boulders.map((boulder) => {
      return {
        ...boulder,
        ...comparisonsMap[boulder.id],
      };
    });
  }, [boulders, comparisons]);

  if (!ranking || !compareUser) {
    return <Loader />;
  }

  const userRank = ranking.list.find((rank) => rank.user.id === parseInt(a));
  const compareUserRank = ranking.list.find(
    (rank) => rank.user.id === parseInt(b)
  );

  return (
    <Fragment>
      <Meta title="Compare" />

      <div className={styles.header}>
        <div>
          <h2>You</h2>
          <p>
            <strong>rank</strong> {userRank.rank}
          </p>
          <p>
            <strong>score</strong> {userRank.score}
          </p>
          <p>
            <strong>boulders</strong> {userRank.boulders}
          </p>
          <p>
            <strong>flashes</strong> {userRank.flashes}
          </p>
          <p>
            <strong>tops</strong> {userRank.tops}
          </p>
        </div>

        <div>
          <h2>{compareUser.username}</h2>
          <p>
            <strong>rank</strong> {compareUserRank.rank}
          </p>
          <p>
            <strong>score</strong> {compareUserRank.score}
          </p>
          <p>
            <strong>boulders</strong> {compareUserRank.boulders}
          </p>
          <p>
            <strong>flashes</strong> {compareUserRank.flashes}
          </p>
          <p>
            <strong>tops</strong> {compareUserRank.tops}
          </p>
        </div>
      </div>

      <RankingTable data={data ? data : []} columns={columns} />

      <Drawer onClose={() => setDetailBoulder(null)}>
        {detailBoulder && <BoulderDetails id={detailBoulder} />}
      </Drawer>
    </Fragment>
  );
};

export { Current };
