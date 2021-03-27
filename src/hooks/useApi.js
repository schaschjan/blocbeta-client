import axios from "axios";
import { useParams } from "react-router-dom";
import { sortItemsAlphabetically } from "../helper/sortItemsAlphabetically";

export const getLocationFromGlobals = () =>
  window.location.pathname.split("/")[1];

export const extractErrorMessage = (error) => {
  if (!error.response) {
    return null;
  }

  const { data } = error.response;

  if (data.type === "formError") {
    return Object.values(error.response.data.errors)
      .map((message) => `⚠️ ${message}`)
      .join("\n");
  }

  return data.message;
};

export const allIdle = (...resources) =>
  [...resources].every((resource) => resource.isSuccess === true);

export const queryDefaults = {
  refetchOnWindowFocus: false,
};

export const mutationDefaults = {
  throwOnError: true,
};

export const cache = {
  rooms: "rooms",
  roomSchedule: "roomSchedule",
  boulder: "boulder",
  compare: "compare",
  ascents: "ascents",
  walls: "walls",
  grades: "grades",
  holdTypes: "holdTypes",
  setters: "setters",
  currentSetters: "current-setters",
  tags: "tags",
  labels: "labels",
  locations: "locations",
  reservationCount: "reservationCount",
  timeSlotExclusion: "time-slot-exclusion",
  schedule: "schedule",
  location: "location",
  user: "user",
  ticker: "ticker",
  ranking: {
    current: "currentRanking",
    allTime: "allTimeRanking",
  },
  doubts: {
    unresolved: "unresolvedDoubts",
  },
  stats: {
    boulder: "boulderStat",
    resetRotation: "resetRotationStat",
  },
};

let options = {
  baseURL: process.env.REACT_APP_API_HOST,
  headers: {},
};

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  options.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

const axiosInstance = axios.create(options);

export const resources = {
  login: async ({ payload }) => {
    const { data } = await axiosInstance.post(`/api/login`, payload);

    return data;
  },
  boulder: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/boulder`);

    return data;
  },
  boulderMass: async ({ location, payload }) => {
    const { data } = await axiosInstance.put(
      `/api/${location}/boulder/mass`,
      payload
    );

    return data;
  },
  boulderDetail: async ({ location, id }) => {
    const { data } = await axiosInstance.get(`/api/${location}/boulder/${id}`);

    return data;
  },
  createBoulder: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/boulder`,
      payload
    );

    return data;
  },
  updateBoulder: async ({ location, payload, id }) => {
    const { data } = await axiosInstance.put(
      `/api/${location}/boulder/${id}`,
      payload
    );

    return data;
  },
  ascents: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/ascent`);

    return data;
  },
  addAscent: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/ascent`,
      payload
    );

    return data;
  },
  removeAscent: async ({ location, id }) => {
    const { data } = await axiosInstance.delete(
      `/api/${location}/ascent/${id}`
    );

    return data;
  },
  walls: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/wall`);

    return sortItemsAlphabetically(data, "name");
  },
  grades: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/grade`);

    return sortItemsAlphabetically(data, "name");
  },
  holdTypes: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/holdstyle`);

    return sortItemsAlphabetically(data, "name");
  },
  tags: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/tag`);

    return sortItemsAlphabetically(data, "name");
  },
  setters: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/setter`);

    return sortItemsAlphabetically(data, "username");
  },
  currentSetters: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/setter/current`);

    return sortItemsAlphabetically(data, "username");
  },
  updateSetter: async ({ location, id, payload }) => {
    const { data } = await axiosInstance.put(
      `/api/${location}/setter/${id}`,
      payload
    );

    return data;
  },
  createSetter: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/setter`,
      payload
    );

    return data;
  },
  deleteSetter: async ({ location, id }) => {
    await axiosInstance.get(`/api/${location}/setter/${id}`);
  },
  ping: async ({ location }) => {
    await axiosInstance.get(`/api/${location}/ping`);
  },
  me: async () => {
    const { data } = await axiosInstance.get(`/api/me`);

    return data;
  },
  updateMe: async ({ payload }) => {
    delete payload.id;
    delete payload.username;

    const { data } = await axiosInstance.put(`/api/me`, payload);

    return data;
  },
  deleteMe: async () => {
    await axiosInstance.delete(`/api/me`);
  },
  boulderStatistics: async ({ location }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/statistic/boulder`
    );

    return data;
  },
  boulderCount: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/boulder/count`);

    return data;
  },
  currentRanking: async ({ location }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/ranking/current`
    );

    return data;
  },
  allTimeRanking: async ({ location }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/ranking/all-time`
    );

    return data;
  },
  locations: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/location`);

    return data;
  },
  location: async ({ id }) => {
    const { data } = await axiosInstance.get(`/api/location/${id}`);

    return data;
  },
  schedule: async ({ location, roomId, ymd }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/schedule/${roomId}/${ymd}`
    );

    return data;
  },
  roomSchedule: async ({ location, room }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/time-slot?roomId=${room}`
    );

    return data;
  },
  rooms: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/room`);

    return data;
  },
  createReservation: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/reservation`,
      payload
    );

    return data;
  },
  createGuestReservation: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/reservation/guest`,
      payload
    );

    return data;
  },
  updateReservation: async ({ location, id, payload }) => {
    const { data } = await axiosInstance.put(
      `/api/${location}/reservation/${id}`,
      payload
    );

    return data;
  },
  deleteReservation: async ({ location, id }) => {
    const { data } = await axiosInstance.delete(
      `/api/${location}/reservation/${id}`
    );

    return data;
  },
  reservations: async ({ location }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/reservation/pending`
    );

    return data;
  },
  reservationCount: async ({ location }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/reservation/pending/count`
    );

    return data;
  },
  ticker: async ({ location, ymd }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/schedule/rooms/${ymd}`
    );

    let flat = [];
    let pendingCheckIns = 0;

    data.forEach((room) => {
      room.schedule.forEach((timeSlot) => {
        delete room.schedule;
        timeSlot.room = room;

        flat.push(timeSlot);
      });

      pendingCheckIns += room.pending_check_ins;
    });

    return {
      pendingCheckIns,
      schedule: flat,
    };
  },
  updateTimeSlot: async ({ location, id, payload }) => {
    const { data } = await axiosInstance.put(
      `/api/${location}/time-slot/${id}`,
      payload
    );

    return data;
  },
  searchUser: async ({ username }) => {
    const { data } = await axiosInstance.get(`/api/user/search`, {
      params: { username },
    });

    return data;
  },
  addBlocker: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/time-slot-exclusion`,
      payload
    );

    return data;
  },
  indexBlocker: async ({ location }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/time-slot-exclusion`
    );

    return data;
  },
  compareCurrent: async ({ location, a, b }) => {
    const { data } = await axiosInstance.get(
      `/api/${location}/compare/${a}/to/${b}/at/current`
    );

    return data;
  },
  createDoubt: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/doubt`,
      payload
    );

    return data;
  },
  createError: async ({ location, payload }) => {
    const { data } = await axiosInstance.post(
      `/api/${location}/error`,
      payload
    );

    return data;
  },
  doubtCount: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/doubt/count`);

    return data;
  },
  doubts: async ({ location }) => {
    const { data } = await axiosInstance.get(`/api/${location}/doubt`);

    return data;
  },
  updateDoubt: async ({ location, id, payload }) => {
    const { data } = await axiosInstance.put(
      `/api/${location}/doubt/${id}`,
      payload
    );

    return data;
  },
};

export const useApi = (key, args = {}) => {
  let { location } = useParams();

  const resource = resources[key];

  if (!(key in resources)) {
    throw new Error(`Resource ${key} not found`);
  }

  return (payload) => {
    return resource({
      location,
      ...args,
      ...payload,
    });
  };
};
