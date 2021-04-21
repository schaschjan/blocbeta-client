import React, { Fragment, useContext } from "react";
import { Meta } from "../../App";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { useHistory } from "react-router-dom";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { useRequest } from "../../hooks/useRequest";
import "./Index.css";

const Index = () => {
  let history = useHistory();
  const { setCurrentLocation } = useContext(BoulderDBUIContext);
  const { data: locations } = useRequest("/location", false);

  const switchLocation = (location) => {
    setCurrentLocation(location);
    history.push(`${location.url}/boulder`);
  };

  return (
    <Fragment>
      <Meta title="Setup your account" />
      <PageHeader title="Setup your account" />

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Please choose your default gym:
        </h1>

        <div className="side-title-layout__content">
          <ul className="setup-location-list">
            {locations &&
              locations.map((location) => {
                return (
                  <li
                    onClick={() => switchLocation(location)}
                    className="setup-location-list__item"
                  >
                    <h2 className="t--beta">{location.name}</h2>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export { Index };
