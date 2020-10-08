import axios from "axios";

const location = window.location.pathname.split("/")[1];

const cache = {
  timeSlotExclusion: "time-slot-exclusion",
  schedule: "schedule"
};

const api = {
  timeSlotExclusion: {
    add: (payload) => {
      return axios.post(`/api/${location}/time-slot-exclusion`, payload);
    },
    index: () => {
      return axios.get(`/api/${location}/time-slot-exclusion`);
    }
  },
  rooms: {
    index: () => {
      return axios.get(`/api/${location}/room`);
    }
  },
  schedule: {
    rooms: () => {
      return axios.get(`/api/${location}/schedule/rooms`);
    }
  },
  reservation: {
    update: (id, payload) => {
      return axios.put(`/api/${location}/reservation/${id}`, payload);
    }
  }
};

export {api, cache};