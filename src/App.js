import React, {createContext, Fragment, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Context from "./Context";
import Navigation from "./components/Navigation/Navigation";
import {Content} from "./components/Content/Content";
import {Drawer, DrawerContext} from "./components/Drawer/Drawer";
import {router} from "./services/router";
import {ToastContainer} from "react-toastify";
import {Footer} from "./components/Footer/Footer";
import {ReactQueryDevtools} from 'react-query-devtools'
import usePersistentState from "./hooks/usePersistentState";

export const AppContext = createContext();

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerPages, setDrawerPages] = useState([]);
    const [drawerActivePage, setDrawerActivePage] = useState(null);
    const [drawerData, setDrawerData] = useState(null);

    const [user, setUser] = usePersistentState('user', null);
    const [token, setToken] = usePersistentState('token', null);
    const [location, setLocation] = usePersistentState('location', null);
    const [expiration, setExpiration] = usePersistentState('expiration', null);

    const drawerContextValues = {
        drawerData,
        setDrawerData,
        drawerOpen,
        setDrawerOpen,
        drawerLoading,
        setDrawerLoading,
        drawerPages,
        setDrawerPages,
        drawerActivePage,
        setDrawerActivePage
    };

    const reset = () => {
        setUser(null);
        setToken(null);
        setLocation(null);
        setExpiration(null);

        localStorage.clear();
    };

    const locationPath = (path) => {

        if (!location) {
            return null;
        }

        return location.url + path
    };

    const appContextValues = {
        token,
        setToken,
        user,
        setUser,
        location,
        setLocation,
        expiration,
        setExpiration,
        reset,
        locationPath
    };

    const authenticated = () => {
        return user !== null;
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
                    <DrawerContext.Provider value={drawerContextValues}>
                        <Navigation/>

                        <Content disabled={drawerOpen} onClick={() => drawerOpen ? setDrawerOpen(false) : null}>
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
                    </DrawerContext.Provider>
                </AppContext.Provider>
            </Router>

            <Drawer open={drawerOpen}
                    data={drawerData}
                    loading={drawerLoading}
                    closeHandler={() => setDrawerOpen(false)}
                    activePage={drawerActivePage}
                    pages={drawerPages}/>

            <ToastContainer/>
            <Footer/>

            <ReactQueryDevtools initialIsOpen={process.env.REACT_APP_ENV === 'dev'}/>
        </Fragment>
    );
};

export default App