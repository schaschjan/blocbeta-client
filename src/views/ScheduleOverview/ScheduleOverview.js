import React, {Fragment, useEffect, useState} from "react";
import {queryCache, useMutation, useQuery} from "react-query";
import {useParams} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "./ScheduleOverview.css";
import {Loader, Downward, AccordionItem, Accordion} from "./../../index";


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

              <Accordion>
                {room.schedule.map(timeSlot => {
                  return (
                    <AccordionItem
                      itemId={timeSlot.hash}
                      content={
                        <table className="reservation-grid">
                          {timeSlot.reservations.map(reservation => {
                            return (
                              <div className="reservation-grid__item" key={reservation.hash}>
                                <strong>{reservation.first_name} {reservation.last_name}</strong>
                                <p> {reservation.username}</p>
                              </div>
                            )
                          })}
                        </table>
                      }
                      header={
                        <Fragment>
                          <div className="t--zeta">
                            {timeSlot.start_time} - {timeSlot.end_time}
                          </div>

                          <div className="t--zeta">
                            {timeSlot.available} / {timeSlot.capacity}
                          </div>

                        </Fragment>
                      }
                      defaultRevealed={false}
                    />
                  );
                })}
              </Accordion>

            </div>
          })}
        </div>
      ) : (
        <Loader/>
      )}
    </Fragment>
  )
}