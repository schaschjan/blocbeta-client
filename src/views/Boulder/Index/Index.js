import React, {
  useState,
  useEffect,
  useContext,
  Fragment,
  useRef,
  useMemo,
} from "react";
import { Loader } from "../../../components/Loader/Loader";
import Grade from "../../../components/Grade/Grade";
import moment from "moment";
import HoldStyle from "../../../components/HoldStyle/HoldStyle";
import Paragraph from "../../../components/Paragraph/Paragraph";
import Icon from "../../../components/Icon/Icon";
import Ascent from "../../../components/Ascent/Ascent";
import "./Index.css";
import Button from "../../../components/Button/Button";
import classnames from "classnames";

import {
  IndeterminateCheckbox,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter,
} from "../../../components/Table/Table";

import {
  usePagination,
  useTable,
  useGlobalFilter,
  useSortBy,
  useRowSelect,
  useFilters,
} from "react-table";
import { Link } from "react-router-dom";
import { messages } from "../../../messages";
import { toast } from "react-toastify";
import { FilterDropdown } from "./FilterDropdown/FilterDropdown";
import { PageHeader } from "../../../components/PageHeader/PageHeader";
import Container from "../../../components/Container/Container";
import Bar from "./Bar/Bar";
import useApi, { api, cacheKeys } from "../../../hooks/useApi";
import { useMutation, queryCache } from "react-query";
import { AppContext, Meta } from "../../../App";
import { Drawer } from "../../../components/Drawer/Drawer";
import {Form} from "../../../components/Form/Form";
import { Textarea } from "../../../components/Textarea/Textarea";
import Input from "../../../components/Input/Input";
import useDrawer from "../../../hooks/useDrawer";
import SwipeOut from "../../../components/SwipeOut/SwipeOut";
import { useMediaQuery } from "react-responsive/src";
import {
  mediumQuery,
  resolveBoulder,
  resolveBoulders,
  smallQuery,
} from "../../../helpers";
import { Tag } from "../../../components/TagInput/TagInput";
import Wrapper from "../../../components/Wrapper/Wrapper";

const Table = ({ columns, data, editable = false }) => {
  const isMedium = useMediaQuery(mediumQuery);
  const isSmall = useMediaQuery(smallQuery);

  const [filters, setFilters] = useState([]);
  const [filtersDropped, setFiltersDropped] = useState(false);

  const removeFilter = (id) => {
    setFilters(filters.filter((tag) => tag.id !== id));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const addFilter = (id, value) => {
    const filter = { id, value };
    setFilters([...filters, filter]);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    selectedFlatRows,
    setFilter,
    setAllFilters,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 },
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetPage: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const [mutateOnMassDeactivation] = useMutation(api.boulder.mass, {
    onSuccess: () => {
      queryCache.refetchQueries(cacheKeys.boulders);
    },
  });

  const massDeactivate = async () => {
    try {
      await mutateOnMassDeactivation({
        items: selectedFlatRows.map((row) => row.original.id),
        operation: "deactivate",
      });

      toast.success(`Deactivated ${selectedFlatRows.length} boulders`);
    } catch (error) {
      toast.error(messages.errors.general);
    }
  };

  useEffect(() => {
    const url = new URL(window.location);
    const parameters = new URLSearchParams(url.search);

    let defaultFilters = [];

    for (let parameter of parameters) {
      defaultFilters.push({
        id: parameter[0],
        value: parameter[1],
      });
    }

    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    filters.map((filter) => setFilter(filter.id, filter.value));
    setAllFilters(filters);

    if (filtersDropped) {
      document.getElementById("search").scrollIntoView();
    } else {
      document.getElementById("root").scrollIntoView();
    }
  }, [filters, filtersDropped]);

  return (
    <Fragment>
      <Search
        filters={filters}
        filtersDropped={filtersDropped}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
        setGlobalFilter={setGlobalFilter}
        toggleFilters={() => setFiltersDropped(!filtersDropped)}
      />

      <FilterDropdown addFilter={addFilter} dropped={filtersDropped} />

      <div
        className={classnames(
          "table",
          "table--boulder",
          editable ? "table--editable" : null
        )}
        {...getTableProps()}
      >
        <TableHeader headerGroups={headerGroups} />

        <div className="table-content" {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);

            const findCell = (id) => {
              return row.cells.find((cell) => cell.column.id === id);
            };

            const renderCell = (name) => {
              const cell = findCell(name);

              if (!cell) {
                return null;
              }

              return (
                <TableCell
                  {...cell.getCellProps({ className: cell.column.className })}
                >
                  {cell.render("Cell")}
                </TableCell>
              );
            };

            if (isSmall) {
              return (
                <SwipeOut
                  actions={renderCell("ascent")}
                  width={172}
                  key={index}
                >
                  <TableRow>
                    <div>{renderCell("holdStyle")}</div>

                    <div>
                      {renderCell("name")}

                      <span className="inline-wall-names">
                        {renderCell("end")}
                        <span>></span>
                        {renderCell("start")}
                      </span>

                      {renderCell("grade")}
                    </div>

                    <div>
                      {row.original.me && <Icon name={row.original.me.type} />}
                    </div>
                  </TableRow>
                </SwipeOut>
              );
            }

            if (isMedium) {
              return (
                <TableRow key={index}>
                  <div>{renderCell("holdStyle")}</div>

                  <div>
                    {renderCell("name")}

                    <span className="inline-wall-names">
                      {renderCell("end")} <span>></span> {renderCell("start")}
                    </span>

                    {renderCell("grade")}
                  </div>

                  {renderCell("ascent")}
                </TableRow>
              );
            }

            return (
              <TableRow key={index}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell
                      {...cell.getCellProps({
                        className: cell.column.className,
                      })}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </div>
      </div>

      <TableFooter
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageOptions={pageOptions}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
      />

      {selectedFlatRows.length > 0 && (
        <Bar data={selectedFlatRows}>
          <div className="bar__summary">
            <h2>Selected {selectedFlatRows.length} boulders:</h2>
          </div>

          <div className="bar__actions">
            <Button text={true} onClick={() => massDeactivate()}>
              Deactivate
            </Button>
            <Button text={true} onClick={() => alert()}>
              Prune Ascents
            </Button>
          </div>
        </Bar>
      )}
    </Fragment>
  );
};

const Search = ({
  filters,
  removeFilter,
  clearFilters,
  filtersDropped,
  toggleFilters,
  setGlobalFilter,
}) => {
  const inputElement = useRef(null);

  const searchHasValue = inputElement.current
    ? inputElement.current.value.length > 0
    : false;

  return (
    <div className="search" id={"search"}>
      <Icon name="search" onClick={() => inputElement.current.focus()} />

      {filters &&
        filters.map((filter) => (
          <Tag
            key={filter.id}
            id={filter.id}
            value={filter.value}
            onRemove={() => removeFilter(filter.id)}
          />
        ))}

      <Input
        register={inputElement}
        placeholder={"Search"}
        onClear={() => setGlobalFilter(null)}
        onChange={(event) => {
          setGlobalFilter(event.target.value || undefined);
        }}
      />

      {(filters.length > 0 || searchHasValue) && (
        <Button
          text={true}
          onClick={() => {
            clearFilters();
            setGlobalFilter(null);
            inputElement.current.value = null;
          }}
        >
          Clear all
        </Button>
      )}

      <Icon
        name={filtersDropped ? "close" : "menu-small"}
        className="toggle-filter-dropdown"
        onClick={() => toggleFilters()}
      />
    </div>
  );
};

const Index = () => {
  const { isAdmin, locationPath } = useContext(AppContext);
  const [data, setData] = useState([]);

  const {
    open,
    close,
    isOpen,
    isLoading,
    setLoading,
    data: drawerData,
    setData: setDrawerData,
    activePage: drawerActivePage,
    setActivePage: setDrawerActivePage,
  } = useDrawer("details");

  const { status: bouldersStatus, data: boulders } = useApi(
    cacheKeys.boulders,
    api.boulder.active
  );
  const { status: ascentsStatus, data: ascents } = useApi(
    cacheKeys.ascents,
    api.ascents.active
  );
  const { status: wallsStatus, data: walls } = useApi(
    cacheKeys.walls,
    api.walls.all
  );
  const { status: gradesStatus, data: grades } = useApi(
    cacheKeys.grades,
    api.grades.all
  );
  const { status: holdStylesStatus, data: holdStyles } = useApi(
    cacheKeys.holdStyles,
    api.holdStyles.all
  );
  const { status: tagsStatus, data: tags } = useApi(
    cacheKeys.tags,
    api.tags.all
  );
  const { status: settersStatus, data: setters } = useApi(
    cacheKeys.setters,
    api.setters.all
  );

  const loading = [
    bouldersStatus,
    ascentsStatus,
    wallsStatus,
    gradesStatus,
    holdStylesStatus,
    tagsStatus,
    settersStatus,
  ].includes("loading");

  const [mutateOnAddAscent] = useMutation(api.ascents.add, {
    onSuccess: () => {
      queryCache.refetchQueries(cacheKeys.ascents);
    },
  });

  const [mutateOnRemoveAscent] = useMutation(api.ascents.remove, {
    onSuccess: () => {
      queryCache.refetchQueries(cacheKeys.ascents);
    },
  });

  const addAscent = async (id, type) => {
    data.find((boulder) => boulder.id === id).me = {
      type: type,
      user: null,
      id: null,
    };

    setData([...data]);

    try {
      await mutateOnAddAscent({
        boulder: id,
        type: type,
      });
    } catch (error) {
      toast.error(messages.errors.general);
    }
  };

  const removeAscent = async (id) => {
    data.find((boulder) => {
      if (!boulder.me) {
        return false;
      }

      return boulder.me.id === id;
    }).me = null;

    setData([...data]);

    try {
      await mutateOnRemoveAscent(id);
    } catch (error) {
      toast.error(messages.errors.generals);
    }
  };

  useEffect(() => {
    setData(
      resolveBoulders(boulders, ascents, grades, walls, holdStyles, setters)
    );
  }, [boulders, ascents, grades, walls, holdStyles, setters]);

  if (loading || !data) return <Loader />;

  const showDetails = async (boulderId) => {
    open(true);

    const details = await api.boulder.get(boulderId);

    setDrawerData(
      resolveBoulder(details, null, grades, walls, holdStyles, setters, tags)
    );

    setLoading(false);
  };

  const selectionColumn = {
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <div>
        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
      </div>
    ),
    id: "selection",
    className: `table-cell--selection`,
    Cell: ({ row }) => {
      return <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />;
    },
  };

  const newBoulderTimeOffset = moment().subtract(14, "days");

  const Ascents = ({ boulderId, ascent, flashed, topped, resigned }) => {
    return (
      <div className="ascents">
        <Ascent
          type="flash"
          disabled={!flashed && ascent}
          checked={flashed}
          onClick={() =>
            ascent ? removeAscent(ascent.id) : addAscent(boulderId, "flash")
          }
        />

        <Ascent
          type="top"
          disabled={!topped && ascent}
          checked={topped}
          onClick={() =>
            ascent ? removeAscent(ascent.id) : addAscent(boulderId, "top")
          }
        />

        <Ascent
          type="resignation"
          disabled={!resigned && ascent}
          checked={resigned}
          onClick={() =>
            ascent
              ? removeAscent(ascent.id)
              : addAscent(boulderId, "resignation")
          }
        />
      </div>
    );
  };

  const columns = [
    {
      id: "holdStyle",
      Header: "holdStyle",
      accessor: "holdStyle.name",
      className: `table-cell--holdStyle`,
      Cell: ({ row }) => {
        return (
          <HoldStyle
            name={row.original.holdStyle.name}
            icon={row.original.holdStyle.icon}
          />
        );
      },
    },
    {
      id: "grade",
      Header: "Grade",
      accessor: "grade.name",
      className: `table-cell--grade`,
      Cell: ({ row }) => {
        return (
          <Fragment>
            <Grade
              name={row.original.grade.name}
              color={row.original.grade.color}
            />

            {isAdmin && (
              <Grade
                internal={true}
                name={row.original.internalGrade.name}
                color={row.original.internalGrade.color}
              />
            )}
          </Fragment>
        );
      },
    },
    {
      id: "points",
      Header: "Points",
      accessor: "points",
      className: `table-cell--points`,
      Cell: ({ cell }) => <Paragraph>{cell.value} pts</Paragraph>,
    },
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      className: `table-cell--name`,
      Cell: ({ cell, row }) => (
        <Fragment>
          {isAdmin && (
            <Link
              to={locationPath(`/boulder/${row.original.id}`)}
              className="edit-boulder"
            >
              {" "}
              ✏
            </Link>
          )}

          <Button
            onClick={() => showDetails(row.original.id)}
            className="table-cell--name__details-button"
          >
            {cell.value} <Icon name="forward" />
          </Button>
        </Fragment>
      ),
    },
    {
      id: "start",
      Header: "Start",
      accessor: "startWall.name",
    },
    {
      id: "end",
      Header: "End",
      accessor: "endWall.name",
    },
    {
      id: "date",
      Header: "Date",
      accessor: "createdAt",
      className: `table-cell--date`,
      filter: (rows, id, filterValue) => {
        if (filterValue === "new") {
          return rows.filter((row) => {
            const rowValue = row.values[id];
            return moment(rowValue).isSameOrAfter(newBoulderTimeOffset);
          });
        }

        return true;
      },
      Cell: ({ cell }) => {
        return <Paragraph>{moment(cell.value).format("l")}</Paragraph>;
      },
    },
    {
      id: "ascent",
      Header: "Ascent",
      className: `table-cell--ascent`,
      accessor: (row) => {
        if (row.me) {
          return row.me.type;
        }

        return "todo";
      },
      Cell: ({ row }) => {
        const ascent = row.original.me;

        let flashed = false;
        let topped = false;
        let resigned = false;

        if (ascent && ascent.type === "flash") {
          flashed = true;
        }

        if (ascent && ascent.type === "top") {
          topped = true;
        }

        if (ascent && ascent.type === "resignation") {
          resigned = true;
        }

        return (
          <Ascents
            topped={topped}
            flashed={flashed}
            resigned={resigned}
            boulderId={row.original.id}
            ascent={row.original.me}
          />
        );
      },
    },
    {
      id: "setters",
      className: `table-cell--hidden`,
      accessor: (originalRow) => {
        return originalRow.setters.map((setter) => setter.username);
      },
    },
    {
      id: "tags",
      className: `table-cell--hidden`,
      accessor: (originalRow) => {
        return originalRow.tags.map((tag) => tag.description);
      },
    },
    {
      id: "labels",
      className: `table-cell--hidden`,
      accessor: (originalRow) => {
        return originalRow.labels.map((label) => label);
      },
    },
  ];

  if (isAdmin) {
    columns.unshift(selectionColumn);
  }

  const onErrorSubmit = async (data) => {
    try {
      await api.boulder.reportError(data.boulder, { ...data.message });
      toast.success("Error reported!");
    } catch (e) {
      toast.error(messages.errors.general);
    }
  };

  const onDoubtSubmit = async (data) => {
    try {
      await api.ascents.doubt(data.ascent, {
        recipient: data.recipient,
        message: data.message,
      });

      close();
      setDrawerActivePage("details");
      toast.success("Doubt submitted!");
    } catch (e) {
      toast.error(messages.errors.general);
    }
  };

  const Labels = ({ boulderId, items }) => {
    const [labels, setLabels] = useState(items);

    const [mutateOnAddLabel] = useMutation(api.labels.add, {
      onSuccess: () => {
        queryCache.refetchQueries(cacheKeys.boulders);
        queryCache.refetchQueries(cacheKeys.labels);
      },
    });

    const addLabel = async (event) => {
      if (event.key === "Enter") {
        const label = event.target.value
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");

        if (!labels.includes(label) && label.length > 0) {
          setLabels([...labels, label]);
          event.target.value = null;

          try {
            await mutateOnAddLabel({
              title: label,
              boulder: boulderId,
            });
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    const removeLabel = async (title) => {
      setLabels([...labels.filter((label) => label !== title)]);

      await api.labels.remove(boulderId, title);
    };

    return (
      <div className={"labels"}>
        <ul>
          {labels.map((label) => {
            return (
              <li>
                # {label}{" "}
                <Icon name={"close"} onClick={() => removeLabel(label)} />
              </li>
            );
          })}

          <li>
            <Input type="text" name="title" prefix={"#"} onKeyDown={addLabel} />
          </li>
        </ul>
      </div>
    );
  };

  const drawerPages = [
    {
      id: "details",
      header: (data) => {
        return (
          <div className="header-detail">
            <HoldStyle
              name={data.holdStyle.name}
              icon={data.holdStyle.icon}
              small={true}
            />
            <h3>{data.name}</h3>
          </div>
        );
      },
      content: (data) => {
        return (
          <div className="page-detail">
            <div className="detail__list">
              <h4>Ascents ({data.ascents.length ? data.ascents.length : 0})</h4>

              {data.ascents.length > 0 && (
                <ul>
                  {data.ascents.map((ascent) => {
                    const doubted = ascent.type.includes("pending-doubt");

                    return (
                      <li>
                        <span
                          className={classnames(
                            "ascent-info",
                            doubted ? "ascent-info--pending-doubt" : null
                          )}
                        >
                          <Icon name={ascent.type} />
                          {ascent.user.username}
                        </span>

                        <Button
                          text={true}
                          onClick={() => {
                            setDrawerActivePage("doubt");

                            setDrawerData({
                              ascent: {
                                id: ascent.id,
                              },
                              user: ascent.user,
                              boulder: {
                                id: data.id,
                                name: data.name,
                              },
                              ...data,
                            });
                          }}
                        >
                          Doubt it
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="detail__list">
              <h4>Setters ({data.setters.length})</h4>
              <ul>
                {data.setters.map((setter) => {
                  return <li>{setter.username}</li>;
                })}
              </ul>
            </div>

            {data.tags.length > 0 && (
              <div className="detail__list">
                <h4>Tags ({data.tags.length})</h4>

                <ul>
                  {data.tags.map((tag) => {
                    return (
                      <li>
                        {tag.emoji} {tag.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="detail__list">
              <h4>Labels</h4>

              <Labels items={data.labels} boulderId={data.id} />
            </div>

            <Button
              text={true}
              onClick={() => setDrawerActivePage("error")}
              className="report-error"
            >
              Report error
            </Button>
          </div>
        );
      },
    },
    {
      id: "error",
      header: (data) => {
        return (
          <div className="header-error">
            <Icon
              name="backward"
              onClick={() => setDrawerActivePage("details")}
            />
            <h3>
              <strong>Report error:</strong> {data.name}
            </h3>
          </div>
        );
      },
      content: (data) => {
        return (
          <div className="page-error">
            <h3>Message</h3>

            <Form onSubmit={onErrorSubmit}>
              <Textarea
                name="message"
                validate={{ required: messages.required }}
                placeholder="Write something…"
              />
              <Input type={"hidden"} name={"boulder"} value={data.id} />

              <Button text={true}>Send Message</Button>
            </Form>
          </div>
        );
      },
    },
    {
      id: "doubt",
      header: (data) => {
        return (
          <div className="header-doubt">
            <Icon
              name="backward"
              onClick={() => setDrawerActivePage("details")}
            />
            <strong>
              Doubt {data.user.username}
              {""}
            </strong>{" "}
            on {data.boulder.name}
          </div>
        );
      },
      content: (data) => {
        return (
          <div className="page-doubt">
            <h3>Message</h3>

            <Form onSubmit={onDoubtSubmit}>
              <Textarea
                name="message"
                validate={{ required: messages.required }}
                placeholder="Describe whats is wrong…"
              />

              <Input type="hidden" name="recipient" value={data.user.id} />
              <Input type="hidden" name="ascent" value={data.ascent.id} />

              <Button text={true} type="submit">
                Submit doubt
              </Button>
            </Form>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Meta title={"Boulder"} />

      <Container>
        <PageHeader title={`Boulder (${data.length})`}>
          {isAdmin && (
            <Link to={locationPath(`/boulder/add`)}>
              <Button primary={true} size={"small"}>
                Add
              </Button>
            </Link>
          )}
        </PageHeader>

        <Wrapper>
          <Table columns={columns} data={data} editable={isAdmin} />
        </Wrapper>
      </Container>

      <Drawer
        open={isOpen}
        closeHandler={close}
        activePage={drawerActivePage}
        loading={isLoading}
        data={drawerData}
        pages={drawerPages}
      />
    </Fragment>
  );
};

export default Index;
