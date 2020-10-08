import React, {Fragment} from "react";
import {useQuery} from "react-query";
import {api, cache} from "../../../helper/api";
import {LoadedContent} from "../../../components/Loader/Loader";
import EmptyState from "../../../components/EmptyState/EmptyState";

const IndexTimeSlotBlocker = () => {
  const {status, data} = useQuery(cache.timeSlotExclusion, async () => {
    const {data: exclusions} = await api.timeSlotExclusion.index();
    const {data: rooms} = await api.rooms.index();

    return exclusions.map(exclusion => {
      return {
        ...exclusion,
        room: rooms.find(room => room.id === exclusion.room_id)
      }
    });
  });

  return <Fragment>
    <h1 className="t--alpha page-title">
      Time Slot Blocker
    </h1>

    <LoadedContent loading={status === "loading"}>

      <EmptyState isEmpty={!data || data.length === 0}>
        <ul className="blocked-time-slots">
          {data && data.map(pending => {
            return (
              <li className="blocked-time-slots__item blocked-time-slots-item" key={pending.id}>
                <span>
                  From {pending.start_date} to {pending.end_date}
                  <strong>@{pending.room.name}</strong>
                </span>
                <span>{pending.quantity}</span>
                <span>{pending.note}</span>
              </li>
            )
          })}
        </ul>
      </EmptyState>

    </LoadedContent>

  </Fragment>
};

export default IndexTimeSlotBlocker