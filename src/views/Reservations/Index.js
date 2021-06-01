import React, { Fragment, useContext } from "react";
import AddToCalendar from "react-add-to-calendar";
import "./Index.css";
import { extractErrorMessage } from "../../hooks/useApi";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import Emoji from "../../components/Emoji/Emoji";
import { Button } from "../../components/Button/Button";
import { useHttp, useRequest } from "../../hooks/useRequest";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { mutate } from "swr";

const Index = () => {
  const {
    currentLocation: { id: locationId },
    contextualizedApiPath,
  } = useContext(BoulderDBUIContext);
  const http = useHttp();
  const { dispatch } = useContext(ToastContext);
  const { data: reservations } = useRequest("/reservation/pending");
  const { data: location } = useRequest(`/location/${locationId}`);

  return (
    <>
      <h1 className="t--alpha page-title">Reservations</h1>

      <ul className="blocked-time-slots">
        {reservations && location ? (
          reservations.map((pending) => {
            const event = {
              title: `Bouldern (+ ${pending.quantity - 1})`,
              description: "",
              location: `${location.address_line_one} ${location.zip}, ${location.city}`,
              startTime: `${pending.date} ${pending.start_time}`,
              endTime: `${pending.date} ${pending.end_time}`,
            };

            return (
              <li
                className="blocked-time-slots__item blocked-time-slots-item"
                key={pending.id}
              >
                <span>
                  On {pending.date} • From {pending.start_time} to{" "}
                  {pending.end_time}
                </span>

                <span>
                  {pending.quantity > 1 && (
                    <Fragment>+{pending.quantity - 1}</Fragment>
                  )}
                </span>

                <div className="blocked-time-slots-item__calendar">
                  <AddToCalendar event={event} buttonLabel="Copy to Calendar" />
                </div>

                <Button
                  variant="danger"
                  size="small"
                  onClick={async () => {
                    try {
                      await http.delete(`/reservation/${pending.id}`);

                      await mutate(contextualizedApiPath("/schedule"));
                      await mutate(
                        contextualizedApiPath("/reservation/pending")
                      );
                      await mutate(
                        contextualizedApiPath("/reservation/pending/count")
                      );
                    } catch (error) {
                      console.error(error.response);
                      dispatch(
                        toast("Error", extractErrorMessage(error), "error")
                      );
                    }
                  }}
                >
                  Cancel
                </Button>
              </li>
            );
          })
        ) : (
          <h2 className="t--gamma">
            <Emoji>🤷</Emoji>
          </h2>
        )}
      </ul>
    </>
  );
};
export { Index };
