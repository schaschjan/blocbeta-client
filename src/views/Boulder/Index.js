import React, {
  Fragment,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Meta } from "../../App";
import { queryCache, useMutation } from "react-query";
import { cache, useApi, extractErrorMessage } from "../../hooks/useApi";
import HoldType from "../../components/HoldStyle/HoldType";
import Grade from "../../components/Grade/Grade";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import {
  errorToast,
  toast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import BoulderDetails from "../../components/BoulderDetails/BoulderDetails";
import { Bar } from "../../components/Bar/Bar";
import { Button } from "../../components/Button/Button";
import {
  Ascents,
  BoulderTable,
  DetailToggle,
  boulderTableColumns,
  WallLink,
} from "../../components/BoulderTable/BoulderTable";
import { Drawer, DrawerContext } from "../../components/Drawer/Drawer";
import {
  ascentFilterProps,
  Filter,
  GlobalFilter,
  gradeFilterProps,
  holdTypeFilterProps,
  setterFilterProps,
  wallFilterProps,
} from "../../components/BoulderFilters/BoulderFilters";
import { filterPresentOptions, useBoulders } from "../../hooks/useBoulders";
import { WallDetails } from "../../components/WallDetails/WallDetails";
import { Link } from "react-router-dom";
import { IndeterminateCheckbox } from "../../components/IndeterminateCheckbox";
import useRequest from "../../hooks/useRequest";
import styles from "./Index.module.css";
import { Loader } from "../../components/Loader/Loader";

const Index = () => {
  const { isAdmin, contextualizedPath } = useContext(BoulderDBUIContext);
  const { dispatch } = useContext(ToastContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  const [detailBoulder, setDetailBoulder] = useState(null);
  const [detailWall, setDetailWall] = useState(null);

  const [selected, setSelected] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([
    {
      id: "ascent",
      value: "todo",
    },
  ]);

  const ping = useApi("ping");
  const { boulders } = useBoulders();

  const grades = useMemo(() => filterPresentOptions(boulders, "grade"), [
    boulders,
  ]);
  const holdTypes = useMemo(() => filterPresentOptions(boulders, "holdType"), [
    boulders,
  ]);
  const walls = useMemo(() => filterPresentOptions(boulders, "startWall"), [
    boulders,
  ]);

  const { data: setters } = useRequest("/setter");

  useEffect(() => {
    ping();
  }, []);

  const [mutateAscentCreation] = useMutation(useApi("addAscent"), {
    throwOnError: true,
    onSuccess: (data) => {
      queryCache.invalidateQueries(cache.ascents);
      dispatch(toast(`${data.me.type}`, `+${data.points}`));
    },
  });

  const [mutateAscentDeletion] = useMutation(useApi("removeAscent"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.ascents);
    },
  });

  const [mutateMass] = useMutation(useApi("boulderMass"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.boulder);
      queryCache.invalidateQueries(cache.ascents);
    },
  });

  const columns = useMemo(() => {
    const defaultColumns = [
      {
        ...boulderTableColumns.holdType,
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
        ...boulderTableColumns.setters,
      },
      {
        ...boulderTableColumns.date,
      },
      {
        ...boulderTableColumns.ascent,
        Cell: ({ value }) => (
          <Ascents
            value={value}
            addHandler={addHandler}
            removeHandler={removeHandler}
          />
        ),
      },
    ];

    if (isAdmin) {
      defaultColumns.unshift({
        ...boulderTableColumns.selection,
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />

            <Link to={contextualizedPath(`/admin/boulder/${row.original.id}`)}>
              &nbsp;&nbsp;&nbsp;✎
            </Link>
          </div>
        ),
      });
    }

    return defaultColumns;
  }, [isAdmin, detailBoulder]);

  const addHandler = useCallback(async (boulderId, type) => {
    const payload = {
      boulder: boulderId,
      type: type,
    };

    try {
      await mutateAscentCreation({ payload });
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  }, []);

  const removeHandler = useCallback(async (id) => {
    try {
      await mutateAscentDeletion({ id });
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  }, []);

  const applyFilter = useCallback(
    (id, value) => {
      // clone array, filter out current filters on given id to suppress duplicate filtering
      const currentFilters = [...filters].filter(
        (currentFilter) => currentFilter.id !== id
      );

      currentFilters.push({
        id,
        value,
      });

      setFilters(currentFilters);
    },
    [filters]
  );

  return (
    <Fragment>
      <Meta title={"Boulder"} />

      <h1 className="t--alpha page-title">
        Boulder
        {isAdmin && (
          <Button
            size={"small"}
            asLink={true}
            to={contextualizedPath("/admin/boulder/add")}
          >
            Add
          </Button>
        )}
      </h1>

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

        <Filter
          {...setterFilterProps}
          onSelect={(item) =>
            applyFilter(
              setterFilterProps.id,
              item[setterFilterProps.valueProperty]
            )
          }
          items={setters}
        />

        <Filter
          {...ascentFilterProps}
          onSelect={(item) =>
            applyFilter(
              ascentFilterProps.id,
              item[ascentFilterProps.valueProperty]
            )
          }
        />
      </div>

      <GlobalFilter
        filters={filters}
        setFilters={setFilters}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
      />

      <BoulderTable
        columns={columns}
        data={boulders}
        filters={filters}
        globalFilter={globalFilter}
        onSelectRows={(ids) => setSelected(ids)}
        isAdmin={isAdmin}
      />

      <Drawer onClose={() => setDetailBoulder(null)}>
        {detailBoulder && <BoulderDetails id={detailBoulder} />}
      </Drawer>

      <Bar visible={selected.length > 0}>
        <span>Selected ({selected.length})</span>

        <span>
          <Button
            size={"small"}
            variant={"danger"}
            onClick={async () => {
              try {
                await mutateMass({
                  payload: {
                    items: selected,
                    operation: "prune-ascents",
                  },
                });
              } catch (error) {
                dispatch(errorToast(error));
              }
            }}
          >
            Prune Ascents
          </Button>

          <Button
            size={"small"}
            variant={"danger"}
            onClick={async () => {
              try {
                await mutateMass({
                  payload: {
                    items: selected,
                    operation: "deactivate",
                  },
                });
              } catch (error) {
                dispatch(errorToast(error));
              }
            }}
          >
            Deactivate
          </Button>
        </span>
      </Bar>

      {detailWall && (
        <WallDetails wall={detailWall} onClose={() => setDetailWall(null)} />
      )}
    </Fragment>
  );
};

export { Index };
