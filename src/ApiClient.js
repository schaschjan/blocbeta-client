import Context from "./Context";
import ApiError from "./api/ApiError";

class ApiClient {

    static getUrl(path, location = null) {
        if (location) {
            return `/api/${location}${path}`
        }

        return `/api${path}`
    }

    static fetch(url, request) {

        return fetch(url, request)
            .then(response => {
                if (response.status === 401) {
                    Context.storage.clear();
                    window.location.href = "/login";
                }

                if (response.status === 204) {
                    return null
                }

                if (!response.ok) {
                    throw new ApiError(response.message, response.status);
                }

                return response.json();
            });
    }

    static authorize(username, password) {
        const data = {
            "username": username,
            "password": password
        };

        return ApiClient.fetch(ApiClient.getUrl(`/login`), this.getRequestConfig("post", data));
    }

    static getRequestConfig(method = "get", data) {

        let config = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Context.getToken()}`
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

    static boulder = {
        get: (id) => {
            const url = ApiClient.getUrl(`/boulder/${id}`, Context.location.current().url);
            const request = this.getRequestConfig();

            return ApiClient.fetch(url, request);
        },
        update: (id, data) => {
            const url = ApiClient.getUrl(`/boulder/${id}`, Context.location.current().url);
            const request = this.getRequestConfig("put", data);

            return ApiClient.fetch(url, request);
        },
        active: () => {
            const url = ApiClient.getUrl(`/boulder/filter/active`, Context.location.current().url);
            const request = this.getRequestConfig();

            return ApiClient.fetch(url, request);
        },
        reportError: (data) => {
            const url = ApiClient.getUrl(`/boulder/error`, Context.location.current().url);
            const request = this.getRequestConfig("post", data);

            return ApiClient.fetch(url, request);
        }
    };

    static ascent = {
        create: (data) => {
            const url = ApiClient.getUrl("/ascent", Context.location.current().url);
            const request = this.getRequestConfig("post", data);

            return ApiClient.fetch(url, request)
        },
        delete: (id) => {
            const url = ApiClient.getUrl(`/ascent/${id}`, Context.location.current().url);
            const request = this.getRequestConfig("delete");

            return ApiClient.fetch(url, request)
        },
        doubt: (data) => {
            const url = ApiClient.getUrl("/ascent/doubt", Context.location.current().url);
            const request = this.getRequestConfig("post", data);

            return ApiClient.fetch(url, request)
        }
    };

    static me = {
        get: () => {
            const url = ApiClient.getUrl(`/me`);
            const request = this.getRequestConfig();

            return ApiClient.fetch(url, request)
        },
        update: (data) => {
            const url = ApiClient.getUrl(`/me`);
            const request = this.getRequestConfig("put", data);

            return ApiClient.fetch(url, request)
        }
    };

    static ascents = {
        active: () => {
            const url = ApiClient.getUrl("/ascent/active-boulders", Context.location.current().url);
            const request = this.getRequestConfig();

            return ApiClient.fetch(url, request)
        }
    };

    static location = {
        walls: {
            all: () => {
                const url = ApiClient.getUrl("/wall", Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request)
            }
        },
        setters: {
            all: () => {
                const url = ApiClient.getUrl("/setter", Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request)
            }
        },
        tags: {
            all: () => {
                const url = ApiClient.getUrl("/tag", Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request)
            }
        },
        grades: {
            all: () => {
                const url = ApiClient.getUrl("/grade", Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request)
            }
        },
        holdStyles: {
            all: () => {
                const url = ApiClient.getUrl("/holdstyle", Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request)
            }
        },
        ascents: {
            activeBoulders: () => {
                const url = ApiClient.getUrl("/ascent/active-boulders", Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request)
            }
        }
    };

    static locations = {
        all: () => {
            const url = ApiClient.getUrl("/location");
            const request = this.getRequestConfig();

            return ApiClient.fetch(url, request)
        }
    };

    static stats = {
        boulder: {
            active: () => {
                const url = ApiClient.getUrl(`/stat/boulder`, Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request);
            }
        },
        walls: {
            allocation: () => {
                const url = ApiClient.getUrl(`/stat/wall`, Context.location.current().url);
                const request = this.getRequestConfig();

                return ApiClient.fetch(url, request);
            }
        },
        resetRotation: () => {
            const url = ApiClient.getUrl(`/stat/reset-rotation`, Context.location.current().url);
            const request = this.getRequestConfig();

            return ApiClient.fetch(url, request);
        }
    };

    static rankings = {
        current: () => {
            const url = ApiClient.getUrl(`/ranking/current`, Context.location.current().url);
            const request = this.getRequestConfig();

            return ApiClient.fetch(url, request);
        }
    };
}

export default ApiClient;