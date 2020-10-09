import React, {Fragment, useContext} from "react";
import {AppContext, Meta} from "../../App";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import {useHistory} from "react-router-dom";
import {useQuery} from "react-query";
import axios from "axios";
import {LoadedContent} from "../../components/Loader/Loader";
import "./Setup.css"
import {BlocBetaUIContext} from "../../components/BlocBetaUI";

const Setup = () => {
  let history = useHistory();
  const {setCurrentLocation} = useContext(BlocBetaUIContext);

  const {status, data: locations} = useQuery("stat-boulders", async () => {
    const {data} = await axios.get(`/api/location`);

    return data;
  });

  const switchLocation = (location) => {
    setCurrentLocation(location);
    history.push(`${location.url}/dashboard`);
  };

  return (
    <Fragment>
      <Meta title="Setup your account"/>
      <PageHeader title="Setup your account"/>

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Please choose your default gym:
        </h1>

        <div className="side-title-layout__content">
          <LoadedContent loading={status === "loading"}>
            <ul className="setup-location-list">
              {locations && locations.map((location) => {
                return (
                  <li onClick={() => switchLocation(location)} className="setup-location-list__item">
                    <h2 className="t--beta">{location.name}</h2>
                  </li>
                );
              })}
            </ul>

            {/*<em>*/}
            {/*  Want to track your progress in privacy? You can edit your visibility settings in the account page.*/}
            {/*</em>*/}
          </LoadedContent>
        </div>
      </div>
    </Fragment>
  );
};

export default Setup;
