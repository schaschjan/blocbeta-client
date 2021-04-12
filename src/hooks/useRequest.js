import useSWR from "swr";
import axios from "axios";
import {useContext} from "react";
import {BoulderDBUIContext} from "../components/BoulderDBUI";

let options = {
    baseURL: process.env.REACT_APP_API_HOST,
    headers: {},
};

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    options.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

const axiosInstance = axios.create(options);

function useUri(uri, locationResource = true) {
    const {currentLocation} = useContext(BoulderDBUIContext);

    let url = "/api";

    if (locationResource) {
        if (!currentLocation) {
            throw new Error("Unable to resolve current location");
        }

        url += `/${currentLocation.url}`;
    }

    url += uri;

    return url;
}

const useApi = (uri, locationResource = true, requestConfig) => {
    const url = useUri(uri, locationResource);

    return async (data) =>
        axiosInstance({
            ...requestConfig,
            url,
            data,
        });
};

const useRequest = (
    uri,
    locationResource = true,
    requestConfig = {method: "get"}
) => {
    const {reset} = useContext(BoulderDBUIContext);
    const url = useUri(uri, locationResource);

    return useSWR(url, async (url) => {

        try {
            const {data} = await axiosInstance({
                ...requestConfig,
                url,
            });

            return data;
        } catch (error) {
            if (error.response.status === 401) {
                reset();
            }
        }
    });
};

const useHttp = () => axiosInstance;

export {useRequest, useApi, useUri, useHttp};
