import useSWR from "swr";
import { useParams } from "react-router-dom";
import axios from "axios";

let options = {
  baseURL: process.env.REACT_APP_API_HOST,
  headers: {},
};

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  options.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

const axiosInstance = axios.create(options);

const useRequest = (uri, locationResource = true) => {
  const { location } = useParams();

  let url = "/api";

  if (locationResource) {
    url += `/${location}`;
  }

  url += uri;

  return useSWR(
    url,
    async (url) => {
      const { data } = await axiosInstance.get(url);

      return data;
    },
    {
      suspense: true,
    }
  );
};

export default useRequest;
