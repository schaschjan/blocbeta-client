import React, {Fragment, useContext, useState, useCallback, useMemo} from "react";
import {Meta} from "../../App";
import {useQuery, queryCache, useMutation} from "react-query";
import {cache, allIdle, useApi, queryDefaults, extractErrorMessage} from "../../hooks/useApi";
import {LoadedContent} from "../../components/Loader/Loader";
import HoldStyle from "../../components/HoldStyle/HoldStyle";
import {usePagination, useTable, useGlobalFilter, useSortBy, useRowSelect, useFilters} from "react-table";
import Grade from "../../components/Grade/Grade";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import moment from "moment";
import Ascent from "../../components/Ascent/Ascent";
import "./Index.css"
import {toast, ToastContext} from "../../components/Toaster/Toaster";

const Ascents = ({boulderId, ascent, removeHandler, addHandler}) => {

  return (
    <div className="ascents">
      <Ascent
        type="flash"
        disabled={ascent && ascent.type !== "flash"}
        checked={ascent && ascent.type === "flash"}
        onClick={
          () => ascent ? removeHandler(ascent.id) : addHandler(boulderId, "flash")
        }
      />

      <Ascent
        type="top"
        disabled={ascent && ascent.type !== "top"}
        checked={ascent && ascent.type === "top"}
        onClick={
          () => ascent ? removeHandler(ascent.id) : addHandler(boulderId, "top")
        }
      />

      <Ascent
        type="resignation"
        disabled={ascent && ascent.type !== "resignation"}
        checked={ascent && ascent.type === "resignation"}
        onClick={
          () => ascent ? removeHandler(ascent.id) : addHandler(boulderId, "resignation")
        }
      />
    </div>
  );
};

const Table = ({columns, data}) => {

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
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0, pageSize: 20},
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

  return (
    <div className="boulder-list">
      {page.map((row, index) => {
        prepareRow(row);

        return (
          <div className="boulder-list__item boulder-list-item" key={index}>
            {row.cells.map(cell => {
              return (
                <div className="boulder-list-item__cell"
                     {...cell.getCellProps({
                       className: cell.column.className,
                     })}>
                  {cell.render("Cell")}
                </div>
              );
            })}
          </div>
        )
      })}
    </div>
  )
};

const Index = () => {
  const {isAdmin} = useContext(BlocBetaUIContext);
  const {dispatch} = useContext(ToastContext);

  const [data, setData] = useState([]);

  const boulderQuery = useQuery(
    cache.boulder,
    useApi("boulder"),
    queryDefaults
  );

  const ascentsQuery = useQuery(
    cache.ascents,
    useApi("ascents"),
    queryDefaults
  );

  const wallsQuery = useQuery(
    cache.walls,
    useApi("walls"),
    queryDefaults
  );

  const gradesQuery = useQuery(
    cache.grades,
    useApi("grades"),
    queryDefaults
  );

  const holdStylesQuery = useQuery(
    cache.holdStyles,
    useApi("holdStyles"),
    queryDefaults
  );

  const tagsQuery = useQuery(
    cache.tags,
    useApi("tags"),
    queryDefaults
  );

  const settersQuery = useQuery(
    cache.setters,
    useApi("setters"),
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

  const idle = allIdle(
    boulderQuery,
    ascentsQuery,
    wallsQuery,
    gradesQuery,
    holdStylesQuery,
    tagsQuery,
    settersQuery
  );

  const toggleDetails = async (id) => {
    alert(id);
  };

  const addHandler = async (boulderId, type) => {

    const payload = {
      boulder: boulderId,
      type: type
    };

    try {
      await mutateAscentCreation({payload});
    } catch (error) {

      dispatch(
        toast(
          "Error",
          extractErrorMessage(error),
          "danger"
        )
      );
    }
  };

  const removeHandler = async (id) => {

    try {
      await mutateAscentCreation({id});
    } catch (error) {

      dispatch(
        toast(
          "Error",
          extractErrorMessage(error),
          "danger"
        )
      );
    }
  };

  const renderAscents = useCallback(ascent => {

    return <Ascents boulderId={ascent.boulderId}
                    addHandler={addHandler}
                    removeHandler={removeHandler}
                    ascent={ascent}/>

  }, []);

  const columns = useMemo(() => {
    return [
      {
        id: "holdStyle",
        Header: "holdStyle",
        accessor: "holdStyle",
        Cell: ({value}) => (
          <HoldStyle
            name={value.name}
            icon={value.icon}
          />
        )
      },
      isAdmin ? {
        id: "grade",
        Header: "Grade",
        accessor: "grade",
        Cell: ({value}) => (
          <Grade
            name={value.name}
            color={value.color}
          />
        ),
      } : {
        id: "internalGrade",
        Header: "Internal Grade",
        accessor: "internalGrade",
        Cell: ({value}) => (
          <Grade
            name={value.name}
            color={value.color}
          />
        ),
      },
      {
        id: "points",
        Header: "Points",
        accessor: "points",
        Cell: ({value}) => `${value} pts`,
      },
      {
        id: "name",
        Header: "Name",
        accessor: "name",
        Cell: ({value, row}) => (
          <span onClick={() => toggleDetails(row.original.id)}>
            {value}
          </span>
        )
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
        Cell: ({value}) => (
          moment(value).format("l")
        )
      },
      {
        id: "ascent",
        Header: "Ascent",
        accessor: "ascent",
        Cell: ({value}) => renderAscents(value)
      }
    ];

  }, [isAdmin]);

  const mergedData = useMemo(() => {

    if (!boulderQuery.data || !gradesQuery.data || !holdStylesQuery.data || !wallsQuery.data || !settersQuery.data || !tagsQuery.data) {
      return [];
    }

    return boulderQuery.data.map(boulder => {

      const ascent = ascentsQuery.data.find(ascent => {
        return ascent.boulderId === boulder.id
      });

      return {
        ...boulder,
        points: ascent.points,
        ascents: ascent.ascents,
        grade: gradesQuery.data.find(grade => {
          return grade.id === boulder.grade.id
        }),
        internalGrade: gradesQuery.data.find(grade => {
          return grade.id === boulder.internalGrade.id
        }),
        holdStyle: holdStylesQuery.data.find(holdStyle => {
          return holdStyle.id === boulder.holdStyle.id
        }),
        startWall: wallsQuery.data.find(wall => {
          return wall.id === boulder.startWall.id
        }),
        endWall: wallsQuery.data.find(wall => {
          if (!boulder.endWall) {
            return null;
          }

          return wall.id === boulder.endWall.id
        }),
        setters: boulder.setters.map(boulderSetter => {
          return settersQuery.data.find(setter => boulderSetter.id === setter.id)
        }),
        tags: boulder.tags.map(boulderTag => {
          return tagsQuery.data.find(tag => boulderTag.id === tag.id)
        }),
        ascent: ascent ? {
          id: ascent.id,
          boulderId: ascent.boulderId,
          type: ascent.me ? ascent.me.type : null,
        } : null
      }
    });

  }, [
    boulderQuery,
    wallsQuery,
    gradesQuery,
    holdStylesQuery,
    tagsQuery,
    settersQuery
  ]);

  console.log(mergedData);

  return (
    <Fragment>
      <Meta title={"Boulder"}/>

      <h1 className="t--alpha page-title">
        Boulder
      </h1>

      <LoadedContent loading={!idle}>
        <Table columns={columns} data={mergedData}/>
      </LoadedContent>

      {/*<Container>*/}
      {/*  <PageHeader title={`Boulder (${data.length})`}>*/}
      {/*    {isAdmin && (*/}
      {/*      <Link to={locationPath(`/boulder/add`)}>*/}
      {/*        <Button primary={true} size={"small"}>*/}
      {/*          Add*/}
      {/*        </Button>*/}
      {/*      </Link>*/}
      {/*    )}*/}
      {/*  </PageHeader>*/}

      {/*  <Wrapper>*/}
      {/*    <Table columns={columns} data={data} editable={isAdmin} />*/}
      {/*  </Wrapper>*/}
      {/*</Container>*/}
    </Fragment>
  );
};

export default Index;