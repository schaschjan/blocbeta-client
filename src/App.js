import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import AdminDashboard from "./views/admin/Dashboard";
import AdminBoulderIndex from "./views/admin/boulder/Index.js";
import AdminBoulderAdd from "./views/admin/boulder/Add";
import AdminBoulderEdit from "./views/admin/boulder/Edit";
import AdminSettingsIndex from "./views/admin/settings/Index.js";
import AdminErrorIndex from "./views/admin/errors";
import ApiClient from "./ApiClient";
import NotFound from "./views/NotFound";
import AdminUserIndex from "./views/admin/users/Index.js";
import Context from "./Context";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Header from "./components/Header";
import {openDB, deleteDB, wrap, unwrap} from 'idb';
import Dexie from "dexie";


const PrivateRoute = ({children, ...rest}) => {

    if (Context.isAuthenticated()) {
        return <Route {...rest}/>
    }

    return (
        <Route
            {...rest}
            render={({location}) =>
                Context.isAuthenticated() ? (children) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
};

export default function App() {

    const routes = [
        {
            title: "Login",
            path: "/login",
            render: () => <Login/>,
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
            title: "Admin Dashboard",
            path: "/:locationSlug/admin",
            render: () => <AdminDashboard/>,
            exact: true,
            admin: true,
        },
        {
            title: "Boulder index",
            path: "/:locationSlug/admin/boulder",
            render: () => <AdminBoulderIndex/>,
            exact: true
        },
        {
            title: "Add boulder",
            path: "/:locationSlug/admin/boulder/add",
            render: () => <AdminBoulderAdd/>,
            exact: true
        },
        {
            title: "Edit boulder",
            path: "/:locationSlug/admin/boulder/edit/:boulderId",
            render: () => <AdminBoulderEdit/>,
            exact: true
        },
        {
            title: "Setter index",
            path: "/:locationSlug/admin/users",
            render: () => <AdminUserIndex/>,
            exact: true
        },
        {
            title: "Setting index",
            path: "/:locationSlug/admin/settings",
            render: () => <AdminSettingsIndex/>,
            exact: true
        },
        {
            title: "Error index",
            path: "/:locationSlug/admin/errors",
            render: () => <AdminErrorIndex/>,
            exact: true
        }
    ];
    return (
        <Router>
            <div className="app">

                {Context.isAuthenticated() &&
                <Header/>
                }

                <div className="content">
                    <Switch>
                        {routes.map((route, i) => {
                            if (route.public) {
                                return <Route key={i} {...route} />
                            }

                            return <PrivateRoute key={i} {...route} />
                        })}

                        <Route render={() => <NotFound routes={routes}/>}/>
                    </Switch>
                </div>

            </div>
        </Router>
    );
}