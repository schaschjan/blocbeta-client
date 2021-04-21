import React, {
  Fragment,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Meta } from "../../App";
import { extractErrorMessage } from "../../hooks/useApi";
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
import styles from "./Index.module.css";
import { sortItemsAlphabetically } from "../../helper/sortItemsAlphabetically";
import { Loader } from "../../components/Loader/Loader";
import { Select } from "../../components/Select/Select";
import { mutate } from "swr";
import { getApiHost, useHttp, useRequest } from "../../hooks/useRequest";
import { CollapsedRow } from "./CollapsedRow";
import { joinClassNames } from "../../helper/classNames";

const Index = () => {
  const { isAdmin, contextualizedPath, contextualizedApiPath } = useContext(
    BoulderDBUIContext
  );
  const { dispatch } = useContext(ToastContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { version } = useContext(BoulderDBUIContext);

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

  const { boulders } = useBoulders();
  const http = useHttp();

  // todo: add internal grade filter for admins
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

  const setters = useMemo(
    () =>
      sortItemsAlphabetically(
        filterPresentOptions(boulders, "setters"),
        "username"
      ),
    [boulders]
  );

  const columns = useMemo(() => {
    const defaultColumns = [
      {
        ...boulderTableColumns.holdType,
        className: styles.holdTypeCell,
        Cell: ({ value }) => <HoldType image={value.image} />,
      },
      {
        ...boulderTableColumns.grade,
        className: styles.gradeCell,
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
        className: styles.pointsCell,
        Cell: ({ value }) => `${value} pts`,
      },
      {
        ...boulderTableColumns.name,
        className: styles.nameCell,
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
        className: styles.startWallCell,
        Cell: ({ value }) => (
          <WallLink onClick={() => setDetailWall(value)} name={value.name} />
        ),
      },
      {
        ...boulderTableColumns.endWall,
        className: styles.endWallCell,
        Cell: ({ value }) => (
          <WallLink onClick={() => setDetailWall(value)} name={value.name} />
        ),
      },
      {
        ...boulderTableColumns.setters,
        className: styles.setterCell,
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        ...boulderTableColumns.date,
        className: styles.dateCell,
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
      const { data } = await http.post("/ascent", payload);
      await mutate(contextualizedApiPath("/ascent"));

      dispatch(toast(`${data.me.type}`, `+${data.points}`));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  }, []);

  const removeHandler = useCallback(async (id) => {
    try {
      await http.delete(`/ascent/${id}`);
      await mutate(contextualizedApiPath("/ascent"));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  }, []);

  // todo: remove duplicate declaration
  const applyFilter = useCallback(
    (id, value) => {
      // if passed value is empty, clear the filter
      if (!value) {
        setFilters([
          ...filters.filter((activeFilter) => activeFilter.id !== id),
        ]);

        return;
      }

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

  if (!boulders.length) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Meta title={"Boulder"} />

      <h1 className="t--alpha page-title">
        Boulder ({boulders.length})
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
        <Select
          {...holdTypeFilterProps}
          options={holdTypes}
          onChange={(event, newValue) =>
            applyFilter("holdType", newValue ? newValue.name : null)
          }
          items={holdTypes}
        />

        <Select
          {...gradeFilterProps}
          options={grades}
          onChange={(event, newValue) =>
            applyFilter("grade", newValue ? newValue.name : null)
          }
          items={grades}
        />

        <Select
          {...wallFilterProps}
          label={"Start"}
          options={walls}
          onChange={(event, newValue) =>
            applyFilter("start", newValue ? newValue.name : null)
          }
          items={walls}
        />

        <Select
          {...wallFilterProps}
          label={"End"}
          options={walls}
          onChange={(event, newValue) =>
            applyFilter("end", newValue ? newValue.name : null)
          }
          items={walls}
        />

        <Select
          {...setterFilterProps}
          options={setters}
          value={filters.find((filter) => filter.id === "setter")}
          onChange={(event, newValue) => {
            applyFilter("setter", newValue ? newValue.username : null);
          }}
        />

        <Select
          {...ascentFilterProps}
          value={filters.find((filter) => filter.id === "ascent")}
          onChange={(event, newValue) => {
            applyFilter("ascent", newValue ? newValue.value : null);
          }}
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
        headerClassName={joinClassNames(
          styles.tableHeader,
          isAdmin ? styles.isAdminTableHeader : null
        )}
        rowClassName={isAdmin ? styles.isAdminTableRow : styles.tableRow}
        collapsedRowRenderer={(cells) => <CollapsedRow cells={cells} />}
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
                await http.put("/boulder/mass", {
                  items: selected,
                  operation: "prune-ascents",
                });

                await mutate(contextualizedApiPath("/ascent"));
                await mutate(contextualizedApiPath("/boulder"));
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
                await http.put("/boulder/mass", {
                  items: selected,
                  operation: "deactivate",
                });

                await mutate(contextualizedApiPath("/ascent"));
                await mutate(contextualizedApiPath("/boulder"));
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
