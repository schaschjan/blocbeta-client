import jwt_decode from 'jwt-decode';
import ApiClient from "./ApiClient";

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
            }
        }
    };

    static storage = {
        clear: () => {
            localStorage.removeItem('grades');
            localStorage.removeItem('walls');
            localStorage.removeItem('holdStyles');
            localStorage.removeItem('locations');
            localStorage.removeItem('tags');
            localStorage.removeItem('setters');
            localStorage.removeItem('boulders');
        },
        init: () => {
            ApiClient.getLocations().then(response => Context.storage.locations.set(response));
            ApiClient.getGrades().then(response => Context.storage.grades.set(response));
            ApiClient.getHoldStyles().then(response => Context.storage.holdStyles.set(response));
            ApiClient.getWalls().then(response => Context.storage.walls.set(response));
            ApiClient.getTags().then(response => Context.storage.tags.set(response));
            ApiClient.getSetters().then(response => Context.storage.setters.set(response));
            ApiClient.getActiveBoulders().then(response => Context.storage.boulders.set(response));
        },
        grades: Context.createStorageApi('grades'),
        walls: Context.createStorageApi('walls'),
        holdStyles: Context.createStorageApi('holdStyles'),
        locations: Context.createStorageApi('locations'),
        tags: Context.createStorageApi('tags'),
        setters: Context.createStorageApi('setters'),
        boulders: Context.createStorageApi('boulders'),
        system: {
            states: {
                options: () => [
                    {
                        label: 'active',
                        value: 'active'
                    },
                    {
                        label: 'inactive',
                        value: 'inactive'
                    }
                ]
            },
        }
    };

    static location = {
        current: () => JSON.parse(localStorage.getItem('location')),
        switchTo: (id) => {
            const location = Context.storage.locations.get(id);
            localStorage.setItem('location', JSON.stringify(location));
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