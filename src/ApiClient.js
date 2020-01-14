class ApiClient {

    static authorize(username, password) {
        return fetch(`/holdstyle`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        }).then(response => response.json());
    }

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

    static getSetters() {
        return fetch(`/${window.location.slug}/user/setters`).then(response => response.json());
    }

    static getAdmins() {
        return fetch(`/${window.location.slug}/user/admins`).then(response => response.json());
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