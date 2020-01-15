import jwt_decode from 'jwt-decode';

class Context {

    static isAuthenticated() {
        const token = localStorage.getItem('token');

        if (!token) {
            return false
        }

        return true
    }

    static authorize(token) {
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

    static getLocationUrl() {
        return this.getLocation().url
    }

    static getLocation() {
        return JSON.parse(localStorage.getItem('location'))
    }

    static getWalls() {
        return window.walls;
    }
}

export default Context;