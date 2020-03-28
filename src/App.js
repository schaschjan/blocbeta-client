import React, {createContext, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Context from "./Context";
import Navigation from "./components/Navigation/Navigation";
import {Content} from "./components/Content/Content";
import {Drawer, DrawerContext} from "./components/Drawer/Drawer";
import {router} from "./services/router";

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

export const UserContext = createContext();

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerPages, setDrawerPages] = useState([]);
    const [drawerActivePage, setDrawerActivePage] = useState(null);
    const [drawerData, setDrawerData] = useState(null);

    const [user, setUser] = useState(Context.user);
    const [authenticated, setAuthenticated] = useState(Context.isAuthenticated());

    console.log(user, authenticated);

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

    const userContextValues = {
        user,
        setUser,
        authenticated,
        setAuthenticated
    };

    return (
        <Router>
            <DrawerContext.Provider value={drawerContextValues}>
                <Content disabled={drawerOpen} onClick={() => drawerOpen ? setDrawerOpen(false) : null}>
                    <UserContext.Provider value={userContextValues}>
                        <div className="app" id="app">
                            <Navigation/>
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
                        </div>
                    </UserContext.Provider>
                </Content>
            </DrawerContext.Provider>

            <Drawer open={drawerOpen}
                    data={drawerData}
                    loading={drawerLoading}
                    closeHandler={() => setDrawerOpen(false)}
                    activePage={drawerActivePage}
                    pages={drawerPages}/>
        </Router>
    );
};

export default App