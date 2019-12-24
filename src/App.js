import React, {useState, useEffect} from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import CurrentRanking from "./views/CurrentRanking";
import Boulder from "./views/Boulder";
import Dashboard from "./views/admin/Dashboard";
import StyleGuide from "./views/StyleGuide";
import Header from "./components/Header";

import AdminBoulderIndex from "./views/admin/boulder/Index.js";
import AdminBoulderAdd from "./views/admin/boulder/Add";
import AdminBoulderEdit from "./views/admin/boulder/Edit";
import AdminSettingsIndex from "./views/admin/settings/Index.js";
import AdminErrorIndex from "./views/admin/errors";
import ApiClient from "./ApiClient";
import {isAdmin} from "./Helpers";

export default function App() {

    const [loading, setLoading] = useState(true);
    const [resource, setResource] = useState(null);

    const location = {
        name: 'Salon du Bloc',
        slug: 'salon',
        id: 28
    };

    window.location.name = location.name;
    window.location.slug = location.slug;
    window.location.id = location.id;

    useEffect(() => {
        Promise.all([
            ApiClient.getLocations().then(response => {
                setResource('locations');
                const locations = {};
                for (const location of response) {
                    locations[location.url] = location;
                }

                window['locations'] = locations
            }),
            ApiClient.getGrades(location.slug).then(response => {
                setResource('grades');
                const grades = {};
                for (const grade of response) {
                    grades[grade.id] = grade;
                }

                window['grades'] = grades
            }),
            ApiClient.getHoldStyles(location.slug).then(response => {
                setResource('colors');
                const colors = {};
                for (const color of response) {
                    colors[color.id] = color;
                }

                window['colors'] = colors;
            }),
            ApiClient.getWalls(location.slug).then(response => {
                setResource('walls');
                const walls = {};
                for (const wall of response) {
                    walls[wall.id] = wall;
                }

                window['walls'] = walls;
            }),
            ApiClient.getTags(location.slug).then(response => {
                setResource('tags');
                const tags = {};
                for (const tag of response) {
                    tags[tag.id] = tag;
                }

                window['tags'] = tags;
            }),
            ApiClient.getSetters(location.slug).then(response => {
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
                <Header location={location}/>

                <div className="content">
                    <Switch>
                        <Route exact path="/:locationSlug/admin">
                            <Dashboard/>
                        </Route>

                        <Route exact path="/:locationSlug/admin/boulder">
                            <AdminBoulderIndex/>
                        </Route>

                        <Route exact path="/:locationSlug/admin/errors">
                            <AdminErrorIndex/>
                        </Route>

                        <Route path="/:locationSlug/admin/boulder/add">
                            <AdminBoulderAdd/>
                        </Route>

                        <Route path="/:locationSlug/admin/boulder/edit/:boulderId">
                            <AdminBoulderEdit/>
                        </Route>

                        <Route exact path="/:locationSlug/admin/settings">
                            <AdminSettingsIndex/>
                        </Route>

                        <Route path="/:locationSlug/boulder">
                            <Boulder/>
                        </Route>

                        <Route path="/:locationSlug/ranking/current">
                            <CurrentRanking/>
                        </Route>

                        <Route path="/:locationSlug/styleguide">
                            <StyleGuide/>
                        </Route>
                    </Switch>
                </div>

                <footer>
                </footer>
            </div>
        </Router>
    );
}