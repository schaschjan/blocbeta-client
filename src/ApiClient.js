import Context from "./Context";

class ApiClient {

    static authorize(username, password) {
        const data = {
            "username": username,
            "password": password
        };

        return fetch(`/api/login`, this.getRequestConfig("post", data))
            .then(response => response.json());
    }

    static getRequestConfig(method = "get", data) {

        let config = {
            headers: {
                "Authorization": `Bearer ${Context.getToken()}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        if (method !== "get") {
            config.method = method
        }

        if (data) {
            config.body = JSON.stringify(data)
        }

        return config;
    }

    static checkResponse(response) {
        if (response.ok) {
            return response
        }

        if (response.status === 401) {
            Context.storage.clear();

            window.location.href = "/login";
        }
    }

    static getAscents() {
        return fetch(`/api/${Context.location.current().url}/ascent/active-boulders`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getHoldStyles() {
        return fetch(`/api/${Context.location.current().url}/holdstyle`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getGrades() {
        return fetch(`/api/${Context.location.current().url}/grade`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getTags() {
        return fetch(`/api/${Context.location.current().url}/tag`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getWalls() {
        return fetch(`/api/${Context.location.current().url}/wall`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getSetters() {
        return fetch(`/api/${Context.location.current().url}/user/setters`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getAdmins() {
        return fetch(`/api/${Context.location.current().url}/user/admins`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getLocations() {
        return fetch(`/api/location`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static boulderStats() {
        return fetch(`/api/${Context.location.current().url}/stat/boulder`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static wallStats() {
        return fetch(`/api/${Context.location.current().url}/stat/wall`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static boulder = {
        get: (id) => {
            return fetch(`/api/${Context.location.current().url}/boulder/${id}`, this.getRequestConfig())
                .then(response => ApiClient.checkResponse(response))
                .then(response => response.json());
        },
        update: (id, data) => {
            return fetch(`/api/${Context.location.current().url}/boulder/${id}`, this.getRequestConfig("put", data))
                .then(response => ApiClient.checkResponse(response))
                .then(response => response.status !== 204 ? response.json() : null);
        }
    };

    static getActiveBoulders() {
        return fetch(`/api/${Context.location.current().url}/boulder/filter/active`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getErrors() {
        return fetch(`/api/${Context.location.current().url}/error`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getErrorsCount() {
        return fetch(`/api/${Context.location.current().url}/error/count`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getCurrentRanking() {
        return fetch(`/api/${Context.location.current().url}/ranking/current`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getCurrentComparison(a, b) {
        return fetch(`/api/${Context.location.current().url}/compare/${a}/to/${b}/at/current`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getUser(id) {
        return fetch(`/api/showuser/${id}`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getMe() {
        return fetch(`/api/me`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static updateMe(data) {
        return fetch(`/api/me`, this.getRequestConfig("put", data))
            .then(response => ApiClient.checkResponse(response));
    }

    static createAscent(data) {
        return fetch(`/api/${Context.location.current().url}/ascent`, this.getRequestConfig("post", data))
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static deleteAscent(id) {
        return fetch(`/api/${Context.location.current().url}/ascent/${id}`, this.getRequestConfig("delete"))
            .then(response => ApiClient.checkResponse(response));
    }
}


export default ApiClient;