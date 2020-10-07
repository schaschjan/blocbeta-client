import React, {Fragment, useEffect, useState} from "react";
import {queryCache, useMutation, useQuery} from "react-query";
import {useParams} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "./ScheduleOverview.css";
import {Button, LoadedContent, AccordionItem, Accordion, buildClassNames, Select} from "./../../index";
import {useApiV2} from "../../hooks/useApi";

const ReservationsTicker = ({location, rooms, selectedRoom, handleRoomChange}) => {
  const currentDate = moment();
  const [updated, setUpdated] = useState(currentDate.format("LTS"));

  const {status, data, isFetching} = useQuery(["schedule-admin", {selectedRoom}], async () => {
    const {data} = await axios.get(`/api/${location}/schedule/${selectedRoom}?admin=true`);

    return data;
  }, {
    refetchInterval: (1000 * 20) // 10 seconds
  });

  useEffect(() => {
    setUpdated(moment().format("LTS"));
  }, [isFetching]);

  const [mutateAppearance, {status: mutateAppearanceStatus, error: mutateAppearanceError}] = useMutation(async ({id, appeared}) => {
    await axios.put(`/api/${location}/reservation/${id}`, {appeared});
  }, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(["schedule-admin", {selectedRoom}]);
    },
  });

  return (
    <Fragment>
      <div className="overview-header">

        <div className="overview-header__title">
          <h1 className="t--alpha page-title">
            Schedule for &nbsp;
            <mark> {currentDate.format("ll")}</mark>
          </h1>

          <em>Updated: {updated}</em>
        </div>

        <div className="overview-header__room-select room-select">
          <h2 className="t--gamma room-select__label">Room:</h2>
          <Select
            value={selectedRoom}
            onChange={(event) => handleRoomChange(event.target.value)}>

            <Fragment>
              {rooms.map(room => <option value={room.id} key={room.id}>{room.name}</option>)}
            </Fragment>
          </Select>
        </div>
      </div>

      <Accordion>
        {data && data.map(timeSlot => {
          return (
            <AccordionItem
              itemId={timeSlot.hash}
              header={
                <div className="overview__time-slot">
                  <div className="t--zeta">
                    {timeSlot.start_time} - {timeSlot.end_time}
                  </div>

                  <div className="t--zeta">
                    {timeSlot.available} / {timeSlot.capacity}
                  </div>

                </div>
              }
              content={
                <table className="overview__reservations overview-reservations">
                  {timeSlot.reservations.map(reservation => {

                    return (
                      <div
                        className={buildClassNames("overview-reservations__item overview-reservations-item", reservation.appeared ? "overview-reservations-item--appeared" : null)}
                        key={reservation.hash}>
                        <p
                          className="t--eta overview-reservations-item--detail overview-reservations-item--detail__name">
                          {reservation.first_name} {reservation.last_name}
                        </p>

                        <p className="t--eta overview-reservations-item--detail">
                          {reservation.username}
                        </p>

                        <p className="t--eta overview-reservations-item--detail">
                          {reservation.email}
                        </p>

                        <div className="overview-reservations-item--actions">
                          {!reservation.appeared ? (
                            <Button variant="primary" size="small" onClick={() => mutateAppearance({
                              id: reservation.id,
                              appeared: true
                            })}>
                              Check-In
                            </Button>
                          ) : (
                            <Button variant="primary" size="small" onClick={() => mutateAppearance({
                              id: reservation.id,
                              appeared: false
                            })}>
                              Cancel Check-In
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </table>
              }
              disabled={timeSlot.reservations.length === 0}
              defaultRevealed={false}
            />
          );
        })}
      </Accordion>
    </Fragment>
  );
};

export default () => {
  const {location} = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const {status, data: rooms} = useQuery("rooms", useApiV2("rooms"));

  useEffect(() => {
    if (rooms) {
      setSelectedRoom(rooms[0].id)
    }

  }, [status]);

  return (
    <Fragment>
      <LoadedContent loading={status !== "success" || !selectedRoom}>
        <ReservationsTicker location={location}
                            rooms={rooms}
                            handleRoomChange={(roomId) => setSelectedRoom(roomId)}
                            selectedRoom={selectedRoom}/>
      </LoadedContent>
    </Fragment>
  )
}