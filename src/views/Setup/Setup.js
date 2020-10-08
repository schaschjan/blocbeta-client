import React, {Fragment, useContext} from "react";
import {AppContext, Meta} from "../../App";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import Wrapper from "../../components/Wrapper/Wrapper";
import {alphaSort} from "../../helpers";
import {useHistory} from "react-router-dom";
import {useQuery} from "react-query";
import axios from "axios";
import {Loader} from "../../index";
import {LoadedContent} from "../../components/Loader/Loader";

const Setup = () => {
  let history = useHistory();
  const {setCurrentLocation} = useContext(AppContext);

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
          Please provide some information for your account.
        </h1>

        <div className="side-title-layout__content">

          <LoadedContent loading={status === "loading"}>
            Choose your gym:
            <ul>
              {alphaSort(locations, "name").map((location) => {
                return (
                  <li onClick={() => switchLocation(location)}>
                    {location.name}
                  </li>
                );
              })}
            </ul>

            Want to track your progress in privacy? You can edit your visibility settings in the account page.
          </LoadedContent>
        </div>
      </div>
    </Fragment>
  );
};

export default Setup;
