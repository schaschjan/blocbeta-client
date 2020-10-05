import React, {Fragment, useEffect, useState} from "react";
import {queryCache, useMutation, useQuery} from "react-query";
import {useParams} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "./ScheduleOverview.css";
import {Loader, buildClassNames} from "./../../index";

export default () => {
  const {location} = useParams();

  const currentDate = moment();

  const {status, data, isFetching} = useQuery("reservation-rooms", async () => {
    const {data} = await axios.get(`/api/${location}/reservation/rooms`);

    return data;
  }, {
    refetchInterval: (1000 * 20) // 10 seconds
  });

  const [updated, setUpdated] = useState(currentDate.format("LTS"));

  const [mutateReservation, {status: mutateAppearanceStatus, error: mutateAppearanceError}] = useMutation(async ({id, payload}) => {
    await axios.put(`/api/${location}/reservation/${id}`, payload);
  }, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["reservation-rooms"]);
    },
  });

  useEffect(() => {
    setUpdated(moment().format("LTS"));

  }, [isFetching]);

  return (

    <Fragment>
      <h1 className="t--alpha page-title">
        Admin <mark> {currentDate.format("ll")}</mark>
      </h1>

      <em>Updated: {updated}</em>

      {status === "success" ? (
        <div className="room-list">
          {data.map(room => {
            return <div key={room.id} className="room-list__item room-list-item">
              <h2 className="t--gamma room-list-item__title">{room.name}</h2>

              <ul className="room-list-item__schedule room-list-item-schedule">

                {room.schedule.map(item => {
                  return <li key={item.hash} className={"room-list-item-schedule__item"}>

                    <div className="room-list-item-schedule__time t--zeta">
                      {item.start_time} - {item.end_time}
                    </div>

                    <div className="room-list-item-schedule__capacity t--zeta">
                      {item.available} / {item.capacity}
                    </div>

                    <ul className="room-list-item-schedule__reservations room-list-item-schedule-reservations">
                      {item.reservations.map(reservation => {
                        return <li className={buildClassNames(
                          "room-list-item-schedule-reservations__item",
                          "room-list-item-schedule-reservations-item",
                          reservation.appeared ? "room-list-item-schedule-reservations__item--appeared" : null
                        )}>
                          <p className="room-list-item-schedule-reservations-item__detail">First
                            Name: {reservation.first_name}</p>
                          <p className="room-list-item-schedule-reservations-item__detail">Last
                            Name: {reservation.last_name}</p>
                          <p
                            className="room-list-item-schedule-reservations-item__detail">E-Mail: {reservation.email}</p>
                          <p
                            className="room-list-item-schedule-reservations-item__detail">Username: {reservation.username}</p>

                          <button className="room-list-item-schedule-reservations-item__check-in"
                                  onClick={async () => {
                                    await mutateReservation({
                                      id: reservation.id,
                                      payload: {
                                        appeared: reservation.appeared ? false : true
                                      }
                                    });
                                  }}>
                            {reservation.appeared ? "⇦" : "⇨"}
                          </button>
                        </li>
                      })}
                    </ul>
                  </li>
                })}
              </ul>
            </div>

          })}
        </div>
      ) : (
        <Loader/>
      )}
    </Fragment>
  )
}