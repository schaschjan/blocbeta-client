import React, {Fragment, useEffect, useState} from "react";
import {queryCache, useQuery, useMutation} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";
import {api} from "../../helper/api";
import {useTable, useExpanded, useGlobalFilter} from "react-table"
import {buildClassNames, Button} from "../../index";
import Input from "../../components/Input/Input";
import "./ScheduleOverview.css";
import Forward from "../../components/Icon/Forward";
import Downward from "../../components/Icon/Downward";

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
            {headerGroup.headers.map(column => {
              if (!column.hidden) {
                return <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              } else {
                return null;
              }
            })}
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
                  if (!cell.column.hidden) {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    )
                  } else {
                    return null
                  }
                })}
              </tr>
              {row.isExpanded ? (
                <tr>
                  <td colSpan={5}>{renderRowSubComponent({row})}</td>
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

        flat.push(timeSlot);
      });
    });

    return flat;
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (status === "success") {
      console.log("update data")
      setTableData([...data]);
    }

  }, [status]);

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
      Header: "Time",
      accessor: (row) => {
        return `${row.start_time} – ${row.end_time}`
      },
      Cell: ({cell}) => (
        <strong>{cell.value}</strong>
      ),
    },
    {
      Header: "Room",
      accessor: "room.name",
    },
    {
      Header: "Available",
      accessor: (row) => {
        return `${row.available} / ${row.capacity}`
      },
    },
    {
      Header: "Appeared",
      accessor: (row) => {
        return `${row.reservations.filter(reservation => reservation.appeared === true).length} / ${row.capacity}`
      },
    },
    {
      Header: () => null,
      id: 'expander',
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()} className="expander">
            {row.isExpanded ? <Downward/> : <Forward/>}
          </span>
      ),
    },
    {
      hidden: true,
      Header: 'Reservations',
      id: 'reservations',
      accessor: (row) => {
        return row.reservations.map(reservation => {
          return `${reservation.first_name} ${reservation.last_name} ${reservation.username}`
        })
      },
    },
  ];

  const Reservations = ({row}) => {
    return (
      <div className="ticker-reservation-table">
        {row.original.reservations.map(reservation => {
          return <div className={
            buildClassNames(
              "ticker-reservation-table__item ticker-reservation-table-item",
              reservation.appeared ? "ticker-reservation-table__item--appeared" : null
            )
          }>

              <span className="ticker-reservation-table-item__details">
                <strong>
                  {reservation.first_name} {reservation.last_name}
                  {reservation.quantity > 1 && (
                    <span>(+{reservation.quantity})</span>
                  )}
                </strong>
                <span>{reservation.username}</span>
              </span>

            <span className="ticker-reservation-table-item__actions">
                {!reservation.appeared ? (
                  <Button variant="primary" size="small" onClick={() => mutateAppearance({
                    id: reservation.id,
                    appeared: true
                  })}>
                    Check-In
                  </Button>
                ) : (
                  <Button variant="primary" size="small" onClick={() => mutateAppearance({
                    id: reservation.id,
                    appeared: false
                  })}>
                    Cancel Check-In
                  </Button>
                )}
              </span>
          </div>
        })}
      </div>
    )
  };

  return (
    <Fragment>
      <LoadedContent loading={status === "loading"}>
        <Table columns={columns} data={tableData} renderRowSubComponent={Reservations}/>
      </LoadedContent>
    </Fragment>
  )
}