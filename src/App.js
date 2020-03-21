import React, {Fragment, useState} from 'react';
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

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerPages, setDrawerPages] = useState([]);
    const [drawerActivePage, setDrawerActivePage] = useState(null);
    const [drawerData, setDrawerData] = useState(null);

    const handleAuthenticationSuccess = () => {
        return <Redirect to={{pathname: `/${Context.location.current().url}/dashboard`}}/>;
    };

    const routes = [
        {
            title: "Login",
            path: "/login",
            render: () => <Login onAuthenticationSuccess={handleAuthenticationSuccess}/>,
            public: true,
            exact: true,
        },
        {
            title: "Register",
            path: "/register",
            render: () => <Register onRegistrationSuccess={handleAuthenticationSuccess}/>,
            public: true,
            exact: true,
        },
        {
            title: "Reset Password",
            path: "/reset-password",
            render: () => <PasswordReset/>,
            public: true,
            exact: true,
        },
        {
            title: "Dashboard",
            path: "/:locationSlug/dashboard",
            render: () => <Dashboard/>,
            exact: true,
        },
        {
            title: "Boulder index",
            path: "/:locationSlug/boulder",
            render: () => <BoulderIndex/>,
            exact: true
        },
        {
            title: "Edit boulder",
            path: "/:locationSlug/boulder/:boulderId",
            render: () => <BoulderEdit/>,
            exact: true
        },
        {
            title: "Current ranking",
            path: "/:locationSlug/ranking/current",
            render: () => <CurrentRanking/>,
            exact: true
        },
        {
            title: "Compare current",
            path: "/:locationSlug/compare/:a/to/:b/at/current",
            render: () => <CurrentComparison/>,
            exact: true
        },
        {
            title: "Account",
            path: "/account",
            render: () => <Account/>,
            exact: true
        }
    ];

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
                    <div className="app" id="app">
                        <Navigation/>

                        <Switch>
                            {routes.map((route, i) => {
                                if (route.public) {
                                    return <Route key={i} {...route} />
                                }

                                return <PrivateRoute key={i} {...route} />
                            })}

                            <Route render={() => <LoginRedirect/>}/>
                        </Switch>
                    </div>
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