import React, {Fragment, useContext, useEffect, useState} from "react";
import 'react-dates/initialize';
import moment from "moment";
import {queryCache, useMutation, useQuery} from "react-query";
import {Button, Select, buildClassNames} from "./../../index";
import "./Schedule.css";
import {extractErrorMessage, useApi} from "../../hooks/useApi";
import {Loader} from "../../components/Loader/Loader";
import {DatePicker} from "../../components/DatePicker/DatePicker";
import {Counter} from "../../components/Counter/Counter";
import {toast, ToastContext} from "../../components/Toaster/Toaster";

export const BookButton = ({isFull, isDisabled, isBlocked, timeSlot, blockHandler, unBlockHandler}) => {

  const [quantity, setQuantity] = useState(1);

  if (isDisabled) {
    return <Button variant="text">
      disabled
    </Button>
  }

  if (isBlocked) {
    return <Button variant="primary" size="small" modifier="inverted"
                   onClick={() => unBlockHandler(timeSlot.reservation)}>
      Cancel!
    </Button>;
  }

  if (isFull) {
    return <Button variant="text">
      Fully booked
    </Button>
  }

  return (
    <Fragment>
      <Counter max={timeSlot.allow_quantity}
               onChange={(count) => setQuantity(count)}/>

      <Button variant="primary" size="small" onClick={() => blockHandler(timeSlot, quantity)}>
        Book!
      </Button>
    </Fragment>
  )
};

const TimeSlotList = ({ymd, roomId}) => {
  const {dispatch} = useContext(ToastContext);

  const {status: scheduleStatus, data: schedule} = useQuery(["schedule", {
    ymd,
    roomId
  }], useApi("schedule", {ymd, roomId}));

  const [mutateDeletion, {status: deletionMutationStatus, error: deletionMutationError}] = useMutation(useApi("unBlockTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule", {ymd, roomId}]);
      queryCache.invalidateQueries("reservations-count");
    },
  });

  const [mutateCreation, {status: creationMutationStatus, error: creationMutationError}] = useMutation(useApi("blockTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule", {ymd, roomId}]);
      queryCache.invalidateQueries("reservations-count");
    },
  });

  const blockTimeSlot = async (timeSlot, quantity) => {

    try {
      await mutateCreation({
        payload: {
          "start_time": timeSlot.start_time,
          "end_time": timeSlot.end_time,
          "date": ymd,
          "room": roomId,
          "quantity": quantity
        }
      });
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

  const unblockTimeSlot = async (id) => {

    try {
      await mutateDeletion({id});
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
        <ul className={buildClassNames("schedule-list__time-slot-list", "time-slot-list")}>
          {schedule.map(timeSlot => {

            const dayHasBlockedTimeSlot = findPendingReservation();
            const timeSlotIsBlocked = timeSlot.reservation;
            const timeSlotIsFull = timeSlot.available === 0;
            const isPassed = moment() > moment(ymd + ' ' + timeSlot.end_time);
            const isDisabled = timeSlot.capacity === 0;

            return (
              <li key={timeSlot.hash}
                  className={buildClassNames(
                    "time-slot-list__item time-slot-list-item",
                    timeSlotIsBlocked ? "time-slot-list-item--blocked" : null,
                    isPassed ? "time-slot-list-item--disabled" : null,
                    ((dayHasBlockedTimeSlot || timeSlotIsFull || isDisabled) && !timeSlotIsBlocked) ? "time-slot-list-item--disabled" : null
                  )}>

                <div className="time-slot-list-item__time t--zeta">
                  {timeSlot.start_time} - {timeSlot.end_time}
                </div>

                <div className="time-slot-list-item__capacity t--zeta">
                  {timeSlot.available} / {timeSlot.capacity}
                </div>

                <div className="time-slot-list-item__action">
                  <BookButton blockHandler={blockTimeSlot}
                              timeSlot={timeSlot}
                              unBlockHandler={unblockTimeSlot}
                              isBlocked={timeSlotIsBlocked}
                              isDisabled={isDisabled}
                              isFull={timeSlotIsFull}/>
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

  const {status: roomsStatus, data: rooms} = useQuery("rooms", useApi("rooms"));

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

          <TimeSlotList ymd={selectedDate.format("Y-MM-DD")} roomId={selectedRoom}/>
        </div>
      </div>
    </Fragment>
  )
}
