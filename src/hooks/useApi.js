import {useContext} from "react";
import {AppContext} from "../App";
import axios from "axios";

const getConfig = () => {
  return {
    headers: {Authorization: `Bearer ${api.token}`},
  };
};

const getUri = () => {

};


const assignRanks = (ranking) => {
  ranking.map((result, rank) => {
    rank++;

    if (rank <= 9) {
      return (result.rank = `0${rank}`);
    }

    return (result.rank = rank.toString());
  });
};

export const cacheKeys = {
  boulders: "boulders",
  compare: "compare",
  ascents: "ascents",
  walls: "walls",
  grades: "grades",
  holdStyles: "holdStyles",
  setters: "setters",
  tags: "tags",
  labels: "labels",
  locations: "locations",
  user: "user",
  ranking: {
    current: "currentRanking",
    allTime: "allTimeRanking",
  },
  doubts: {
    unresolved: "unresolvedDoubts"
  },
  stats: {
    boulder: "boulderStat",
    resetRotation: "resetRotationStat",
  },
};

export const api = {
  token: null,
  requestPasswordReset: async (data) =>
    await axios.post(getUri("/request-reset", false), data),
  checkPasswordResetHash: async (hash) =>
    await axios.get(getUri(`/reset/${hash}`, false)),
  resetPassword: async (hash, data) =>
    await axios.post(getUri(`/reset/${hash}`, false), data),
  me: {
    get: async () => await httpGet("/me", false),
    update: async (data) => await httpPut("/me", data, false),
  },
  ping: async () => await httpGet("/ping"),
  ranking: {
    current: async () => {
      const data = await httpGet("/ranking/current");
      assignRanks(data.list);

      return data;
    },
    allTime: async () => {
      const data = await httpGet("/ranking/all-time");
      assignRanks(data.list);

      return data;
    },
  },
  compare: {
    current: async (a, b) => await httpGet(`/compare/${a}/to/${b}/at/current`),
  },
  stats: {
    boulder: async () => await httpGet("/statistic/boulder"),
    resetRotation: async () => await httpGet("/statistic/wall-reset-rotation"),
  },
  walls: {
    all: async () => await httpGet("/wall"),
  },
  setters: {
    all: async () => await httpGet("/setter"),
    withActiveBoulders: async () => await httpGet("/setter?withActiveBoulders"),
    revoke: async (userId) => httpPut(`/setter/${userId}/revoke`),
  },
  boulder: {
    get: async (id) => await httpGet(`/boulder/${id}`),
    active: async () => await httpGet(`/boulder`),
    mass: async (data) => await httpPut(`/boulder/mass`, data),
    reportError: async (id, data) => httpPost(`/boulder/${id}/error`, data),
    update: async ({data, id}) => httpPut(`/boulder/${id}`, data),
    add: async (data) => httpPost(`/boulder`, data),
  },
  ascents: {
    active: async () => await httpGet(`/ascent`),
    add: async (data) => await httpPost(`/ascent`, data),
    remove: async (id) => await httpDelete(`/ascent/${id}`),
    doubt: async (ascentId, data) =>
      await httpPost(`/ascent/${ascentId}/doubt`, data),
  },
  errors: {
    unresolved: async () => await httpGet(`/error`),
  },
  grades: {
    all: async () => await httpGet("/grade"),
  },
  holdStyles: {
    all: async () => await httpGet("/holdstyle"),
  },
  tags: {
    all: async () => await httpGet("/tag"),
  },
  locations: {
    public: async () => await httpGet("/location", false),
  },
  user: {
    find: async (username) =>
      await httpGet(`/user?username=${username}`, false),
    show: async (id) => await httpGet(`/user/${id}`, false),
  },
  labels: {
    all: async () => await httpGet("/label"),
    add: async (data) => await httpPost(`/label`, data),
    remove: async (id, label) =>
      await httpDelete(`/boulder/${id}/label/${label}`),
  },
  doubts: {
    unresolved: async () => await httpGet("/doubt"),
  }
};

const httpDelete = async (path, contextualize = true) => {
  const response = await axios.delete(getUri(path, contextualize), getConfig());

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
  const response = await axios.get(getUri(path, contextualize), getConfig());

  return response.data;
};

export default function useApi(method, path, contextualize = true, ...rest) {
  const {currentLocation} = useContext(AppContext);

  if (!contextualize) {
    return `${process.env.REACT_APP_API_HOST}/api${path}`;
  }

  if (!currentLocation) {
    new Error("poop");
  }

  if (method.toLowerCase() === "get") {
    return axios.get(`/api/${currentLocation.url}${path}`);
  }
}
