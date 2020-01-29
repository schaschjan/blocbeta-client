import Context from "./Context";

class ApiClient {

    static authorize(username, password) {
        return fetch(`/api/login`, {
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

    static getRequestConfig() {
        return {
            headers: {
                'Authorization': `Bearer ${Context.getToken()}`
            }
        }
    }

    static checkResponse(response) {
        if (response.ok) {
            return response
        }

        if (response.status === 401) {
            Context.logout();

            window.location.href = '/login';
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

    static locationStats() {
        return fetch(`/api/${Context.getLocationUrl()}/stat/location`, this.getRequestConfig())
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
}


export default ApiClient;