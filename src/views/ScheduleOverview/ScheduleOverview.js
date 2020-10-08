import React, {Fragment, useCallback, useMemo} from "react";
import {queryCache, useQuery, useMutation} from "react-query";
import "./ScheduleOverview.css";
import {LoadedContent} from "../../components/Loader/Loader";
import {api} from "../../helper/api";
import {useTable, useExpanded, useGlobalFilter} from 'react-table'
import Forward from "../../components/Icon/Forward";
import Downward from "../../components/Icon/Downward";
import {buildClassNames} from "../../index";
import Input from "../../components/Input/Input";

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
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetPage: false,
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
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                className={buildClassNames("ticker-table-body__row", row.isExpanded ? "ticker-table-body__row--expanded" : null)}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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

    const data = [];

    rooms.forEach(room => {
      room.schedule.forEach(timeSlot => {

        data.push({
          start_time: timeSlot.start_time,
          end_time: timeSlot.end_time,
          available: timeSlot.available,
          capacity: timeSlot.capacity,
          room: room,
          hash: timeSlot.hash,
          reservations: timeSlot.reservations
        });
      });
    });

    return data;
  });

  const [mutateAppearance, {status: mutateAppearanceStatus, error: mutateAppearanceError}] = useMutation(async ({id, appeared}) => {
    await api.reservation.update(id, {appeared})
  }, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(caches.schedule);
    },
  });

  const columns = useMemo(() => [
    {
      Header: "Reservation",
      accessor: (row) => {
        return `${row.start_time} – ${row.end_time}`
      },
      Cell: ({cell}) => (
        <strong>{cell.value}</strong>
      ),
    },
    {
      Header: 'Time',
      accessor: (row) => {
        return `${row.start_time} – ${row.end_time}`
      },
      Cell: ({cell}) => (
        <strong>{cell.value}</strong>
      ),
    },
    {
      Header: 'Capacity',
      accessor: (row) => {
        return `${row.available} / ${row.capacity}`
      },
    },
    {
      Header: 'Room',
      accessor: 'room.name',
    },
    {
      Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
        <span {...getToggleAllRowsExpandedProps()} className="expander">
            {isAllRowsExpanded ? <Downward/> : <Forward/>}
          </span>
      ),
      id: 'expander',
      Cell: ({row}) => {
        return (
          <span {...row.getToggleRowExpandedProps()} className="expander">
            {row.isExpanded ? <Downward/> : <Forward/>}
        </span>
        )
      }
    },

  ], []);

  const renderRowSubComponent = useCallback(
    ({row}) => {

      return (
        <table className="ticker-reservation-table">
          <tbody className="ticker-reservation-table__body ticker-reservation-table-body">
          {row.original.reservations.map(reservation => (
              <tr className={
                buildClassNames(
                  "ticker-reservation-table-body__row",
                  reservation.appeared ? "ticker-reservation-table-body__row--appeared" : null,
                  "ticker-reservation-table-body-row"
                )}>

                <td
                  className="ticker-reservation-table-body-row-item__detail ticker-reservation-table-body-row-item__detail--name">
                  {reservation.first_name} {reservation.last_name} {reservation.quantity > 1 && (
                  <>(+{reservation.quantity})</>
                )}
                </td>

                <td className="ticker-reservation-table-body-row-item__detail">
                  {reservation.username}
                </td>

                <td
                  className="ticker-reservation-table-body-row-item__detail ticker-reservation-table-body-row-item__detail--action">
                  {!reservation.appeared ? (
                    <button onClick={() => mutateAppearance({
                      id: reservation.id,
                      appeared: true
                    })}>
                      Check-In
                    </button>
                  ) : (
                    <button onClick={() => mutateAppearance({
                      id: reservation.id,
                      appeared: false
                    })}>
                      Cancel Check-In
                    </button>
                  )}
                </td>
              </tr>
            )
          )}
          </tbody>
        </table>
      )
    },
    []
  );

  return (
    <Fragment>
      <LoadedContent loading={status === "loading"}>
        <Table
          columns={columns}
          data={data}
          renderRowSubComponent={renderRowSubComponent}
        />
      </LoadedContent>
    </Fragment>
  )
}