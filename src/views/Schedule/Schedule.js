import React, {Fragment, useEffect, useState} from "react";
import 'react-dates/initialize';
import DatePicker from "../../components/DatePicker/DatePicker";
import moment from "moment";
import {queryCache, useMutation, useQuery} from "react-query";
import classNames from 'classnames';
import {Button, Select, buildClassNames} from "./../../index";
import "./Schedule.css";
import {useApiV2} from "../../hooks/useApi";
import {Loader} from "../../components/Loader/Loader";

const TimeSlotList = ({date, roomId}) => {

  const ymdDate = date.format("Y-MM-DD");
  const {status: scheduleStatus, data: schedule} = useQuery(["schedule", {ymdDate, roomId}], useApiV2("schedule", {ymdDate, roomId}));

  const [mutateDeletion, {status: deletionMutationStatus, error: deletionMutationError}] = useMutation(useApiV2("unBlockTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule", {ymdDate, roomId}]);
      queryCache.invalidateQueries("reservations-count");
    },
  });

  const [mutateCreation, {status: creationMutationStatus, error: creationMutationError}] = useMutation(useApiV2("blockTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule", {ymdDate, roomId}]);
      queryCache.invalidateQueries("reservations-count");
    },
  });

  const blockTimeSlot = async (timeSlot) => {
    await mutateCreation({
      payload: {
        "start_time": timeSlot.start_time,
        "end_time": timeSlot.end_time,
        "date": ymdDate,
        "room": roomId
      }
    });
  };

  const unblockTimeSlot = async (id) => {
    await mutateDeletion({id});
  };

  const findPendingReservation = () => {
    return schedule.find(timeSlot => timeSlot.reservation !== null);
  };

  if (scheduleStatus === "loading") return <Loader/>;

  return (
    <div className="schedule-list">
      <ul className="schedule-list__header">
        <li className="t--zeta">
          Time
        </li>

        <li className="t--zeta">
          Capacity
        </li>
      </ul>

      {(schedule.length ? (
        <ul className={classNames("schedule-list__time-slot-list", "time-slot-list")}>
          {schedule.map(timeSlot => {

            const dayHasBlockedTimeSlot = findPendingReservation();
            const timeSlotIsBlocked = timeSlot.reservation;
            const timeSlotIsFullyBlocked = timeSlot.available === 0;

            return (
              <li key={timeSlot.hash}
                  className={buildClassNames(
                    "time-slot-list__item time-slot-list-item",
                    timeSlotIsBlocked ? "time-slot-list-item--blocked" : null,
                    ((dayHasBlockedTimeSlot || timeSlotIsFullyBlocked) && !timeSlotIsBlocked) ? "time-slot-list-item--disabled" : null
                  )}>

                <div className="time-slot-list-item__time t--zeta">
                  {timeSlot.start_time} - {timeSlot.end_time}
                </div>

                <div className="time-slot-list-item__capacity t--zeta">
                  {timeSlot.available} / {timeSlot.capacity}
                </div>

                <div className="time-slot-list-item__action">
                  {!timeSlotIsBlocked ? (

                    <Fragment>
                      {timeSlotIsFullyBlocked ? (
                        <Button variant="text">
                          Fully booked
                        </Button>
                      ) : (
                        <Button variant="primary" size="small" onClick={() => blockTimeSlot(timeSlot)}>
                          Book!
                        </Button>
                      )}
                    </Fragment>

                  ) : (
                    <Button variant="primary" size="small" modifier="inverted" onClick={() => unblockTimeSlot(timeSlot.reservation)}>
                      Cancel!
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <Fragment>Not configured!</Fragment>
      ))}
    </div>
  )
};

export default () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedRoom, setSelectedRoom] = useState(null);

  const {status: roomsStatus, data: rooms} = useQuery("rooms", useApiV2("rooms"));

  useEffect(() => {
    if (!rooms) {
      return
    }

    if (rooms.length) {
      setSelectedRoom(rooms[0].id);
    }

  }, [rooms]);

  const RoomSelect = () => {

    return <div className="room-select">
      <h2 className="t--gamma room-select__label">Room:</h2>
      <Select onChange={(event) => setSelectedRoom(event.target.value)}
              value={selectedRoom}>
        {roomsStatus === "success" && (
          <Fragment>
            {rooms.map((room, index) => <option value={room.id} key={room.id}>{room.name}</option>)}
          </Fragment>
        )}
      </Select>
    </div>
  };

  if (!selectedRoom) {
    return <Loader/>
  }

  return (
    <Fragment>
      <h1 className="t--alpha page-title">
        Schedule
      </h1>

      <RoomSelect/>

      <div className="schedule">
        <div className="schedule__datepicker">
          <DatePicker
            hideKeyboardShortcutsPanel={true}
            readOnly={true}
            date={selectedDate}
            onDateChange={(date) => setSelectedDate(date)}
            focused={true}
            id="mainPicker"
          />
        </div>

        <div className="schedule__list schedule-list">
          <h2 className="schedule-list__title t--gamma">Available Time Slots</h2>

          <TimeSlotList date={selectedDate} roomId={selectedRoom}/>
        </div>
      </div>
    </Fragment>
  )
}