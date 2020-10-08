import React, {Fragment} from "react";
import {queryCache, useQuery, useMutation} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";
import {api} from "../../helper/api";
import {useTable, useExpanded, useGlobalFilter} from "react-table"
import {buildClassNames, Button} from "../../index";
import Input from "../../components/Input/Input";
import "./ScheduleOverview.css";

const Table = ({columns, data, renderRowSubComponent}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useExpanded
  );

  return (
    <>
      <Input
        className="ticker-search"
        placeholder="Search"
        onClear={() => setGlobalFilter(null)}
        clearable={true}
        onChange={event => {
          setGlobalFilter(event.target.value);
        }}
      />

      <table {...getTableProps()} className="ticker-table">
        <thead className="ticker-table__head ticker-table-head">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} className="ticker-table-head__row">
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
        </thead>

        <tbody {...getTableBodyProps()} className="ticker-table__body ticker-table-body">
        {rows.map((row) => {
          prepareRow(row);

          return (
            <Fragment {...row.getRowProps()}>
              <tr
                className={buildClassNames("ticker-table-body__row", row.original.appeared ? "ticker-table-body__row--appeared" : null)}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  )
                })}
              </tr>

              {row.isExpanded ? (
                <tr>
                  <td colSpan={4}>{renderRowSubComponent({row})}</td>
                </tr>
              ) : null}
            </Fragment>
          )
        })}
        </tbody>
      </table>
    </>
  )
};

export default () => {
  const {status, data} = useQuery(caches.schedule, async () => {
    const {data: rooms} = await api.schedule.rooms();

    const flat = [];

    rooms.forEach(room => {
      room.schedule.forEach(timeSlot => {
        timeSlot.room = room;

        timeSlot.reservations.forEach(reservation => {
          flat.push({
            ...reservation,
            timeSlot: timeSlot
          });
        });
      });
    });

    return flat;
  });

  const [mutateAppearance, {status: mutateAppearanceStatus, error: mutateAppearanceError}] = useMutation(async ({id, appeared}) => {
    await api.reservation.update(id, {appeared})
  }, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(caches.schedule);
    },
  });

  const columns = [
    {
      Header: "Name",
      accessor: (row) => {
        return `${row.first_name} ${row.last_name}`
      },
      Cell: ({cell}) => (
        <strong>{cell.value}</strong>
      ),
    },
    {
      Header: "Username",
      accessor: "username"
    },
    {
      Header: "Time",
      accessor: (row) => {
        return `${row.timeSlot.start_time} – ${row.timeSlot.end_time}`
      },
      Cell: ({cell}) => (
        <strong>{cell.value}</strong>
      ),
    },
    {
      Header: "Room",
      accessor: "timeSlot.room.name",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "",
      accessor: "appeared",
      Cell: ({row, value}) => {
        return (
          <div className="actions-cell">
            {!value ? (
              <Button size="small" onClick={() => mutateAppearance({
                id: row.original.id,
                appeared: true
              })}>
                Check-In
              </Button>
            ) : (
              <Button size="small" modifier="inverted" onClick={() => mutateAppearance({
                id: row.original.id,
                appeared: false
              })}>
                Cancel Check-In
              </Button>
            )}
          </div>
        )
      }
    }
  ];

  return (
    <Fragment>
      <LoadedContent loading={status === "loading"}>
        <Table columns={columns} data={data}/>
      </LoadedContent>
    </Fragment>
  )
}