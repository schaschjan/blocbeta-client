import jwt_decode from 'jwt-decode';
import ApiClient from "./ApiClient";
import db from './db.js';

class Context {
    static isAuthenticated() {
        const token = localStorage.getItem('token');

        if (!token) {
            return false
        }

        return true
    }

    static init() {

        db.open();
        db.on('ready', () => {
            db.locations.count(count => {
                if (count === 0) {
                    ApiClient.getLocations().then(response => {
                        db.locations.bulkAdd(response);
                        Context.storage.locations.init(response);
                    });
                }
            });

            db.grades.count(count => {
                if (count === 0) {
                    ApiClient.getGrades().then(response => {
                        db.grades.bulkAdd(response);
                        Context.storage.grades.init(response);
                    });
                }
            });

            db.holdStyles.count(count => {
                if (count === 0) {
                    ApiClient.getHoldStyles().then(response => {
                        db.holdStyles.bulkAdd(response);
                        Context.storage.holdStyles.init(response);
                    });
                }
            });

            db.walls.count(count => {
                if (count === 0) {
                    ApiClient.getWalls().then(response => {
                        db.walls.bulkAdd(response);
                        Context.storage.walls.init(response);
                    });
                }
            });

            db.tags.count(count => {
                if (count === 0) {
                    ApiClient.getTags().then(response => {
                        db.tags.bulkAdd(response);
                        Context.storage.tags.init(response);
                    });
                }
            });

            db.setters.count(count => {
                if (count === 0) {
                    ApiClient.getSetters().then(response => {
                        db.setters.bulkAdd(response);
                        Context.storage.setters.init(response);
                    });
                }
            });

            db.boulders.count(count => {
                if (count === 0) {
                    ApiClient.getActiveBoulders().then(response => {
                        db.boulders.bulkAdd(response);
                    });
                }
            });
        });


    }

    static destroy() {
        db.delete();
    }

    static logout() {
        localStorage.clear();
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
        return localStorage.getItem('token');
    }

    static isAdmin() {
        return localStorage.getItem('roles').includes('ROLE_ADMIN')
    }

    static getUsername() {
        return localStorage.getItem('username');
    }

    static getUserId() {
        return localStorage.getItem('id');
    }

    static getLocationUrl() {
        return this.getLocation().url
    }

    static getLocation() {
        return JSON.parse(localStorage.getItem('location'))
    }

    static getPath(path) {
        return `/${Context.getLocationUrl()}${path}`;
    }

    static getOptions = (collection, labelProperty) => {

        const options = [];

        db[collection].toArray().then((item) => {
            options.push({
                label: item[labelProperty],
                value: item.id
            })
        });

        return options
    };

    static createStorageApi = (name) => {
        return {
            init: (data) => {
                localStorage.setItem(name, JSON.stringify(data))
            },
            all: () => {
                return JSON.parse(localStorage.getItem(name));
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
        grades: Context.createStorageApi('grades'),
        walls: Context.createStorageApi('walls'),
        holdStyles: Context.createStorageApi('holdStyles'),
        locations: Context.createStorageApi('locations'),
        tags: Context.createStorageApi('tags'),
        setters: Context.createStorageApi('setters'),
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
        }
    };
}


export default Context;