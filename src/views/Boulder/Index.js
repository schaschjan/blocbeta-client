import React, {
  Fragment,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Meta } from "../../App";
import { useQuery, queryCache, useMutation } from "react-query";
import {
  cache,
  allIdle,
  useApi,
  queryDefaults,
  extractErrorMessage,
} from "../../hooks/useApi";
import { LoadedContent } from "../../components/Loader/Loader";
import HoldType from "../../components/HoldStyle/HoldType";
import Grade from "../../components/Grade/Grade";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import moment from "moment";
import {
  errorToast,
  toast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import BoulderDetails from "../../components/BoulderDetails/BoulderDetails";
import { Ascents } from "../../components/Ascents/Ascents";
import { Bar } from "../../components/Bar/Bar";
import { Button } from "../../components/Button/Button";
import {
  BoulderTable,
  DetailToggle,
} from "../../components/BoulderTable/BoulderTable";
import { Drawer, DrawerContext } from "../../components/Drawer/Drawer";
import { BoulderFilters } from "../../components/BoulderFilters/BoulderFilters";
import convertToKeyValueObject from "../../helper/convertToKeyValueObject";

const Index = () => {
  const { isAdmin, contextualizedPath, currentLocation } = useContext(
    BoulderDBUIContext
  );
  const { dispatch } = useContext(ToastContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  const [boulder, setBoulder] = useState(null);
  const [selected, setSelected] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([
    {
      id: "ascent",
      value: "todo",
    },
  ]);

  const ping = useApi("ping");

  useEffect(() => {
    ping();
  }, []);

  const boulderQuery = useQuery(
    [cache.boulder, currentLocation.id],
    useApi("boulder"),
    queryDefaults
  );

  const ascentsQuery = useQuery(
    [cache.ascents, currentLocation.id],
    useApi("ascents"),
    queryDefaults
  );

  const wallsQuery = useQuery(
    [cache.walls, currentLocation.id],
    useApi("walls"),
    queryDefaults
  );

  const gradesQuery = useQuery(
    [cache.grades, currentLocation.id],
    useApi("grades"),
    queryDefaults
  );

  const holdTypesQuery = useQuery(
    [cache.holdTypes, currentLocation.id],
    useApi("holdTypes"),
    queryDefaults
  );

  const tagsQuery = useQuery(
    [cache.tags, currentLocation.id],
    useApi("tags"),
    queryDefaults
  );

  const settersQuery = useQuery(
    [cache.currentSetters, currentLocation.id],
    useApi("currentSetters"),
    queryDefaults
  );

  const [mutateAscentCreation] = useMutation(useApi("addAscent"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.ascents);
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
    return [
      {
        id: "holdType",
        accessor: "holdType",
        Header: "Hold",
        sortType: (a, b) => {
          return a.values.holdType.name > b.values.holdType.name ? -1 : 1;
        },
        Cell: ({ value }) => <HoldType image={value.image} />,
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            return row.values[id].name === filterValue;
          });
        },
      },
      {
        id: "grade",
        accessor: "grade",
        Header: "Grade",
        sortType: (a, b) => {
          const gradeA = a.values.grade.internal
            ? a.values.grade.internal.name
            : a.values.grade.name;
          const gradeB = b.values.grade.internal
            ? b.values.grade.internal.name
            : b.values.grade.name;

          return gradeA > gradeB ? -1 : 1;
        },
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
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values[id].internal
              ? row.values[id].internal.name
              : row.values[id].name;

            return rowValue === filterValue;
          });
        },
      },
      {
        id: "points",
        accessor: "points",
        Header: "Points",
        sortType: (a, b) => {
          return a.values.points > b.values.points ? -1 : 1;
        },
        Cell: ({ value }) => `${value} pts`,
      },
      {
        id: "name",
        accessor: "name",
        Header: "Name",
        Cell: ({ value, row }) => {
          const boulderId = row.original.id;

          return (
            <DetailToggle
              active={boulder === boulderId}
              boulderId={boulderId}
              toggleHandler={toggleDetails}
            >
              {value}
            </DetailToggle>
          );
        },
      },
      {
        id: "start",
        accessor: "startWall.name",
        Header: "Start",
      },
      {
        id: "end",
        accessor: "endWall.name",
        Header: "End",
      },
      {
        id: "setter",
        accessor: "setters",
        Header: "Setter",
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            console.log(row.values);
            return row.values[id].some((item) => item.username === filterValue);
          });
        },
        Cell: ({ value }) => {
          return value.map((setter, index) => {
            if (!setter) {
              return null;
            }

            if (index === value.length - 1) {
              return setter.username;
            }

            return `${setter.username}, `;
          });
        },
      },
      {
        id: "date",
        accessor: "createdAt",
        Header: "Date",
        Cell: ({ value }) => {
          return moment(value).format("l");
        },
      },
      {
        id: "ascent",
        accessor: "ascent",
        Header: "Ascent",
        sortType: (a, b) => {
          return a.values.ascent.type > b.values.ascent.type ? -1 : 1;
        },
        Cell: ({ value }) => renderAscents(value),
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values[id].type ? row.values[id].type : "todo";

            return rowValue === filterValue;
          });
        },
      },
    ];
  }, [isAdmin, boulder]);

  const mergedData = useMemo(() => {
    if (
      !boulderQuery.data ||
      !gradesQuery.data ||
      !holdTypesQuery.data ||
      !wallsQuery.data ||
      !settersQuery.data ||
      !ascentsQuery.data
    ) {
      return [];
    }

    const ascents = convertToKeyValueObject(ascentsQuery.data, "boulderId");
    const grades = convertToKeyValueObject(gradesQuery.data);
    const holdTypes = convertToKeyValueObject(holdTypesQuery.data);
    const walls = convertToKeyValueObject(wallsQuery.data);
    const setters = convertToKeyValueObject(settersQuery.data);

    return boulderQuery.data.map((boulder) => {
      const ascent = ascents[boulder.id];
      const grade = grades[boulder.grade];
      const startWall = walls[boulder.start_wall];

      return {
        ...boulder,
        points: ascent.points,
        ascents: ascent.ascents,
        grade: {
          ...grade,
          internal_grade: null,
        },
        holdType: holdTypes[boulder.hold_type],
        startWall: startWall,
        endWall: boulder.end_wall ? walls[boulder.end_wall] : startWall,
        setters: boulder.setters.map((id) => setters[id]),
        ascent: ascent
          ? {
              id: ascent.me ? ascent.me.id : null,
              boulderId: ascent.boulderId,
              type: ascent.me ? ascent.me.type : null,
            }
          : null,
      };
    });
  }, [
    boulderQuery,
    ascentsQuery,
    wallsQuery,
    gradesQuery,
    holdTypesQuery,
    settersQuery,
  ]);

  const idle = allIdle(
    boulderQuery,
    ascentsQuery,
    wallsQuery,
    gradesQuery,
    holdTypesQuery,
    tagsQuery,
    settersQuery
  );

  const addHandler = async (boulderId, type) => {
    const payload = {
      boulder: boulderId,
      type: type,
    };

    try {
      await mutateAscentCreation({ payload });
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const removeHandler = async (id) => {
    try {
      await mutateAscentDeletion({ id });
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const renderAscents = useCallback((ascent) => {
    return (
      <Ascents
        boulderId={ascent.boulderId}
        addHandler={addHandler}
        removeHandler={removeHandler}
        ascent={ascent}
      />
    );
  }, []);

  const toggleDetails = (id) => {
    setBoulder(id);
    toggleDrawer(true);
  };

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

      <BoulderFilters
        filters={filters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        setFilters={setFilters}
      />

      <LoadedContent loading={!idle}>
        <BoulderTable
          columns={columns}
          data={mergedData}
          filters={filters}
          globalFilter={globalFilter}
          onSelectRows={(ids) => setSelected(ids)}
          isAdmin={isAdmin}
        />
      </LoadedContent>

      <Drawer onClose={() => setBoulder(null)}>
        {boulder && <BoulderDetails id={boulder} />}
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
    </Fragment>
  );
};

export { Index };
