import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import NotFound from "./views/NotFound";
import Context from "./Context";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Header from "./components/Header";
import BoulderIndex from "./views/boulder/Index.js";

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
            title: "Boulder index",
            path: "/:locationSlug/boulder",
            render: () => <BoulderIndex/>,
            exact: true
        },
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