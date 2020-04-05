import axios from "axios";
import Context from "../Context";
import {useQuery} from "react-query";
import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import {AppContext} from "../App";

export const getUri = (path, contextualize) => {
    if (!contextualize) return `/api${path}`;

    return `/api/${Context.location.current().url}${path}`
};

const config = {
    headers: {Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`}
};

export const api = {
    me: {
        get: async () => await get('/me', false),
        update: async (data) => await put('/me', data, false)
    },
    ranking: {
        current: async () => {
            const data = await get('/ranking/current');

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
        resetRotation: () => get('/stat/reset-rotation'),
    },
    walls: {
        all: () => get('/wall')
    },
    boulder: {
        get: async (id) => await get(`/boulder/${id}`),
        active: async () => await get(`/boulder/filter/active`),
        mass: async (data) => await post(`/boulder/mass`, data)
    },
    ascents: {
        active: async () => await get(`/ascent/filter/active`)
    },
    grades: {
        all: () => get('/grade')
    },
    holdStyles: {
        all: async () => await get('/holdstyle')
    },
    locations: {
        public: async () => await get('/location', false)
    }
};

const post = async (path, data, contextualize = true) => {

    const response = await axios.post(
        getUri(path, contextualize),
        data,
        config
    );

    return response.data;
};

const put = async (path, data, contextualize = true) => {

    const response = await axios.put(
        getUri(path, contextualize),
        data,
        config
    );

    return response.data;
};

const get = async (path, contextualize = true) => {

    const response = await axios.get(
        getUri(path, contextualize),
        config
    );

    return response.data;
};

export default function useApi(identifier, method, queryOptions) {
    const history = useHistory();
    const {reset, token} = useContext(AppContext);

    const query = useQuery(identifier, method, {
        refetchOnWindowFocus: false,
        retry: false,
        ...queryOptions
    });

    // if (query.error && query.error.response.data.code === 401) {
    //     reset();
    //     history.push('/login');
    // }

    return query;
}