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
            Context.logout();

            window.location.href = "/login";
        }
    }

    static getAscents() {
        return fetch(`/api/${Context.getLocationUrl()}/ascent/active-boulders`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getHoldStyles() {
        return fetch(`/api/${Context.getLocationUrl()}/holdstyle`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getGrades() {
        return fetch(`/api/${Context.getLocationUrl()}/grade`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getTags() {
        return fetch(`/api/${Context.getLocationUrl()}/tag`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getWalls() {
        return fetch(`/api/${Context.getLocationUrl()}/wall`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getSetters() {
        return fetch(`/api/${Context.getLocationUrl()}/user/setters`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getAdmins() {
        return fetch(`/api/${Context.getLocationUrl()}/user/admins`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getLocations() {
        return fetch(`/api/location`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static boulderStats() {
        return fetch(`/api/${Context.getLocationUrl()}/stat/boulder`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static wallStats() {
        return fetch(`/api/${Context.getLocationUrl()}/stat/wall`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getBoulder(id) {
        return fetch(`/api/${Context.getLocationUrl()}/boulder/${id}`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getActiveBoulders() {
        return fetch(`/api/${Context.getLocationUrl()}/boulder/filter/active`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getErrors() {
        return fetch(`/api/${Context.getLocationUrl()}/error`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getErrorsCount() {
        return fetch(`/api/${Context.getLocationUrl()}/error/count`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getCurrentRanking() {
        return fetch(`/api/${Context.getLocationUrl()}/ranking/current`, this.getRequestConfig())
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static getCurrentComparison(a, b) {
        return fetch(`/api/${Context.getLocationUrl()}/compare/${a}/to/${b}/at/current`, this.getRequestConfig())
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
        return fetch(`/api/${Context.getLocationUrl()}/ascent`, this.getRequestConfig("post", data))
            .then(response => ApiClient.checkResponse(response))
            .then(response => response.json());
    }

    static deleteAscent(id) {
        return fetch(`/api/${Context.getLocationUrl()}/ascent/${id}`, this.getRequestConfig("delete"))
            .then(response => ApiClient.checkResponse(response));
    }
}


export default ApiClient;