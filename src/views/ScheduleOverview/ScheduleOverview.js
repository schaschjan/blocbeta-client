import React, {Fragment, useMemo, useCallback, useState} from "react";
import {useQuery, queryCache, useMutation} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";
import {api} from "../../helper/api";
import {useTable, useExpanded, useGlobalFilter} from "react-table"
import {buildClassNames, Button} from "../../index";
import Input from "../../components/Input/Input";
import "./ScheduleOverview.css";
import Forward from "../../components/Icon/Forward";
import Downward from "../../components/Icon/Downward";
import axios from "axios";
import {useParams} from "react-router-dom";

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
      autoResetExpanded: false,
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
        {rows.map((row, i) => {
          prepareRow(row);

          return (
            <Fragment key={i}>
              <tr
                {...row.getRowProps()}
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
  const [fetched, setFetched] = useState(Date.now());
  const [schedule, setSchedule] = useState([]);
  const {location} = useParams();

  const {status, data} = useQuery("ticker", async () => {
      const {data: rooms} = await axios.get(`/api/${location}/schedule/rooms`);

      let flat = [];

      rooms.forEach(room => {
        room.schedule.forEach(timeSlot => {
          timeSlot.room = room;

          flat.push(timeSlot);
        });
      });

      setSchedule(flat);

      return flat;
    },
    {
      onSuccess: () => {
        setFetched(Date.now());
      },
      refetchOnWindowFocus: false
    }
  );

  console.log(data);

  const [mutateAppearance, {status: mutateAppearanceStatus, error: mutateAppearanceError}] = useMutation(async ({id, appeared}) => {
    await api.reservation.update(id, {appeared})
  }, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries("ticker");
    },
  });

  const columns = useMemo(() => {

    return [
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
        Header: 'User',
        accessor: (row) => {
          return row.reservations.map(reservation => {
            return `${reservation.first_name} ${reservation.last_name} ${reservation.username}`;
          })
        },
      },
      {
        hidden: true,
        Header: 'Reservations',
        id: 'reservations',
        accessor: "reservations",
        // filter: (rows, id, filterValue) => {
        //   console.log(rows, id, filterValue);
        // }
      },
    ];
  }, []);

  const renderRowSubComponent = useCallback(({row}) => {
    return (
      <div className="ticker-reservation-table">
        {row.values.reservations.length > 0 ? row.values.reservations.map(reservation => {

          const classes = buildClassNames(
            "ticker-reservation-table__item ticker-reservation-table-item",
            reservation.appeared ? "ticker-reservation-table__item--appeared" : null
          );

          return <div className={classes} key={reservation.id}>
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
        }) : (
          <div className="ticker-reservation-table__item">
            <em>No reservations!</em>
          </div>
        )}
      </div>
    )
  }, [fetched]);

  return (
    <Fragment>
      <LoadedContent loading={status === "loading"}>
        <Table columns={columns} data={schedule} renderRowSubComponent={renderRowSubComponent}/>
      </LoadedContent>
    </Fragment>
  )
}