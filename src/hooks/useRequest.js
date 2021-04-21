import useSWR from "swr";
import axios from "axios";
import { useContext, useMemo } from "react";
import { BoulderDBUIContext } from "../components/BoulderDBUI";

let options = {
  baseURL: process.env.REACT_APP_API_HOST,
  headers: {},
};

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  options.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

const axiosInstance = axios.create(options);

const useRequest = (
  uri,
  locationResource = true,
  requestConfig = { method: "get" },
  swrConfig
) => {
  const { reset, contextualizedApiPath } = useContext(BoulderDBUIContext);

  return useSWR(
    locationResource ? contextualizedApiPath(uri) : `/api${uri}`,
    async (url) => {
      try {
        const { data } = await axiosInstance({
          ...requestConfig,
          url,
        });

        return data;
      } catch (error) {
        if (
          error.response.status === 401 &&
          process.env.NODE_ENV !== "development"
        ) {
          reset();
        }
      }
    },
    swrConfig
  );
};

const getApiHost = () => {
  const { REACT_APP_API_HOST: host } = process.env;

  return `${host ? host : ""}/api`;
};

const useHttp = (locationSpecific = true) => {
  const { currentLocation } = useContext(BoulderDBUIContext);

  if (!currentLocation && locationSpecific) {
    throw new Error("Unable to resolve current location");
  }

  return useMemo(() => {
    const baseURL = locationSpecific
      ? `${getApiHost()}/${currentLocation.url}`
      : getApiHost();

    let options = {
      baseURL,
      headers: {},
    };

    if (
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined"
    ) {
      options.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }

    return axios.create(options);
  }, [currentLocation]);
};

export { useRequest, useHttp, getApiHost };
