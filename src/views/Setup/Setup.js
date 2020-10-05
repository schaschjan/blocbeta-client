import React, {Fragment, useContext} from "react";
import {AppContext, Meta} from "../../App";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import Wrapper from "../../components/Wrapper/Wrapper";
import {alphaSort} from "../../helpers";
import {useHistory} from "react-router-dom";
import {useQuery} from "react-query";
import axios from "axios";
import {Loader} from "../../index";

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

  if (status === "loading") return <Loader/>;

  return (
    <Fragment>
      <Meta title="Setup your account"/>
      <PageHeader title="Setup your account"/>

      <Wrapper>
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
      </Wrapper>
    </Fragment>
  );
};

export default Setup;
