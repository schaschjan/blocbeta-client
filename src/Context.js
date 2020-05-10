import jwt_decode from "jwt-decode";
import ApiClient from "./ApiClient";

export const GRADES_STORE_NAME = "grades";
export const WALLS_STORE_NAME = "walls";
export const HOLD_STYLE_STORE_NAME = "holdStyles";
export const LOCATIONS_STORE_NAME = "locations";
export const TAGS_STORE_NAME = "tags";
export const SETTER_STORE_NAME = "setters";
export const BOULDER_STORE_NAME = "boulders";
export const STATES_STORE_NAME = "states";
export const ASCENTS_STORE_NAME = "ascents";

export const getOptions = (
  items,
  labelProperty = "name",
  valueProperty = "id"
) => {
  return items
    .map((item) => {
      return getOption(item, labelProperty, valueProperty);
    })
    .sort((a, b) => (a.label > b.label ? 1 : -1));
};

export const getOption = (
  item,
  labelProperty = "name",
  valueProperty = "id"
) => {
  return {
    label: item[labelProperty],
    value: item[valueProperty],
  };
};

class Context {
  static isAuthenticated() {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    return Date.now() < localStorage.getItem("exp") * 1000;
  }

  static authenticate(token) {
    const decoded = jwt_decode(token);

    Object.entries(decoded).forEach(([key, value]) => {
      if (value instanceof Object) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    });

    localStorage.setItem("token", token);
  }

  static getToken() {
    return localStorage.getItem("token");
  }

  static getPath(path) {
    return `/${Context.location.current().url}${path}`;
  }

  static createStorageApi = (name) => {
    return {
      set: (data) => {
        localStorage.setItem(name, JSON.stringify(data));
      },
      all: () => {
        return JSON.parse(localStorage.getItem(name));
      },
      get: (id) => {
        const storage = Context.storage[name].all();

        if (!storage) {
          return null;
        }

        return storage.find((item) => item.id === id);
      },
      options: (labelProperty = "name", valueProperty = "id") => {
        const storage = Context.storage[name].all();

        if (!storage) {
          return null;
        }

        return storage
          .map((item) => {
            return {
              label: item[labelProperty],
              value: item[valueProperty],
            };
          })
          .sort((a, b) => (a.label > b.label ? 1 : -1));
      },
      getOption: function (value, labelProperty = "name") {
        const storageValue = this.get(value);

        return {
          label: storageValue ? storageValue[labelProperty] : null,
          value: value,
        };
      },
    };
  };

  static core = {
    ascents: [
      {
        id: "todo",
        name: "Todo",
      },
      {
        id: "flash",
        name: "Flash",
      },
      {
        id: "top",
        name: "Top",
      },
      {
        id: "resignation",
        name: "Resignation",
      },
    ],
    states: [
      {
        id: "active",
        name: "active",
      },
      {
        id: "inactive",
        name: "inactive",
      },
    ],
  };

  static storage = {
    clear: () => {
      localStorage.clear();
    },
    init: () => {
      return Promise.all([
        ApiClient.locations
          .all()
          .then((response) => Context.storage.locations.set(response)),
        ApiClient.location.grades
          .all()
          .then((response) => Context.storage.grades.set(response)),
        ApiClient.location.holdStyles
          .all()
          .then((response) => Context.storage.holdStyles.set(response)),
        ApiClient.location.walls
          .all()
          .then((response) => Context.storage.walls.set(response)),
        ApiClient.location.tags
          .all()
          .then((response) => Context.storage.tags.set(response)),
        ApiClient.location.setters
          .all()
          .then((response) => Context.storage.setters.set(response)),
        ApiClient.boulder
          .active()
          .then((response) => Context.storage.boulders.set(response)),
      ]);
    },
    grades: Context.createStorageApi(GRADES_STORE_NAME),
    walls: Context.createStorageApi(WALLS_STORE_NAME),
    holdStyles: Context.createStorageApi(HOLD_STYLE_STORE_NAME),
    locations: Context.createStorageApi(LOCATIONS_STORE_NAME),
    tags: Context.createStorageApi(TAGS_STORE_NAME),
    setters: Context.createStorageApi(SETTER_STORE_NAME),
    boulders: Context.createStorageApi(BOULDER_STORE_NAME),

    states: Context.createStorageApi(STATES_STORE_NAME),
    ascents: Context.createStorageApi(ASCENTS_STORE_NAME),
  };

  static location = {
    current: () => JSON.parse(localStorage.getItem("location")),
    switchTo: (id) => {
      const location = Context.storage.locations.get(id);
      localStorage.setItem("location", JSON.stringify(location));
      Context.storage.init();
    },
  };

  static user = {
    isAdmin: () => {
      if (!this.isAuthenticated()) {
        return false;
      }

      return localStorage.getItem("roles").includes("ROLE_ADMIN");
    },
    id: localStorage.getItem("id"),
    username: localStorage.getItem("username"),
  };
}

export default Context;
