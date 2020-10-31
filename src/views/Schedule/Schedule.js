import React, {Fragment, useContext, useEffect, useState} from "react";
import 'react-dates/initialize';
import moment from "moment";
import {queryCache, useMutation, useQuery} from "react-query";
import {Button, Select} from "./../../index";
import "./Schedule.css";
import {cache, extractErrorMessage, queryDefaults, useApi} from "../../hooks/useApi";
import {Loader} from "../../components/Loader/Loader";
import {DatePicker} from "../../components/DatePicker/DatePicker";
import {Counter} from "../../components/Counter/Counter";
import {toast, ToastContext} from "../../components/Toaster/Toaster";
import {classNames} from "../../helper/buildClassNames";

export const BookButton = ({isFull, isDisabled, isBlocked, timeSlot, blockHandler, unBlockHandler}) => {

  const [quantity, setQuantity] = useState(timeSlot.min_quantity);

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
      <Counter max={timeSlot.available < timeSlot.max_quantity ? timeSlot.available : timeSlot.max_quantity}
               min={timeSlot.min_quantity}
               value={quantity}
               onChange={(count) => setQuantity(count)}/>

      <Button variant="primary" size="small" onClick={() => blockHandler(timeSlot, quantity)}>
        Book!
      </Button>
    </Fragment>
  )
};

const TimeSlotList = ({ymd, roomId}) => {
  const {dispatch} = useContext(ToastContext);

  const {status: scheduleStatus, data: schedule} = useQuery(
    ["schedule", {ymd, roomId}],
    useApi("schedule", {ymd, roomId}),
    queryDefaults
  );

  const [mutateDeletion, {status: deletionMutationStatus, error: deletionMutationError}] = useMutation(useApi("deleteReservation"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries([cache.schedule, {ymd, roomId}]);
      queryCache.invalidateQueries(cache.reservationCount);
    },
  });

  const [mutateCreation, {status: creationMutationStatus, error: creationMutationError}] = useMutation(useApi("createReservation"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries([cache.schedule, {ymd, roomId}]);
      queryCache.invalidateQueries(cache.reservationCount);
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
        <li className="t--epsilon">
          Time
        </li>

        <li className="t--epsilon">
          Capacity
        </li>
      </ul>

      {(schedule.length ? (
        <ul className={classNames("schedule-list__time-slot-list", "time-slot-list")}>
          {schedule.map(timeSlot => {

            const dayHasBlockedTimeSlot = findPendingReservation();
            const timeSlotIsBlocked = timeSlot.reservation;
            const timeSlotIsFull = timeSlot.available === 0;
            const isPassed = moment() > moment(ymd + ' ' + timeSlot.end_time);
            const isDisabled = timeSlot.capacity === 0;

            return (
              <li key={timeSlot.hash}
                  className={classNames(
                    "time-slot-list__item time-slot-list-item",
                    timeSlotIsBlocked ? "time-slot-list-item--blocked" : null,
                    isPassed ? "time-slot-list-item--disabled" : null,
                    ((dayHasBlockedTimeSlot || timeSlotIsFull || isDisabled) && !timeSlotIsBlocked) ? "time-slot-list-item--disabled" : null
                  )}>

                <div className="time-slot-list-item__time t--epsilon">
                  {timeSlot.start_time} - {timeSlot.end_time}
                </div>

                <div className="time-slot-list-item__capacity t--epsilon">
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
  const [selectedRoomId, setSelectedRoom] = useState(null);

  const {status: roomsStatus, data: rooms} = useQuery(
    "rooms",
    useApi("rooms"),
    queryDefaults
  );

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
              value={selectedRoomId}>
        {roomsStatus === "success" && (
          <Fragment>
            {rooms.map((room, index) => <option value={room.id} key={room.id}>{room.name}</option>)}
          </Fragment>
        )}
      </Select>
    </div>
  };

  if (!selectedRoomId) {
    return <Loader/>
  }

  const selectedRoom = rooms.find(room => room.id === parseInt(selectedRoomId));

  return (
    <Fragment>
      <h1 className="t--alpha page-title">
        Schedule
      </h1>

      <div className="schedule-header">
        {rooms.length > 1 && (
          <RoomSelect/>
        )}

        {selectedRoom && selectedRoom.instructions && (
          <span>
            <strong className="t--eta">Note: </strong>
            <em className="t--eta">{selectedRoom.instructions}</em>
          </span>
        )}
      </div>

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

          <TimeSlotList ymd={selectedDate.format("Y-MM-DD")} roomId={selectedRoomId}/>
        </div>
      </div>
    </Fragment>
  )
}
