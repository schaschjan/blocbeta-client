import axios from "axios";
import Context from "../Context";
import {useQuery} from "react-query";
import React, {useContext} from "react";
import {AppContext} from "../App";

export const getUri = (path, contextualize) => {
    if (!contextualize) return `/api${path}`;

    return `/api/${Context.location.current().url}${path}`
};

const getConfig = () => {
    return {
        headers: {Authorization: `Bearer ${api.token}`}
    }
};

export const cacheKeys = {
    boulders: 'boulders',
    ascents: 'ascents',
    walls: 'walls',
    grades: 'grades',
    holdStyles: 'holdStyles',
    setters: 'setters',
    tags: 'tags'
};

export const api = {
    token: null,
    me: {
        get: async () => await httpGet('/me', false),
        update: async (data) => await httpPut('/me', data, false)
    },
    ranking: {
        current: async () => {
            const data = await httpGet('/ranking/current');

            // assign ranks
            data.map((result, rank) => {
                rank++;

                if (rank <= 9) {
                    return result.rank = `0${rank}`;
                }

                return result.rank = rank.toString();
            });

            return data
        }
    },
    stats: {
        resetRotation: async () => await httpGet('/stat/reset-rotation'),
    },
    walls: {
        all: async () => await httpGet('/wall')
    },
    setters: {
        all: async () => await httpGet('/setter')
    },
    boulder: {
        get: async (id) => await httpGet(`/boulder/${id}`),
        active: async () => await httpGet(`/boulder/filter/active`),
        mass: async (data) => await httpPost(`/boulder/mass`, data)
    },
    ascents: {
        active: async () => await httpGet(`/ascent/filter/active`),
        add: async (data) => await httpPost(`/ascent`, data),
        remove: async (id) => await httpDelete(`/ascent/${id}`),
    },
    grades: {
        all: async () => await httpGet('/grade')
    },
    holdStyles: {
        all: async () => await httpGet('/holdstyle')
    },
    tags: {
        all: async () => await httpGet('/tag')
    },
    locations: {
        public: async () => await httpGet('/location', false)
    },
    user: {
        find: async (username) => await httpGet(`/user?username=${username}`)
    }
};

const httpDelete = async (path, contextualize = true) => {

    const response = await axios.delete(
        getUri(path, contextualize),
        getConfig()
    );

    return response.data;
};

const httpPost = async (path, data, contextualize = true) => {

    const response = await axios.post(
        getUri(path, contextualize),
        data,
        getConfig()
    );

    return response.data;
};

const httpPut = async (path, data, contextualize = true) => {

    const response = await axios.put(
        getUri(path, contextualize),
        data,
        getConfig()
    );

    return response.data;
};

const httpGet = async (path, contextualize = true) => {

    const response = await axios.get(
        getUri(path, contextualize),
        getConfig()
    );

    return response.data;
};

export default function useApi(identifier, method, queryOptions) {
    const {token} = useContext(AppContext);

    if (!token) {
        throw new Error(`No token provided for call ${identifier}`)
    }

    api.token = token;

    const query = useQuery(identifier, method, {
        refetchOnWindowFocus: false,
        retry: false,
        ...queryOptions
    });


    if (query.error) {
        console.error(query.error);
        // reset();
        // history.push('/login');
    }

    return query;
}