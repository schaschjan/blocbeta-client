import React, {Fragment, useMemo} from "react";
import {queryCache, useQuery, useMutation} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import {cache, useApi} from "../../hooks/useApi";
import {useParams} from "react-router-dom";
import {CrudTable, EditableCell} from "../../components/CrudTable/CrudTable";
import "./Detail.css";
import {handleApiErrors} from "../../index";

export default () => {
  const {room} = useParams();
  const {status, data} = useQuery([cache.roomSchedule, {room}], useApi("roomSchedule", {room}));

  const [mutateUpdate, {status: mutateUpdateStatus, error: mutateUpdateError}] = useMutation(useApi("updateTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries([cache.roomSchedule, {room}]);
    },
  });

  const columns = useMemo(() => {
    return [
      {
        Header: "Day",
        accessor: "day_name",
        canGroupBy: true,
        Aggregated: ({value}) => `${value} time slots`,
        Cell: ({value}) => {
          return <span>{value}</span>
        }
      },
      {
        Header: "Start",
        accessor: "start_time",
        canGroupBy: false,
        aggregate: 'count',
        Aggregated: ({value}) => `${value} time slots`,
      },
      {
        Header: "End",
        accessor: "end_time",
        canGroupBy: false,
        aggregate: 'count',
        Aggregated: ({value}) => `${value} time slots`,
      },
      {
        Header: "Capacity",
        accessor: "capacity",
        canGroupBy: false,
        aggregate: 'count',
        Aggregated: ({value}) => `${value} time slots`,
      },
      {
        Header: "Allow quantity",
        accessor: "allow_quantity",
        canGroupBy: false,
        aggregate: 'count',
        Aggregated: ({value}) => `${value} time slots`,
      }
    ]
  }, []);

  const handleUpdate = async (rowIndex, columnId, value) => {

    const payload = {
      ...data[rowIndex],
      [columnId]: value,
      room
    };

    const {id} = payload;

    delete payload.id;

    try {
      await mutateUpdate({
        id,
        payload
      });
    } catch (e) {
      handleApiErrors(e)
    }
  };

  return <Fragment>
    <h1 className="t--alpha page-title">
      Rooms
    </h1>

    <LoadedContent loading={status === "loading"}>
      <EmptyState isEmpty={!data || data.length === 0}>

        <CrudTable data={data}
                   columns={columns}
                   updateHandler={handleUpdate}
                   defaultColumn={{
                     Cell: EditableCell
                   }}
                   defaultGroupBy={["day_name"]}
        />

      </EmptyState>
    </LoadedContent>
  </Fragment>
};
