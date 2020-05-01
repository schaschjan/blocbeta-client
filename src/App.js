import React, {createContext, Fragment, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Context from "./Context";
import Navigation from "./components/Navigation/Navigation";
import {Content} from "./components/Content/Content";
import {router} from "./services/router";
import {ToastContainer} from "react-toastify";
import {Footer} from "./components/Footer/Footer";
import {ReactQueryDevtools} from 'react-query-devtools'
import usePersistentState from "./hooks/usePersistentState";
import jwt_decode from "jwt-decode";

export const isMobile = () => {
    return matchMedia('(max-width: 600px)').matches;
};

export const isTablet = () => {
    return matchMedia('(min-width: 601px) and (max-width: 1139px)').matches;
};

export const isDesktop = () => {
    return matchMedia('(min-width: 1140px)').matches;
};

export const AppContext = createContext();

console.log(`Mobile ${isMobile()}`);
console.log(`Table ${isTablet()}`);
console.log(`Desktop ${isDesktop()}`);

const App = () => {
    const [user, setUser] = usePersistentState('user', null);
    const [token, setToken] = usePersistentState('token', null);
    const [currentLocation, setCurrentLocation] = usePersistentState('location', null);
    const [expiration, setExpiration] = usePersistentState('expiration', null);
    const [contentDisabled, disableContent] = useState(false);

    const reset = () => {
        setUser(null);
        setToken(null);
        setCurrentLocation(null);
        setExpiration(null);

        localStorage.clear();
    };

    const locationPath = (path) => {
        if (!currentLocation) {
            throw new Error("No location");
        }

        return `/${currentLocation.url}${path}`
    };

    const authenticated = () => {
        if (token === null) {
            return false
        }

        if (new Date().getTime() / 1000 > expiration) {
            return false
        }

        return true;
    };

    const isAdmin = () => {
        const payload = jwt_decode(token);

        return payload.roles.includes('ROLE_ADMIN');
    };

    const appContextValues = {
        token,
        setToken,
        user,
        setUser,
        currentLocation,
        setCurrentLocation,
        expiration,
        setExpiration,
        contentDisabled,

        disableContent,
        isAdmin,
        authenticated,
        reset,
        locationPath
    };


    const PrivateRoute = ({children, ...rest}) => {
        if (authenticated()) {
            return <Route {...rest}/>
        }

        return (
            <Route
                {...rest}
                render={() =>
                    authenticated() ? (children) : <LoginRedirect/>
                }
            />
        );
    };

    const LoginRedirect = () => (
        <Redirect
            to={{
                pathname: "/login"
            }}
        />
    );

    return (
        <Fragment>
            <Router>
                <AppContext.Provider value={appContextValues}>
                    <Navigation/>

                    <Content disabled={contentDisabled}>
                        <Switch>
                            {router.map((route, i) => {
                                if (!route.public) {
                                    return <PrivateRoute key={i} {...route} />
                                }

                                if (route.admin && !Context.user.isAdmin()) {
                                    return null
                                }

                                return <Route key={i} {...route} />
                            })}

                            <Route render={() => <LoginRedirect/>}/>
                        </Switch>
                    </Content>
                </AppContext.Provider>
            </Router>

            <ToastContainer/>
            <Footer/>

            <ReactQueryDevtools initialIsOpen={process.env.REACT_APP_ENV === 'dev'}/>
        </Fragment>
    );
};

export default App