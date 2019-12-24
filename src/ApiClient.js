class ApiClient {

    static getHoldStyles(location) {
        return fetch(`/${location}/holdstyle`).then(response => response.json());
    }

    static getGrades(location) {
        return fetch(`/${location}/grade`).then(response => response.json());
    }

    static getTags(location) {
        return fetch(`/${location}/tag`).then(response => response.json());
    }

    static getWalls(location) {
        return fetch(`/${location}/wall`).then(response => response.json());
    }

    static getSetters(location) {
        return fetch(`/${location}/setter`).then(response => response.json());
    }

    static getLocations() {
        return fetch(`/location`).then(response => response.json());
    }

    static getBoulder(id) {
        return fetch(`/${window.location.slug}/boulder/${id}`).then(response => response.json());
    }

    static getErrors() {
        return fetch(`/${window.location.slug}/error`).then(response => response.json());
    }

    static getErrorsCount() {
        return fetch(`/${window.location.slug}/error/count`).then(response => response.json());
    }
}


export default ApiClient;