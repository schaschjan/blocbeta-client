import React, {
  Fragment,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { Meta } from "../../App";
import { queryCache, useMutation } from "react-query";
import { cache, useApi, extractErrorMessage } from "../../hooks/useApi";
import { LoadedContent } from "../../components/Loader/Loader";
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
  BoulderTable,
  DetailToggle,
  boulderTableColumns,
} from "../../components/BoulderTable/BoulderTable";
import { Drawer, DrawerContext } from "../../components/Drawer/Drawer";
import { BoulderFilters } from "../../components/BoulderFilters/BoulderFilters";
import { useBoulders } from "../../hooks/useBoulders";
import { Ascent } from "../../components/Ascent/Ascent";
import styles from "./Index.module.css";
import { WallDetails } from "../../components/WallDetails/WallDetails";

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

  const { idle, boulders } = useBoulders();

  useEffect(() => {
    ping();
  }, []);

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
          <span
            className={styles.wallLink}
            onClick={() => setDetailWall(value)}
          >
            {value.name}
          </span>
        ),
      },
      {
        ...boulderTableColumns.endWall,
        Cell: ({ value }) => (
          <span
            className={styles.wallLink}
            onClick={() => setDetailWall(value)}
          >
            {value.name}
          </span>
        ),
      },
      {
        ...boulderTableColumns.setters,
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
        ...boulderTableColumns.date,
      },
      {
        ...boulderTableColumns.ascent,
        Cell: ({ value }) => (
          <div className={styles.ascents}>
            <Ascent
              type="flash"
              disabled={value.id && value.type !== "flash"}
              checked={value.type === "flash"}
              asyncHandler={async () => {
                value.id
                  ? await removeHandler(value.id)
                  : await addHandler(value.boulderId, "flash");
              }}
            />

            <Ascent
              type="top"
              disabled={value.id && value.type !== "top"}
              checked={value.type === "top"}
              asyncHandler={async () => {
                value.id
                  ? await removeHandler(value.id)
                  : await addHandler(value.boulderId, "top");
              }}
            />

            <Ascent
              type="resignation"
              disabled={value.id && value.type !== "resignation"}
              checked={value.type === "resignation"}
              asyncHandler={async () => {
                value.id
                  ? await removeHandler(value.id)
                  : await addHandler(value.boulderId, "resignation");
              }}
            />
          </div>
        ),
      },
    ];
  }, [isAdmin, detailBoulder]);

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
          data={boulders}
          filters={filters}
          globalFilter={globalFilter}
          onSelectRows={(ids) => setSelected(ids)}
          isAdmin={isAdmin}
        />
      </LoadedContent>

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
