import axios from "axios";
import {useParams} from "react-router-dom";

export const getLocationFromGlobals = () => window.location.pathname.split("/")[1];

export const extractErrorMessage = (error) => {
  if (!error.response) {
    return null
  }

  const {data} = error.response;

  if (data.type === "formError") {
    return Object.values(error.response.data.errors).map(message => `⚠️ ${message}`).join('\n');
  }

  return data.message
};

export const allIdle = (...resources) => [...resources].every(resource => resource.isSuccess === true);

export const queryDefaults = {
  refetchOnWindowFocus: false,
};

export const mutationDefaults = {
  throwOnError: true
};

export const cache = {
  roomSchedule: "roomSchedule",
  boulder: "boulder",
  compare: "compare",
  ascents: "ascents",
  walls: "walls",
  grades: "grades",
  holdStyles: "holdStyles",
  setters: "setters",
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
    unresolved: "unresolvedDoubts"
  },
  stats: {
    boulder: "boulderStat",
    resetRotation: "resetRotationStat",
  },
};

export const resources = {
  boulder: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/boulder`);

    return data;
  },
  ascents: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/ascent`);

    return data;
  },
  addAscent: async ({location, payload}) => {
    const {data} = await axios.post(`/api/${location}/ascent`, payload);

    return data;
  },
  removeAscent: async ({location, id}) => {
    const {data} = await axios.delete(`/api/${location}/ascent/${id}`);

    return data;
  },
  walls: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/wall`);

    return data;
  },
  grades: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/grade`);

    return data;
  },
  holdStyles: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/holdstyle`);

    return data;
  },
  tags: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/tag`);

    return data;
  },
  setters: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/setter`);

    return data;
  },
  ping: async ({location}) => {
    await axios.get(`/api/${location}/ping`);
  },
  me: async () => {
    const {data} = await axios.get(`/api/me`);

    return data;
  },
  updateMe: async ({payload}) => {
    delete payload.id;
    delete payload.username;

    const {data} = await axios.put(`/api/me`, payload);

    return data;
  },
  deleteMe: async () => {
    await axios.delete(`/api/me`);
  },
  boulderStatistics: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/statistic/boulder`);

    return data;
  },
  boulderCount: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/boulder/count`);

    return data;
  },
  currentRanking: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/ranking/current`);

    return data;
  },
  locations: async ({location}) => {
    const {data} = await axios.get(`/api/location`);

    return data;
  },
  location: async ({id}) => {
    const {data} = await axios.get(`/api/location/${id}`);

    return data;
  },
  schedule: async ({location, roomId, ymd}) => {
    const {data} = await axios.get(`/api/${location}/schedule/${roomId}/${ymd}`);

    return data;
  },
  roomSchedule: async ({location, room}) => {
    const {data} = await axios.get(`/api/${location}/time-slot?roomId=${room}`);

    return data;
  },
  rooms: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/room`);

    return data;
  },
  createReservation: async ({location, payload}) => {
    const {data} = await axios.post(`/api/${location}/reservation`, payload);

    return data;
  },
  createGuestReservation: async ({location, payload}) => {
    const {data} = await axios.post(`/api/${location}/reservation/guest`, payload);

    return data;
  },
  updateReservation: async ({location, id, payload}) => {
    const {data} = await axios.put(`/api/${location}/reservation/${id}`, payload);

    return data;
  },
  deleteReservation: async ({location, id}) => {
    const {data} = await axios.delete(`/api/${location}/reservation/${id}`);

    return data;
  },
  reservations: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/reservation/pending`);

    return data;
  },
  reservationCount: async ({location}) => {
    const {data} = await axios.get(`/api/${location}/reservation/pending/count`);

    return data;
  },
  ticker: async ({location, ymd}) => {
    const {data} = await axios.get(`/api/${location}/schedule/rooms/${ymd}`);

    let flat = [];

    data.forEach(room => {
      room.schedule.forEach(timeSlot => {

        delete room.schedule;
        timeSlot.room = room;

        flat.push(timeSlot);
      });
    });

    return flat;
  },
  updateTimeSlot: async ({location, id, payload}) => {

    const {data} = await axios.put(`/api/${location}/time-slot/${id}`, payload);

    return data;
  },
};

export const useApi = (key, args = {}) => {
  const params = useParams();
  const location = params.location ? params.location : getLocationFromGlobals();
  const resource = resources[key];

  if (!(key in resources)) {
    throw new Error(`Resource ${key} not found`);
  }

  return (payload) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Called resource ${key}`);
      console.log("Args:", {args});
      console.log("Payload:", {payload});
      console.log("");
    }

    return resource({
      location,
      ...args,
      ...payload
    })
  }
};
