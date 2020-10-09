import axios from "axios";

const getLocation = () => window.location.pathname.split("/")[1];

const cache = {
  timeSlotExclusion: "time-slot-exclusion",
  schedule: "schedule"
};

const api = {
  timeSlotExclusion: {
    add: (payload) => {
      return axios.post(`/api/${getLocation()}/time-slot-exclusion`, payload);
    },
    index: () => {
      return axios.get(`/api/${getLocation()}/time-slot-exclusion`);
    }
  },
  rooms: {
    index: async () => {
      return axios.get(`/api/${getLocation()}/room`);
    }
  },
  schedule: {
    rooms: () => {
      const {data} = axios.get(`/api/${getLocation()}/schedule/rooms`);

      return data;
    }
  },
  reservation: {
    update: (id, payload) => {

      return axios.put(`/api/${getLocation()}/reservation/${id}`, payload);
    }
  }
};

export {api, cache};