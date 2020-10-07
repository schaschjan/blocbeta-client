import React, {Fragment, useEffect, useState} from "react";
import {Select} from "../../index";
import {useApiV2} from "../../hooks/useApi";
import {useQuery} from "react-query";
import "./RoomSelect.css";

export default ({changeHandler}) => {
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

  return <div className="room-select">
    <h2 className="t--gamma room-select__label">Room:</h2>
    <Select
      value={selectedRoom}
      onChange={(event) => {
        setSelectedRoom(event.target.value);
        changeHandler(event.target.value);
      }}>
      {roomsStatus === "success" && (
        <Fragment>
          {rooms.map(room => <option value={room.id} key={room.id}>{room.name}</option>)}
        </Fragment>
      )}
    </Select>
  </div>
};
