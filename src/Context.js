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
                    });
                }
            });

            db.grades.count(count => {
                if (count === 0) {
                    ApiClient.getGrades().then(response => {
                        db.grades.bulkAdd(response);
                    });
                }
            });

            db.holdStyles.count(count => {
                if (count === 0) {
                    ApiClient.getHoldStyles().then(response => {
                        db.holdStyles.bulkAdd(response);
                    });
                }
            });

            db.walls.count(count => {
                if (count === 0) {
                    ApiClient.getWalls().then(response => {
                        db.walls.bulkAdd(response);
                    });
                }
            });

            db.tags.count(count => {
                if (count === 0) {
                    ApiClient.getTags().then(response => {
                        db.tags.bulkAdd(response);
                    });
                }
            });

            db.setters.count(count => {
                if (count === 0) {
                    ApiClient.getSetters().then(response => {
                        db.setters.bulkAdd(response);
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
}

export default Context;