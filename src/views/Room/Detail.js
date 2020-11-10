import React, {Fragment, useMemo, useContext} from "react";
import {queryCache, useQuery, useMutation} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import {cache, extractErrorMessage, useApi} from "../../hooks/useApi";
import {useParams} from "react-router-dom";
import {CrudTable, EditableCellInput, EditableCellSwitch} from "../../components/CrudTable/CrudTable";
import {toast, ToastContext} from "../../components/Toaster/Toaster";

const Detail = () => {
  const {room} = useParams();
  const {status, data} = useQuery([cache.roomSchedule, {room}], useApi("roomSchedule", {room}));
  const {dispatch} = useContext(ToastContext);

  const [mutateUpdate, {status: mutateUpdateStatus, error: mutateUpdateError}] = useMutation(useApi("updateTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries([cache.roomSchedule, {room}]);
    },
  });

  const columns = useMemo(() => {
    return [
      {
        Header: "Enabled",
        accessor: "enabled",
        canGroupBy: false,
        aggregate: 'count',
        Aggregated: ({value}) => `${value} items`,
        Cell: EditableCellSwitch
      },
      {
        Header: "Auto destroy",
        accessor: "auto_destroy",
        canGroupBy: false,
        aggregate: 'count',
        Aggregated: ({value}) => `${value} items`,
        Cell: EditableCellSwitch
      },
      {
        Header: "Enable after",
        accessor: "enable_after",
        aggregate: 'count',
        Aggregated: ({value}) => `${value} items`,
        Cell: ({...cellProps}) => {
          return <EditableCellInput inputType="date" {...cellProps}/>
        }
      },
      {
        Header: "Disable after",
        accessor: "disable_after",
        aggregate: 'count',
        Aggregated: ({value}) => `${value} items`,
        Cell: ({...cellProps}) => {
          return <EditableCellInput inputType="date" {...cellProps}/>
        }
      },
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
        Header: "Min quantity",
        accessor: "min_quantity",
        canGroupBy: false,
        aggregate: 'count',
        Aggregated: ({value}) => `${value} time slots`,
      },
      {
        Header: "Max quantity",
        accessor: "max_quantity",
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

      dispatch(
        toast(
          "Update successful",
          null,
          "success"
        )
      );

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
                     Cell: EditableCellInput
                   }}
                   defaultGroupBy={["day_name"]}
        />

      </EmptyState>
    </LoadedContent>
  </Fragment>
};

export {Detail}
