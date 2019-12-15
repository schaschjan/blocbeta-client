import React from 'react';
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

const gradeStorageId = 'grades';
const colorStorageId = 'colors';
const wallStorageId = 'walls';
const tagStorageId = 'tags';
const setterStorageId = 'setters';
const boulderStorageId = 'boulders';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            resource: null
        };
    }

    static isAdmin() {
        return window.location.pathname.includes('/admin');
    }

    static storageLoaded() {
        if (!localStorage.getItem(gradeStorageId)) {
            return false
        }
        if (!localStorage.getItem(colorStorageId)) {
            return false
        }
        if (!localStorage.getItem(wallStorageId)) {
            return false
        }
        if (!localStorage.getItem(tagStorageId)) {
            return false
        }
        if (!localStorage.getItem(setterStorageId)) {
            return false
        }
        if (!localStorage.getItem(boulderStorageId)) {
            return false
        }

        return true
    }

    componentDidMount() {

        if (App.storageLoaded() && !App.isAdmin()) {
            window.grades = JSON.parse(localStorage.getItem(gradeStorageId));
            window.colors = JSON.parse(localStorage.getItem(colorStorageId));
            window.walls = JSON.parse(localStorage.getItem(wallStorageId));
            window.tags = JSON.parse(localStorage.getItem(tagStorageId));
            window.setters = JSON.parse(localStorage.getItem(setterStorageId));
            window.boulders = JSON.parse(localStorage.getItem(boulderStorageId));

            this.setState({loading: false});

            return
        }

        Promise.all([
            fetch('/grade').then((response) => response.json()).then(response => {

                this.setState({resource: 'grades'});

                const grades = {};
                for (const grade of response) {
                    grades[grade.id] = grade;
                }

                localStorage.setItem(gradeStorageId, JSON.stringify(grades));
                window[gradeStorageId] = grades
            }),
            fetch('/color').then((response) => response.json()).then(response => {

                this.setState({resource: 'colors'});

                const colors = {};
                for (const color of response) {
                    colors[color.id] = color;
                }

                localStorage.setItem(colorStorageId, JSON.stringify(colors));
                window[colorStorageId] = colors;
            }),
            fetch('/wall').then((response) => response.json()).then(response => {

                this.setState({resource: 'walls'});

                const walls = {};
                for (const wall of response) {
                    walls[wall.id] = wall;
                }

                localStorage.setItem(wallStorageId, JSON.stringify(walls));
                window[wallStorageId] = walls;
            }),
            fetch('/tag').then((response) => response.json()).then(response => {

                this.setState({resource: 'tags'});

                const tags = {};
                for (const tag of response) {
                    tags[tag.id] = tag;
                }

                localStorage.setItem(tagStorageId, JSON.stringify(tags));
                window[tagStorageId] = tags;
            }),
            fetch('/user/setters').then((response) => response.json()).then(response => {

                this.setState({resource: 'setters'});

                const setters = {};
                for (const setter of response) {
                    setters[setter.id] = setter;
                }

                localStorage.setItem(setterStorageId, JSON.stringify(setters));
                window[setterStorageId] = setters;
            }),
            fetch('/boulder/filter/active').then((response) => response.json()).then(response => {

                this.setState({resource: 'boulders'});

                const boulders = {};
                for (const boulder of response) {
                    boulders[boulder.id] = boulder;
                }

                localStorage.setItem(boulderStorageId, JSON.stringify(boulders));
                window[boulderStorageId] = boulders;
            })
        ]).then(() => {
            this.setState({loading: false})
        })
    }

    render() {
        const {loading, resource} = this.state;

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
                            <Route exact path="/admin">
                                <Dashboard/>
                            </Route>

                            <Route exact path="/admin/boulder">
                                <AdminBoulderIndex/>
                            </Route>

                            <Route path="/admin/boulder/add">
                                <AdminBoulderAdd/>
                            </Route>

                            <Route path="/admin/boulder/edit/:boulderId">
                                <AdminBoulderEdit/>
                            </Route>

                            <Route path="/boulder">
                                <Boulder/>
                            </Route>

                            <Route path="/ranking/current">
                                <CurrentRanking/>
                            </Route>

                            <Route path="/styleguide">
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
}

export default App;
