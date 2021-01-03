import React, { Fragment, useContext } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import "./Index.css";
import { cache, useApi } from "../../hooks/useApi";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import Emoji from "../../components/Emoji/Emoji";
import { LoadedContent } from "../../components/Loader/Loader";

const Index = () => {
  const {
    currentLocation: { id: locationId },
  } = useContext(BoulderDBUIContext);

  const { status: reservationStatus, data: reservations } = useQuery(
    "doubts",
    useApi("doubts")
  );

  const { status: locationStatus, data: location } = useQuery(
    [cache.location, { locationId }],
    useApi("location", { id: locationId })
  );

  const [
    mutateDeletion,
    { status: deletionMutationStatus, error: deletionMutationError },
  ] = useMutation(useApi("deleteReservation"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries("schedule");
      queryCache.invalidateQueries("reservations");
      queryCache.invalidateQueries("reservations-count");
    },
  });

  return (
    <Fragment>
      <h1 className="t--alpha page-title">Doubts</h1>

      <LoadedContent
        loading={[locationStatus, reservationStatus].includes("loading")}
      >
        <h2 className="t--gamma">
          <Emoji>🤷</Emoji>
        </h2>
      </LoadedContent>
    </Fragment>
  );
};

export { Index };
