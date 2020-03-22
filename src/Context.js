import jwt_decode from 'jwt-decode';
import ApiClient from "./ApiClient";

export const GRADES_STORE_NAME = "grades";
export const WALLS_STORE_NAME = "walls";
export const HOLD_STYLE_STORE_NAME = "holdStyles";
export const LOCATIONS_STORE_NAME = "locations";
export const TAGS_STORE_NAME = "tags";
export const SETTER_STORE_NAME = "setters";
export const BOULDER_STORE_NAME = "boulders";
export const STATES_STORE_NAME = "states";

class Context {

    static isAuthenticated() {
        const token = localStorage.getItem('token');

        if (!token) {
            return false
        }

        return true
    }

    static authenticate(token) {
        localStorage.setItem('token', token);
        const decoded = jwt_decode(token);

        Object.entries(decoded).forEach(([key, value]) => {
            if (value instanceof Object) {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.setItem(key, value);
            }
        })
    }

    static getToken() {
        if (!this.isAuthenticated()) {
            return false;
        }

        return localStorage.getItem('token');
    }

    static getLocationUrl() {
        return this.location.url
    }

    static getPath(path) {
        return `/${Context.location.current().url}${path}`;
    }

    static createStorageApi = (name) => {
        return {
            set: (data) => {
                localStorage.setItem(name, JSON.stringify(data))
            },
            all: () => {
                return JSON.parse(localStorage.getItem(name));
            },
            get: (id) => {
                return Context.storage[name].all().find(item => item.id === id);
            },
            options: (labelProperty = 'name', valueProperty = 'id') => {
                return Context.storage[name].all().map(item => {
                    return {
                        label: item[labelProperty],
                        value: item[valueProperty]
                    }
                }).sort((a, b) => a.label > b.label ? 1 : -1);
            },
            getOption: function (value, labelProperty = 'name') {

                return {
                    label: this.get(value)[labelProperty],
                    value: value
                }
            }
        }
    };

    static storage = {
        clear: () => {
            localStorage.clear();
        },
        init: () => {
            ApiClient.locations.all().then(response => Context.storage.locations.set(response));
            ApiClient.location.grades.all().then(response => Context.storage.grades.set(response));
            ApiClient.location.holdStyles.all().then(response => Context.storage.holdStyles.set(response));
            ApiClient.location.walls.all().then(response => Context.storage.walls.set(response));
            ApiClient.location.tags.all().then(response => Context.storage.tags.set(response));
            ApiClient.location.setters.all().then(response => Context.storage.setters.set(response));
            ApiClient.boulder.active().then(response => Context.storage.boulders.set(response));

            Context.storage.states.set([
                {
                    id: "active",
                    name: "active"
                },
                {
                    id: "inactive",
                    name: "inactive"
                }
            ])
        },
        grades: Context.createStorageApi(GRADES_STORE_NAME),
        walls: Context.createStorageApi(WALLS_STORE_NAME),
        holdStyles: Context.createStorageApi(HOLD_STYLE_STORE_NAME),
        locations: Context.createStorageApi(LOCATIONS_STORE_NAME),
        tags: Context.createStorageApi(TAGS_STORE_NAME),
        setters: Context.createStorageApi(SETTER_STORE_NAME),
        boulders: Context.createStorageApi(BOULDER_STORE_NAME),
        states: Context.createStorageApi(STATES_STORE_NAME),
    };

    static location = {
        current: () => JSON.parse(localStorage.getItem('location')),
        switchTo: (id) => {
            const location = Context.storage.locations.get(id);
            localStorage.setItem('location', JSON.stringify(location));

            Context.storage.init();
        }
    };

    static user = {
        isAdmin: () => {
            if (!this.isAuthenticated()) {
                return false;
            }

            return localStorage.getItem('roles').includes('ROLE_ADMIN')
        },
        id: localStorage.getItem('id'),
        username: localStorage.getItem('username'),
    };
}


export default Context;