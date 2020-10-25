import React, {useContext, Fragment, useState} from "react";
import {Meta} from "../../App";
import {FormRow} from "../../components/Form/Form";
import {composeFormElement} from "../..";
import Input from "../../components/Input/Input";
import ResourceDependantSelect from "../../components/ResourceDependantSelect/ResourceDependantSelect";
import {cache, extractErrorMessage, useApi} from "../../hooks/useApi";
import "./AddGuest.css";
import moment from "moment";
import {Loader} from "../../components/Loader/Loader";
import {queryCache, useMutation, useQuery} from "react-query";
import {BookButton} from "../Schedule/Schedule";
import {useHistory} from "react-router-dom";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import {classNames} from "../../helper/buildClassNames";
import {toast, ToastContext} from "../../components/Toaster/Toaster";

const TimeSlotList = ({ymd, roomId, user}) => {

  const history = useHistory();
  const {contextualizedPath} = useContext(BlocBetaUIContext);
  const {dispatch} = useContext(ToastContext);

  const {status: scheduleStatus, data: schedule} = useQuery(["schedule", {
    ymd,
    roomId
  }], useApi("schedule", {ymd, roomId}));

  const [mutateDeletion, {status: deletionMutationStatus, error: deletionMutationError}] = useMutation(useApi("deleteReservation"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule", {ymd, roomId}]);
      queryCache.invalidateQueries(["ticker", {ymd}]);
    },
  });

  const [mutateCreation, {status: creationMutationStatus, error: creationMutationError}] = useMutation(useApi("createGuestReservation"), {
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

      dispatch(
        toast(
          "Success",
          "Resevervation added!",
          "success"
        )
      );

      history.push(contextualizedPath("/dashboard"));


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
        <ul className={classNames("schedule-list__time-slot-list", "time-slot-list")}>
          {schedule.map(timeSlot => {

            const timeSlotIsFull = timeSlot.available <= 0;
            const isPassed = moment() > moment(ymd + ' ' + timeSlot.end_time);
            const isDisabled = timeSlot.capacity <= 0;

            return (
              <li key={timeSlot.hash}
                  className={classNames(
                    "time-slot-list__item time-slot-list-item",
                    isPassed ? "time-slot-list-item--disabled" : null,
                    (( timeSlotIsFull || isDisabled)) ? "time-slot-list-item--disabled" : null
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
                              isBlocked={false}
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
              cacheKey: cache.rooms,
              api: "rooms",
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
