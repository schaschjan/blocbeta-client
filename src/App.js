import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Context from "./Context";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Header from "./components/Header";
import BoulderIndex from "./views/boulder/Index.js";
import Current from "./views/ranking/Current";

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

    const [authenticated, setAuthenticated] = useState(Context.isAuthenticated);

    function handleSuccess(data) {
        setAuthenticated(true);

        return <Redirect to={{pathname: `/${Context.getLocationUrl()}/dashboard`}}/>;
    }

    const routes = [
        {
            title: "Login",
            path: "/login",
            render: () => <Login onAuthenticationSuccess={handleSuccess}/>,
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
            title: "Current ranking",
            path: "/:locationSlug/ranking/current",
            render: () => <Current/>,
            exact: true
        }
    ];

    return (
        <Router>
            <div className="app">
                <Header authenticated={authenticated}/>

                <div className="content">
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

            </div>
        </Router>
    );
};

export default App