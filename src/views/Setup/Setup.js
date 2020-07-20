import React, { useContext } from "react";
import Container from "../../components/Container/Container";
import { AppContext, Meta } from "../../App";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import Wrapper from "../../components/Wrapper/Wrapper";
import useApi, { api, cacheKeys } from "../../hooks/useApi";
import { Loader } from "../../components/Loader/Loader";
import { alphaSort } from "../../helpers";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Setup = () => {
  let history = useHistory();
  const { setCurrentLocation } = useContext(AppContext);
  const { status, data: locations } = useApi(
    cacheKeys.locations,
    api.locations.public
  );

  const switchLocation = (location) => {
    setCurrentLocation(location);

    history.push(`${location.url}/dashboard`);
  };

  if (status === "loading") return <Loader />;

  return (
    <Container>
      <Meta title="Setup your account" />
      <PageHeader title="Setup your account" />

      <Wrapper>
        Choose your gym:
        {alphaSort(locations, "name").map((location) => {
          return (
            <span onClick={() => switchLocation(location)}>
              {location.name}
            </span>
          );
        })}
      </Wrapper>
    </Container>
  );
};

export default Setup;
