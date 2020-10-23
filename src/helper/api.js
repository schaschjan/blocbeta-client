import axios from "axios";

const getLocation = () => window.location.pathname.split("/")[1];

const api = {
  timeSlotExclusion: {
    add: (payload) => {
      return axios.post(`/api/${getLocation()}/time-slot-exclusion`, payload);
    },
    index: () => {
      return axios.get(`/api/${getLocation()}/time-slot-exclusion`);
    }
  },
};

export {api};
