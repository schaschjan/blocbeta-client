import useSWR from "swr";
import axios from "axios";
import { useContext } from "react";
import { BoulderDBUIContext } from "../components/BoulderDBUI";

let options = {
  baseURL: process.env.REACT_APP_API_HOST,
  headers: {},
};

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  options.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

const axiosInstance = axios.create(options);

const useRequest = (uri, locationResource = true, requestConfig) => {
  const { currentLocation } = useContext(BoulderDBUIContext);

  let url = "/api";

  if (locationResource) {
    if (!currentLocation) {
      throw new Error("Unable to resolve current location");
    }

    url += `/${currentLocation.url}`;
  }

  url += uri;

  return useSWR(url, async (url) => {
    const { data } = await axiosInstance.get(url, requestConfig);

    return data;
  });
};

export default useRequest;
