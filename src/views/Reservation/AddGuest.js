import React, {useContext, Fragment, useState} from "react";
import {Meta} from "../../App";
import {FormRow} from "../../components/Form/Form";
import {buildClassNames, composeFormElement, handleApiErrors} from "../..";
import Input from "../../components/Input/Input";
import ResourceDependantSelect from "../../components/ResourceDependantSelect/ResourceDependantSelect";
import {api} from "../../helper/api";
import {useApiV2} from "../../hooks/useApi";
import "./AddGuest.css";
import moment from "moment";
import {Loader} from "../../components/Loader/Loader";
import {queryCache, useMutation, useQuery} from "react-query";
import {BookButton} from "../Schedule/Schedule";
import {useHistory} from "react-router-dom";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";

const TimeSlotList = ({ymd, roomId, user}) => {

  const history = useHistory();
  const {contextualizedPath} = useContext(BlocBetaUIContext);

  const {status: scheduleStatus, data: schedule} = useQuery(["schedule", {
    ymd,
    roomId
  }], useApiV2("schedule", {ymd, roomId}));

  const [mutateDeletion, {status: deletionMutationStatus, error: deletionMutationError}] = useMutation(useApiV2("unBlockTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule", {ymd, roomId}]);
      queryCache.invalidateQueries(["ticker", {ymd}]);
    },
  });

  const [mutateCreation, {status: creationMutationStatus, error: creationMutationError}] = useMutation(useApiV2("blockGuestTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule", {ymd, roomId}]);
      queryCache.invalidateQueries(["ticker", {ymd}]);
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
          "quantity": quantity,
          ...user
        }
      });

      alert("Reservation created!");
      history.push(contextualizedPath("/dashboard"));


    } catch (e) {
      handleApiErrors(e)
    }
  };

  const unblockTimeSlot = async (id) => {
    try {
      await mutateDeletion({id});
    } catch (e) {
      handleApiErrors(e)
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
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());

  const [user, setUser] = useState({
    first_name: null,
    last_name: null,
    email: null
  });

  return <Fragment>
    <Meta title="Add time slot exclusion"/>

    <div className="side-title-layout">
      <h1 className="t--alpha side-title-layout__title">
        Add a new guest reservation.
      </h1>

      <div className="side-title-layout__content">
        <FormRow>
          {composeFormElement(
            "date",
            "Date",
            selectedDate.format("Y-MM-DD"),
            Input,
            (event) => {
              setSelectedDate(moment(event.target.value, "Y-MM-DD"))
            },
            {
              type: "date",
              required: true
            }
          )}
        </FormRow>

        <FormRow>
          {composeFormElement(
            "room",
            "Room",
            selectedRoom,
            ResourceDependantSelect,
            (event) => setSelectedRoom(event.target.value),
            {
              required: "required",
              cacheKey: "room",
              api: () => api.rooms.index(),
              labelProperty: "name"
            }
          )}
        </FormRow>

        <FormRow>
          <h2 className="t--gamma">User</h2>
        </FormRow>

        <FormRow>
          {composeFormElement(
            "first_name",
            "First Name",
            user.first_name,
            Input,
            (event) => setUser({
              ...user,
              first_name: event.target.value
            }),
            {
              required: "required",
            }
          )}
        </FormRow>

        <FormRow>
          {composeFormElement(
            "last_name",
            "Last Name",
            user.last_name,
            Input,
            (event) => setUser({
              ...user,
              last_name: event.target.value
            }),
            {
              required: "required",
            }
          )}
        </FormRow>

        <FormRow>
          {composeFormElement(
            "email",
            "E-Mail",
            user.email,
            Input,
            (event) => setUser({
              ...user,
              email: event.target.value
            }),
            {
              type: "email",
            }
          )}
        </FormRow>

        <FormRow>
          <h2 className="t--gamma">Time Slots</h2>

          {(selectedRoom && selectedDate) && (
            <TimeSlotList ymd={selectedDate.format("Y-MM-DD")}
                          roomId={selectedRoom}
                          user={user}/>
          )}
        </FormRow>
      </div>
    </div>
  </Fragment>
}
