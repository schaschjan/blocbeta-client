import React, {Fragment, useContext} from "react";
import {queryCache, useMutation, useQuery} from "react-query";
import AddToCalendar from "react-add-to-calendar"
import {Button, Loader} from "../../index";
import "./Reservations.css";
import {useApiV2} from "../../hooks/useApi";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";

export default () => {
  const {status, data} = useQuery("reservations", useApiV2("reservations"));

  const {currentLocation} = useContext(BlocBetaUIContext);

  const [mutateDeletion, {
    status: deletionMutationStatus,
    error: deletionMutationError
  }] = useMutation(useApiV2("unBlockTimeSlot"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries("schedule");
      queryCache.invalidateQueries("reservations");
    },
  });

  return (
    <Fragment>
      <h1 className="t--alpha page-title">
        Reservations
      </h1>

      {status === "loading" ? (
        <Loader/>
      ) : (
        <ul className="blocked-time-slots">
          {data.map(pending => {
            const event = {
              title: "Bouldern",
              description: "",
              location: `${currentLocation.address_line_one} ${currentLocation.zip}, ${currentLocation.city}`,
              startTime: `${pending.date} ${pending.start_time}`,
              endTime: `${pending.date} ${pending.end_time}`
            };

            return (
              <li className="blocked-time-slots__item blocked-time-slots-item" key={pending.id}>
                <span>On {pending.date} • From {pending.start_time} to {pending.end_time}</span>

                <div className="blocked-time-slots-item__calendar">
                  <AddToCalendar event={event} buttonLabel="Add to Calendar"/>
                </div>

                <Button variant="text" onClick={async () => {
                  await mutateDeletion({id: pending.id});
                }}>Cancel</Button>
              </li>
            )
          })}
        </ul>
      )}
    </Fragment>
  )
}