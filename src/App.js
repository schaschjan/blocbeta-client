import React, {createContext, Fragment, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Context from "./Context";
import Navigation from "./components/Navigation/Navigation";
import {Content} from "./components/Content/Content";
import {Drawer, DrawerContext} from "./components/Drawer/Drawer";
import {router} from "./services/router";
import {ToastContainer} from "react-toastify";
import {Footer} from "./components/Footer/Footer";

const LoginRedirect = () => (
    <Redirect
        to={{
            pathname: "/login"
        }}
    />
);

const PrivateRoute = ({children, ...rest}) => {
    if (Context.isAuthenticated()) {
        return <Route {...rest}/>
    }

    return (
        <Route
            {...rest}
            render={() =>
                Context.isAuthenticated() ? (children) : <LoginRedirect/>
            }
        />
    );
};

export const AppContext = createContext();

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerPages, setDrawerPages] = useState([]);
    const [drawerActivePage, setDrawerActivePage] = useState(null);
    const [drawerData, setDrawerData] = useState(null);

    const [user, setUser] = useState(Context.user);
    const [authenticated, setAuthenticated] = useState(Context.isAuthenticated());

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

    const appContextValues = {
        user,
        setUser,
        authenticated,
        setAuthenticated
    };

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
        </Fragment>
    );
};

export default App