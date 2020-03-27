import React, {createContext, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Context from "./Context";
import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard";
import CurrentRanking from "./views/ranking/Current";
import CurrentComparison from "./views/compare/Current";
import Account from "./views/Account";
import Register from "./views/Register";
import PasswordReset from "./views/PasswordReset";
import Navigation from "./components/Navigation/Navigation";
import {Content} from "./components/Content/Content";
import BoulderIndex from "./views/boulder/Index/Index.js";
import BoulderEdit from "./views/boulder/Edit/Edit.js";
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

export const UserContext = createContext({
    user: null,
    authenticated: false
});

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerPages, setDrawerPages] = useState([]);
    const [drawerActivePage, setDrawerActivePage] = useState(null);
    const [drawerData, setDrawerData] = useState(null);

    const user = Context.user || null;
    const authenticated = Context.isAuthenticated() || false;

    return (
        <Router>
            <DrawerContext.Provider value={{
                drawerData, setDrawerData,
                drawerOpen, setDrawerOpen,
                drawerLoading, setDrawerLoading,
                drawerPages, setDrawerPages,
                drawerActivePage, setDrawerActivePage
            }}>
                <Content disabled={drawerOpen} onClick={() => drawerOpen ? setDrawerOpen(false) : null}>
                    <UserContext.Provider value={{user, authenticated}}>
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