import React, {
  Fragment,
  useMemo,
  useCallback,
  useState,
  useContext,
  useEffect,
} from "react";
import { useTable, useExpanded, useGlobalFilter } from "react-table";
import { Input } from "../../components/Input/Input";
import "./Index.css";
import Forward from "../../components/Icon/Forward";
import Downward from "../../components/Icon/Downward";
import moment from "moment";
import { extractErrorMessage } from "../../hooks/useApi";
import { classNames } from "../../helper/classNames";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { Button } from "../../components/Button/Button";
import { useHttp, useRequest } from "../../hooks/useRequest";
import { mutate } from "swr";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { Loader } from "../../components/Loader/Loader";

const Table = ({ columns, ymd, setYmd, data, renderRowSubComponent }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter,
    isAllRowsExpanded,
    toggleAllRowsExpanded,
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
      <div className="ticker-header">
        <Input
          type="date"
          value={ymd}
          className="ticker-header__date"
          onChange={(event) => {
            setYmd(event.target.value);
          }}
        />

        <Input
          className="ticker-header__search"
          placeholder="Search"
          value={globalFilter}
          onClear={(event) => {
            setGlobalFilter(" ");
          }}
          clearable={true}
          onChange={(event) => {
            if (!isAllRowsExpanded) {
              toggleAllRowsExpanded();
            }

            setGlobalFilter(event.target.value);
          }}
        />
      </div>

      <table {...getTableProps()} className="ticker-table">
        <thead className="ticker-table__head ticker-table-head">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="ticker-table-head__row"
            >
              {headerGroup.headers.map((column) => {
                if (!column.hidden) {
                  return (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  );
                } else {
                  return null;
                }
              })}
            </tr>
          ))}
        </thead>

        <tbody
          {...getTableBodyProps()}
          className="ticker-table__body ticker-table-body"
        >
          {rows.map((row, i) => {
            prepareRow(row);

            return (
              <Fragment key={i}>
                <tr
                  {...row.getRowProps()}
                  className={classNames(
                    "ticker-table-body__row",
                    row.original.checked_in
                      ? "ticker-table-body__row--active"
                      : null
                  )}
                >
                  {row.cells.map((cell) => {
                    if (!cell.column.hidden) {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    } else {
                      return null;
                    }
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={5}>{renderRowSubComponent({ row })}</td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const Index = () => {
  const [fetched, setFetched] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment().format("Y-MM-DD"));
  const [scheduleData, setScheduleData] = useState();

  const { dispatch } = useContext(ToastContext);
  const http = useHttp();
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);

  const { data } = useRequest(
    `/schedule/rooms/${selectedDate}`,
    true,
    { method: "get" },
    {
      refreshInterval: 1000 * 10,
      onSuccess: () => {
        setFetched(moment());
      },
    }
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    let flat = [];
    let pendingCheckIns = 0;

    data.forEach((room) => {
      room.schedule.forEach((timeSlot) => {
        delete room.schedule;
        timeSlot.room = room;

        flat.push(timeSlot);
      });

      pendingCheckIns += room.pending_check_ins;
    });

    setScheduleData({
      pendingCheckIns,
      schedule: flat,
    });
  }, [data]);

  const handleDeletion = async (id) => {
    try {
      await http.delete(`/reservation/${id}`);
      await mutate(contextualizedApiPath("/ticker"));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const handleUpdate = async (id, checkedIn) => {
    try {
      await http.put(`/reservation/${id}`, { checkedIn });
      await mutate(contextualizedApiPath("/ticker"));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const columns = useMemo(() => {
    return [
      {
        Header: "Time",
        accessor: (row) => {
          return `${row.start_time} – ${row.end_time}`;
        },
        Cell: ({ cell }) => <strong>{cell.value}</strong>,
      },
      {
        Header: "Room",
        accessor: "room.name",
      },
      {
        Header: "Available",
        accessor: (row) => {
          return `${row.available} / ${row.capacity}`;
        },
      },
      {
        Header: "Checked in",
        accessor: (row) => {
          return `${
            row.reservations.filter(
              (reservation) => reservation.checked_in === true
            ).length
          } / ${row.capacity}`;
        },
      },
      {
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()} className="expander">
            {isAllRowsExpanded ? <Downward /> : <Forward />}
          </span>
        ),
        id: "expander",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()} className="expander">
            {row.isExpanded ? <Downward /> : <Forward />}
          </span>
        ),
      },
      {
        hidden: true,
        Header: "User",
        accessor: (row) => {
          return row.reservations
            .sort((a, b) => {
              if (a.first_name < b.first_name) {
                return -1;
              }

              if (a.first_name > b.first_name) {
                return 1;
              }

              return 0;
            })
            .map((reservation) => {
              return `${reservation.first_name} ${reservation.last_name} ${reservation.username}`;
            });
        },
      },
      {
        hidden: true,
        Header: "Reservations",
        id: "reservations",
        accessor: "reservations",
      },
    ];
  }, []);

  const renderRowSubComponent = useCallback(
    ({ row }) => {
      return (
        <div className="ticker-reservation-table">
          {row.values.reservations.length > 0 ? (
            row.values.reservations.map((reservation) => {
              const classes = classNames(
                "ticker-reservation-table__item ticker-reservation-table-item",
                reservation.checked_in
                  ? "ticker-reservation-table__item--active"
                  : null
              );

              return (
                <div className={classes} key={reservation.id}>
                  <span className="ticker-reservation-table-item__details">
                    <strong>
                      {reservation.first_name} {reservation.last_name}
                      {reservation.quantity > 1 && (
                        <span>(+{reservation.quantity - 1})</span>
                      )}
                    </strong>
                    <span>{reservation.username}</span>
                  </span>

                  <span className="ticker-reservation-table-item__cancel">
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeletion(reservation.id)}
                    >
                      Delete
                    </Button>
                  </span>

                  <span className="ticker-reservation-table-item__check-in">
                    {!reservation.checked_in ? (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleUpdate(reservation.id, true)}
                      >
                        Check in
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleUpdate(reservation.id, false)}
                      >
                        Check out
                      </Button>
                    )}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="ticker-reservation-table__item">
              <em>No reservations!</em>
            </div>
          )}
        </div>
      );
    },
    [fetched]
  );

  if (!scheduleData) {
    return <Loader />;
  }

  return (
    <Fragment>
      <div className="page-title">
        <h1 className="t--alpha">
          Ticker – Updated:&nbsp;
          <mark>{fetched.format("H:mm:s")}</mark>
        </h1>

        <h2 className="t--gamma">
          Currently checked in:&nbsp;
          <mark>{scheduleData.pendingCheckIns}</mark>
        </h2>
      </div>

      <Table
        columns={columns}
        data={scheduleData.schedule}
        setYmd={setSelectedDate}
        ymd={selectedDate}
        renderRowSubComponent={renderRowSubComponent}
      />
    </Fragment>
  );
};

export { Index };
