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
        return fetch(`/${location}/user/setters`).then(response => response.json());
    }

    static getBoulder(id) {
        return fetch(`/${window.location.slug}/boulder/${id}`).then(response => response.json());
    }
}

export default ApiClient;