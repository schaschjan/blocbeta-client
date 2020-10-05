import React, {useEffect, useContext} from "react";
import axios from "axios";
import {BlocBetaUIContext} from "../BlocBetaUI";

export default () => {
  const {
    setExpiration,
    setUser,
    setCurrentLocation,
    currentLocation,
  } = useContext(BlocBetaUIContext);

  const locationUrlParameter = window.location.pathname.split("/")[1];

  const initContext = async () => {

    try {
      const {data} = await axios.get(`/api/context`);

      setExpiration(data.expiration);
      setUser(data.user);
      setCurrentLocation(data.location);

    } catch (error) {
      console.error(error.data);
    }
  };

  const switchContext = async () => {
    const {data: locations} = await axios.get(`/api/location`);

    const newLocation = locations.find(location => location.url === locationUrlParameter);
    setCurrentLocation(newLocation);
  };

  useEffect(() => {

    if (!currentLocation) {
      initContext();
    } else {
      switchContext()
    }

  }, [locationUrlParameter]);

  return null
}