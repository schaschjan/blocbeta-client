import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Meta } from "../../App";
import axios from "axios";
import { LoadedContent } from "../../components/Loader/Loader";
import { Button } from "../../components/Button/Button";

const Cancel = () => {
  const { hash } = useParams();
  const [hashFound, setHashFound] = useState(null);
  const [loading, setLoading] = useState(true);

  const cancelReservation = async () => {
    try {
      await axios.get(`/api/cancel-reservation/${hash}`);
      setHashFound(true);
    } catch (e) {
      console.error(e.response.data);
    } finally {
      setLoading(false);
    }
  };

  const getBookingLink = () => {
    const location = localStorage.getItem("location");

    if (!location || location === "null") {
      return "/login";
    }

    const { url } = JSON.parse(location);

    return `/${url}/schedule`;
  };

  useEffect(() => {
    cancelReservation();
  }, [hash]);

  return (
    <Fragment>
      <Meta title="Cancel reservation" />

      <LoadedContent loading={loading}>
        {hashFound === true ? (
          <h1 className="t--alpha page-title">Thank you for cancelling!</h1>
        ) : (
          <h1 className="t--alpha page-title">
            It looks like the reservation has already been cancelled!
          </h1>
        )}

        <Button variant="primary" asLink={true} to={getBookingLink()}>
          Book a new time slot
        </Button>
      </LoadedContent>
    </Fragment>
  );
};

export { Cancel };
