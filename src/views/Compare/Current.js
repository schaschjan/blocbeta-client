import React, {
  useCallback,
  Fragment,
  useContext,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { Meta } from "../../App";
import useRequest from "../../hooks/useRequest";
import { filterPresentOptions, useBoulders } from "../../hooks/useBoulders";
import {
  BoulderTable,
  boulderTableColumns,
  DetailToggle,
  WallLink,
} from "../../components/BoulderTable/BoulderTable";
import HoldType from "../../components/HoldStyle/HoldType";
import Grade from "../../components/Grade/Grade";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import BoulderDetails from "../../components/BoulderDetails/BoulderDetails";
import { Drawer, DrawerContext } from "../../components/Drawer/Drawer";
import { AscentIcon } from "../../components/Ascent/Ascent";
import convertToKeyValueObject from "../../helper/convertToKeyValueObject";
import styles from "./Current.module.css";
import { Loader } from "../../components/Loader/Loader";
import { WallDetails } from "../../components/WallDetails/WallDetails";
import {
  Filter,
  GlobalFilter,
  gradeFilterProps,
  holdTypeFilterProps,
  wallFilterProps,
} from "../../components/BoulderFilters/BoulderFilters";
import { sortItemsAlphabetically } from "../../helper/sortItemsAlphabetically";

const UserRank = ({ title, rank, score, boulders, flashes, tops }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>
        <strong>rank</strong> {rank ? rank : "–"}
      </p>
      <p>
        <strong>score</strong> {score ? score : 0}
      </p>
      <p>
        <strong>boulders</strong> {boulders ? boulders : 0}
      </p>
      <p>
        <strong>flashes</strong> {flashes ? flashes : 0}
      </p>
      <p>
        <strong>tops</strong> {tops ? tops : 0}
      </p>
    </div>
  );
};

const Current = () => {
  const { a, b } = useParams();

  const { isAdmin } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  const { boulders } = useBoulders();

  const { data: comparisons } = useRequest(`/compare/${a}/to/${b}/at/current`);
  const { data: compareUser } = useRequest(`/user/${b}`, false);
  const { data: ranking } = useRequest(`/ranking/current`);

  const grades = useMemo(
    () =>
      filterPresentOptions(boulders, "grade").sort((a, b) =>
        a.name > b.name ? 1 : -1
      ),
    [boulders]
  );

  const holdTypes = useMemo(
    () =>
      sortItemsAlphabetically(
        filterPresentOptions(boulders, "holdType"),
        "name"
      ),
    [boulders]
  );

  const walls = useMemo(
    () =>
      sortItemsAlphabetically(
        filterPresentOptions(boulders, "startWall"),
        "name"
      ),
    [boulders]
  );

  const [detailBoulder, setDetailBoulder] = useState(null);
  const [detailWall, setDetailWall] = useState(null);

  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);

  const columns = useMemo(() => {
    return [
      {
        ...boulderTableColumns.holdType,
        gridTemplate: "minmax(20px, 60px)",
        Cell: ({ value }) => <HoldType image={value.image} />,
      },
      {
        ...boulderTableColumns.grade,
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
        Cell: ({ value }) => `${value} pts`,
      },
      {
        ...boulderTableColumns.name,
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
        Cell: ({ value }) => (
          <WallLink onClick={() => setDetailWall(value)} name={value.name} />
        ),
      },
      {
        ...boulderTableColumns.endWall,
        Cell: ({ value }) => (
          <WallLink onClick={() => setDetailWall(value)} name={value.name} />
        ),
      },
      {
        Header: "You",
        accessor: "a",
        Cell: ({ value }) => <AscentIcon type={value} />,
      },
      {
        Header: compareUser ? compareUser.username : "",
        accessor: "b",
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

  const userRank = useMemo(() => {
    if (!ranking) {
      return null;
    }

    return ranking.list.find((rank) => rank.user.id === parseInt(a));
  }, [ranking]);

  const compareUserRank = useMemo(() => {
    if (!ranking) {
      return null;
    }

    return ranking.list.find((rank) => rank.user.id === parseInt(b));
  }, [ranking]);

  const applyFilter = useCallback((id, value) => {
    let current = filters.filter((currentFilter) => currentFilter.id !== id);

    current.push({
      id,
      value,
    });

    setFilters([...current]);
  }, []);

  if (!ranking || !compareUser || !comparisons) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Meta title="Compare" />

      <div className={styles.header}>
        <UserRank
          title={"You"}
          rank={userRank.rank}
          score={userRank.score}
          boulders={userRank.boulders}
          flashes={userRank.flashes}
          tops={userRank.tops}
        />

        <UserRank
          title={compareUser.username}
          rank={compareUserRank.rank}
          score={compareUserRank.score}
          boulders={compareUserRank.boulders}
          flashes={compareUserRank.flashes}
          tops={compareUserRank.tops}
        />
      </div>

      <div className={styles.filters}>
        <Filter
          {...holdTypeFilterProps}
          onSelect={(item) =>
            applyFilter(
              holdTypeFilterProps.id,
              item[holdTypeFilterProps.valueProperty]
            )
          }
          items={holdTypes}
        />

        <Filter
          {...gradeFilterProps}
          onSelect={(item) =>
            applyFilter(
              gradeFilterProps.id,
              item[gradeFilterProps.valueProperty]
            )
          }
          items={grades}
        />

        <Filter
          {...wallFilterProps}
          name={"Start"}
          onSelect={(item) =>
            applyFilter("start", item[wallFilterProps.valueProperty])
          }
          items={walls}
        />

        <Filter
          {...wallFilterProps}
          name={"End"}
          onSelect={(item) =>
            applyFilter("end", item[wallFilterProps.valueProperty])
          }
          items={walls}
        />
      </div>

      <GlobalFilter
        filters={filters}
        setFilters={setFilters}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
      />

      <BoulderTable
        data={data}
        columns={columns}
        filters={filters}
        globalFilter={globalFilter}
        headerClassName={styles.tableHeader}
        rowClassName={styles.tableRow}
      />

      <Drawer onClose={() => setDetailBoulder(null)}>
        {detailBoulder && <BoulderDetails id={detailBoulder} />}
      </Drawer>

      {detailWall && (
        <WallDetails wall={detailWall} onClose={() => setDetailWall(null)} />
      )}
    </Fragment>
  );
};

export { Current };
