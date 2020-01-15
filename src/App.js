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
    const [loading, setLoading] = useState(true);
    const [resource, setResource] = useState(null);

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

    useEffect(() => {

        if (!Context.isAuthenticated()) {
            setLoading(false);
            return
        }

        Promise.all([
            ApiClient.getLocations().then(response => {
                setResource('locations');
                const locations = {};
                for (const location of response) {
                    locations[location.url] = location;
                }

                window['locations'] = locations
            }),
            ApiClient.getGrades().then(response => {
                setResource('grades');
                const grades = {};
                for (const grade of response) {
                    grades[grade.id] = grade;
                }

                window['grades'] = grades
            }),
            ApiClient.getHoldStyles().then(response => {
                setResource('colors');
                const colors = {};
                for (const color of response) {
                    colors[color.id] = color;
                }

                window['colors'] = colors;
            }),
            ApiClient.getWalls().then(response => {
                setResource('walls');
                const walls = {};
                for (const wall of response) {
                    walls[wall.id] = wall;
                }

                window['walls'] = walls;
            }),
            ApiClient.getTags().then(response => {
                setResource('tags');
                const tags = {};
                for (const tag of response) {
                    tags[tag.id] = tag;
                }

                window['tags'] = tags;
            }),
            ApiClient.getSetters().then(response => {
                setResource('setters');
                const setters = {};
                for (const setter of response) {
                    setters[setter.id] = setter;
                }

                window['setters'] = setters;
            }),
            ApiClient.getErrorsCount().then(response => {
                setResource('errors');
                window['errors'] = response.count;
            })
        ]).then(() => {
            setLoading(false);
        })
    }, []);

    if (loading) {
        return (
            <div className="loader">
                <em>loading {resource}</em>
            </div>
        )
    }

    return (
        <Router>
            <div className="app">
                <Header/>

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