import React, { Fragment, useContext, useEffect, useState } from "react";
import "react-dates/initialize";
import moment from "moment";
import { extractErrorMessage } from "../../hooks/useApi";
import { Loader } from "../../components/Loader/Loader";
import { DatePicker } from "../../components/DatePicker/DatePicker";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { classNames } from "../../helper/classNames";
import { Select } from "../../components/Select/Select";
import { BookButton } from "../../components/BookButton/BookButton";
import "./Index.css";
import { useHttp, useRequest } from "../../hooks/useRequest";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { mutate } from "swr";

const TimeSlotList = ({ ymd, roomId }) => {
  const { dispatch } = useContext(ToastContext);
  const { data: schedule } = useRequest(`/schedule/${roomId}/${ymd}`);
  const http = useHttp();
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);

  const blockTimeSlot = async (timeSlot, quantity) => {
    try {
      await http.post(`/reservation`, {
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        date: ymd,
        room: roomId,
        quantity: quantity,
      });

      await mutate(contextualizedApiPath(`/schedule/${roomId}/${ymd}`));
      await mutate(contextualizedApiPath(`/reservation/pending/count`));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const unblockTimeSlot = async (id) => {
    try {
      await http.delete(`/reservation/${id}`);

      await mutate(contextualizedApiPath(`/schedule/${roomId}/${ymd}`));
      await mutate(contextualizedApiPath(`/reservation/pending/count`));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const findPendingReservation = () => {
    return schedule.find((timeSlot) => timeSlot.reservation !== null);
  };

  return (
    <div className="schedule-list">
      <ul className="schedule-list__header">
        <li className="t--epsilon">Time</li>

        <li className="t--epsilon">Capacity</li>
      </ul>

      {schedule && schedule.length ? (
        <ul
          className={classNames(
            "schedule-list__time-slot-list",
            "time-slot-list"
          )}
        >
          {schedule.map((timeSlot) => {
            const dayHasBlockedTimeSlot = findPendingReservation();
            const timeSlotIsBlocked = timeSlot.reservation;
            const timeSlotIsFull = timeSlot.available === 0;
            const isPassed = moment() > moment(ymd + " " + timeSlot.end_time);
            const isDisabled = timeSlot.capacity === 0;

            return (
              <li
                key={timeSlot.hash}
                className={classNames(
                  "time-slot-list__item time-slot-list-item",
                  timeSlotIsBlocked ? "time-slot-list-item--blocked" : null,
                  isPassed ? "time-slot-list-item--disabled" : null,
                  (dayHasBlockedTimeSlot || timeSlotIsFull || isDisabled) &&
                    !timeSlotIsBlocked
                    ? "time-slot-list-item--disabled"
                    : null
                )}
              >
                <div className="time-slot-list-item__time t--epsilon">
                  {timeSlot.start_time} - {timeSlot.end_time}
                </div>

                <div className="time-slot-list-item__capacity t--epsilon">
                  {timeSlot.available} / {timeSlot.capacity}
                </div>

                <div className="time-slot-list-item__action">
                  <BookButton
                    blockHandler={blockTimeSlot}
                    timeSlot={timeSlot}
                    unBlockHandler={unblockTimeSlot}
                    isBlocked={timeSlotIsBlocked}
                    isDisabled={isDisabled}
                    isFull={timeSlotIsFull}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <Loader />
      )}
    </div>
  );
};

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedRoomId, setSelectedRoom] = useState(null);
  const { data: rooms } = useRequest("/room");

  useEffect(() => {
    if (!rooms) {
      return;
    }

    if (rooms.length) {
      setSelectedRoom(rooms[0].id);
    }
  }, [rooms]);

  const RoomSelect = () => {
    return (
      <div className="room-select">
        <h2 className="t--gamma room-select__label">Room:</h2>
        <Select
          onChange={(event) => setSelectedRoom(event.target.value)}
          value={selectedRoomId}
        >
          {rooms.map((room) => (
            <option value={room.id} key={room.id}>
              {room.name}
            </option>
          ))}
        </Select>
      </div>
    );
  };

  if (!selectedRoomId) {
    return <Loader />;
  }

  const selectedRoom = rooms.find(
    (room) => room.id === parseInt(selectedRoomId)
  );

  return (
    <Fragment>
      <h1 className="t--alpha page-title">Schedule</h1>

      <div className="schedule-header">
        {rooms.length > 1 && <RoomSelect />}

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
          <h2 className="schedule-list__title t--gamma">
            Available Time Slots
          </h2>

          <TimeSlotList
            ymd={selectedDate.format("Y-MM-DD")}
            roomId={selectedRoomId}
          />
        </div>
      </div>
    </Fragment>
  );
};

export { Index };
