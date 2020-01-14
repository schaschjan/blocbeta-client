class Context {

    static isAuthenticated() {
        const token = localStorage.getItem('token');

        if (!token) {
            return false
        }

        return true
    }

    authorize() {
        localStorage.setItem('token',)
    }
}

export default Context;